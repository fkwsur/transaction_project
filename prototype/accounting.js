const {
  business_group,
  company,
  category,
  transaction,
  sequelize,
  QueryTypes,
} = require("../models");
const uuid = require("uuid");
const shortid = require("shortid");
const { parse } = require("csv-parse/sync");

class A {}

const batchUpsert = async (model, records, uniqueFields, batchSize, tx) => {
  const results = { 
    // success: [], 
    duplicates: [], 
    failed: [] 
  };

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const inserted = await model.bulkCreate(batch, {
      ignoreDuplicates: true,
      transaction: tx,
      returning: true,
    });
    // results.success.push(...inserted);

    if (inserted.length < batch.length) {
      const createdKeys = new Set(
        inserted.map((item) => uniqueFields.map((f) => item[f]).join("|"))
      );

      for (const rec of batch) {
        const key = uniqueFields.map((f) => rec[f]).join("|");
        if (!createdKeys.has(key)) {
          try {
            const single = await model.create(rec, { transaction: tx });
            // results.success.push(single);
          } catch (err) {
            if (err.name === "SequelizeUniqueConstraintError")
              results.duplicates.push(rec);
            else results.failed.push({ rec, error: err.message });
          }
        }
      }
    }
  }
  if(results.failed.length == 0 && results.duplicates.length == 0) {
    return {result: "success"}
  }
  return results;
};

A.prototype.getGroupId = async () => {
  try {
    let group = await business_group.findOne({
      where: { registration_number: "1111111111" },
    });
    if (!group) throw { code: 9 };
    return group.id;
  } catch (error) {
    throw error;
  }
};

A.prototype.getFileToJson = async (data) => {
  try {
    const keyMap = {
      거래일시: "transacted_at",
      적요: "description",
      입금액: "deposit_amount",
      출금액: "withdrawal_amount",
      거래후잔액: "balance_after_transaction",
      거래점: "transaction_branch",
    };
    const bankFile = parse(data.bank_transactions[0].buffer.toString("utf-8"), {
      columns: (header) => header.map((h) => keyMap[h] || h),
      skip_empty_lines: true,
    });
    const rulesFile = JSON.parse(data.rules[0].buffer.toString("utf-8"));
    return { bankFile, rulesFile };
  } catch (error) {
    throw { code: 8 };
  }
};

A.prototype.AccountingBind = async (bankFile, rulesFile, group_id) => {
  const tx = await sequelize.transaction();
  try {
    let rules = [];
    let companies = [];
    let categories = [];

    const companyCodes = rulesFile.companies.map((rule) => rule.company_id);
    const existingCompanies = await company.findAll({
      where: {
        business_group_id: group_id,
        company_code: companyCodes,
      },
    });
    const companyMap = new Map(
      existingCompanies.map((c) => [c.company_code, c.id])
    );

    for (const rule of rulesFile.companies) {
      let company_id = companyMap.get(rule.company_id) || uuid.v4();

      companies.push({
        id: company_id,
        business_group_id: group_id,
        company_code: rule.company_id,
        company_name: rule.company_name,
      });
      for (const category of rule.categories) {
        for (const keyword of category.keywords) {
          categories.push({
            id: shortid.generate(),
            company_id: company_id,
            category_code: category.category_id,
            category_name: category.category_name,
            keyword: keyword,
          });

          rules.push({
            company_id: company_id,
            category_name: category.category_name,
            category_code: category.category_id,
            company_name: rule.company_name,
            keyword: keyword,
          });
        }
      }
    }

    // 배치 설정
    const companyBatch = 50;
    const categoryBatch = 200;
    const txBatch = 500;

    // 회사 배치 인서트
    const companyResults = await batchUpsert(
      company,
      companies,
      ["business_group_id", "company_code"],
      companyBatch,
      tx
    );
    console.log("Company insert results:", companyResults);

    // 카테고리 배치 인서트
    const categoryResults = await batchUpsert(
      category,
      categories,
      ["company_id", "category_code", "category_name", "keyword"],
      categoryBatch,
      tx
    );
    console.log("Category insert results:", categoryResults);

    for (const transaction of bankFile) {
      transaction.business_group_id = group_id;
      transaction.id = uuid.v4();
      for (const rule of rules) {
        if (transaction.description.includes(rule.keyword)) {
          transaction.company_id = rule.company_id;
          transaction.category_code = rule.category_code;
          break;
        }
      }
    }

    // 거래 벌크 인서트
    const transactionResults = await batchUpsert(
      transaction,
      bankFile,
      [
        `business_group_id`,
        `description`,
        `balance_after_transaction`,
        `transaction_branch`,
        `transacted_at`,
      ],
      txBatch,
      tx
    );
    console.log("Transaction insert results:", transactionResults);
    await tx.commit();
    if(companyResults.result === "success" &&
       categoryResults.result === "success" &&
       transactionResults.result === "success") {
      return { result: "success" };
    }
    return { companyResults, categoryResults, transactionResults };
  } catch (error) {
    await tx.rollback();
    throw error;
  }
};

A.prototype.getRecords = async (data) => {
  try {
    const get_company = await company.findOne({
      where: { company_code: data },
      attributes: ["id", "company_name"],
    });
    if (!get_company) throw { code: 7 };

    query = `SELECT 
  ANY_VALUE(ct.category_code) AS category_id,
  ANY_VALUE(ct.category_name) AS category_name,
  t.description,
  t.deposit_amount,
  t.withdrawal_amount,
  t.balance_after_transaction,
  t.transaction_branch,
  t.transacted_at
  FROM transaction t
  JOIN category ct 
  ON t.company_id = ct.company_id 
  AND t.category_code = ct.category_code
  WHERE ct.company_id = ?
  GROUP BY t.id
  ORDER BY t.transacted_at DESC;`;
    const rows = await sequelize.query(query, {
      replacements: [get_company.id],
      type: QueryTypes.SELECT,
    });
    if (!rows) throw { code: 1 };
    let result = [
      {
        company_name: get_company.company_name,
        result: rows,
      },
    ];
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = A;

const { handler } = require("../utils");
const { A, R } = require("../prototype");
const a = new A();
const r = new R();

module.exports = {
  Process: async (req, res) => {
    try {
      let group_id = await a.getGroupId();
      let { bankFile, rulesFile } = await a.getFileToJson(req.files);
      let result = await a.AccountingBind(bankFile, rulesFile,group_id);
      return r.ReturnBind(res, result);
    } catch (error) {
      return res.status(200).send(handler.errorHandler(error));
    }
  },
  Records: async (req, res) => {
    try {
      let rows = await a.getRecords(req.query.companyId);
      return r.ReturnBind(res, rows);
    } catch (error) {
      return res.status(200).send(handler.errorHandler(error));
    }
  },
};

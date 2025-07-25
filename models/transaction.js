module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    "transaction",
    {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      business_group_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      company_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      category_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deposit_amount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      withdrawal_amount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      balance_after_transaction: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      transaction_branch: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      transacted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          name: "uq_transaction",
          fields: [`business_group_id`,`description`,`balance_after_transaction`, `transaction_branch`,`transacted_at`],
        },
      ],
    }
  );

  return transaction;
};

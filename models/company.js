module.exports = (sequelize, DataTypes) => {
  const company = sequelize.define(
    "company",
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
      company_code: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "company",
      underscored: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          name: "uq_group_code",
          fields: ["business_group_id", "company_code"],
        },
      ],
    }
  );
  return company;
};

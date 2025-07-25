module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.STRING(11),
        allowNull: false,
        primaryKey: true,
      },
      company_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      category_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      category_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      keyword: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "category",
      underscored: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          name: "uq_category_name",
          fields: [`company_id`,`category_code`, `category_name`,`keyword`],
        }
      ],
    }
  );
  return category;
};

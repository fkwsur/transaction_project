module.exports = (sequelize, DataTypes) => {
  const business_group = sequelize.define('business_group', {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
    },
    business_group_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    registration_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
            unique: true
    },
  }, {
    tableName: 'business_group',
    underscored: true,
    timestamps: true,
  });
  return business_group;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sales extends Model {
    static associate(models) {
        Sales.hasOne(models.invoice, {
            foreignKey: "sales_id",
            as: "invoice"
        })
    }
  }
  Sales.init({
    sales_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
        type: DataTypes.ENUM("day", "month"),
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'sales',
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return Sales;
};
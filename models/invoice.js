'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
        Invoice.belongsTo(models.sales, {
            foreignKey: "sales_id",
            as: "sales"
        })

    }
  }
  Invoice.init({
    invoice_id: {
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
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sales_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'invoice',
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return Invoice;
};
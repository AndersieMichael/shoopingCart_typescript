const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_header', {
    order_header_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'customer_id'
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    total_price: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'order_header',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "order_header_pkey",
        unique: true,
        fields: [
          { name: "order_header_id" },
        ]
      },
    ]
  });
};

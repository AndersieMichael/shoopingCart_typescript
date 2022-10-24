const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dummy', {
    order_detail_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_header_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'item',
        key: 'item_id'
      }
    },
    total_pcs: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'dummy',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "dummy_pkey",
        unique: true,
        fields: [
          { name: "order_detail_id" },
        ]
      },
    ]
  });
};

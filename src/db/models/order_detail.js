const Sequelize = require('sequelize');
const{sequelizeJoi,Joi} = require("sequelize-joi");

module.exports = function(sequelize, DataTypes) {

  sequelizeJoi(sequelize);
  
  return sequelize.define('order_detail', {
    order_detail_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_header_id: {
      type: DataTypes.INTEGER,
      schema: Joi.number().required(),
      allowNull: false,
      references: {
        model: 'order_header',
        key: 'order_header_id'
      }
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
    tableName: 'order_detail',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "order_detail_pkey",
        unique: true,
        fields: [
          { name: "order_detail_id" },
        ]
      },
    ]
  });
};

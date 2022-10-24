const Sequelize = require('sequelize');
const{sequelizeJoi,Joi} = require("sequelize-joi");


module.exports = function(sequelize, DataTypes) {

  
  sequelizeJoi(sequelize);
  
  return sequelize.define('cart_detail', {
    cart_detail_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'shooping_cart',
        key: 'cart_id'
      }
    },
    item_id: {
      type: DataTypes.INTEGER,
      schema: Joi.number().required(),
      allowNull: false,
      references: {
        model: 'item',
        key: 'item_id'
      }
    },
    total: {
      type: DataTypes.INTEGER,
      schema: Joi.number().required(),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'cart_detail',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cart_detail_pkey",
        unique: true,
        fields: [
          { name: "cart_detail_id" },
        ]
      },
    ]
  });
};

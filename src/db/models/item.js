const Sequelize = require('sequelize');
const{sequelizeJoi,Joi} = require("sequelize-joi");
module.exports = function(sequelize, DataTypes) {
  
  sequelizeJoi(sequelize);
  
  return sequelize.define('item', {
    item_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(250),
      schema: Joi.string().min(3).required(),
      allowNull: false
    },
    price: {
      type: DataTypes.BIGINT,
      schema: Joi.number().required(),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'item',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "item_pkey",
        unique: true,
        fields: [
          { name: "item_id" },
        ]
      },
    ]
  });
};

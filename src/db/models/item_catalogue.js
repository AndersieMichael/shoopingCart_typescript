const Sequelize = require('sequelize');
const{sequelizeJoi,Joi} = require("sequelize-joi");
module.exports = function(sequelize, DataTypes) {
  
  sequelizeJoi(sequelize);
  
  return sequelize.define('item_catalogue', {
    catalogue_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'item',
        key: 'item_id'
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      schema: Joi.number().required(),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'item_catalogue',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "item_catalogue_pkey",
        unique: true,
        fields: [
          { name: "catalogue_id" },
        ]
      },
    ]
  });
};

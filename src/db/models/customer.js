const Sequelize = require('sequelize');
const{sequelizeJoi,Joi} = require("sequelize-joi");

module.exports = function(sequelize, DataTypes) {
  
  sequelizeJoi(sequelize);
  
  return sequelize.define('customer', {
    customer_id: {
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
    username: {
      type: DataTypes.STRING(250),
      schema: Joi.string().min(3).required(),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(250),
      schema: Joi.string().min(3).required(),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(250),
      schema: Joi.string().min(3).required(),
      allowNull: false
    },
    token_key: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customer',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "customer_pkey",
        unique: true,
        fields: [
          { name: "customer_id" },
        ]
      },
    ]
  });
};

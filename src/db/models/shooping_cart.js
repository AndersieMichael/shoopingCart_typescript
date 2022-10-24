const Sequelize = require('sequelize');
// const{sequelizeJoi,Joi} = require("sequelize-joi");

module.exports = function(sequelize, DataTypes) {
  
  // sequelizeJoi(sequelize);

  return sequelize.define('shooping_cart', {
    
    cart_id: {
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
    }
  }, {
    sequelize,
    tableName: 'shooping_cart',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "shooping_cart_pkey",
        unique: true,
        fields: [
          { name: "cart_id" },
        ]
      },
    ]
  });
};

var Sequelize = require("sequelize");

var sequelize = require("../config/connection.js");

var Burger = sequelize.define("burger", {
    burgerName: {type:Sequelize.STRING,
        allowNull: false
    },
    patty: {
        type:Sequelize.STRING,
        allowNull:false
    },
    bun: {
        type:Sequelize.STRING,
        allowNull:false
    },
    sauces:Sequelize.STRING,
    cheese: Sequelize.STRING,
    addOn: Sequelize.STRING,
    numSold: {type:Sequelize.INTEGER,
        defaultValue: 1},
    price: Sequelize.DECIMAL(10,2)
},{
    freezeTableName: true
});

Burger.sync();

module.exports = Burger;
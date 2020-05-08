var Sequelize = require("sequelize");

var sequelize = require("../config/connection.js");

var Component= sequelize.define("component", {
    compName: Sequelize.STRING,
    compType: {type:Sequelize.STRING,
        isIn:[['bun','pattyType','sauce','cheese','addOn']]
    },
    addOnPrice: {type:Sequelize.DECIMAL(10,2),
        defaultValue: 0
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
    } 
}, {
    freezeTableName: true
},{
    timestamps: false
});

Component.sync();

module.exports = Component;
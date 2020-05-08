var Sequelize = require("sequelize");
var enviro = require("dotenv").config();

var password = process.env.DB_PASS
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL)
} else {
     sequelize = new Sequelize("burger2", "root", password, {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})
}

     

module.exports = sequelize;
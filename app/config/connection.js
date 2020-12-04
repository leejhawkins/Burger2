var Sequelize = require("sequelize");
var enviro = require("dotenv").config();

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL)
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: "ijj1btjwrd3b7932.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
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
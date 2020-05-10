var Burger = require("../models/burgers.js");
var Component = require("../models/components.js")
module.exports = function (app) {
    app.get("/api/all", function (req, res) {
        Burger.findAll({}).then(function (results) {
            res.json(results)
        });
    });
    app.get("/api/components",function(req,res){
        Component.findAll({
            order: [['addOnPrice', 'ASC']]
        }).then(function (results){
            res.json(results)
        })
    })
    app.get("/api/bestsellers",function(req,res){
        Burger.findAll({
            order: [['numSold','DESC']]
        }).then(function(results){
            res.json(results)
        })
    })
    app.post("/api/new", function (req, res) {
        console.log(req.body)
        Burger.create({
            burgerName: req.body.burgerName,
            patty:req.body.patty,
            bun:req.body.bun,
            sauces:req.body.sauce,
            cheese:req.body.cheese,
            topping:req.body.topping,
            addOn:req.body.addOn,
            price: req.body.price
        }).then(function (results) {
            res.end();
        })
    })
    app.put("/api/burgers/:id", function (req, res) {

        Burger.update({ numSold: req.body.numSold }, {
            where: {
                id: req.body.id
            }
            }).then(function (results) {
                res.end();
            })

        
    });
}
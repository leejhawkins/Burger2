
$(document).ready(function () {
    var addOns = [];
    var cheeses = [];
    var sauces = []; 
    $("#addburger").on("submit", function (event) {
        event.preventDefault();
        var burgerCost = 7.50;
        var pattyType = $("#patty").val().split(" +$", 2)
        burgerCost = + burgerCost + parseFloat(pattyType[1]);
        var sauce = "";
        for (var i = 0; i < sauces.length; i++) {
            var buttonId = sauces[i].replace(/\s+/g, '-').toLowerCase()
            if ($("#" + buttonId).prop("checked") === true) {
                sauce += $("#" + buttonId).val() + " ";
                burgerCost += parseFloat($("#" + buttonId).attr("cost"));
            }
        }
        var cheese = ""
        for (var i = 0; i < cheeses.length; i++) {
            var buttonId = cheeses[i].replace(/\s+/g, '-').toLowerCase()
            if ($("#" + buttonId).prop("checked") === true) {
                cheese += $("#" + buttonId).val() + ",";
                burgerCost += parseFloat($("#" + buttonId).attr("cost"))
            }
        }
         
        var addOn = "";
        for (var i = 0; i < addOns.length; i++) {
            var buttonId = addOns[i].replace(/\s+/g, '-').toLowerCase()
            if ($("#" + buttonId).prop("checked") === true) {
                addOn += $("#" + buttonId).val() + ",";
                burgerCost += parseFloat($("#" + buttonId).attr("cost"))
            }
        }


        console.log(burgerCost)
        var newBurger = {
            burgerName: $("#burg").val().trim(),
            patty: pattyType[0],
            bun: $("#bun").val(),
            sauce: sauce.trim().slice(0, -1),
            cheese: cheese.trim().slice(0,-1),
            addOn: addOn.trim().slice(0, -1),
            price: burgerCost
        }

        $.post("api/new", newBurger).then(function () {
            $("#burg").val("")
            $("#add-on").empty()
            $("#patty").val("Selected Disabled Value")
            $("#bun").val("Selected Disabled Value")
            $("#sauces").empty().val("");
            $("#cheese").empty().val("");
            $("#topping").empty().val("");
            addOns = [];
            cheeses = [];
            sauces = [];
            getBurgers();
            getComponents();
            getBestSellers();

        })
    })
    getBurgers();
    getComponents();
    getBestSellers();
    $(document).on("click", "button.orderBurg", orderBurger)

    function getBurgers() {
        $("#devoured").empty();
        $("#undevoured").empty();
        $.get("/api/all", function (data) {
            if (data.length !== 0) {
                data.forEach(burger => {
                    var buttonDiv = `<div class="col-3">
                                        <button type="button" class="orderBurg btn btn-danger" burgerId=${burger.id} numberSold=${burger.numSold}>
                                            Order
                                            <img src="images/images/eatenhamburgericon2.png" class="b-icon">
                                        </button>
                                    <div>`
                    var descriptionDiv = $("<div>").addClass("col-4 descript")
                    var description = burger.patty + " on a " + burger.bun + " Bun ";
                    var cheeseArray = burger.cheese.split(",")
                    var sauceArray = burger.sauces.split(",")
                    var addOnArray = burger.addOn.split(",")
                    if (!(cheeseArray[0] === "")) {
                        description += " smothered in "
                        if (cheeseArray.length === 1) {
                            description += cheeseArray[0] + " cheese"
                        } else {
                            for (var j = 0; j < cheeseArray.length; j++) {
                                if (j === 0) {
                                    description += cheeseArray[j]
                                } else if (j === cheeseArray.length - 1) {
                                    description += " and " + cheeseArray[j] + " cheeses"
                                } else {
                                    description += ", " + cheeseArray[j]
                                }
                            }
                        }                        
                    }  
                    if (!(sauceArray[0] === "")) {
                        description += " slathered in "
                        if (sauceArray.length === 1) {
                            description += sauceArray[0]

                        } else {
                            for (var j = 0; j < sauceArray.length; j++) {
                                if (j === 0) {
                                    description += sauceArray[j]
                                } else if (j === sauceArray.length - 1) {
                                    description += " and " + sauceArray[j]
                                } else {
                                    description += ", " + sauceArray[j]
                                }
                            }
                        }
                    } 
                    
                    
                    if (!(addOnArray[0] === "")) {
                        description += " and topped with "
                        if (addOnArray.length === 1) {
                            description += addOnArray[0];
                        } else {
                            addOnArray.pop()
                            for (var j = 0; j < addOnArray.length; j++) {
                                if (j === 0) {
                                    description += addOnArray[j]
                                } else if (j === addOnArray.length - 1) {
                                    description += " and " + addOnArray[j]
                                } else {
                                    description += ", " + addOnArray[j]
                                }
                            }
                        }
                    } 
                    var row = $("<div>").addClass("burger row")
                    var icon = $("<img>").attr("src", "images/images/hamburgericon.png").addClass("b-icon")
                    var name = $("<div>").addClass("col-5 name ")
                    name.append(icon).append(burger.burgerName).append($("<div>").html("<br>" + "Price: $" + burger.price))
                    descriptionDiv.text(description)
                    row.append(name)
                    row.append(descriptionDiv).append(buttonDiv)
                    $("#undevoured").append(row)
                })


            }
        })
    }
    function orderBurger() {
        var id = $(this).attr("burgerid");
        var numberSold = $(this).attr("numberSold")
        numberSold++
        var devouredBurg = {
            id: id,
            numSold: numberSold
        };
        $.ajax("/api/burgers/" + id, {
            type: "PUT",
            data: devouredBurg
        }).then(
            function () {
                getBurgers();
                getBestSellers();
            })
    }
    function getComponents() {
        $.get("api/components", function (data) {
            
            for (var i = 0; i < data.length; i++) {
                var buttonId = data[i].compName.replace(/\s+/g, '-').toLowerCase()
                if (data[i].compType === "pattyType") {
                    $("#patty").append($("<option>").addClass("menuItem").text(data[i].compName + " +$" + data[i].addOnPrice))
                } else if (data[i].compType === "bun") {
                    $("#bun").append($("<option>").text(data[i].compName))
                } else if (data[i].compType === "sauce") {

                    sauces.push(data[i].compName)
                    $("#sauces").append($("<div>").addClass("dropdown-item").append($("<div>").addClass("form-check").append($("<input>").attr("type", "checkbox").addClass("form-check-input").val(data[i].compName).attr("id", buttonId).attr("cost", data[i].addOnPrice)).append($("<label>").addClass("form-check-label").text(data[i].compName + " $" + data[i].addOnPrice))))

                } else if (data[i].compType === "cheese") {
                    cheeses.push(data[i].compName)
                    $("#cheese").append($("<div>").addClass("dropdown-item").append($("<div>").addClass("form-check").append($("<input>").attr("type", "checkbox").addClass("form-check-input").val(data[i].compName).attr("id", buttonId).attr("cost", data[i].addOnPrice)).append($("<label>").addClass("form-check-label").text(data[i].compName + " $" + data[i].addOnPrice))))

                } else if (data[i].compType === "addOn") {
                    addOns.push(data[i].compName)
                    $("#add-on").append   ($("<div>").addClass("dropdown-item").append($("<div>").addClass("form-check").append($("<input>").attr("type", "checkbox").addClass("form-check-input").val(data[i].compName).attr("id", buttonId).attr("cost", data[i].addOnPrice)).append($("<label>").addClass("form-check-label").text(data[i].compName + " $" + data[i].addOnPrice))))
                }
            }
        })
    }
    function getBestSellers() {
        $("#best-sellers").empty();
        $.get("/api/bestsellers", function (data) {
            for (var i = 0; i < data.length; i++) {
                
                var place = (i + 1);
                for (var j=i+1;j>=0;j--){
                    if (j===data.length){

                    } else if(j===i) {

                    } else if (data[i].numSold===data[j].numSold && j===i+1) {
                        place="T"+(i+1)
                    } else if (data[i].numSold===data[j].numSold) {
                        place="T"+(j+1)
                    }
                }
                
                var row = $("<tr>").addClass("row")
                var name = $("<td>").addClass("name col-8")
                name.text(data[i].burgerName)
                row.append($("<tr>").addClass("name col-2").text(place+"."))
                row.append(name)
                row.append($("<td>").text(data[i].numSold).addClass("name col-2"))
                $("#best-sellers").append(row)
            }

        })
    }


})

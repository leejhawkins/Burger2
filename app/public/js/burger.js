
$(document).ready(function () {
    var burgerCost = parseFloat(7.50);
    var cheeses = [];
    var sauces = [];
    var addOns = [];
    var patty = {};
    $("#addburger").on("submit", function (event) {
        event.preventDefault(); 
        var sauceString = sauces.join(",");
        var cheeseString = cheeses.join(",")
        var addOnString = addOns.join(",")


        console.log(burgerCost)
        var newBurger = {
            burgerName: $("#burg").val().trim(),
            patty: patty.name,
            bun: $("#bun").val(),
            sauce: sauceString,
            cheese: cheeseString,
            addOn: addOnString,
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
            $("#price").text("Price: $7.50")
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

            data.forEach(burger => {
                var dropdown = (`<div class="dropdown-item">
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input" value="${burger.compName}" price=${burger.addOnPrice} comp-type=${burger.compType}>
                                                    <label class="form-check-label">${burger.compName}  +$ ${burger.addOnPrice}</label>
                                            </div>
                                        </div>`)
                switch (burger.compType) {
                    case "pattyType":
                        $("#patty").append(`<option class="menuItem"  value="${burger.compName},${burger.addOnPrice}">
                                            ${burger.compName}  +$ ${burger.addOnPrice}
                                        </option>`)
                    break;
                    case "bun":
                        $("#bun").append($("<option>").text(burger.compName))
                    break;
                    case "sauce":
                        $("#sauces").append(dropdown)
                    break;
                    case "cheese":
                        $("#cheese").append(dropdown)
                    break;
                    case "addOn":
                        $("#add-on").append(dropdown)
                    break;
                }              
            })
        })
    }
    $("#cheese,#sauces,#add-on").on("click", ".form-check-input", function () {
        var checked = $(this).val();
        var price = parseFloat($(this).attr("price"));
        var compType= $(this).attr("comp-type")
        switch(compType) {
            case "cheese":
                if (cheeses.indexOf(checked) === -1) {
                    cheeses.push(checked)
                    burgerCost += price;
                } else {
                    cheeses = cheeses.filter(cheese => cheese != checked)
                    burgerCost -= price;
                }
                break;
            case "sauce":
                if (sauces.indexOf(checked) === -1) {
                    sauces.push(checked)
                    burgerCost += price;
                } else {
                    sauces = sauces.filter(sauce => sauce != checked)
                    burgerCost -= price;
                }
                break;
            case "addOn":
                if (addOns.indexOf(checked) === -1) {
                    addOns.push(checked)
                    burgerCost += price;
                } else {
                    addOns = addOns.filter(addOn => addOn != checked)
                    burgerCost -= price;
                    break;
                }

        }
        $("#price").html("Price: $"+burgerCost)
    })
    $("#patty").on("change",function(event){
        var pattyType = event.target.value.split(",")
        if (patty.price) {
            burgerCost -= parseFloat(patty.price)
        } 
        patty = {
            name: pattyType[0], price:pattyType[1]
        }
        burgerCost += parseFloat(patty.price)
        $("#price").text("Price:$" + burgerCost)
    })
    function getBestSellers() {
        $("#best-sellers").empty();
        $.get("/api/bestsellers", function (data) {
            for (var i = 0; i < data.length; i++) {

                var place = (i + 1);
                for (var j = i + 1; j >= 0; j--) {
                    if (j === data.length) {

                    } else if (j === i) {

                    } else if (data[i].numSold === data[j].numSold && j === i + 1) {
                        place = "T" + (i + 1)
                    } else if (data[i].numSold === data[j].numSold) {
                        place = "T" + (j + 1)
                    }
                }
                $("#best-sellers").append(`<tr class="row">
                                            <td class="name col-2">
                                                ${place}.
                                            </td>
                                            <td class="name col-8">
                                                ${data[i].burgerName}
                                            </td>
                                             <td class="name col-2">
                                                ${data[i].numSold}
                                            </td>
                                            </tr>`)
            }

        })
    }


})

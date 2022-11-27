var global_product_cnt = 3;


function add_tr() {
    var new_tr = document.createElement('tr');
    new_tr.innerHTML = `<td>Product ${global_product_cnt}</td>
                        <td><input class='form-control' style='width: 100px;' type='text' name='qty[]' onkeyup='sum_total_mrp()' value=''></td>
                        <td> x</td >
                        <td><input class='form-control' style='width: 150px;' type='text' name='rate[]' onkeyup='sum_total_mrp()' value=''></td>
                        <td>=</td><td><input class='form-control' style='width: 150px;' type='text' name='total_mrp[]' value=''></td>
                        <td><input class='form-control' style='width: 150px;' type='text' name='charge[]' value=''></td>
                        <td><input class='form-control' style='width: 150px;' type='text' name='total_cost[]' value=''></td>
                        <td><input class='form-control' style='width: 150px;' type='text' name='cost_product[]' value=''>
                        </td>`;

    document.getElementById("table_body").appendChild(new_tr);
    global_product_cnt++; // increment
}


function get_cost_per_qty() {
    let total_costs = document.getElementsByName("total_cost[]");
    let rates = document.getElementsByName("rate[]");
    let charges = document.getElementsByName("charge[]");
    total_costs.forEach((total_cost_input, index) => {
        total_cost_input.value = (Number(rates[index].value) + Number(charges[index].value)).toFixed(2);
    });
}




function get_charge_per_box() {
    let charges = document.getElementsByName("charge[]");
    let cost_products = document.getElementsByName("cost_product[]");
    let qtys = document.getElementsByName("qty[]");
    charges.forEach((charge_input, index) => {
        if (cost_products[index].value > 0 && qtys[index].value > 0)
            charge_input.value = (cost_products[index].value / qtys[index].value).toFixed(2);
        else
            charge_input.value = 0;
    });
}

function get_grand_total_mrp() {
    let grand_total_mrp = document.getElementById("grand_total_mrp");
    let total_mrps = document.getElementsByName("total_mrp[]");
    let sum = 0;
    total_mrps.forEach((input_total) => {
        sum += Number(input_total.value);
    });
    grand_total_mrp.value = sum;
    get_cost_per_product();
    get_charge_per_box();
    get_cost_per_qty();
    get_sum_cost_product();
}


function sum_total_mrp() {
    let rates = document.getElementsByName("rate[]");
    let qtys = document.getElementsByName("qty[]");
    let total_mrps = document.getElementsByName("total_mrp[]");
    let total = 0;
    rates.forEach((rate_input, index) => {
        total = Number(rate_input.value) * Number(qtys[index].value);
        total_mrps[index].value = total;
    });
    get_grand_total_mrp();
    get_cost_per_product();
}




function get_cost_per_product() {
    let cost_product = document.getElementsByName("cost_product[]");
    let freight_charge = document.getElementById('freight_charge');
    let grand_total_mrp = document.getElementById('grand_total_mrp');
    let total_mrps = document.getElementsByName("total_mrp[]");
    let cost = 0;
    if (Number(grand_total_mrp.value) > 0) {
        cost_product.forEach((cost_input, index) => {
            cost = (Number(freight_charge.value) * Number(total_mrps[index].value)) / Number(grand_total_mrp.value);
            cost_input.value = cost.toFixed(2);
        });
    }
}

function enter_event() {

    let qtys = document.getElementsByName("qty[]");
    let rates = document.getElementsByName("rate[]");

    qtys.forEach((qty_input, index) => {
        qty_input.addEventListener("keyup", (event) => {
            if (event.key == "Enter") {
                rates[index].focus();
                rates[index].select();
            }
            if (event.key == "Backspace") {
                if (qty_input.value == "") {
                    rates[index - 1].focus();
                    rates[index - 1].select();
                }
            }
        });
        // select it self if clicked
        qty_input.addEventListener("click", (event) => {
            qty_input.select();
        });
    });

    rates.forEach((rate_input, index) => {
        rate_input.addEventListener("keyup", (event) => {
            if (event.key == "Enter") {
                if (!qtys[index + 1]) {
                    add_tr();
                    enter_event();
                }
                qtys[index + 1].focus();
                qtys[index + 1].select();
            }
            if (event.key == "Backspace") {
                if (rate_input.value == "") {
                    qtys[index].focus();
                    qtys[index].select();
                }
            }
        });

        rate_input.addEventListener("click", (event) => {
            rate_input.select();
        });

    });


}


function get_sum_cost_product() {
    let cost_products = document.getElementsByName("cost_product[]");
    let sum = 0;
    cost_products.forEach((cost_input) => {
        sum += Number(cost_input.value);
    });

    document.getElementById("sum_cost_product").value = sum.toFixed(2);
}

window.onload = () => {
    get_grand_total_mrp();

    let freight_charge = document.getElementById("freight_charge");
    freight_charge.addEventListener("keyup", (event) => {
        if (event.key == "Enter") {
            document.getElementsByName("qty[]")[0].focus();
        }
    });
    enter_event();
    get_sum_cost_product();
};
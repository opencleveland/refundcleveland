// Parse JSON data in Django template
// https://docs.djangoproject.com/en/dev/ref/templates/builtins/#std:templatefilter-json_script
function retrieve_budget_data() {
    const json_data = JSON.parse(document.getElementById('json_data').textContent);
    console.log(json_data);
    const data = json_data.fund_structure[0].children[0].departments;
    return data;
}

function sort_budget_data(data) {
    var toReturn = [...data];
    var totalFunds = 0;
    for (var i=0; i < data.length; i++) {
        var categoryTotal = 0;
        for (var j=0; j < data[i].children.length; j++) {
            totalFunds += data[i].children[j].total;
            categoryTotal += data[i].children[j].total;
        }
        toReturn[i].fundTotal = categoryTotal;
    }
    for (var i=0; i<data.length; i++) {
        toReturn[i].percentage = (toReturn[i].fundTotal / totalFunds) * 100;
        toReturn[i].percentage = toReturn[i].percentage.toFixed(2);
    }
    toReturn.sort((a, b) => b.percentage - a.percentage);
    
    for (var i=0; i<toReturn.length; i++) {
        if (toReturn[i].name === "Other") {
            var other = toReturn.splice(i, 1)[0];
            toReturn.push(other);
            break;
        }
    }
    return toReturn;
}
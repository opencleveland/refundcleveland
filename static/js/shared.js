// Parse JSON data in Django template
// https://docs.djangoproject.com/en/dev/ref/templates/builtins/#std:templatefilter-json_script
function retrieve_budget_data() {
    // Get data file from Django template
    const json_data = JSON.parse(document.getElementById('json_data').textContent);

    // Return the relevant portion of the JSON file
    return json_data.fund_structure[0].children[0].departments;
}

function sort_budget_data(data) {
    let sorted_data = [...data];
    let total_funds = 0;

    // Calculate the dollar amount for each category
    // as well as the overall total
    for (let i = 0; i < data.length; i++) {
        let category_total = 0;
        for (let j = 0; j < data[i].children.length; j++) {
            // Add each line item to category total
            category_total = data[i].children[j].total
        }

        // Update overall total
        total_funds += category_total;

        // Add final category total to data object
        sorted_data[i].fund_total = category_total;
    }

    // Calculate percentage for each category
    // and add to the data object
    for (let i = 0; i < data.length; i++) {
        sorted_data[i].percentage = ((sorted_data[i].fund_total / total_funds) * 100).toFixed(2);
    }

    // Sort the data by category percentage
    sorted_data.sort((a, b) => b.percentage - a.percentage);
    
    for (let i = 0; i < sorted_data.length; i++) {
        if (sorted_data[i].name === "Other") {
            let other = sorted_data.splice(i, 1)[0];
            sorted_data.push(other);
            break;
        }
    }
    return sorted_data;
}
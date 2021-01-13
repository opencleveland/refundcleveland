// Parse JSON data in Django template
function retrieve_budget_data() {
    // Get data file from Django template
    const json_data = JSON.parse(document.getElementById('json_data').textContent);

    // Return the relevant portion of the JSON file
    return json_data.fund_structure[0];
}

// Add category totals and overall total to JSON object
function sum_category_totals(data) {
    // Add overall total property to data object
    data.total = 0;

    // Cycle through each category
    data.children.forEach(function (category) {
        category.total = 0;

        // Determine sum of all children (budget line items)
        category.children.forEach(function (line_item) {
            category.total += line_item.total;
        })

        // Add category total to overall total
        data.total += category.total;
    });

    return data;
}

// Sort categories in descending order by percentage
function sort_desc_by_percentage(data) {

    // Add percentage data to JSON object
    data.children.forEach(function (category) {
        category.percentage = (category.total / data.total * 100).toFixed(2)
    })

    // Sort the categories by percentage
    data.children.sort((a, b) => b.percentage - a.percentage);

    // Move "Other" category to the end
    data.children.forEach(function (category, i) {
        if (category.name == "Other") {
            let other_category = data.children[i];
            data.children.splice(i, 1);
            data.children.push(other_category)
        }
    });

    return data;
}

// Format integer with price commas
function add_commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// Parse JSON data in Django template
function retrieve_budget_data() {
    // Get data file from Django template
    const json_data = JSON.parse(document.getElementById('json_data').textContent);

    // Return the relevant portion of the JSON file
    return json_data;
}

// Add category totals and overall total to JSON object
function sum_category_totals(data) {
    // Add overall total property to data object
    data.total = 0;

    // Cycle through each category
    data.fund_structure.forEach(function (category) {

        // Determine sum of all children (budget line items)
        // user data doesn't have subcategory data, so check for null
        if (category.children != undefined) {
          category.total = 0;
          category.children.forEach(function (line_item) {
              category.total += line_item.total;
          })
        }

        // Add category total to overall total
        data.total += category.total;
    });

    return data;
}

// Add percentage data to child categories
function add_percentage_to_categories(data) {
    data.fund_structure.forEach(function (category) {
        category.percentage = (category.total / data.total * 100).toFixed(2)
    });
    return data;
}

// Sort child categories in descending order by percentage
function sort_desc_by_percentage(data) {
    data.fund_structure.sort((a, b) => b.percentage - a.percentage);
    return data;
}

// Format integer with price commas
function add_commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Returns array of bar colors
function get_bar_colors() {
    return ["#3333CC", "#4ABDAC", "#BD42BD", "#CC3333", "#319fd4", "#FC4A1A", "#DFDCE3"];
}

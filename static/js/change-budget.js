(function () {

    // Retrieve data
    let data = retrieve_budget_data();
    data = sum_category_totals(data);
    data = sort_desc_by_percentage(data);
    let categories = data.children;

    // Remove "Other" category from data object
    let other_category = categories.pop();
    data.total -= other_category.total;

    // Init all category totals and percentages to 0
    categories.forEach(function (category) {
        category.percentage = 0;
        category.total = 0;
    });

    const MULTIPLIER = 2.5,  // add height to bars
        SHIFT = 50,  // bar height when data is $0
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        height = 300 - margin.top - margin.bottom + SHIFT;

    // Select container div
    let container_div = d3.select("#penny_budget");

    // Select all .bar_wrap divs
    let bar_divs = container_div.selectAll("svg")
        .data(categories)
        .enter()
        .append("div")
        .attr("class", "bar_wrap");

    // Add SVG element to each .bar_wrap div
    let svgs = d3.selectAll(bar_divs).append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", "100%")
        .attr("y", 0);

    // Add background bar rects
    let background_bars = svgs.append("rect")
        .attr("class", "background_bar")
        .attr("width", "100%")
        .attr("height", d => (100 * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (100 * MULTIPLIER) - SHIFT)
        .attr("x", 0);

    // Prevent default scrolling behavior in Google Chrome
    // when user should be able to drag bars
    let scrollable = true;
    document.addEventListener("touchstart", function (e) {
        if (!scrollable) {
            e.preventDefault();
        }
    }, {passive: false});

    // Bars drag event handler
    let max_amount;
    let drag_bars = d3.drag()
        .on("start", function (event, d) {
            scrollable = false;
        })
        .on("drag", function (event, d) {
            curr_total = update_total();
            max_amount = Math.max(0, 100 - curr_total);

            d.percentage = Math.max(0, Math.min((height / MULTIPLIER), (height - event.y) / MULTIPLIER, d.percentage + max_amount));
            d3.select(this).attr("height", d => (Math.round(d.percentage) * MULTIPLIER) + SHIFT);
            d3.select(this).attr("y", height - (Math.round(d.percentage) * MULTIPLIER) - SHIFT);

            // Update current category dollar amount
            d.total = d.percentage / 100 * data.total;

            update_legend(Math.round(update_total()));
            update_bar_totals();
        })
        .on("end", function (event, d) {
            scrollable = true;
        });

    // Add bars to SVG
    let bars = svgs.append("rect")
        .attr("class", "bar")
        .attr("width", "100%")
        .attr("height", d => (100 * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (100 * MULTIPLIER) - SHIFT)
        .attr("x", 0)
        // .attr("fill", (d, i) => colors[30 + (i * 15) % colors.length])
        .call(drag_bars);

    // Animate in bars on load
    bars.transition()
        .attr("height", d => (d.percentage * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (d.percentage * MULTIPLIER) - SHIFT)
        .delay((d, i) => 400 + i * 100)
        .duration(1500)
        .ease(d3.easeCubicOut);

    // Add text elements to SVG to display bar totals
    let bar_totals = svgs.append("text").style("opacity", 0);

    // Animate in bar totals on load
    bar_totals.html(d => d.percentage + "%")
        .transition()
        .attr("y", d => height - (d.percentage * MULTIPLIER) - SHIFT - 10)
        .style("opacity", 1)
        .delay((d, i) => 400 + i * 100)
        .duration(1500)
        .ease(d3.easeCubicOut);

    // Get the current total of all programs
    let update_total = function () {
        let newTotal = 0;
        for (let i = 0; i < categories.length; i++) {
            newTotal += categories[i].percentage;
        }
        return newTotal;
    }

    // Update the legend HTML
    let update_legend = function (balance) {
        let curr_bal = 100 - balance;
        if (curr_bal === 0) {
            d3.select("#penny_budget_legend")
                .html(`<h1>Your surplus: <span class="balanced">${curr_bal}%</span></h1><p>You're balanced!</p>`);
        } else {
            d3.select("#penny_budget_legend")
                .html(`<h1>Your surplus: <span>${curr_bal}%</span></h1><p>Drag the bars below to disperse funds</p>`);
        }
    }

    // Update text for bar totals
    let update_bar_totals = function () {
        bar_totals.attr("y", d => height - (d.percentage * MULTIPLIER) - SHIFT - 10)
            .html(function(d) {
                return Math.round(d.percentage) + "% = $" + add_commas(Math.round(d.total));
            });
    }

    // Get total and update legend on load
    let curr_total = update_total();
    update_legend(curr_total);

    // Add placeholder programs below each bar
    bar_divs.append("div")
        .html(function (d) {
            content = "";
            content += `<p>${d.name}</p>`;

            // Add real programs if they exist in the data set
            if (d.children) {
                content += "<ul>";
                d.children.forEach(function (children) {
                    content += `<li>${children.name}</li>`;

                })
                content += "</ul>";
            }
            return content;
        })
        .attr("y", height + margin.bottom);

    container_div.append("button")
        .html("Submit your budget &#8594;");

})();


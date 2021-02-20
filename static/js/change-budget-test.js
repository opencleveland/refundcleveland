(function () {

    // Retrieve and format data
    let data = retrieve_budget_data();
    data = sum_category_totals(data);

    // Remove "Other" category from data object
    let other_category;
    data.fund_structure.forEach(function (category, i) {
        if (category.name === "Administration, Law, and Other") {
            other_category = data.fund_structure[i];
            data.fund_structure.splice(i, 1);
        } else {
            // Optional: Remove line item totals
            // since they are no longer needed
            data.fund_structure[i].children.forEach(function (line_item) {
                delete line_item.total;
            });
        }
    });

    data.full_total = data.total;
    data.total -= other_category.total;

    // Calculate category percentage data
    // and sort to match order of home page.
    data = add_percentage_to_categories(data);
    data = sort_desc_by_percentage(data);

    // Clear category totals and percentage data
    // for the user
    let categories = data.fund_structure;
    categories.forEach(function (category) {
        category.user_percentage = 0;
        category.total = 0;
    });

    // Placeholder info explaining what data
    // the user is manipulating
    d3.select("#header-info").append("div")
        .html(function () {
            return `<p>Refund Cleveland is collecting public feedback about how <strong>$${add_commas(data.total)}</strong> should be dispersed between the categories below (the full <strong>$${add_commas(data.full_total)}</strong> minus the <strong>$${add_commas(other_category.total)}</strong> "Other" category in our <a href="/">&laquo; simplified view of Mayor Jackson's 2021 budget proposal</a>).</p>`
        });

    const MULTIPLIER = 2,  // add height to bars
        SHIFT = 2,  // bar height when data is $0
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        height = 225 - margin.top - margin.bottom + SHIFT,
        colors = get_bar_colors();

    // Select container div
    let container_div = d3.select("#change_budget");

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

    let drag_background_bars = d3.drag()
        .on("start", function (event, d) {
            scrollable = false;
        })
        .on("drag", function (event, d) {
            const i = background_bars.nodes().indexOf(this);
            udpate_bar_height(event, d, i)
            update_legend(Math.round(update_total()));
            update_bar_totals();
            update_form_input_value();
        })
        .on("end", function (event, d) {
            scrollable = true;
        });

    // Add background bar rects
    let background_bars = svgs.append("rect")
        .attr("class", "background_bar")
        .attr("width", "100%")
        .attr("height", d => (100 * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (100 * MULTIPLIER) - SHIFT)
        .attr("x", 0)
        .call(drag_background_bars);

    // Prevent default scrolling behavior in Google Chrome
    // when user should be able to drag bars
    let scrollable = true;
    document.addEventListener("touchstart", function (e) {
        if (!scrollable) {
            e.preventDefault();
        }
    }, {passive: false});

    let udpate_bar_height = function (event, d, bar_index) {
        curr_total = update_total();
        max_amount = Math.max(0, 100 - curr_total);

        d.user_percentage = Math.max(0, Math.min((height / MULTIPLIER), (height - event.y) / MULTIPLIER, d.user_percentage + max_amount));
        d3.select(bars.nodes()[bar_index]).attr("height", d => (Math.round(d.user_percentage) * MULTIPLIER) + SHIFT);
        d3.select(bars.nodes()[bar_index]).attr("y", height - (Math.round(d.user_percentage) * MULTIPLIER) - SHIFT);

        // Update current category dollar amount
        d.total = d.user_percentage / 100 * data.total;
    }

    // Bars drag event handler
    let max_amount;
    let drag_bars = d3.drag()
        .on("start", function (event, d) {
            scrollable = false;
        })
        .on("drag", function (event, d) {
            let bar_index = bars.nodes().indexOf(this);
            udpate_bar_height(event, d, bar_index)
            update_legend(Math.round(update_total()));
            update_bar_totals();
            update_form_input_value();
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
        .attr("fill", (d, i) => colors[i % colors.length])
        .call(drag_bars);

    // Animate in bars on load
    bars.transition()
        .attr("height", d => (d.user_percentage * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (d.user_percentage * MULTIPLIER) - SHIFT)
        .delay((d, i) => 400 + i * 100)
        .duration(1500)
        .ease(d3.easeCubicOut);

    background_bars.on("click", function (event, d) {
        const i = background_bars.nodes().indexOf(this);
        // console.log(`bar ${i} clicked`);
        // console.log(d3.select(bars.nodes()[i]).datum());
        udpate_bar_height(event, d, i);
        udpate_bar_height(event, d, i)
        update_legend(Math.round(update_total()));
        update_bar_totals();
        update_form_input_value();


    });

    // Add text elements to SVG to display bar totals
    let bar_totals = svgs.append("text").style("opacity", 0);
    // let bar_totals_dollars = svgs.append("text").style("opacity", 0);

    // Animate in bar totals on load
    bar_totals.html(d => d.user_percentage + "%")
        .transition()
        .attr("y", d => height - (d.user_percentage * MULTIPLIER) - SHIFT - 10)
        .style("opacity", 1)
        .delay((d, i) => 400 + i * 100)
        .duration(1500)
        .ease(d3.easeCubicOut);

    // // Animate in bar dollar amounts on load
    // bar_totals_dollars.html(d => "$0")
    //     .attr("y", d => height - 5)
    //     .attr("fill", "#fff")
    //     .attr("x", 2)
    //     .transition()
    //     .attr("class", "dollar-amounts")
    //     .attr("width", "100%")
    //     .style("opacity", 1)
    //     .delay(650)
    //     .duration(1800)
    //     .ease(d3.easeCubicOut);

    // Get the current total of all programs
    let update_total = function () {
        let new_total = 0;
        for (let i = 0; i < categories.length; i++) {
            new_total += categories[i].user_percentage;
        }
        return new_total;
    }

    // Update the legend HTML
    let update_legend = function (balance) {
        let curr_bal = 100 - balance;
        if (curr_bal === 0) {
            // Enable Submit button
            // document.getElementById("submit_btn").disabled = false;

            // Update legend and add balanced class
            d3.select("#change_budget_legend")
                .html(`<div class="balanced"><h2>Your surplus: <span class="balanced">${curr_bal}%</span></h2><p>You're balanced! Click the button to submit</p></div>`);

        } else {
            // Disable Submit button
            document.getElementById("submit_btn").disabled = true;

            // Update legend
            d3.select("#change_budget_legend")
                .html(`<div><h2>Your surplus: <span>${curr_bal}%</span></h2><p>Drag the bars below to disperse funds</p></div>`);
        }
    }

    // Update text for bar totals
    let update_bar_totals = function () {
        // Update percentage
        bar_totals.attr("y", d => height - (d.user_percentage * MULTIPLIER) - SHIFT - 10)
            .html(function (d) {
                return Math.round(d.user_percentage) + "%";
            });

        // Update dollar amount
        // bar_totals_dollars.html(d => "$" + add_commas(Math.round(d.user_percentage/100 * data.total)));

    }

    // Get total and update legend on load
    let curr_total = update_total();
    update_legend(curr_total);

    // Display line items below each bar
    bar_divs.append("div")
        .html(function (d, i) {
            content = `<p class="category_name">${d.name}</p>`;
            content += `<p class="city_budget" style="color: ${colors[i]};">City Budget ${d.percentage}%</p>`;
            content += `<a class="category_details">See Details</a>`
            content += `<div class="modal" id="cat${i}">`;
            content += `<div class="modal-content"><span class="close" id="close${i}">&times;</span>`

            content += `<strong><p>${d.name}</p></strong>`;

            if (d.children) {
                content += "<ul>";
                d.children.forEach(function (subdept, index) {
                    content += `<li>${subdept.name}</li>`;

                })
                content += "</ul>";
            }

            content += `</div></div>`


            return content;
        })
        .attr("y", height + margin.bottom);

    let update_form_input_value = function () {
        let json_input = document.getElementById("id_json_data");
        json_input.value = JSON.stringify(data);
    }
    update_form_input_value();


})();

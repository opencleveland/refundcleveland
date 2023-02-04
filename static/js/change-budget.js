(function () {

    // Retrieve and format data
    let data = retrieve_budget_data();
    data = sum_category_totals(data);

    // Calculate category percentage data
    data = add_percentage_to_categories(data);

    // Temporarily remove "other" category from data object
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

    // Calculate total without "other" category
    data.full_total = data.total;
    data.total -= other_category.total;

    // Sort to match order of home page
    data = sort_desc_by_percentage(data);

    // Re-add "other" category to end of data object
    data.fund_structure.push(other_category);

    // Clear category totals and percentage data
    // for the user
    let categories = data.fund_structure;
    categories.forEach(function (category) {
        if (category != other_category) {
            category.user_percentage = 0;
            category.total = 0;
        } else {
            category.user_percentage = Math.round(parseFloat(category.percentage));
        }
    });

    // Placeholder info explaining what data
    // the user is manipulating
    d3.select("#header-info").append("div")
        .html(function () {
            return `<p>Refund Cleveland is collecting public feedback about how <strong>$${add_commas(data.total)}</strong> should be dispersed between the categories below (the full <strong>$${add_commas(data.full_total)}</strong> minus the <strong>$${add_commas(other_category.total)}</strong> "Administration, Law, and Other" category in our <a href="/">&laquo; simplified view of Mayor Bibb's 2023 budget proposal</a>).</p>`
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

    // Prevent default scrolling behavior in Google Chrome
    // when user should be able to drag bars
    let scrollable = true;
    document.addEventListener("touchstart", function (e) {
        if (!scrollable) {
            e.preventDefault();
        }
    }, {passive: false});

    // Update bar height to match user percentage
    let max_amount;
    let udpate_bar_height = function (event, d, bar_index) {
        curr_total = update_total();
        max_amount = Math.max(0, 100 - curr_total);

        d.user_percentage = Math.max(0, Math.min((height / MULTIPLIER), (height - event.y) / MULTIPLIER, d.user_percentage + max_amount));
        d3.select(bars.nodes()[bar_index]).attr("height", d => (Math.round(d.user_percentage) * MULTIPLIER) + SHIFT);
        d3.select(bars.nodes()[bar_index]).attr("y", height - (Math.round(d.user_percentage) * MULTIPLIER) - SHIFT);

        // Update current category dollar amount
        d.total = d.user_percentage / 100 * data.total;
    }

    // Bars drag event handler closure
    let bar_index = -1;
    let drag_bars = function (this_parent_node) {
        return d3.drag()
            .on("start", function (event, d) {
                scrollable = false;
                bar_index = this_parent_node.nodes().indexOf(this);
            })
            .on("drag", function (event, d) {
                // Update bar totals and height if not "other" category
                if (bar_index != categories.length - 1) {
                    udpate_bar_height(event, d, bar_index)
                    update_legend(Math.round(update_total()));
                    update_bar_totals();
                    update_form_input_value();
                }
            })
            .on("end", function (event, d) {
                scrollable = true;
                bar_index = -1;
            });
    }

    // Add background bar rects
    let background_bars = svgs.append("rect")
        .attr("class", "background_bar")
        .attr("width", "100%")
        .attr("height", d => (100 * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (100 * MULTIPLIER) - SHIFT)
        .attr("x", 0);
    background_bars.call(drag_bars(background_bars));

    // Add bars to SVG
    let bars = svgs.append("rect")
        .attr("class", "bar")
        .attr("width", "100%")
        .attr("height", d => (100 * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (100 * MULTIPLIER) - SHIFT)
        .attr("x", 0)
        .attr("fill", (d, i) => colors[i % colors.length]);
    bars.call(drag_bars(bars));

    // Add disabled symbol to "Other" bar
    let disabled_rect = d3.select(svgs.nodes()[bar_divs.nodes().length - 1]).append("g")
        .attr("class", "disabled-rect");

    disabled_rect.append("line")
        .style("stroke", "#ee8f8f")
        .style("stroke-width", .5)
        .style("stroke-dasharray", 3)
        .attr("x1", 0)
        .attr("y1", (height - (100 * MULTIPLIER) - SHIFT))
        .attr("x2", "100%")
        .attr("y2", (100 * MULTIPLIER) + SHIFT + 25);

    disabled_rect.append("line")
        .style("stroke", "#ee8f8f")
        .style("stroke-width", .5)
        .style("stroke-dasharray", 3)
        .attr("x1", "100%")
        .attr("y1", (height - (100 * MULTIPLIER) - SHIFT))
        .attr("x2", 0)
        .attr("y2", (100 * MULTIPLIER) + SHIFT + 25);

    // Animate in bars on load
    bars.transition()
        .attr("height", d => (d.user_percentage * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (d.user_percentage * MULTIPLIER) - SHIFT)
        .delay((d, i) => 0)
        .duration(1500)
        .ease(d3.easeCubicOut);

    // // Click event handler
    // background_bars.on("click", function (event, d) {
    //     let i = background_bars.nodes().indexOf(this);
    //     // console.log(`bar ${i} clicked`);
    //     // console.log(d3.select(bars.nodes()[i]).datum());
    // });

    // Add text elements to SVG to display bar totals
    let bar_totals = svgs.append("text").style("opacity", 0);
    // let bar_totals_dollars = svgs.append("text").style("opacity", 0);

    // Animate in bar totals on load
    bar_totals.html(d => d.user_percentage + "%")
        .transition()
        .attr("y", d => height - (d.user_percentage * MULTIPLIER) - SHIFT - 10)
        .style("opacity", 1)
        .delay((d, i) => 0)
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

    let submit_btn = document.getElementById("submit_btn");

    // Update the legend HTML
    let update_legend = function (balance) {
        let curr_bal = 100 - balance;
        if (curr_bal === 0) {
            // Enable Submit button
            submit_btn.disabled = false;

            // Update legend and add balanced class
            d3.select("#change_budget_legend")
                .html(`<div class="balanced"><h2>Your surplus: <span class="balanced">${curr_bal}%</span></h2><p>You're balanced! Click the button to submit</p></div>`);

        } else {
            // Disable Submit button
            submit_btn.disabled = true;

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

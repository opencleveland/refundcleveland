(function() {

    var mayors_data = retrieve_budget_data();
    
    mayors_data = sort_budget_data(mayors_data);
    
    /*const data = [{"name": "Environment and Sustainability", "dollars": 0, "programs": ["Environment", "Air Quality", "Office of Sustainability", "Recreation", "Parks Maintenance & Properties", "Division of Waste Management"]},
        {"name": "Fire, EMS, and Animal Control", "dollars": 0, "programs": ["Fire", "EMS", "Animal Care and Control"]},
        {"name": "Health", "dollars": 0, "programs": ["Dept of Public Health Director", "Health"]},
        {"name": "Infrastructure", "dollars": 0, "programs": ["Capital Projects", "Street Construction, Maintenance, & Repair"]},
        {"name": "Policing and Corrections", "dollars": 0, "programs": ["Police", "Police Review Board", "Community Police Commission", "Police Inspector General", "Corrections"]}];*/
    var data = [];
    for (var i=0; i < mayors_data.length; i++) {
        if (mayors_data[i].name != "Other") {
            var child = {};
            child.name = mayors_data[i].name;
            child.dollars = 0;
            child.programs = [];
            for (var j=0; j < mayors_data[i].children.length; j++) {
                child.programs.push(mayors_data[i].children[j].name);
            }
            data.push(child);
        }
    }

    const MULTIPLIER = 2.5,  // add height to bars
        SHIFT = 50,  // bar height when data is $0
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        height = 300 - margin.top - margin.bottom + SHIFT;

    // Colors
    // https://observablehq.com/@d3/color-schemes
    let colors = ["#6e40aa","#7140ab","#743fac","#773fad","#7a3fae","#7d3faf","#803eb0","#833eb0","#873eb1","#8a3eb2","#8d3eb2","#903db2","#943db3","#973db3","#9a3db3","#9d3db3","#a13db3","#a43db3","#a73cb3","#aa3cb2","#ae3cb2","#b13cb2","#b43cb1","#b73cb0","#ba3cb0","#be3caf","#c13dae","#c43dad","#c73dac","#ca3dab","#cd3daa","#d03ea9","#d33ea7","#d53ea6","#d83fa4","#db3fa3","#de3fa1","#e040a0","#e3409e","#e5419c","#e8429a","#ea4298","#ed4396","#ef4494","#f14592","#f34590","#f5468e","#f7478c","#f9488a","#fb4987","#fd4a85","#fe4b83","#ff4d80","#ff4e7e","#ff4f7b","#ff5079","#ff5276","#ff5374","#ff5572","#ff566f","#ff586d","#ff596a","#ff5b68","#ff5d65","#ff5e63","#ff6060","#ff625e","#ff645b","#ff6659","#ff6857","#ff6a54","#ff6c52","#ff6e50","#ff704e","#ff724c","#ff744a","#ff7648","#ff7946","#ff7b44","#ff7d42","#ff8040","#ff823e","#ff843d","#ff873b","#ff893a","#ff8c38","#ff8e37","#fe9136","#fd9334","#fb9633","#f99832","#f89b32","#f69d31","#f4a030","#f2a32f","#f0a52f","#eea82f","#ecaa2e","#eaad2e","#e8b02e","#e6b22e","#e4b52e","#e2b72f","#e0ba2f","#debc30","#dbbf30","#d9c131","#d7c432","#d5c633","#d3c934","#d1cb35","#cece36","#ccd038","#cad239","#c8d53b","#c6d73c","#c4d93e","#c2db40","#c0dd42","#bee044","#bce247","#bae449","#b8e64b","#b6e84e","#b5ea51","#b3eb53","#b1ed56","#b0ef59","#adf05a","#aaf159","#a6f159","#a2f258","#9ef258","#9af357","#96f357","#93f457","#8ff457","#8bf457","#87f557","#83f557","#80f558","#7cf658","#78f659","#74f65a","#71f65b","#6df65c","#6af75d","#66f75e","#63f75f","#5ff761","#5cf662","#59f664","#55f665","#52f667","#4ff669","#4cf56a","#49f56c","#46f46e","#43f470","#41f373","#3ef375","#3bf277","#39f279","#37f17c","#34f07e","#32ef80","#30ee83","#2eed85","#2cec88","#2aeb8a","#28ea8d","#27e98f","#25e892","#24e795","#22e597","#21e49a","#20e29d","#1fe19f","#1edfa2","#1ddea4","#1cdca7","#1bdbaa","#1bd9ac","#1ad7af","#1ad5b1","#1ad4b4","#19d2b6","#19d0b8","#19cebb","#19ccbd","#19cabf","#1ac8c1","#1ac6c4","#1ac4c6","#1bc2c8","#1bbfca","#1cbdcc","#1dbbcd","#1db9cf","#1eb6d1","#1fb4d2","#20b2d4","#21afd5","#22add7","#23abd8","#25a8d9","#26a6db","#27a4dc","#29a1dd","#2a9fdd","#2b9cde","#2d9adf","#2e98e0","#3095e0","#3293e1","#3390e1","#358ee1","#378ce1","#3889e1","#3a87e1","#3c84e1","#3d82e1","#3f80e1","#417de0","#437be0","#4479df","#4676df","#4874de","#4a72dd","#4b70dc","#4d6ddb","#4f6bda","#5169d9","#5267d7","#5465d6","#5663d5","#5761d3","#595fd1","#5a5dd0","#5c5bce","#5d59cc","#5f57ca","#6055c8","#6153c6","#6351c4","#6450c2","#654ec0","#664cbe","#674abb","#6849b9","#6a47b7","#6a46b4","#6b44b2","#6c43af","#6d41ad","#6e40aa"];
    colors.reverse();

    // Select container div
    let container_div = d3.select("#penny_budget");

    // Select all .bar_wrap divs
    let bar_divs = container_div.selectAll("svg")
        .data(data)
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

    // Bars drag event handler
    let max_amount, current_data;
    let drag_bars = d3.drag()
        .on("drag", function(event, d) {
            event.preventDefault();
            curr_total = update_total();
            max_amount = Math.max(0, 100 - curr_total);
            current_data = d.dollars;

            d.dollars = Math.round(Math.max(0, Math.min((height/MULTIPLIER), (height - event.y) / MULTIPLIER, current_data + max_amount)));
            d3.select(this).attr("height", d => (d.dollars * MULTIPLIER) + SHIFT);
            d3.select(this).attr("y", height - (d.dollars * MULTIPLIER) - SHIFT);

            update_legend(update_total());
            update_bar_totals();
        });
    
    // Add bars to SVG
    let bars = svgs.append("rect")
        .attr("class", "bar")
        .attr("width", "100%")
        .attr("height", d => (100 * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (100 * MULTIPLIER) - SHIFT)
        .attr("x", 0)
        .attr("fill", (d, i) => colors[30 + (i * 15) % colors.length])
        .call(drag_bars);

    // Animate in bars on load
    bars.transition()
        .attr("height", d => (d.dollars * MULTIPLIER) + SHIFT)
        .attr("y", d => height - (d.dollars * MULTIPLIER) - SHIFT)
        .delay((d, i) => 400 + i * 100)
        .duration(1500)
        .ease(d3.easeCubicOut);

    // Add text elements to SVG to display bar totals
    let bar_totals = svgs.append("text").style("opacity", 0);

    // Animate in bar totals on load
    bar_totals.html(d => "$" + d.dollars)
        .transition()
        .attr("y", d => height - (d.dollars * MULTIPLIER) - SHIFT - 10)
        .style("opacity", 1)
        .delay((d, i) => 400 + i * 100)
        .duration(1500)
        .ease(d3.easeCubicOut);

    // Get the current total of all programs
    let update_total = function() {
        let newTotal = 0;
        for (let i = 0; i < data.length; i++) {
            newTotal += data[i].dollars;
        }
        return newTotal;
    }

    // Update the legend HTML
    let update_legend = function(balance) {
        let curr_bal = 100 - balance;
        let bal_class = "";
        if (curr_bal == 0) {
            bal_class = "empty";
        }

        d3.select("#penny_budget_legend")
            .html(`<h1>Your balance: <span class="${bal_class}">\$${curr_bal}</span></h1>`);
            // .html(`<h1>Current total: \$${balance}</h1>`);
    }

    let update_bar_totals = function() {
        bar_totals.attr("y", d => height - (d.dollars * MULTIPLIER) - SHIFT - 10)
            .html(d => "$" + d.dollars);
    }

    // Get total and update legend on load
    let curr_total = update_total();
    update_legend(curr_total);

    // Add placeholder programs below each bar
    bar_divs.append("div")
        .html( function(d) {
            content = "";
            content += `<p>${d.name}</p>`;

            // Add real programs if they exist in the data set
            if (d.programs) {
                content += "<ul>";
                d.programs.forEach(function(program, index) {
                    content += `<li>${program}</li>`;

                })
                content += "</ul>";
            }
            // otherwise add placeholders
            else {
                content += `<ul><li>Add programs to dataset</li></ul>`;
            }
            return content;
        })
        .attr("y", height + margin.bottom);

    container_div.append("button")
        .html( "Continue &#8594;" );

})();


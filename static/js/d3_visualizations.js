//////////////////////////////////////////////////////
//   Test D3 visualizations for Refund Cleveland

(function() {

    // Parse JSON data in Django template
    // https://docs.djangoproject.com/en/dev/ref/templates/builtins/#std:templatefilter-json_script
    const data = JSON.parse(document.getElementById('json_data').textContent);

   (function(data) {

        const margin = {top: 30, right: 40, bottom: 0, left: 0},
            height = 800 - margin.top - margin.bottom,
            width = 400 - margin.left - margin.right;

        let deptArray = [],
            deptNames = [],
            deptTotals = [],
            index,
            tooltip,
            x,
            y,
            yAxis,
            bandWidth,
            colors,
            svg,
            bars,
            totalBudget,
            startingBudget;

        // Sort Public Safety department array by total
        deptArray = data.fund_structure[0].children[0].departments[8].children;
        deptArray.sort((a, b) => b.total - a.total);

        // Calculate starting total and fill JSON data
        // into some arrays that may be useful
        startingBudget = 0;
        for (index = 0; index < deptArray.length; index++) {
            deptNames.push(deptArray[index].name);
            deptTotals.push(deptArray[index].total);
            startingBudget += deptArray[index].total;
        }
        totalBudget = startingBudget;
        // console.log("STARTING TOTAL: ", totalBudget);

        // Create scales
        y = d3.scaleLinear()
            .domain([0, deptArray.length])
            .range([0, height]);

        x = d3.scaleLinear()
            .domain([0, d3.max(deptTotals)])// 0 to max total
            .range([0, width]);

        bandWidth = d3.scaleBand()
            .domain(deptNames)
            .paddingInner(0.1)
            .range([0, height]);

        // Create axes
        xAxis = d3.axisTop(x).tickPadding(10).tickSize(5)
            .tickFormat(d => "$" + d3.format("~s")(d));

        yAxis = d3.axisLeft(y).tickValues([]);

        // Colors
        // from https://observablehq.com/@d3/color-schemes
        colors = ["#6e40aa","#7140ab","#743fac","#773fad","#7a3fae","#7d3faf","#803eb0","#833eb0","#873eb1","#8a3eb2","#8d3eb2","#903db2","#943db3","#973db3","#9a3db3","#9d3db3","#a13db3","#a43db3","#a73cb3","#aa3cb2","#ae3cb2","#b13cb2","#b43cb1","#b73cb0","#ba3cb0","#be3caf","#c13dae","#c43dad","#c73dac","#ca3dab","#cd3daa","#d03ea9","#d33ea7","#d53ea6","#d83fa4","#db3fa3","#de3fa1","#e040a0","#e3409e","#e5419c","#e8429a","#ea4298","#ed4396","#ef4494","#f14592","#f34590","#f5468e","#f7478c","#f9488a","#fb4987","#fd4a85","#fe4b83","#ff4d80","#ff4e7e","#ff4f7b","#ff5079","#ff5276","#ff5374","#ff5572","#ff566f","#ff586d","#ff596a","#ff5b68","#ff5d65","#ff5e63","#ff6060","#ff625e","#ff645b","#ff6659","#ff6857","#ff6a54","#ff6c52","#ff6e50","#ff704e","#ff724c","#ff744a","#ff7648","#ff7946","#ff7b44","#ff7d42","#ff8040","#ff823e","#ff843d","#ff873b","#ff893a","#ff8c38","#ff8e37","#fe9136","#fd9334","#fb9633","#f99832","#f89b32","#f69d31","#f4a030","#f2a32f","#f0a52f","#eea82f","#ecaa2e","#eaad2e","#e8b02e","#e6b22e","#e4b52e","#e2b72f","#e0ba2f","#debc30","#dbbf30","#d9c131","#d7c432","#d5c633","#d3c934","#d1cb35","#cece36","#ccd038","#cad239","#c8d53b","#c6d73c","#c4d93e","#c2db40","#c0dd42","#bee044","#bce247","#bae449","#b8e64b","#b6e84e","#b5ea51","#b3eb53","#b1ed56","#b0ef59","#adf05a","#aaf159","#a6f159","#a2f258","#9ef258","#9af357","#96f357","#93f457","#8ff457","#8bf457","#87f557","#83f557","#80f558","#7cf658","#78f659","#74f65a","#71f65b","#6df65c","#6af75d","#66f75e","#63f75f","#5ff761","#5cf662","#59f664","#55f665","#52f667","#4ff669","#4cf56a","#49f56c","#46f46e","#43f470","#41f373","#3ef375","#3bf277","#39f279","#37f17c","#34f07e","#32ef80","#30ee83","#2eed85","#2cec88","#2aeb8a","#28ea8d","#27e98f","#25e892","#24e795","#22e597","#21e49a","#20e29d","#1fe19f","#1edfa2","#1ddea4","#1cdca7","#1bdbaa","#1bd9ac","#1ad7af","#1ad5b1","#1ad4b4","#19d2b6","#19d0b8","#19cebb","#19ccbd","#19cabf","#1ac8c1","#1ac6c4","#1ac4c6","#1bc2c8","#1bbfca","#1cbdcc","#1dbbcd","#1db9cf","#1eb6d1","#1fb4d2","#20b2d4","#21afd5","#22add7","#23abd8","#25a8d9","#26a6db","#27a4dc","#29a1dd","#2a9fdd","#2b9cde","#2d9adf","#2e98e0","#3095e0","#3293e1","#3390e1","#358ee1","#378ce1","#3889e1","#3a87e1","#3c84e1","#3d82e1","#3f80e1","#417de0","#437be0","#4479df","#4676df","#4874de","#4a72dd","#4b70dc","#4d6ddb","#4f6bda","#5169d9","#5267d7","#5465d6","#5663d5","#5761d3","#595fd1","#5a5dd0","#5c5bce","#5d59cc","#5f57ca","#6055c8","#6153c6","#6351c4","#6450c2","#654ec0","#664cbe","#674abb","#6849b9","#6a47b7","#6a46b4","#6b44b2","#6c43af","#6d41ad","#6e40aa"];
        colors.reverse();

        // Add tooltip element to DOM
        tooltip = d3.select('body')
            .append("div")
            .attr("class", "tooltip");

        // Add svg element to DOM
        svg = d3.select("#bar_chart")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .classed("svg-content", true);

        // Add bars group to SVG
        bars = svg.append("g").attr("class", "bars")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", `translate(${margin.left} ${margin.top})`)
            .selectAll("rect")
            .data(deptArray)
            .enter()
            .append("g")
            .append("rect")
            .classed("bar", true)
            .attr("width", 0)
            .attr("height", bandWidth.bandwidth())
            .attr("y", (d, i) => y(i))
            .attr("x", 0)
            .attr("rx", 5)
            .attr("fill", (d, i) => colors[30 + (i * 15) % colors.length]);

        // Handles drag event handler
        let currentBar,
            oldTotal,
            newTotal,
            surplus,
            equalShare,
            totalNodes,
            cd,
            datum,
            currBarIndex;
        let dragHandles = d3.drag()
            // .on("start", function(event, d) {})
            .on("drag", function(event, d) {

                const i = handles.nodes().indexOf(this);
                currentBar = d3.select(bars.nodes()[i]);
                oldTotal = currentBar.datum().total;

                cd = currentBar.datum()

                // Calculate new total for bar being dragged
                // ensuring value doesn't go below $0
                // or beyond the width of the graph
                newTotal = Math.max(0, Math.min(x.invert(event.x), x.invert(width)));

                // Update bound datum for bar being dragged
                cd.total = newTotal;

                // Determine how many dollars were freed up
                surplus = oldTotal - newTotal;
                totalNodes = bars.nodes().length;
                equalShare = surplus / (totalNodes - 1);

                // Reallocate surplus to other bars
                bars.nodes().forEach(function(x){
                    datum = d3.select(x).datum();
                    currBarIndex = bars.nodes().indexOf(x);
                    if (currBarIndex !== i) {
                        datum.total += equalShare;
                    }
                });

                // Redraw width and position of bars and handles
                update();

                // Update legend text
                updateLegend();

            })
            .on("end", function(event, d) {

                // Recalculate balance
                totalBudget = 0;
                for (index = 0; index < deptArray.length; index++) {
                    totalBudget += deptArray[index].total;
                }

                // Make sure the budget stays even
                if (Math.round(totalBudget) != startingBudget) {
                    throw "Something went wrong... budget isn't even";
                }

            });

        // Add bar handles to bars group
        let handles = d3.selectAll(".bars g").append("rect")
            .classed("handle", true)
            .attr("height", bandWidth.bandwidth())
            .attr("width", 10)
            .attr("x", d => x(d.total) - 10)
            .attr("y", (d, i) => y(i))
            .attr("rx", 5)
            .call(dragHandles);

        // Tooltip event handlers
        bars.on('mouseover', function(event, d) {
                const e = bars.nodes();
                const i = e.indexOf(this);

                d3.select(".tooltip")
                    .classed("show", true)
                    .html(`<span class="dept_name"> ${d.name}:</span> \$${addCommas(Math.round(d.total))}`)
                    .style("top", `${event.pageY - 50}px`)
                    .style("left", `${event.pageX - 50}px`)

                d3.select(this).classed("hover", true);

            })
            .on('mouseout', function() {
                tooltip.classed("show", false)
                d3.select(this).classed("hover", false);
            })
            .on('mousemove', function(event, d) {
                d3.select(".tooltip")
                    .style("top", `${event.pageY - 50}px`)
                    .style("left", `${event.pageX - 50}px`)
            });

        // Add x axis to DOM
        svg.append("g").attr("class", "axis x")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(xAxis);

        // Add y axis to DOM
        svg.append("g").attr("class", "axis y")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);

        // Animate in bars on load
        svg.selectAll(".bars g rect.bar")
            .transition()
            .attr("width", d => x(d.total))
            .delay((d, i) => i * 20)
            .duration(1500)
            .ease(d3.easeBounceOut);

        /////////////////////////////////////////////////////
        // Helper functions

        // Update height and position of bars and handles
        // using Math.max to ensure they remain on screen
        // even when their datum value is negative
        let update = function() {
            svg.selectAll(".bars g rect.bar")
                .attr("width", d => Math.max(15, x(d.total)));

            svg.selectAll(".bars g rect.handle")
                .attr("x", d => Math.max(5, x(d.total) - 10));
        }

        // Update text in #legend div
        let updateLegend = function(total) {
            let legend_text = "<h2>Total Public Safety Budget: $" + addCommas(Math.round(totalBudget)) + "</h2>";
            deptArray.forEach(function(x){
                legend_text += "<p><span>" + x.name + "</span><span ";
                if (x.total < 0) { legend_text += "class='red'"; }
                legend_text += "> $" + addCommas(Math.round(x.total)) + "</p></span>";
            });
            d3.select("#legend").html(legend_text);
        }

        // Format integer with price commas
        let addCommas = function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // Add starting legend text on load
        updateLegend();

    })(data);
})();




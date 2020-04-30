/**
 *  Graph 1 Top Ten Video Game Sales Graph Section
 **/

const GRAPH1_NUM_EXAMPLES = 10;

// Set up SVG object with width, height and margin
let graph1 = d3
    .select("#graph1")
    .append("svg")
    .attr("width", graph_1_width) // HINT: width
    .attr("height", graph_1_height) // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); // HINT: transform

// Create a linear scale for the x axis (number of occurrences)
let x1 = d3
    .scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y1 = d3
    .scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1); // Improves readability

// Set up reference to count SVG group
let countRef = graph1.append("g");
// Set up reference to y axis label to update text in setData
let g1_y_axis_label = graph1.append("g");

// TODO: Add x-axis label
graph1
    .append("text")
    .attr(
        "transform",
        `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                        ${
                                            graph_1_height -
                                            margin.top -
                                            margin.bottom +
                                            15
                                        })`
    ) // Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Combined Platform Global Sales (Millions)");

// Since this text will not update, we can declare it outside of the setData function

let graph1_y_axis_text = graph1
    .append("text")
    .attr("transform", `translate(-50, ${-10})`)
    .style("text-anchor", "middle");

// TODO: Add chart title
let graph1_title = graph1
    .append("text")
    .attr(
        "transform",
        `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-10})`
    )
    .style("text-anchor", "middle")
    .style("font-size", 15);

let color = d3
    .scaleOrdinal()
    .range(
        d3.quantize(
            d3.interpolateHcl("#66a0e2", "#81c2c3"),
            GRAPH1_NUM_EXAMPLES
        )
    );

const setG1Data = (genre) => {
    attr = "Name";
    // Load the video_game CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(data_file).then(function (data) {
        console.log("Genre", genre);
        if (genre !== "All") {
            data = data.filter((x) => x.Genre === genre);
            graph1_title.text(`Top 10 ${genre} Video Game Sales of All Time`);
        } else {
            graph1_title.text(`Combined Top 10 Video Game Sales of All Time`);
        }

        let map_data = new Map();
        // sum the data's Global Sales by Publisher
        for (let i = 0; i < data.length; i++) {
            x = data[i];
            if (map_data[x.Name] === undefined) {
                map_data[x.Name] = {
                    Name: x.Name,
                    Genre: x.Genre,
                    Global_Sales: parseFloat(x.Global_Sales),
                };
            } else {
                let row = map_data[x.Name];
                row.Global_Sales =
                    row.Global_Sales + parseFloat(x.Global_Sales);
            }
        }

        data = Object.values(map_data);

        // TODO: Clean and strip desired amount of data for barplot
        data = getDataSubset(
            data,
            function (a, b) {
                return parseFloat(b.Global_Sales) - parseFloat(a.Global_Sales);
            },
            GRAPH1_NUM_EXAMPLES
        );
        console.log("Graph1 data", data);
        // TODO: Update the x axis domain with the max count of the provided data
        x1.domain([
            0,
            d3.max(data, function (d) {
                return parseFloat(d.Global_Sales);
            }),
        ]);

        // TODO: Update the y axis domains with the desired attribute
        y1.domain(
            data.map(function (d) {
                return d[attr];
            })
        );
        color.domain(
            data.map(function (d) {
                return d[attr];
            })
        ); // OPTIONAL
        // HINT: Use the attr parameter to get the desired attribute for each data point

        // TODO: Render y-axis label
        g1_y_axis_label.call(d3.axisLeft(y1).tickSize(0).tickPadding(10));

        /*
                This next line does the following:
                    1. Select all desired elements in the DOM
                    2. Count and parse the data values
                    3. Create new, data-bound elements for each data value
             */
        let bars = graph1.selectAll("rect").data(data);

        // TODO: Render the bar elements on the DOM
        /*
                This next section of code does the following:
                    1. Take each selection and append a desired element in the DOM
                    2. Merge bars with previously rendered elements
                    3. For each data point, apply styling attributes to each element
    
                Remember to use the attr parameter to get the desired attribute for each data point
                when rendering.
             */
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function (d) {
                return color(d[attr]);
            }) // OPTIONAL for students
            .attr("x", x1(0))
            .attr("y", function (d) {
                return y1(d[attr]);
            }) // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", function (d) {
                return x1(parseInt(d.Global_Sales));
            })
            .attr("height", y1.bandwidth()); // HINT: y.bandwidth() makes a reasonable display height

        /*
                In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
                bar plot. We will be creating these in the same manner as the bars.
             */
        let counts = countRef.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts
            .enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function (d) {
                return x1(parseFloat(d.Global_Sales)) + 10;
            }) // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function (d) {
                return y1(d[attr]) + 10;
            }) // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function (d) {
                return d3.format(".2f")(d.Global_Sales);
            }); // HINT: Get the count of the artist

        graph1_y_axis_text.text("Video Game Name");

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();
    });
};

setG1Data("All");

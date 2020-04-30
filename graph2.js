/**
 *  Graph 2 Top Ten Video Game Sales Graph Section
 **/

const GRAPH2_NUM_EXAMPLES = 10;

// Set up SVG object with width, height and margin
let graph2 = d3
    .select("#graph2")
    .append("svg")
    .attr("width", graph_2_width) // HINT: width
    .attr("height", graph_2_height) // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); // HINT: transform

// Create a linear scale for the x axis (number of occurrences)
let x2 = d3
    .scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y2 = d3
    .scaleBand()
    .range([0, graph_2_height - margin.top - margin.bottom])
    .padding(0.1); // Improves readability

// Set up reference to count SVG group
let countRef2 = graph2.append("g");

// Set up reference to y axis label to update text in setData
let g2_y_axis_label = graph2.append("g");

// TODO: Add x-axis label
graph2
    .append("text")
    .attr(
        "transform",
        `translate(${(graph_2_width - margin.left - margin.right) / 2},
                                        ${
                                            graph_2_height -
                                            margin.top -
                                            margin.bottom +
                                            15
                                        })`
    ) // Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Combined Global Sales by Genre (Millions)");

// Since this text will not update, we can declare it outside of the setData function

let graph2_y_axis_text = graph2
    .append("text")
    .attr("transform", `translate(-50, ${-10})`)
    .style("text-anchor", "middle");

// TODO: Add chart title
let graph2_title = graph2
    .append("text")
    .attr(
        "transform",
        `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-10})`
    )
    .style("text-anchor", "middle")
    .style("font-size", 15);

const setG2Data = (genre) => {
    attr2 = "Publisher";
    // Load the video_game CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(data_file).then(function (data) {
        // get the data by genre
        if (genre !== "All") {
            data = data.filter((x) => x.Genre === genre);
            graph2_title.text(`Top 10 Publishers in the ${genre} Genre`);
        } else {
            graph2_title.text(
                `Top 10 Publishers in All of the Genres Combined`
            );
        }

        let map_data = new Map();
        // sum the data's Global Sales by Publisher
        for (let i = 0; i < data.length; i++) {
            x = data[i];
            if (map_data[x.Publisher] === undefined) {
                map_data[x.Publisher] = {
                    Publisher: x.Publisher,
                    Genre: x.Genre,
                    Global_Sales: parseFloat(x.Global_Sales),
                };
            } else {
                let row = map_data[x.Publisher];
                row.Global_Sales =
                    row.Global_Sales + parseFloat(x.Global_Sales);
            }
        }

        data = Object.values(map_data);

        data = getDataSubset(
            data,
            function (a, b) {
                return b.Global_Sales - a.Global_Sales;
            },
            GRAPH2_NUM_EXAMPLES
        );
        console.log("Graph2 data", data);

        // TODO: Update the x axis domain with the max count of the provided data
        x2.domain([
            0,
            d3.max(data, function (d) {
                return d.Global_Sales;
            }),
        ]);

        // TODO: Update the y axis domains with the desired attr2ibute
        y2.domain(
            data.map(function (d) {
                return d[attr2];
            })
        );
        color.domain(
            data.map(function (d) {
                return d[attr2];
            })
        ); // OPTIONAL
        // HINT: Use the attr parameter to get the desired attribute for each data point

        // TODO: Render y-axis label
        g2_y_axis_label.call(d3.axisLeft(y2).tickSize(0).tickPadding(10));

        /*
                This next line does the following:
                    1. Select all desired elements in the DOM
                    2. Count and parse the data values
                    3. Create new, data-bound elements for each data value
             */
        let bars = graph2.selectAll("rect").data(data);
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
                return color(d[attr2]);
            }) // OPTIONAL for students
            .attr("x", x2(0))
            .attr("y", function (d) {
                return y2(d[attr2]);
            }) // HINT: Use function(d) { return ...; } to apply styles based on the data point

            .attr("width", function (d) {
                return x2(parseInt(d.Global_Sales));
            })
            .attr("height", y2.bandwidth()); // HINT: y.bandwidth() makes a reasonable display height

        /*
                In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
                bar plot. We will be creating these in the same manner as the bars.
             */
        let counts = countRef2.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts
            .enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function (d) {
                return x2(d.Global_Sales) + 10;
            }) // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function (d) {
                return y2(d[attr2]) + 10;
            })
            // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function (d) {
                return d3.format(".2f")(d.Global_Sales);
            });

        graph2_y_axis_text.text("Publisher Name");

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();
    });
};

setG2Data("All");

let genres = [
    "Action",
    "Adventure",
    "Fighting",
    "Misc",
    "Platform",
    "Puzzle",
    "Racing",
    "Role-Playing",
    "Shooter",
    "Simulation",
    "Sports",
    "Strategy",
];

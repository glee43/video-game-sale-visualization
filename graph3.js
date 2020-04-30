let radius = Math.min(graph_3_height, graph_3_width) / 2;

let graph3 = d3
    .select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height + 30)
    .append("g")
    .attr(
        "transform",
        `translate(${graph_3_width / 2}, ${graph_3_height / 2 + 30})`
    );

// Set up reference to tooltip
let tooltip = d3
    .select("#graph3") // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// set the color scale
let color3 = d3
    .scaleOrdinal()
    .domain(["Japan", "Europe", "Other", "North America"])
    .range(d3.schemeCategory10);

// TODO: Add chart title
let graph3_title = graph3
    .append("text")
    .attr("transform", `translate(${0}, ${-graph_3_height / 2 - 10})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

// Mouseover function to display the tooltip on hover

const setG3Data = (genre) => {
    d3.csv(data_file).then(function (data) {
        if (genre !== "All") {
            data = data.filter((x) => x.Genre === genre);

            graph3_title.text(
                `Combined ${genre} Game Sale by Region (NA, EU, JP, Other)`
            );
        } else {
            graph3_title.text(
                `Combined Total Sale By Region (NA, EU, JP, Other)`
            );
        }

        let map_data = new Map();

        map_data["EU"] = {
            Label: "Europe",
            Data: [],
            Total_Sales: 0,
            Global_Sales: 0,
        };
        map_data["NA"] = {
            Label: "North America",
            Data: [],
            Total_Sales: 0,
            Global_Sales: 0,
        };
        map_data["JP"] = {
            Label: "Japan",
            Data: [],
            Total_Sales: 0,
            Global_Sales: 0,
        };
        map_data["Other"] = {
            Label: "Other",
            Data: [],
            Total_Sales: 0,
            Global_Sales: 0,
        };

        // sum the data's Sales by Region
        for (let i = 0; i < data.length; i++) {
            x = data[i];
            map_data["NA"].Total_Sales += parseFloat(x.NA_Sales);
            map_data["EU"].Total_Sales += parseFloat(x.EU_Sales);
            map_data["JP"].Total_Sales += parseFloat(x.JP_Sales);
            map_data["Other"].Total_Sales += parseFloat(x.Other_Sales);
            let total =
                parseFloat(x.NA_Sales) +
                parseFloat(x.EU_Sales) +
                parseFloat(x.JP_Sales) +
                parseFloat(x.Other_Sales);
            map_data["NA"].Global_Sales += total;
            map_data["EU"].Global_Sales += total;
            map_data["JP"].Global_Sales += total;
            map_data["Other"].Global_Sales += total;
            map_data["NA"].Data.push(x);
            map_data["EU"].Data.push(x);
            map_data["JP"].Data.push(x);
            map_data["Other"].Data.push(x);
        }
        // sort the data by NA sales
        map_data["NA"].Data = map_data["NA"].Data.sort(function (a, b) {
            return b.NA_Sales - a.NA_Sales;
        }).slice(0, 5);
        map_data["EU"].Data = map_data["EU"].Data.sort(function (a, b) {
            return b.EU_Sales - a.EU_Sales;
        }).slice(0, 5);
        map_data["JP"].Data = map_data["JP"].Data.sort(function (a, b) {
            return b.JP_Sales - a.JP_Sales;
        }).slice(0, 5);
        map_data["Other"].Data = map_data["Other"].Data.sort(function (a, b) {
            return b.Other_Sales - a.Other_Sales;
        }).slice(0, 5);

        data = Object.values(map_data);

        console.log("Graph3 ", data);

        let pie = d3
            .pie()
            .value(function (d) {
                return d.Total_Sales;
            })
            .sort(function (a, b) {
                return d3.ascending(a.Label, b.Label);
            });
        let data_ready = pie(data);

        var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

        let u = graph3.selectAll("mySlices").data(data_ready);

        let mouseover = function (d) {
            let game = d.data.Data;
            let color_span = `<span style="color: ${color3(d.data.Label)}; ">`;
            let color_span_u = `<span style="color: ${color3(
                d.data.Label
            )}; text-decoration: underline">`;
            let label_map = {
                Europe: "EU_Sales",
                Japan: "JP_Sales",
                Other: "Other_Sales",
            };
            label_map["North America"] = "NA_Sales";
            let label = label_map[d.data.Label];
            let money = "";

            if (d.data.Total_Sales > 1000) {
                money =
                    "$" + d3.format(".3n")(d.data.Total_Sales / 1000) + " B";
            } else {
                money = "$" + d3.format(".3n")(d.data.Total_Sales) + " M";
            }

            let html = `
                <div style="padding: 10px">
                    
                    ${color_span} Total ${genre} Games Sale in ${d.data.Label} = ${money}</span><br/><br/>
                    ${color_span_u} Top 5 ${genre} Games in ${d.data.Label} </span><br/>
                    ${color_span} 1. ${game[0].Name} ($${game[0][label]} M)</span><br/>
                    ${color_span} 2. ${game[1].Name} ($${game[1][label]} M)</span><br/>
                    ${color_span} 3. ${game[2].Name} ($${game[2][label]} M)</span><br/>
                    ${color_span} 4. ${game[3].Name} ($${game[3][label]} M)</span><br/>
                    ${color_span} 5. ${game[4].Name} ($${game[4][label]} M)</span><br/>
                    
                </div style="padding: 10px">
                `; // HINT: Display the song here

            // Show the tooltip and set the position relative to the event X and Y location
            tooltip
                .html(html)
                .style("left", `${d3.event.pageX + 10}px`)
                .style("top", `${d3.event.pageY - 30}px`)
                .style("box-shadow", `2px 2px 5px ${color3(d.data.Label)}`) // OPTIONAL for students
                .style("background-color", `white`)
                .style("padding", 10)
                .transition()
                .duration(200)
                .style("opacity", 0.9);
        };

        // Mouseout function to hide the tool on exit
        let mouseout = function (d) {
            // Set opacity back to 0 to hide
            tooltip.transition().duration(200).style("opacity", 0);
        };

        u.enter()
            .append("path")
            .merge(u)
            .transition()
            .duration(2000)
            .attr("d", arcGenerator)

            .attr("fill", function (d) {
                return color3(d.data.Label);
            })
            .attr("stroke", "white")

            .style("stroke-width", "2px")
            .style("opacity", 1);

        u.enter()
            .append("text")
            .text(function (d) {
                return (
                    d.data.Label +
                    "\n (" +
                    d3.format(".1%")(d.data.Total_Sales / d.data.Global_Sales) +
                    ")"
                );
            })
            .attr("transform", function (d) {
                return "translate(" + arcGenerator.centroid(d) + ")";
            })
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", 10)
            .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout);
        // remove the group that is not present anymore
        u.exit().remove();
    });
};

setG3Data("All");
/**
 * Add graph buttons
 **/
let graph2_buttons = document.getElementById("graph2_buttons");

let btn = document.createElement("Button");
btn.innerHTML = "All";
btn.className = "btn btn-info button";
btn.addEventListener("click", () => {
    setG1Data("All");
    setG2Data("All");
    setG3Data("All");
});

graph2_buttons.appendChild(btn);
for (i in genres) {
    const genre = genres[i];
    let btn = document.createElement("Button");
    btn.innerHTML = genre;
    btn.className = "btn btn-info button";
    btn.addEventListener("click", () => {
        setG1Data(genre);
        setG2Data(genre);
        setG3Data(genre);
    });
    graph2_buttons.appendChild(btn);
}

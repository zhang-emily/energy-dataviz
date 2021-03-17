import * as d3 from "d3";

// Stacked line for state energy sources

// set the dimensions and margins of the graph
var margin = { top: 100, right: 30, bottom: 30, left: 60 };
var width = 500 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

//Read the data

d3.csv("data/state_trends.csv").then(function(data) {
  // filter by one state
  var filtered = data.filter(function(row) {
    return row["STATE"] == "OK" && row["YEAR"] >= 2010;
  });
  var svg = d3
    .select("#state-trend")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // console.log({ filtered });

  // group the data: one array for each value of the X axis.
  var sumstat = d3.group(filtered, (x) => x.YEAR);

  var sources = [
    "Coal",
    "Oil",
    "Natural Gas",
    "Solar",
    "Wind",
    "Hydro",
    "Nuclear",
  ];

  // console.log({ sumstat });
  var stackedData = d3
    .stack()
    .keys(sources)
    .value(function([year, values], key) {
      const matchingThing = values.find((val) => val.ENERGY_SOURCE === key);
      return !matchingThing ? 0 : matchingThing.PERCENT_GEN;
    })(sumstat);

  // Add X axis --> it is a date format
  var x = d3
    .scaleLinear()
    .domain([
      2010,
      d3.max(data, function(d) {
        return Number(d.YEAR);
      }),
    ])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function(d) {
        return Number(d.PERCENT_GEN);
      }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // color palette
  var color = d3
    .scaleOrdinal()
    .domain(sources)
    .range([
      "#323232",
      "#634a4a",
      "#eb9534",
      "#f7eb45",
      "cornflowerblue",
      "#ab91ff",
      "#e34646",
    ]);

  // Show the areas
  // console.log(stackedData);
  const areaFunc = d3
    .area()
    .x((d, i) => x(d.data[0]))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]));
  svg
    .selectAll(".my-area")
    .data(stackedData)
    .join("path")
    .attr("class", "my-area")
    .style("fill", function(d) {
      return color(d.key);
    })
    .attr("d", (d) => areaFunc(d));
});

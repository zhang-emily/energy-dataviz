import * as d3 from "d3";
import * as topojson from "topojson-client";

// -------- Choro map ---------- //

var projection = d3.geoAlbersUsa();

var selected = "";

var sources = [
  "Coal",
  "Oil",
  "Natural Gas",
  "Solar",
  "Wind",
  "Hydro",
  "Nuclear",
  "Other",
];

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
    "#BEBEBE",
  ]);

Promise.all([
  d3.json("data/states-10m.json"),
  d3.csv("data/choro_2019.csv"),
]).then((results) => {
  const [us, data] = results;
  choroMap(us, data);
});

// Function to create maps
function choroMap(us, data) {
  // console.log(us);
  // console.log(data);

  // Draw the map
  var path = d3.geoPath().projection(projection);

  var svg = d3
    .select("#choro-map")
    .append("svg")
    .attr("viewBox", [0, 0, 975, 610]);

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .join("path")
    .attr("class", "state")
    .attr("fill", function(d, key) {
      // setting the fill
      // console.log(data);
      const thRow = data.find(function(x) {
        return Number(x.id) === Number(d.id);
      });
      if (thRow) {
        return color(thRow.Top_Source);
      }
    })
    .attr("d", d3.geoPath().projection(projection)) // draw each state
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .style("opacity", 0.8)
    .attr("d", path);

  var tooltip = d3.select("#state-info").append("g");

  // Create and customize tooltip - https://bl.ocks.org/duynguyen158/b96fa12ed5590b8435af799728e00a96
  svg
    .selectAll(".state")
    .on("mouseover", function(d) {
      var state = d.target.__data__;
      // console.log(state);
      d3.select("#state-trend")
        .selectAll("svg")
        .remove();
      const thRow = data.find(function(x) {
        return Number(x.id) === Number(state.id);
      });
      console.log(thRow);
      if (thRow) {
        console.log(thRow.STATE);
        selected = thRow.STATE;
        stateTrend(selected);
        tooltip.html(
          "<h4>" +
            state.properties.name +
            "</h4><br><h5>" +
            "The primary energy source in " +
            state.properties.name +
            " is " +
            thRow.Top_Source +
            "." +
            "</h5>"
        );
      }
      /// --- Added code above
      d3.select(this)
        .attr("stroke", "red")
        .style("opacity", 1)
        .raise();
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr("stroke", "white")
        .style("opacity", 0.8)
        .lower();
    });
}

// ----- Stacked bar chart ----- //

// Stacked line for state energy sources

// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 50, left: 60 };
var width = 400 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

//Read the data

function stateTrend(selected) {
  // filter by one state
  d3.csv("data/state_trends.csv").then(function(data) {
    // console.log(data);
    // console.log(selected);
    var filtered = data.filter(function(row) {
      return row["STATE"] == selected && row["YEAR"] >= 2010;
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

    // console.log({ sumstat });
    var stackedData = d3
      .stack()
      .keys(sources)
      .value(function([year, values], key) {
        const matchingThing = values.find((val) => val.ENERGY_SOURCE === key);
        return !matchingThing ? 0 : matchingThing.PERCENT_GEN;
      })(sumstat);

    // Add X axis - it is a date format
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
      .call(
        d3
          .axisBottom(x)
          .ticks(10)
          .tickFormat(d3.format("d"))
      );

    // text label for the x axis - source: https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
      )
      .style("text-anchor", "middle")
      .text("Year");

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

    // text label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Percent Generation");

    svg.append("g").call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

    // color palette

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
}

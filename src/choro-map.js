import * as d3 from "d3";
import * as topojson from "topojson-client";
import us from "../data/states-10m.json";
// import { select } from "d3-selection";

// -------- Choro map ---------- //

var projection = d3.geoAlbersUsa();

var color = d3
  .scaleOrdinal()
  .domain(["Coal", "Oil", "Natural Gas", "Solar", "Wind", "Hydro", "Nuclear"])
  .range([
    "#323232",
    "#634a4a",
    "#eb9534",
    "#f7eb45",
    "cornflowerblue",
    "#ab91ff",
    "#e34646",
  ]);

// set the dimensions and margins of the graph
var margin = { top: 0, right: 0, bottom: 0, left: 0 };
var width = 300 - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

//Read the data

d3.csv("data/choro_2019.csv").then(function(data) {
  // console.log(us);
  console.log(data);

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
      if (typeof data[d.id] !== "undefined") {
        return color(data[d.id].Top_Source);
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
      console.log(data[state.id].Top_Source);
      tooltip.html(
        "<h3>" +
          state.properties.name +
          "</h3>" +
          "<br><p><strong>Predominant Energy Source: </strong>" +
          data[state.id].Top_Source +
          "</p>"
      );
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
});

import * as d3 from "d3";
import * as topojson from "topojson-client";
import us from "../data/states-10m.json";
// import { select } from "d3-selection";

// -------- Choro map ---------- //

var projection = d3.geoAlbersUsa();

var sources = [
  "Coal",
  "Oil",
  "Natural Gas",
  "Solar",
  "Wind",
  "Hydro",
  "Nuclear",
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
  ]);

// set the dimensions and margins of the graph
var margin = { top: 0, right: 0, bottom: 0, left: 0 };
var width = 300 - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

// Format tooltip
function callout(g, value) {
  if (!value) return g.style("display", "none");

  g.style("display", null)
    .style("pointer-events", "none")
    .style("font", "10px sans-serif");

  var path = g
    .selectAll("path")
    .data([null])
    .join("path")
    .attr("fill", "white")
    .attr("stroke", "black");

  var text = g
    .selectAll("text")
    .data([null])
    .join("text")
    .call(function(text) {
      text
        .selectAll("tspan")
        .data((value + "").split("/\n/"))
        .join("tspan")
        .attr("x", 0)
        .attr("y", function(d, i) {
          return i * 1.1 + "em";
        })
        .style("font-weight", function(_, i) {
          return i ? null : "bold";
        })
        .text(function(d) {
          return d;
        });
    });

  var x = text.node().getBBox().x;
  var y = text.node().getBBox().y;
  var w = text.node().getBBox().width;
  var h = text.node().getBBox().height;

  text.attr("transform", "translate(" + -w / 2 + "," + (15 - y) + ")");
  path.attr(
    "d",
    "M" +
      (-w / 2 - 10) +
      ",5H-5l5,-5l5,5H" +
      (w / 2 + 10) +
      "v" +
      (h + 20) +
      "h-" +
      (w + 20) +
      "z"
  );
}

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
    .attr("d", path);

  var tooltip = svg.append("g");

  // Create and customize tooltip - https://bl.ocks.org/duynguyen158/b96fa12ed5590b8435af799728e00a96
  svg
    .selectAll(".state")
    .on("mouseover", function(d) {
      var state = d.target.__data__;
      // console.log(d.target);
      tooltip.call(callout, data[state.id] + "/\n/" + state.properties.name);
      d3.select(this)
        .attr("stroke", "red")
        .raise();
    })
    .on("mousemove", function() {
      console.log(d3.pointer(this));
      tooltip.attr(
        "transform",
        "translate(" + d3.pointer(this)[0] + "," + d3.pointer(this)[1] + ")"
        // "translate(" + d3.event.pageX + "," + d3.event.pageY + ")"
      );
    })
    .on("mouseout", function() {
      tooltip.call(callout, null);
      d3.select(this)
        .attr("stroke", null)
        .lower();
    });
});

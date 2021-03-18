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

//Read the data

d3.csv("data/choro_2019.csv").then(function(data) {
  // console.log(us);
  console.log(data);

  var states = us.objects.states.geometries.map((d) => [d.id, d.properties]);
  var path = d3.geoPath().projection(projection);

  var svg = d3
    .select("#choro-map")
    .append("svg")
    .attr("viewBox", [0, 0, 975, 610]);
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  // .append("g");
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    // .data(us)
    .join("path")
    // .attr("fill", (d) => color(data[d.id])) // setting the fill
    .attr("fill", function(d, key) {
      if (typeof data[d.id] !== "undefined") {
        return color(data[d.id].Top_Source);
      }
    })
    .attr("d", d3.geoPath().projection(projection)) // draw each state
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);
});

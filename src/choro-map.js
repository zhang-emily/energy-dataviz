import * as d3 from "d3";
import * as topojson from "topojson-client";
import { select } from "d3-selection";
// import { legend } from "@d3/color-legend";

// import { states } from "https://unpkg.com/us-atlas@1/us/10m.json";

// -------- Choro map ---------- //

// topojson = require("topojson-client@3");
// d3 = require("d3@6");

Promise.all([
  // d3.json("https://unpkg.com/us-atlas@1/us/10m.json"),
  d3.json("data/states-10m.json"),
  d3.csv("data/choro_2019.csv"),
]).then((results) => {
  const [us, data] = results;
  choroMap(us, data);
});

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

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

function choroMap(us, data) {
  // console.log(topojson.feature(us, us.objects.states).features);
  console.log(data);

  // var states = new Map(
  //   us.objects.states.geometries.map((d) => [d.id, d.properties])
  // );

  var svg = d3
    .select("#choro-map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // svg
  //   .append("g")
  //   .selectAll("path")
  //   .datum(topojson.feature(us, us.objects.states).features);
  //   .join("path")
  //   .attr("fill", (d) => color(data.get(d.Top_Source)))
  //   .attr("d", d3.geoPath().projection(projection));
}

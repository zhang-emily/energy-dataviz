import * as d3 from "d3";
import * as topojson from "topojson-client";
// import { states } from "https://unpkg.com/us-atlas@1/us/10m.json";

// -------- Choro map ---------- //

Promise.all([
  // d3.json("https://unpkg.com/us-atlas@1/us/10m.json"),
  d3.json("data/states-10m.json"),
  d3.csv("data/choro_2019.csv"),
]).then((results) => {
  const [states, data] = results;
  choroMap(states, data);
});

// set the dimensions and margins of the graph
// var margin = { top: 10, right: 30, bottom: 30, left: 60 },
//   width = 600 - margin.left - margin.right,
//   height = 400 - margin.top - margin.bottom;

var projection = d3.geoAlbersUsa();

function choroMap(states, data) {
  console.log(states);
  const svg = d3
    .create("svg")
    .select("#choro-map")
    .attr("viewBox", [0, 0, 975, 610]);

  svg
    .append("g")
    .selectAll("path")
    .datum(topojson.feature(states, data).features)
    .join("path")
    .attr("fill", (d) => color(data.get(d.id)))
    .attr("d", d3.geoPath().projection(projection));

  return svg.node();
}

import * as d3 from "d3";
// -------- Choro map ---------- //

// // set the dimensions and margins of the graph
// var margin = { top: 10, right: 30, bottom: 30, left: 60 },
//   width = 600 - margin.left - margin.right,
//   height = 400 - margin.top - margin.bottom;

// // importing data
fetch("./data/choro_2019.csv")
  .then((x) => x.json())
  .then((data) => ChoroMap(data))
  .catch((e) => {
    console.log(e);
  });

function ChoroMap(data) {
  var map = d3
    .choropleth()
    .geofile("./data/states-10m.json")
    .projection(d3.geoAlbersUsa)
    .unitId("fips")
    .scale(1000)
    .legend(true);

  d3.csv("./data/choro_2019.csv").then((data) => {
    map.draw(d3.select("#choro-map").datum(data));
  });
}

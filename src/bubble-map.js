import * as d3 from "d3";
import * as topojson from "topojson-client";

// -------- Bubble map ---------- //
var fills = {
  "Natural Gas": "#eb9534",
  Coal: "#919191",
  Wind: "cornflowerblue",
  Solar: "#f7eb45",
  Nuclear: "#e34646",
  Hydro: "#ab91ff",
  Oil: "#634a4a",
  defaultFill: "grey",
};

// Bubble maps
var i = 0;
var len = sources.length;
for (; i < len; i++) {
  fetch(`./data/bubble/${sources[i]}_2019.json`)
    .then((response) => response.json())
    .then((data) => BubbleMap(data))
    .catch((e) => {
      console.log(e);
    });

  function BubbleMap(data) {
    // Create map
    var bubblemap = new Datamap({
      scope: "usa",
      element: document.getElementById("bubble-map"),
      geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false,
      },
      fills: fills,
    });
    bubblemap.bubbles(data, {
      popupTemplate: function(geo, data) {
        // console.log(data);
        return (
          '<div class="hoverinfo"><strong>' +
          data.name +
          "</strong><br>" +
          `${data.fillKey} Generation (MWh): ` +
          (data["GENERATION (Megawatthours)"] / 1000000).toFixed(1) +
          " million"
        );
      },
    });
    bubblemap.labels();
  }
}

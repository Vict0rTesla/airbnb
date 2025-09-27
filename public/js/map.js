console.log(mapKey)
console.log(coordinates)
const map = new maplibregl.Map({
  center: coordinates,
  zoom: 13,
  container: 'map', // The ID of the HTML element to initialize the map in
  style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${mapKey}`,
});
map.addControl(new maplibregl.NavigationControl());

const home = new maplibregl.Marker({ color: "#fe424d" }).setLngLat(coordinates).addTo(map)




// map.on('load', () => {
//   map.setPaintProperty('highway-motorway', 'line-width', { "base": 1.2, "stops": [[6.5, 0], [7, 1.25], [20, 45]] });
// });

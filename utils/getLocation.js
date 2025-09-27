async function getLocation(city) {
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=3c8d78dda0a64fd0a779237cc8c864af`
  );
  const data = await res.json();

  const feature = data?.features?.[0];
  if (!feature) return null;


  return data.features[0].geometry;
}

module.exports = getLocation;

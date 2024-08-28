// Define product categories
const veryCommonProducts = [
  "zee-bangla.png",
  "star-jalsha.png",
  "sony-sab.png",
  "t-series.png",
];

const commonProducts = [
  "horlicks.png",
  "parachute-hair-oil.png",
  "prestige.png",
];

const rareProducts = ["asian-paints.png", "mahindra.png", "tata.png"];

const extremelyRareProducts = [];

const epicProducts = ["khuni-hasina.png", "khunir-chele-joy.png"];

//list with multiple entries for weighted randomness
function createWeightedList(productArray, weight) {
  return productArray.flatMap((product) => Array(weight).fill(product));
}

//full list of products
const products = [
  ...createWeightedList(veryCommonProducts, 5), // Common products appear more frequently
  ...createWeightedList(commonProducts, 4), // Common products appear more frequently
  ...createWeightedList(rareProducts, 3), // Rare products appear less frequently
  ...createWeightedList(extremelyRareProducts, 2), // Rare products appear less frequently
  ...epicProducts, // Epic products appear only once each
];

//export
export default products;

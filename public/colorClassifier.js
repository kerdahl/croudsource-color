let data;

function preload() {
  data = loadJSON('colorCategories.json');
}

function setup() {
  console.log(data.entries.length);

  let colors = [];
  for (let record of data.entries) {
    let col = [record.r / 255, record.g / 255, record.b / 255];
    colors.push(col);
  }

  let xs = tf.tensor2d(colors);
  console.log(xs.shape);
}
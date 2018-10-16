import * as Jimp from "jimp";
import fetch from "node-fetch";
import * as path from "path";

const API_URL = "<URL>/detect?returnFaceLandmarks=true";
const API_KEY = "<KEY>";

async function detectFaces(imageUrl) {
  let response = await fetch(API_URL, {
    headers: {
      "Ocp-Apim-Subscription-Key": API_KEY,
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ url: imageUrl })
  });
  let resp = await response.json();
  console.log(JSON.stringify(resp, null, 2));
  return resp;
}

async function processImage(imageUrl, faces) {
  let image = await Jimp.read(imageUrl);
  let origShades = await Jimp.read("./assets/shades.png");

  for (let face of faces) {
    let shades = origShades.clone();
    let {
      faceRectangle: { left, width },
      faceLandmarks: { pupilLeft, pupilRight }
    } = face;
    const eyeHeight = (pupilLeft.y + pupilRight.y) / 2.0;
    shades.resize(width, Jimp.AUTO);
    const shadesHeight = eyeHeight - shades.bitmap.height / 2.0;
    image = image.composite(shades, left, shadesHeight);
  }
  image.write(path.join(__dirname, "./out/", `thuged.jpg`));
}

async function main() {
  const [imageUrl] = process.argv.slice(2);
  console.log(imageUrl);
  const faces = await detectFaces(imageUrl);
  await processImage(imageUrl, faces);
}
main();

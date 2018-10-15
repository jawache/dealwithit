import * as Jimp from "jimp";
import fetch from "node-fetch";

const API_URL = "...";
const API_KEY = "...";

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

async function processImage(imageUrl, faces) {}

async function main() {
  const [imageUrl] = process.argv.slice(2);
  console.log(imageUrl);
  const faces = await detectFaces(imageUrl);
  await processImage(imageUrl, faces);
}
main();

const analyzeImage = require("./analyzeImage");
const path = require("path");
const DBpath = "uploads\\6a54c51e3ead7f7ff57719f6\\1786090140399-Screenshot 2026-05-29 182855.png";
const imagePath = path.join(
    __dirname,
    "..",
    DBpath
);
// const aiData;
console.log(imagePath);

async function test() {

    const result = await analyzeImage(imagePath);
    const aiData = JSON.parse(result);
    console.log(aiData);
}

test();
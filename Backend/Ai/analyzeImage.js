const { GoogleGenAI } = require("@google/genai");
const { log } = require("console");
const fs = require("fs");
const path = require("path");
// console.log(__dirname,"..","uploads")
require("dotenv").config({
    path: path.join(__dirname, "..", ".env")
});
// console.log(path)

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
// const fileName = "1786090140399-Screenshot 2026-05-29 123045.png";



// console.log(imagePath);
async function analyzeImage(DBpath) {
    const imagePath = path.join(
    __dirname,
    "..",
    DBpath
);
    const imageData = fs.readFileSync(imagePath);

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
            {
                inlineData: {
                    mimeType: "image/png",
                    data: imageData.toString("base64")
                }
            },
            {
                text: `
                    Analyze this image for a personal Drive application.
                    and 
                    Return:
                    1. A short description of the image.
                    2. A list of useful search tags.

                    Return ONLY valid JSON in this format without markdown fences:
                    {
                        "description": "...",
                        "tags": ["...", "..."]
                    }
                `
            }
        ]
    });
    // console.log(response.text);
    
    return JSON.parse(response.text);
}
module.exports = analyzeImage;
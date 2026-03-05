const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect("mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/urlshortener", {

});

// Schema
const Url = mongoose.model("Url", {
  longUrl: String,
  shortCode: String
});

// Create short URL
app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = shortid.generate();

  const newUrl = new Url({
    longUrl,
    shortCode
  });

  await newUrl.save();

  res.json({
    shortUrl: `http://localhost:5000/${shortCode}`
  });
});

// Redirect
app.get("/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });

  if (url) {
    return res.redirect(url.longUrl);
  }

  res.send("URL not found");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
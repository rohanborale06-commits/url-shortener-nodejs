const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

/* Root route */
app.get("/", (req, res) => {
  res.send("URL Shortener API is running 🚀");
});

/* MongoDB connect */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Schema */
const Url = mongoose.model("Url", {
  longUrl: String,
  shortCode: String
});

/* Create short URL */
app.post("/shorten", async (req, res) => {

  const { longUrl } = req.body;

  if(!longUrl){
    return res.status(400).json({error:"URL required"});
  }

  const shortCode = shortid.generate();

  const newUrl = new Url({
    longUrl,
    shortCode
  });

  await newUrl.save();

  res.json({
    shortUrl: `https://url-shortener-nodejs-2.onrender.com/${shortCode}`
  });

});

/* Redirect route */
app.get("/:code", async (req, res) => {

  const url = await Url.findOne({ shortCode: req.params.code });

  if(url){
    return res.redirect(url.longUrl);
  }

  res.status(404).send("Short URL not found");

});

/* Server start */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("URL Shortener API is running 🚀");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const Url = mongoose.model("Url", {
  longUrl: String,
  shortCode: String
});

app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  const shortCode = shortid.generate();

  const newUrl = new Url({
    longUrl,
    shortCode
  });

  await newUrl.save();

  res.json({ shortUrl: shortCode });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
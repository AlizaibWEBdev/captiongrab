const express = require('express');
const PORT = 3000;
const app = express();
const { getSubtitles } = require('youtube-captions-scraper');

// Middleware
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Function to fetch subtitles
async function captionscrap(videoID, language = 'en') {
  try {
    let captions = await getSubtitles({ videoID, lang: language });
    return captions;
  } catch (error) {
    return false;
  }
}

// Route to fetch English subtitles
app.post("/get-subs", async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).send(["Please send a video ID"]);
  }

  // Attempt to fetch English subtitles
  const captions = await captionscrap(videoId, 'en');

  if (captions) {
    res.send(captions);
  } else {
    // If English subtitles are not available, send a fallback message
    res.send(["Please choose another video"]);
  }
});

// Route to fetch Hindi subtitles if English is not available
app.post("/get-subs-hindi", async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).send(["Please send a video ID"]);
  }

  // Attempt to fetch Hindi subtitles
  const captions = await captionscrap(videoId, 'hi');

  if (captions) {
    res.send(captions);  // Return Hindi subtitles if available
  } else {
    // If Hindi subtitles are also not available, send a fallback message
    res.send(["Please choose another video"]);
  }
});

// Home route
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

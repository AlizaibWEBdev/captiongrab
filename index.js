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
  console.log(`Fetching subtitles for video ID: ${videoID} in language: ${language}`); // Log to track which video and language are being processed
  try {
    let captions = await getSubtitles({ videoID, lang: language });
    console.log(`Subtitles fetched: ${captions.length} captions found`); // Log if subtitles are fetched successfully
    return captions;
  } catch (error) {
    console.error(`Error fetching subtitles for video ${videoID}:`, error); // Log error if fetching fails
    return false;
  }
}

// Route to fetch English subtitles
app.post("/get-subs", async (req, res) => {
  const { videoId } = req.body;
  console.log(`Received videoId: ${videoId}`); // Log the received videoId

  if (!videoId) {
    console.log("No videoId provided in request.");
    return res.status(400).send(["Please send a video ID"]);
  }

  // Attempt to fetch English subtitles
  const captions = await captionscrap(videoId, 'en');

  if (captions) {
    console.log("English subtitles fetched successfully");
    res.send(captions);
  } else {
    console.log("No English subtitles found, asking user to choose another video");
    res.send(["Please choose another video"]);
  }
});

// Route to fetch Hindi subtitles if English is not available
app.post("/get-subs-hindi", async (req, res) => {
  const { videoId } = req.body;
  console.log(`Received videoId: ${videoId}`); // Log the received videoId

  if (!videoId) {
    console.log("No videoId provided in request.");
    return res.status(400).send(["Please send a video ID"]);
  }

  // Attempt to fetch Hindi subtitles
  const captions = await captionscrap(videoId, 'hi');

  if (captions) {
    console.log("Hindi subtitles fetched successfully");
    res.send(captions);  // Return Hindi subtitles if available
  } else {
    console.log("No Hindi subtitles found, asking user to choose another video");
    res.send(["Please choose another video"]);
  }
});

// Home route
app.get("/", (req, res) => {
  console.log("Home route hit");
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

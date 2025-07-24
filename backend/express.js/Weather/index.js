import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const APIkey = "Your Api Key Here"; // Replace with your OpenWeatherMap API key
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", { weather: null, error: null });
});

app.post("/submit-location", async (req, res) => {
  const lat = req.body.latitude;
  const lon = req.body.longitude;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;

    const weatherInfo = `Temperature: ${weatherData.main.temp}°C, Weather: ${weatherData.weather[0].main}`;

    res.render("index.ejs", { weather: weatherInfo, error: null });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.render("index.ejs", { weather: null, error: "Invalid coordinates or API issue." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

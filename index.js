require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", { weather: null, error: null });
});
  

app.get("/weather", async (req, res) => {
  const city = req.query.city || "New York";
  const API_KEY = process.env.API_KEY;
  const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
      const response = await axios.get(URL);
      const forecast = response.data.list;

      // Get weather details for tomorrow
      const tomorrowWeather = forecast[8]; // 8th entry = ~24 hours later
      const weatherDescription = tomorrowWeather.weather[0].description;
      const willRain = tomorrowWeather.weather[0].main.toLowerCase().includes("rain");

      // Additional weather data
      const temp = tomorrowWeather.main.temp;
      const humidity = tomorrowWeather.main.humidity;
      const windSpeed = tomorrowWeather.wind.speed;
      const icon = tomorrowWeather.weather[0].icon;

      res.render("index", {
          city: city,
          weather: willRain ? "Yes, it will rain!" : "No, it won't rain!",
          temp,
          humidity,
          windSpeed,
          icon,
          error: null
      });
  } catch (error) {
      console.error("Error fetching weather data:", error.response ? error.response.data : error.message);
      res.render("index", { city: null, weather: null, temp: null, humidity: null, windSpeed: null, icon: null, error: "Error fetching weather data. Please try again." });
  }
});

  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.get("/weather", (req, res) => {
    res.render("index.ejs");
});

app.post("/weather/submit-zipcode", async (req, res) => {

try {
    const zipcode = req.body.zipcode;
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?zip=`

    const API_KEY= process.env.WEATHER_API_KEY

    const response = await fetch(`${BASE_URL}${zipcode},us&units=imperial&APPID=${API_KEY}`);
    const weatherData = await response.json();
        if(weatherData.cod !== 200) {
            return res.send(`Error: ${weatherData.message}`)
        }
        res.render("weather/show.ejs", {
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather.map(wç => w.description.charAt(0).toUpperCase() + w.description.slice(1)).join(", ")
        });
    } catch (error) {
        console.log("Network error", error);
        res.status(500).send("Something is wrong on our end.");
    }
});


app.listen(3000, () => {
    console.log("Server is running on 3000");
});
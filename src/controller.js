const express = require("express");
// import { Express } from "express";
const app = express();

const forcast = require('./forcast.js');

app.listen(3001, () => {
  console.log("Server is live and running on a Render instance");
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


app.get("/weather-forcast-four-days", 
  async (req, res) => {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let appId = req.query.appid;
    let units = req.query.units;

    let finalObjectArray = await forcast.getWeatherForcast(lat, lon, appId, units);
    console.log("Executed !");
    res.send(JSON.stringify(Object.assign({}, finalObjectArray)));
});



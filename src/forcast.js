var weather = require('openweather-apis');
const convert = require('geo-coordinates-parser');

import fetch from "node-fetch";
// for testing
// let lat = 51.557879;
// let lon = -0.326162;
// let appId = "c5fc45d07aeaf4b375e1aa07a03bd9b5";
// let units = "metric";


module.exports = {
    getWeatherForcast: async function getWeatherForcast(lat, lon, appId, units) {

        let dayOneWeatherData = [];
        let dayTwoWeatherData = [];
        let dayThreeWeatherData = [];
        let dayFourWeatherData = [];

        let firstDate = new Date();
        let formatDate1 = this.formatDate(firstDate);

        let secondDate = new Date(firstDate);
        secondDate.setDate(secondDate.getDate() + 1);
        let formatDate2 = this.formatDate(secondDate);

        let thirdDate = new Date(secondDate);
        thirdDate.setDate(thirdDate.getDate() + 1);
        let formatDate3 = this.formatDate(thirdDate);

        let fourthDate = new Date(thirdDate);
        fourthDate.setDate(fourthDate.getDate() + 1);
        let formatDate4 = this.formatDate(fourthDate);

        const weatherForcastResponse =
            await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appId}&units=${units}`)
        const jsonFormat = await weatherForcastResponse.json();

        if (weatherForcastResponse.status != 200) {
            res.send("Invalid request");
        }
        else {
            for (let index = 0; index < jsonFormat.list.length; index++) {
                switch (jsonFormat.list[index].dt_txt.slice(0, 10)) {
                    case formatDate1:
                        dayOneWeatherData.push(jsonFormat.list[index])
                        break;

                    case formatDate2:
                        dayTwoWeatherData.push(jsonFormat.list[index])
                        break;

                    case formatDate3:
                        dayThreeWeatherData.push(jsonFormat.list[index])
                        break;

                    case formatDate4:
                        dayFourWeatherData.push(jsonFormat.list[index])
                        break;

                    default:
                        break;
                }
            }

            // tsting section
            let feelsLike1 = [];
            let main1 = [];
            let location = [];

            let converted;
            try {
                converted = convert(`${lat}, ${lon}`, 2);
            }
            catch {
                console.log("Invalid Coordinates");
            }

            for (let index = 0; index < dayOneWeatherData.length; index++) {
                feelsLike1.push(dayOneWeatherData[index].main.feels_like);
                main1.push
                    ([dayOneWeatherData[index].weather[0].main,
                    dayOneWeatherData[index].weather[0].description]);
            }
            location.push(
                [jsonFormat.city.name, jsonFormat.city.country],
                [converted.decimalLatitude, converted.decimalLongitude]
            )
            let testWeatherObj1 = [
                {
                    "feels_like": feelsLike1,
                    "main": main1,
                    "location": location,
                }
            ]

            let feelsLike2 = [];
            let main2 = [];

            for (let index = 0; index < dayTwoWeatherData.length; index++) {
                feelsLike2.push(dayTwoWeatherData[index].main.feels_like);
                main2.push
                    ([dayTwoWeatherData[index].weather[0].main,
                    dayTwoWeatherData[index].weather[0].description]);
            }
            location.push(
                [jsonFormat.city.name, jsonFormat.city.country],
                [converted.decimalLatitude, converted.decimalLongitude]
            )

            let badu1 = this.getTimeStampData(dayOneWeatherData, jsonFormat);
            let badu2 = this.getTimeStampData(dayTwoWeatherData, jsonFormat);
            let badu3 = this.getTimeStampData(dayThreeWeatherData, jsonFormat);
            let badu4 = this.getTimeStampData(dayFourWeatherData, jsonFormat);

            let finalObjectArray = badu1.concat(badu2).concat(badu3).concat(badu4);
            return finalObjectArray;
        }
    },

    formatDate: function formatDate(date) {
        let day;
        if (date.getDate() < 10) {
            day = "0" + date.getDate();
        }
        else {
            day = date.getDate();
        }
        let formatDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + day;
        return formatDate;
    },

    getTimeStampData: function getTimeStampData(arr, jsonFormat) {
        let feelsLike = [];
        let main = [];
        let location = [];

        let lat = 51.557879;
        let lon = -0.326162;
        let converted;
        try {
            converted = convert(`${lat}, ${lon}`, 2);
        }
        catch {
            console.log("Invalid Coordinates");
        }

        for (let index = 0; index < arr.length; index++) {
            feelsLike.push(arr[index].main.feels_like);
            main.push
                ([arr[index].weather[0].main,
                arr[index].weather[0].description.charAt(0).toUpperCase() 
                    + arr[index].weather[0].description.slice(1)]);
        }
        location.push(
            [jsonFormat.city.name, jsonFormat.city.country],
            [converted.decimalLatitude, converted.decimalLongitude]
        )
        let testWeatherObj = [
            {
                "feels_like": feelsLike,
                "main": main,
                "location": location,
            }
        ]
        return testWeatherObj;
    }
}
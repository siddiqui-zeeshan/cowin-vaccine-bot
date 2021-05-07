const URL =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?";
const express = require("express");
const cron = require("node-cron");
const axios = require("axios");
const telegram_bot = require("./telegram_bot");
require('dotenv').config();

districtId = "670";
date = formattedDate();
newUrl = URL + "district_id=" + districtId + "&date=" + date;

app = express();
var result = "";

//apiCall();

app.listen(process.env.PORT || 3000, (err) => {
  if (err) console.log(err);
  else console.log(`Starting server at ${process.env.PORT || 3000}`);
});

app.get("/", (req, res) => {
  apiCall();
  res.send("Your cowin bot is active");
});

async function apiCall() {
  var data = "";

  var config = {
    method: "get",
    url: newUrl,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.51",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      result = JSON.stringify(response.data);
      findVacant(response.data.centers);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function findVacant(res) {
  for (i = 0; i < res.length; i++) {
    var center = res[i];
    for (j = 0; j < center.sessions.length; j++) {
      var session = center.sessions[j];
      if (session.min_age_limit == 18 && session.available_capacity >= 0) {
        var msg =
        "Center name: " +
          center.name +
          "\n Date: " +
          session.date +
          "\n Address: " +
          center.address +
          "\n Number of vaccines available: " +
          session.available_capacity;
        console.log(msg);
        if(session.date == date)
        {
          telegram_bot.sendNotification(msg);
        }
        console.log("...___...___...___...___...___...___...");
      }
    }
  }
}

function formattedDate(d = new Date()) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return `${day}-${month}-${year}`;
}

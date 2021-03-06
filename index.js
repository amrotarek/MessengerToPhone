/* Goondy Tech Channel: https://www.youtube.com/channel/UC-ZzYyY1ESVd7VNUrDX25sg/videos */
require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const friends = {};
app.post("/msg", urlencodedParser, (req, res) => {
  const receivedMsg = req.body.Body;
  const nameAndMessage = receivedMsg.split(",").map((msg, index) => {
    if (!index) return msg.trim().toLowerCase();
    return msg.trim();
  });
  if (friends[nameAndMessage[0]]) {
    axios
      .post(
        "https://messages-sandbox.nexmo.com/v0.1/messages",
        {
          from: { type: "messenger", id: process.env.BOT_ID },
          to: { type: "messenger", id: friends[nameAndMessage[0]] },
          message: {
            content: {
              type: "text",
              text: nameAndMessage[1],
            },
          },
        },
        {
          auth: {
            username: process.env.VONAGE_ID,
            password: process.env.VONAGE_SECRET,
          },
        }
      )
      .then(function (response) {
        console.log("Status: " + response.status);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
app.post("/reverse", bodyParser.json(), (req, res) => {
  const client = require("twilio")(
    process.env.TWILIO_ID,
    process.env.TWILIO_TOKEN
  );
  client.messages
    .create({
      body: req.body.message.content.text,
      from: "Your twilio number here",
      to: "your phone number here",
    })
    .then((message) => console.log(message.sid));
  res.status(200).send();
});
app.listen(5000);

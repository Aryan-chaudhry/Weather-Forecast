require("dotenv").config();
const express = require("express");
const axios = require("axios");
const twilio = require("twilio");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // Replace with OpenWeather API Key
const accountSid = "YOUR_TWILIO_ACCOUNT_SID"; // Twilio Account SID
const authToken = "YOUR_TWILIO_AUTH_TOKEN"; // Twilio Auth Token
const fromWhatsAppNumber = "whatsapp:+14155238886"; // Twilio Sandbox WhatsApp Number
const client = new twilio(accountSid, authToken);

app.post("/send-weather", async (req, res) => {
  try {
    const { phoneNumber, city } = req.body;
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = weatherResponse.data;

    const weatherMessage = `🌍 *Weather Report for ${city}*:
🌡 Temperature: ${data.main.temp}°C
💨 Wind Speed: ${data.wind.speed} m/s
💧 Humidity: ${data.main.humidity}%
🌦 Condition: ${data.weather[0].main}`;

    await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${phoneNumber}`,
      body: weatherMessage,
    });

    res.status(200).json({ message: "Weather report sent to WhatsApp!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

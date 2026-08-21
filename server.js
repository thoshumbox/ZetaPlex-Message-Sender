const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error("error: discord webhook url is not configured.");
  process.exit(1);
}

app.use(express.json({ limit: "10kb" }));

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/send", async (req, res) => {
  try {
    let name = String(req.body.name || "").trim();
    let message = String(req.body.message || "").trim();

    if (!name || !message) {
      return res.status(400).json({
        error: "name and message are required."
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        error: "name is too long."
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "message is too long."
      });
    }

    // Make everything lowercase
    name = name.toLowerCase();
    message = message.toLowerCase();

    const now = new Date();

    const time = now.toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "medium"
    }).toLowerCase();

    const footerTime = now.toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short"
    }).toLowerCase();

    const discordPayload = {
      embeds: [
        {
          title: "new message received",

          fields: [
            {
              name: "from",
              value: name,
              inline: true
            },
            {
              name: "time",
              value: time,
              inline: true
            },
            {
              name: "message",
              value: message
            }
          ],

          footer: {
            text: `sent via message form • ${footerTime}`
          },

          color: 0x5865F2
        }
      ]
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordPayload)
    });

    if (!response.ok) {
      const discordError = await response.text();

      console.error("discord error:", discordError);

      return res.status(500).json({
        error: "could not send the message."
      });
    }

    return res.json({
      success: true
    });

  } catch (error) {
    console.error("server error:", error);

    return res.status(500).json({
      error: "something went wrong."
    });
  }
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

const webhook_url = "https://discord.com/api/webhooks/1540339272186593313/6KRzQOsooiCAJar_5-BBzuHtO97KSRo3MykjXFNsvkB_NUI2hN2LujX7u2-y39Y3aa8G";

const form = document.getElementById("messageform");
const name_input = document.getElementById("name");
const message_input = document.getElementById("message");
const character_count = document.getElementById("charactercount");
const send_button = document.getElementById("sendbutton");
const status = document.getElementById("status");


message_input.addEventListener("input", () => {
  character_count.textContent = message_input.value.length;
});


form.addEventListener("submit", async (event) => {

  event.preventDefault();

  const name = name_input.value.trim().toLowerCase();
  const message = message_input.value.trim().toLowerCase();

  if (!name || !message) {
    status.textContent = "please enter a name and message.";
    status.className = "error";
    return;
  }

  if (
    !webhook_url ||
    webhook_url === "paste_your_webhook_url_here"
  ) {
    status.textContent = "webhook has not been configured.";
    status.className = "error";
    return;
  }

  send_button.disabled = true;
  send_button.textContent = "sending...";

  status.textContent = "";
  status.className = "";


  const now = new Date();

  const time = now
    .toLocaleString("en-us", {
      dateStyle: "short",
      timeStyle: "medium"
    })
    .toLowerCase();

  const footer_time = now
    .toLocaleString("en-us", {
      dateStyle: "short",
      timeStyle: "short"
    })
    .toLowerCase();


  const payload = {
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
          text: "sent via message form • " + footer_time
        },

        color: 0x5865f2
      }
    ]
  };


  try {

    const response = await fetch(webhook_url, {
      method: "post",

      headers: {
        "content-type": "application/json"
      },

      body: JSON.stringify(payload)
    });


    if (!response.ok && response.status !== 204) {
      throw new Error("discord rejected the message.");
    }


    status.textContent = "message sent successfully.";
    status.className = "success";

    form.reset();

    character_count.textContent = "0";


  } catch (error) {

    console.error(error);

    status.textContent = "failed to send the message.";
    status.className = "error";

  }


  send_button.disabled = false;
  send_button.textContent = "send message";

});

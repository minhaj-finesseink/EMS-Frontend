import React from "react";
import SlackImage from '../../../../../assets/NewIcons/slack.png'
import TrelloImage from '../../../../../assets/NewIcons/trello.png'
import GoogleCalendarImage from '../../../../../assets/NewIcons/google-calendar.png'
import OutlookImage from '../../../../../assets/NewIcons/outlook.png'
import "./style.css";

const integrations = [
  {
    name: "Slack",
    description:
      "Connect your Slack and get notifications about new registrants in the channel of your choice and in real-time. Keep your whole team in the loop!",
    imgSrc: SlackImage,
  },
  {
    name: "Trello",
    description:
      "Connect your Trello and get notifications about new registrants in the channel of your choice and in real-time. Keep your whole team in the loop!",
      imgSrc: TrelloImage,
    },
  {
    name: "Google Calendar",
    description:
      "Connect your Google Calendar and get notifications about new registrants in the channel of your choice and in real-time. Keep your whole team in the loop!",
      imgSrc: GoogleCalendarImage,
    },
  {
    name: "Outlook",
    description:
      "Connect your Outlook and get notifications about new registrants in the channel of your choice and in real-time. Keep your whole team in the loop!",
      imgSrc: OutlookImage,
    },
];

function IntegrationCards() {
  return (
    <div className="apps-container">
      <div className="apps-grid">
        {integrations.map((integration, index) => (
          <div key={index} className="apps-card">
            <img src={integration.imgSrc} alt={integration.name} className="apps-icon" />
            <h3 className="apps-title">{integration.name}</h3>
            <p className="apps-description">{integration.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IntegrationCards;

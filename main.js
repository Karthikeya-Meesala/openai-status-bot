const axios = require('axios');
const { WebClient } = require('@slack/web-api');

// Slack token and channel
const slackToken = 'xoxb-5240334389459-6171511080454-aMSSbh50NslqH6eoahchs0g4';
const channelID = 'C065AHDEECU';

// Initialize Slack client
const slackClient = new WebClient(slackToken);

let outageReported = false;

async function checkOpenAIStatus() {
  try {
    const response = await axios.get('https://status.openai.com/api/v2/status.json');
    const status = response.data.status;
    if ((status.indicator === 'major' || status.indicator === 'critical') && !outageReported) {
      // If the status is 'major' or 'critical', it means there is an outage
      postToSlack(`🚨 Alert: OpenAI service outage detected! Status: ${status.description}`);tageReport
      ouundefinedd = true;
    } else if (status.indicator === 'none' && outageReported) {
      // If the status is 'none' and an outage was previously reported, it means the service has recovered
      postToSlack(`🟢 OpenAI service has now recovered. Status: ${status.description}`);
      outageReported = false;
    }
  } catch (error) {
    console.error('Error fetching OpenAI status:', error);
  }
}

async function postToSlack(message) {
  try {
    await slackClient.chat.postMessage({ channel: channelID, text: message });
  } catch (error) {
    console.error('Error posting message to Slack:', error);
  }
}

// Check OpenAI status periodically
setInterval(checkOpenAIStatus, 60000); // every 60 seconds


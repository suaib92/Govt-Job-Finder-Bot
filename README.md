# 🤖 Government Job Finder Telegram Bot

A production-ready Node.js Telegram bot that automatically scrapes government job websites and sends real-time alerts for new IT-related positions. Designed to run 24/7 on Render free hosting.

## ✨ Features

- **Automated Daily Scraping**: Scrapes government job websites at 9 AM IST every day
- **Smart Filtering**: Identifies only IT-related government jobs using keyword matching
- **Duplicate Prevention**: Uses local JSON storage to prevent sending duplicate alerts
- **Telegram Alerts**: Sends formatted Telegram messages with job details and links
- **Error Handling**: Robust error handling for failed requests and edge cases
- **Modular Code**: Clean, reusable functions for maintainability
- **Production Ready**: Compatible with Render deployment with environment variables

## 🏢 Supported Job Websites

The bot scrapes the following government recruitment portals:

- **NIC Recruitment**: https://recruitment.nic.in
- **C-DAC Careers**: https://careers.cdac.in
- **DRDO Jobs**: https://drdo.gov.in
- **ISRO Careers**: https://isro.gov.in/careers
- **SSC**: https://ssc.nic.in

## 🔍 Job Filter Keywords

The bot filters jobs matching these IT-related keywords:

- Computer Science
- IT / Software
- Developer / Programmer
- Technical Assistant
- Scientist
- Data Analyst
- Cyber Security
- AI / Machine Learning

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- Telegram Bot Token (get from [@BotFather](https://t.me/BotFather))
- Telegram Chat ID

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/suaib92/Govt-Job-Finder-Bot.git
cd Govt-Job-Finder-Bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
BOT_TOKEN=your_telegram_bot_token_here
CHAT_ID=your_chat_id_here
PORT=8000
```

**How to get these values:**

- **BOT_TOKEN**: Message [@BotFather](https://t.me/BotFather) on Telegram, create a bot, and copy the token
- **CHAT_ID**: Message your bot, then visit `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates` and find your chat ID
- **PORT**: Default port for the application (used by Render)

## 🚀 Usage

### Local Development

```bash
npm run dev
```

### Production (Render)

The bot automatically starts with:

```bash
npm start
```

This command installs dependencies and runs the bot.

## 📁 File Structure

```
Govt-Job-Finder-Bot/
├── index.js              # Main bot application
├── package.json          # Project dependencies
├── jobs.json            # Local database of sent jobs (auto-generated)
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🔧 How It Works

### Daily Job Check (9 AM IST)

1. **Fetch**: Scrapes all configured government job websites
2. **Filter**: Identifies jobs matching IT-related keywords
3. **Deduplicate**: Checks against previously sent jobs in `jobs.json`
4. **Alert**: Sends Telegram message for new jobs
5. **Store**: Updates `jobs.json` with new job links

### Console Logs

The bot provides helpful console output:

```
🔍 Checking for new government IT jobs...
✅ New job found: [Job Title]
ℹ️ No new jobs today
```

## 🎯 Key Functions

### `loadJobs()`
Loads previously sent job links from `jobs.json` to prevent duplicates.

### `saveJobs(jobs)`
Persists job data to local storage for duplicate detection.

### `fetchJobs(website)`
Scrapes a government website and extracts job listings with error handling.

### `filterJobs(jobs)`
Filters jobs based on IT-related keywords.

### `sendTelegramAlert(job)`
Sends a formatted Telegram message with job details.

### `checkForNewJobs()``
Orchestrates the daily check: fetch → filter → deduplicate → alert.

### `scheduleDailyCheck()``
Schedules the job check using node-cron at 9 AM IST (3:30 AM UTC).

## 🌐 Deployment on Render

### Steps to Deploy

1. **Fork/Clone** this repository to your GitHub account
2. **Create Render Account**: Go to [render.com](https://render.com)
3. **Create New Service**:
   - Select "Web Service"
   - Connect your GitHub repository
   - Choose Node.js environment
4. **Configure**:
   - **Start Command**: `npm install && node index.js`
   - **Node Version**: 18 (or latest)
5. **Set Environment Variables**:
   - Add `BOT_TOKEN` with your Telegram bot token
   - Add `CHAT_ID` with your chat ID
   - Add `PORT=8000`
6. **Deploy**: Click "Deploy Service"

The bot will now run 24/7 on Render's free tier!

## 📦 Dependencies

- **node-telegram-bot-api**: ^0.65.0 - Telegram bot API wrapper
- **axios**: ^1.6.0 - HTTP client for web scraping
- **cheerio**: ^1.0.0-rc.12 - jQuery-like syntax for parsing HTML
- **node-cron**: ^3.0.2 - Cron job scheduler
- **dotenv**: Built-in support for .env files

## 🛡️ Error Handling

The bot includes comprehensive error handling:

- **Network Errors**: Handles timeout and connection failures gracefully
- **Parsing Errors**: Recovers from malformed HTML responses
- **Telegram Errors**: Logs API failures without crashing
- **File I/O Errors**: Handles missing or corrupted jobs.json

## 📊 Monitoring

Check bot status:

1. **Telegram Messages**: Bot sends startup confirmation when initialized
2. **Console Logs**: Monitor output for job checks and alerts
3. **jobs.json**: View stored job history
4. **Render Logs**: Monitor deployment status and runtime logs

## 🔍 Troubleshooting

### Bot not sending messages?

- Verify `BOT_TOKEN` and `CHAT_ID` in .env
- Ensure the chat ID is valid (should be numeric)
- Check Telegram bot permissions

### No jobs detected?

- Government websites may have changed structure
- CSS selectors in `fetchJobs()` might need updating
- Check website availability manually

### Bot crashes on Render?

- Check Render logs for error messages
- Verify Node.js version compatibility
- Ensure all environment variables are set

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ✍️ Author

Created by [@suaib92](https://github.com/suaib92)

## 💬 Support

For issues, questions, or suggestions, please open a [GitHub Issue](https://github.com/suaib92/Govt-Job-Finder-Bot/issues).

## ⚠️ Disclaimer

This bot is for educational purposes. Ensure you comply with the terms of service of each government website before scraping. The author is not responsible for misuse of this bot.

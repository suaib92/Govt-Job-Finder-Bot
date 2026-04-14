require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Initialize Telegram bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const CHAT_ID = process.env.CHAT_ID;
const JOBS_FILE = path.join(__dirname, 'jobs.json');

// Keywords for filtering government IT jobs
const KEYWORDS = ['Computer Science', 'IT', 'Software', 'Developer', 'Programmer', 'Technical Assistant', 'Scientist', 'Data Analyst', 'Cyber Security', 'AI', 'Machine Learning'];

// Government job websites to scrape
const JOB_WEBSITES = [
    { name: 'NIC Recruitment', url: 'https://recruitment.nic.in' },
    { name: 'C-DAC Careers', url: 'https://careers.cdac.in' },
    { name: 'DRDO Jobs', url: 'https://drdo.gov.in' },
    { name: 'ISRO Careers', url: 'https://isro.gov.in/careers' },
    { name: 'SSC', url: 'https://ssc.nic.in' }
];

/** Load previously sent jobs from local storage */
function loadJobs() {
    try {
        if (fs.existsSync(JOBS_FILE)) {
            const data = fs.readFileSync(JOBS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading jobs from file:', error.message);
    }
    return [];
}

/** Save jobs to local storage */
function saveJobs(jobs) {
    try {
        fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
    } catch (error) {
        console.error('Error saving jobs to file:', error.message);
    }
}

/** Fetch jobs from a government website */
async function fetchJobs(website) {
    try {
        const { data } = await axios.get(website.url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
        const $ = cheerio.load(data);
        const jobs = [];
        $('a').each((index, element) => {
            const text = $(element).text().trim();
            const href = $(element).attr('href');
            if (text.length > 10 && text.length < 300 && href) {
                jobs.push({ title: text, link: href.startsWith('http') ? href : new URL(href, website.url).href, source: website.name, foundAt: new Date().toISOString() });
            }
        });
        return jobs;
    } catch (error) {
        console.error(`Error fetching jobs from ${website.name}:`, error.message);
        return [];
    }
}

/** Filter jobs based on IT-related keywords */
function filterJobs(jobs) {
    return jobs.filter(job => {
        const jobText = job.title.toLowerCase();
        return KEYWORDS.some(keyword => jobText.includes(keyword.toLowerCase()));
    });
}

/** Send Telegram alert for new job */
async function sendTelegramAlert(job) {
    try {
        const message = `🏢 *New Government IT Job Found!* 📋 *Title:* ${job.title} 🏢 *Source:* ${job.source} 🔗 *Link:* [View Job](${job.link}) ⏰ *Found:* ${new Date(job.foundAt).toLocaleString()} #GovernmentJobs #ITJobs`.trim();
        await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
        console.log('✅ New job found:', job.title);
    } catch (error) {
        console.error('Error sending Telegram alert:', error.message);
    }
}

/** Check for new jobs and send alerts */
async function checkForNewJobs() {
    console.log('🔍 Checking for new government IT jobs...');
    const previousJobs = loadJobs();
    const previousLinks = previousJobs.map(job => job.link);
    let newJobsFound = false;
    for (const website of JOB_WEBSITES) {
        const allJobs = await fetchJobs(website);
        const filteredJobs = filterJobs(allJobs);
        for (const job of filteredJobs) {
            if (!previousLinks.includes(job.link)) {
                await sendTelegramAlert(job);
                previousJobs.push(job);
                newJobsFound = true;
            }
        }
    }
    if (newJobsFound) {
        saveJobs(previousJobs);
        console.log('✅ New jobs found and alerts sent');
    } else {
        console.log('ℹ️ No new jobs today');
    }
}

/** Schedule daily job check at 9 AM IST */
function scheduleDailyCheck() {
    cron.schedule('30 3 * * *', async () => {
        console.log('⏰ Daily check triggered at 9 AM IST');
        await checkForNewJobs();
    });
    console.log('✅ Daily job check scheduled at 9 AM IST');
}

/** Start the bot */
async function startBot() {
    try {
        await bot.sendMessage(CHAT_ID, '🚀 *Government Job Finder Bot Started!*

✅ Bot is now running and will send alerts for new IT government jobs at 9 AM IST daily.', { parse_mode: 'Markdown' });
        console.log('✅ Bot started successfully');
        console.log('🤖 Bot is listening for messages...');
    } catch (error) {
        console.error('Error sending startup message:', error.message);
    }
}

/** Initialize the bot */
async function initialize() {
    try {
        await startBot();
        scheduleDailyCheck();
    } catch (error) {
        console.error('Error initializing bot:', error.message);
        process.exit(1);
    }
}

bot.on('error', (error) => {
    console.error('Telegram bot error:', error.message);
});
initialize();
process.on('SIGINT', () => {
    console.log('\n🛑 Bot shutting down gracefully...');
    bot.stopPolling();
    process.exit(0);
});
const puppeteer = require('puppeteer-core');
const AUTH = 'USER:PASS';
const SBR_WS_ENDPOINT = `wss://${AUTH}@brd.superproxy.io:9222`;

async function scrapeMedium(topic) {
  console.log('Connecting to Scraping Browser...');
  const browser = await puppeteer.connect({
    browserWSEndpoint: SBR_WS_ENDPOINT,
  });

  try {
    console.log('Connected! Navigating...');
    const page = await browser.newPage();
    await page.goto(`https://medium.com/search?q=${encodeURIComponent(topic)}`, { timeout: 2 * 60 * 1000 });

    console.log('Navigated! Scraping page content...');
    await page.waitForSelector('.a');

    const articles = await page.evaluate(() => {
      const articles = [];
      const articleElements = document.querySelectorAll('.a');
      console.log(document.querySelectorAll('.a'))
      articleElements.forEach(article => {
        const titleElement = article.querySelector('h3');
        const authorElement = article.querySelector('.ds-link');
        const dateElement = article.querySelector('time');
        const urlElement = article.querySelector('a');

        if (titleElement && authorElement && dateElement && urlElement) {
          const title = titleElement.innerText;
          const author = authorElement.innerText;
          const publicationDate = dateElement.getAttribute('datetime');
          const url = urlElement.href;

          articles.push({ title, author, publicationDate, url });
        }
      });

      return articles.slice(0, 5); // Return only the top 5 articles
    });

    console.log('Scraped Articles:', articles);
    return articles;
  } finally {
    await browser.close();
  }
}

async function main() {
  const topic = 'YOUR_TOPIC'; // Replace with the topic you want to search for
  const articles = await scrapeMedium(topic);
  console.log('Top 5 Articles:', articles);
}

if (require.main === module) {
  main().catch(err => {
    console.error(err.stack || err);
    process.exit(1);
  });
}

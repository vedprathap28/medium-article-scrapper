const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const scrapeMedium = require('./scrapper'); // Adjust the path as necessary
const app = express();
app.use(cors())
app.use(bodyParser.json());

app.post('/scrape', async (req, res) => {
  const { topic } = req.body;
  console.log(topic)

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const articles = await scrapeMedium(topic);
    res.status(200).json({ message: 'Scraping successful', articles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape articles' });
  }
});

app.get('/articles', (req, res) => {
  // You can add logic here to return stored articles if needed
  res.status(200).json(articles);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config();
// const fetch = require('node-fetch'); // old require statement
let fetch; // declare fetch variable

// new dynamic import statement
import('node-fetch')
  .then((module) => {
    fetch = module.default;
  })
  .catch((err) => {
    console.error(err);
  });
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/test', (req, res) => {
  res.send('hello I am here')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/start', async (req, res) => {
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "guessing the number python game" }],
  });
  console.log(completion.data.choices[0].message);

  message = completion.data.choices[0].message
  console.log(message)
  return res.json({ message })
})


//chat gpt route
app.get('/api/chatgpt', async (req, res) => {
  const prompt = req.query.prompt;

  // Check if prompt is provided
  if (!prompt) {
    return res.status(400).send('Prompt is required.');
  }

  try {
    // Send request to ChatGPT API
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    };

    const body = {
      prompt: prompt,
      max_tokens: 50, // Change the number of tokens to adjust the length of the response
      temperature: 0.7, // Change the temperature to adjust the randomness of the response
      model: 'text-davinci-002', // Change the model to use a different GPT model
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    // Parse the response
    const data = await response.json();
    console.log(data)
    // Send the response back to the client
    return res.send(data.choices[0].text);
  } catch (error) {
    return res.json({ error })
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
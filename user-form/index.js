const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Form Data:', { name, email, password });
  res.send(`<h2>Thanks for registering, ${name}!</h2>`);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const ddb = new AWS.DynamoDB.DocumentClient();

app.post('/submit', (req, res) => {
  const { name, email, password } = req.body;

  const params = {
    TableName: 'Users',
    Item: {
      email: email,
      name: name,
      password: password
    }
  };

  ddb.put(params, (err, data) => {
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).send('Error saving user to database');
    } else {
      console.log('User saved:', data);
      return res.send(`<h2>Thanks for registering, ${name}!</h2>`);
    }
  });
});

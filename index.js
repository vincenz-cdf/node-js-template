const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio');
const PORT = process.env.PORT || 5505;

const app = express();

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const yourPhone = process.env.YOUR_NUMBER;

const client = twilio(accountSid, authToken);

// Route for the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle form submission and send SMS
app.post('/send-sms', (req, res) => {
  const { firstname, name, email, message } = req.body; // Extract phone and message from form

  client.messages
    .create({
      body: `<p>First Name: ${firstname}</p>
      <p>Last Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>`,
      from: twilioNumber,
      to: yourPhone
    })
    .then(message => {
      res.send('Email sent successfully');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error occurred');
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

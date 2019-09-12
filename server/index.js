const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const stripe = require('stripe')('pk_test_TCWJYGPIJwsPmEKvrufHAzEX')

app.use(bodyParser.json());
app.use(express.static('public')); // Put images+zip in public folder
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const activeCampaign = require("activecampaign");
const ac = new activeCampaign(
  'https://matte.api-us1.com',
  'ae4b1a114a0334475af5162f5564a28ab5c948e8dd9d32aba64a772e02a5a065ddff7a48'
);

/*
  Will post to free email active campaign
  {
    email: string
  }
*/
app.post('/api/free-email', (req, res) => {
  const email = req.body.email;
  if (!email || email.indexOf('@') === -1) {
    return sendErr(res, 'Invalid Email');
  }

  const contact = {
    email: email,
    'p[1]': 1 // List ID of Free Campaign
  };

  var contactAdd = ac.api("contact/add", contact);
  contactAdd.then((result) => {
    res.status(200).send({ message: 'OK' });
  }, (err) => {
    sendErr(res, err);
  });
});

app.post("/api/charge", (req, res) => {
  let { amount } = req.body

  stripe.charges.create({
    amount: total,
    source: req.body.stripeTokenId,
    currency: 'usd'
  }).then(function () {
    console.log('Charge Successful')
    res.json({ message: 'Successfully purchased items' })
  }).catch(function () {
    console.log('Charge Fail')
    res.status(500).end()
  })
});

function sendErr(res, err) {
  res.status(500).send({ message: err });
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

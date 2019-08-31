const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
app.use(bodyParser.json());
app.use(express.static('public')); // Put images+zip in public folder

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

function sendErr(res, err) {
  res.status(500).send({ message: err });
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

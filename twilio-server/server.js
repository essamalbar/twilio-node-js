const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');




const accountSid = 'AC350c83661eb5114ca99d6da2aa4b7e97';
const authToken = 'd63752b80b56a39c74b233fda4cc3ec0';
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

const app = express();

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // <--- Here

app.post('/', (req, res) => {
  const twiml = new MessagingResponse();

  if (req.body.Body == 'hello') {
    twiml.message('Hi!');
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message(
      'No Body param match, Twilio sends this in the request to your server.'
    );
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});


app.post('/api/sms-promotion', async function (req, res) {
  try {
    let message;
    let data = req.body;
	 console.log(data);
    var date = new Date();
    var hours = date.getHours();
    if(hours > 12){
          message = "Hello! Your promocode is PM456";
    }else{
      message = "Good morning ! Your promocode is AM123";
    }
 
    client.messages
      .create({
        body: message,
        from: '+12028662185',
        to: `+${data.phonenumber}`
      })
      .then(message => {
        res.json({msg:'success',data:message.sid});
		}).catch(err=>{

          console.log(err);
          res.json({msg:'error -1',data:null});
        })

  } catch (e) {
    console.log(e);
    res.json({ msg: 'error-2', data: null });
  }

});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
const express = require('express');
const dotenv = require("dotenv");
const https = require("https");
const IndexResponse = require('./domains/indexResponse');

const app = express()

dotenv.config();

const PORT = process.env.PORT;

app.use(express.static('public'))

//disable etag for server.
app.set('etag', false);
app.use(express.json());

app.get("/", (req, res) => {
    
    const msg = new IndexResponse("welcome to proxy_pay.eventsmgr.com");

    res.header("Content-Type", "application/json");
    res.status(200);
    res.json(msg);
});

app.post("/items/initiate", async (req, res) => {
    const body = req.body;
    console.log("body : "+ JSON.stringify(body));

    const basicAuth = process.env.clientId + ":"+ process.env.clientSecret;
    const buff = Buffer.from(basicAuth, 'utf-8');
    const basicAuthEncoded = buff.toString('base64');

    // const initiateCheckout = new InitialCheckout("", body, basicAuthEncoded);
    // const response = await initiateCheckout.initiate();

    const data = JSON.stringify(body);
    const baseUrl = process.env.baseUrl;
    const path = process.env.path;

    const options = {
      hostname: baseUrl,
      port: 443,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
        "Authorization": "Basic "+ basicAuthEncoded
      },
    };

    const request = https.request(options, (response) => {
      console.log(`statusCode: ${response.statusCode}`);

      let responseData = "";

      response.on("data", (data) => {
        process.stdout.write(data);
        responseData += data;
        
      });

      response.on("end",() => {
        console.log('Body: ', JSON.parse(responseData));

        res.header("Content-Type", "application/json");
        res.status(200);
        res.json(JSON.parse(responseData));

      });
    });

    request.on("error", (error) => {
      console.error(error);
    });

    request.write(data);
    request.end();

    
});

app.listen(PORT, () => {
  console.log(`Proxy Pay listening at http://localhost:${PORT}`)
})
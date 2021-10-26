const https = require("https");
const dotenv = require("dotenv");
const HubtelCheckoutResponse = require("../domains/hubtelCheckoutResponse");

class InitialCheckout {
  constructor(requestId, payload, basicAuth) {
    this.requestId = requestId;
    this.payload = payload;
    this.basicAuth = basicAuth;
    dotenv.config();
  }

  async initiate() {
    console.log("basic auth : " + this.basicAuth);
    
    var response = {};

    const data = JSON.stringify(this.payload);
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
        "Authorization": "Basic "+ this.basicAuth
      },
    };

    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on("data", (data) => {
        process.stdout.write(data);
        response = data;
      });
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.write(data);
    req.end();

    return response;
  }
}

module.exports = InitialCheckout;

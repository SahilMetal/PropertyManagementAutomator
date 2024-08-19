const express = require("express");
const next = require("next");
const axios = require("axios");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production"; // add node
const app = next({ dev });
const handle = app.getRequestHandler();
const http = require("http");

app.use(cors())

app.prepare().then(async() => {
    const PORT = process.env.PORT;
    const BASE_URL = process.env.BASE_URL;
    const server = express();
    const httpServer = http.createServer(server);

    const runScheduler = async() => {
    try {
        const response = await axios.post(
        `${BASE_URL}:${PORT}/api/services/scheduler`,
        {
            headers: { "Content-Type": "application/json"}
        });
        console.info('response from scheduler: ', response.statusText)
    } 
    catch (error) {
      console.error('theres an error', error);
    }
  };

  server.get("/", (req, res) => {
    return handle(req, res);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });
  
  httpServer.listen(PORT, () => {
      console.log(`Server is running on ${BASE_URL}:${PORT}`);
      runScheduler();
  });
});

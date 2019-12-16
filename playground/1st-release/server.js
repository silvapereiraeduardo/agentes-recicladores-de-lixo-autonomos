console.log('> Script started');
const PORT = process.env.PORT || 3000;
const express = require('express');
const webApp = express();
const webServer = require('http').createServer(webApp);

webApp.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

webServer.listen(3000, () => {
  console.log('> Server listening on port:', PORT);
});
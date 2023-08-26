const express = require('express');
const app = express();
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/assets/icons', express.static(__dirname + '/assets/icons'));
app.use('/assets/fonts/Futura%20PT', express.static(__dirname + '/assets/fonts/Futura PT'));

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/servers', async (req, res) => {
  res.sendFile(__dirname + '/servers.html');
});
app.get('/mike', async (req, res) => {
  res.sendFile(__dirname + '/mike.html');
});
app.get('/mods', async (req, res) => {
  res.sendFile(__dirname + '/mods.html');
});
app.get('/modpacks', async (req, res) => {
  res.sendFile(__dirname + '/modpacks.html');
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
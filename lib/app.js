const http = require('http');
const express = require('express');
var cors = require("cors");
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const repoRouter = require('./routes/repo');
const upgradeRouter = require('./routes/upgradePath')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use('/repo', repoRouter);
app.use('/upgradepath', upgradeRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// app.get('/', (req, res) => res.send('Hello World!'));
module.exports = app;
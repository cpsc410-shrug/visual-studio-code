const express = require('express');
const controller = require('./controller');
var router = express.Router();

var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";
router.get('/', (req, res) => res.send('Hello World!'))

/* must call readrepo before calling other end point*/
router.get('/readrepo', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readRepo(repoPath).then((result)=> {
        res.send(result);
    })
});

router.get('/readjs', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readPkgJson(repoPath).then(result => {
        res.send(result);
    })
});

router.get('/readyarnlock', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readYL(repoPath).then(result => {

        res.send(result);
    })
});

module.exports = router;
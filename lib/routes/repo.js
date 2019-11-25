const express = require('express');
const controller = require('./controller');
var router = express.Router();

//var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";

/* must call readrepo before calling other end point*/
router.get('/readrepo', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readRepo(req.query.repoPath).then((result)=> {
        res.send(result);
    }).catch((error) => {
        res.status = 500;
        res.send(error);
    })
});

router.get('/readjs', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readPkgJson(req.query.repoPath).then(result => {
        res.send(result);
    }).catch((error) => {
        res.status = 500;
        res.send(error);
    })
});

router.get('/readyarnlock', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    controller.readYL(req.query.repoPath).then(result => {

        res.send(result);
    }).catch((error) => {
        res.status = 500;
        res.send(error);
    })
});

module.exports = router;
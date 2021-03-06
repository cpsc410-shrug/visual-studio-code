const express = require('express');
const controller = require('./controller');
var router = express.Router();

//var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";

/* must call readrepo before calling other end point*/
router.get('/readrepo', (req, res) => {
    // console.log(req.query);
    controller.readRepo(req.query.repoPath).then((result)=> {
        res.status = 200;
        res.send(result);
    }).catch((error) => {
        console.log(error)
        res.send({...error, ok: false})
    })
});

router.get('/readjs', (req, res) => {
    res.status = 200;
    controller.readPkgJson(req.query.repoPath).then(result => {
        res.send(result);
    }).catch((error) => {
        res.send({...error, ok: false})
    })
});

router.get('/readyarnlock', (req, res) => {
    res.status = 200;
    controller.readYL(req.query.repoPath).then(result => {
        res.send(result);
    }).catch((error) => {
        res.send({...error, ok: false})
    })
});

module.exports = router;
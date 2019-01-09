const models = require('../models/index');
const md5 = require('md5');

var authenticate = (req, res, next) => {
    var status = 200;
    try{
        var header = req.header('Service');
        if(header == null) {
            status = 500;
            throw new Error("Header not provided");
        }
        var credentials = header.split('-');
        var username = credentials[0];
        var hashedPwd = credentials[1];
        var timestamp = credentials[2];
    } catch(e) {
        res.status(status).send({
            message: e.message
        })
    }
    

    models.AloqaMobileOperator.findOne({
        where: {
            username: username
        }
    }).then(user => {
        // res.send(user.password);
        if (user) {
            if(md5(user.password+timestamp) === hashedPwd) {
                next();
            } else {
                res.status(401).send({
                    message: "Рўйхатдан ўтмаган"
                });
            }
        } else {
            res.status(401).send({
                message: "Рўйхатдан ўтмаган"
            });
        }
    }).catch(e => {
       res.status(500).send(e);
    })
    
}

module.exports = { authenticate };
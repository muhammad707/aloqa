const _ = require('lodash');
const jwt = require('jsonwebtoken');    
const sequelize = require('../db/sequelize');
const models = require('../models');

exports.postLogin = (req, res) => {
    console.log(req.body);
    models.User.findOne({
        include:[{
            model: models.Role,
            attributes: ['id', 'name']
        }],
        where: { 
            username: req.body.username
         }
    }).then(user => {
        // res.send(user);
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if(!user.validPassword(req.body.password)) {
            return res.status(404).json({
                message: "Password is incorrect"
            });
        }

        const payload = {
            id: user.id,
            name: user.firstName,
            password: user.password, 
            role: user.Role.name
        }
        console.log(payload);
        jwt.sign(
            payload,
            'abc123',
            (err, token, user) => {
                res.send({
                    token: "Bearer " +  token, 
                    success: true,
                    role: payload.role
                });
            }
        )
    });
}

exports.currencyList = (req, res) => {
    const currency = models.Currency.findAll({
        attributes: ['id', 'name'],
    }).then(currencies => {
        res.send({
            currencies: currencies
        });
    });
}

exports.paymentMethodList = (req, res) => {
    models.PaymentMethod.findAll({
        attributes: ['id', 'name']
    }).then(methods => {
        res.send({
            methods: methods
        });
    });
}

exports.createTransaction = (req, res) => {

    var body = _.pick(req.body, [

        'send_department', 
        'sender_fullname',
        'sender_passport_series',
        'sender_passport_number',
        'sender_passport_date_of_issue',
        'sender_passport_date_of_expiry',
        'sender_passport_place_of_given',
        'sender_permanent_address',
        'sender_phone_number',
        'sender_account_number',
        'send_amount_in_number',
        'send_amount_in_word',
        'send_payment_method',
        'send_currency_type', 
        'status'
    ]);
    console.log(body);
    models.Transaction.create(body).then(result => {
        res.status(200).send({
            message: "Transaction created",
            success: true,
            transaction_id: result.id,
            secretCode: result.secretCode
        });
    }).catch(e => {
        console.log(e);
    });
}

exports.confirmTransaction = (req, res) => {

    var body = _.pick(req.body, [

        'receive_department', 
        'receiver_fullname',
        'receiver_passport_series',
        'receiver_passport_number',
        'receiver_passport_date_of_issue',
        'receiver_passport_date_of_expiry',
        'receiver_passport_place_of_given',
        'receiver_permanent_address',
        'receiver_phone_number',
        'receiver_account_number',
        'receive_payment_method',
        'receive_currency_type',
        'status'
    ]);
    console.log(body);
    models.Transaction.update(body, {
        where: {
            secretCode: req.body.secretCode
        }
    }).then(() => {
        res.send({
            message: "Transaction finished",
            success: true
        });
    });
}

exports.searchTransaction = (req, res) => {
    models.Transaction.findAll({
        attributes: ['id','secretCode','sender_fullname', 'sender_passport_series', 'sender_passport_number', 'send_currency_type', 'send_amount_in_number', 'createdAt', 'status'],
        include: [{
            model: models.Currency,
            attributes: ['id', 'name'],
            // as: 'send'
        }, {
            model: models.TransactionStatus,
            attributes: ['id', 'status'],
            // as: 'send'
        }],
        where: {
            secretCode: req.body.secretCode
        }
    }).then(result => {
        
        const obj = { test:{
            transaction_id: result[0].id,
            secretCode: result[0].secretCode,
            sender_fullname: result[0].sender_fullname,
            sender_passport_info: `${result[0].sender_passport_series} ${result[0].sender_passport_number}`,
            amount: result[0].send_amount_in_number,
            currency: result[0].Currency.name,
            createdAt: result[0].createdAt,
            status: result[0].Status.status
        }
        }
        const array = Object.values(obj);
        res.send({
            array,
            result,
            message: "Transaction is found",
            success: true
        })
    }).catch(e => {
        console.log("Transaction not found");
        res.send({
            success: false
        })
    });
}

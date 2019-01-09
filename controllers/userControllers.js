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
            { expiresIn: 3600 },
            (err, token, user) => {
                res.send({
                    token: "Bearer " +  token, 
                    success: true,
                    role: payload.role
                });
            }
        );
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
        'send_operator',
        'send_department', 
        'sender_firstName',
        'sender_lastName',
        'sender_middleName',
        'receiver_fullName_from_Sender',
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
        'status',
        'bank_profit'
    ]);
    models.Transaction.create(body).then(result => {
        res.status(200).send({
            message: "Ўтказма яратилди",
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
        'receive_operator',
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
        attributes: ['id','secretCode', 'sender_account_number', 'sender_permanent_address', 'sender_passport_series', 'sender_passport_number', 'send_payment_method', 'send_currency_type', 'send_amount_in_number', 'sender_phone_number', 'send_amount_in_word', 'createdAt', 'status'],
        include: [{
            model: models.Currency,
            attributes: ['id', 'name'],
            // as: 'send'
        }, {
            model: models.TransactionStatus,
            attributes: ['id', 'status'],
            // as: 'send'
        }, {
            model: models.Payment,
            attributes:['id', 'name']
        }],
        where: {
            secretCode: req.params.secretCode
        }
    }).then(result => {
        //res.send(result);
        const obj = { test:{
            transaction_id: result[0].id,
            secretCode: result[0].secretCode,
            sender_fullname: result[0].sender_fullname,
            sender_passport_info: `${result[0].sender_passport_series} ${result[0].sender_passport_number}`,
            amount: result[0].send_amount_in_number,
            paymentMethod: result[0].Payment.name,
            currency: result[0].Currency.name,
            phone_number: result[0].sender_phone_number,
            address: result[0].sender_permanent_address,
            account_number: result[0].sender_account_number,
            createdAt: result[0].createdAt,
            status: result[0].Status.status
        }
        }
        const array = Object.values(obj);
        res.send({
            array,
            message: "Пул ўтказмаси топилди",
            success: true
        })
    }).catch(e => {
        res.send(e);
    });
}

exports.getInfoToPrint = (req, res) => {
    models.Transaction.findAll({
        attributes: ['sender_fullname', 'sender_passport_series', 'sender_passport_number', 'sender_passport_date_of_issue', 'sender_passport_date_of_expiry', 'sender_account_number', 'send_amount_in_number'],
        where: {
            secretCode: req.params.secretCode
        }
    }).then(result => {
        res.send({
            result: result,
            message: "Ариза"
        })
    });
}

exports.sentTransactions = (req, res) => {
    models.Transaction.findAll({
        include: [{
            model: models.TransactionStatus
        }, {
            model: models.PaymentMethod
        }, {
            model: models.Currency
        }, {
            model: models.Currency,
            as: 'reciveCurrency'
        }, {
            model: models.PaymentMethod,
            as: 'receiveMethod'
        }],
        where: {
            send_operator: req.params.operator
        }
    }).then(transactions => {
        result = [];
        for(transaction of transactions) {
            data = {};
            data.transaction = ( transaction.id != null ?  transaction.id : "");
            data.send_department = (transaction.send_department != null ? transaction.send_department : "");
            data.sender_fullname = (transaction.sender_fullname != null ?  transaction.sender_fullname : "");
            data.sender_passport_info = ((transaction.sender_passport_series != null && transaction.sender_passport_number != null) ? `${transaction.sender_passport_series} ${transaction.sender_passport_number}` : ""); 
            data.sender_passport_date_of_issue = (transaction.sender_passport_date_of_issue != null ? transaction.sender_passport_date_of_issue : "");
            data.sender_passport_date_of_expiry = (transaction.sender_passport_date_of_expiry != null ? transaction.sender_passport_date_of_expiry : "");
            data.sender_passport_place_of_given = (transaction.sender_passport_place_of_given != null ? transaction.sender_passport_place_of_given : "");
            data.sender_permanent_address = (transaction.sender_permanent_address != null ? transaction.sender_permanent_address : "");
            data.sender_phone_number = (transaction.sender_phone_number != null ? transaction.sender_phone_number : "");
            data.sender_account_number = (transaction.sender_account_number != null ? transaction.sender_account_number : "");
            data.send_amount_in_number = (transaction.send_amount_in_number != null ? transaction.send_amount_in_number : "");
            data.send_amount_in_word = (transaction.send_amount_in_word != null ? transaction.send_amount_in_word: "");
            data.receive_department = (transaction.receive_department != null ? transaction.receive_department : "");
            data.receiver_fullname = (transaction.receiver_fullname != null ? transaction.receiver_fullname : "");
            data.receiver_passport_info = ((transaction.receiver_passport_series != null && transaction.receiver_passport_number != null) ? `${transaction.receiver_passport_series} ${transaction.receiver_passport_number}` : "") 
            data.receiver_passport_date_of_issue = (transaction.receiver_passport_date_of_issue != null ? transaction.receiver_passport_date_of_issue : "");
            data.receiver_passport_date_of_expiry = (transaction.receiver_passport_date_of_expiry != null ? transaction.receiver_passport_date_of_expiry : "");
            data.receiver_passport_place_of_given = (transaction.receiver_passport_place_of_given != null ? transaction.receiver_passport_place_of_given : "");
            data.receiver_permanent_address = (transaction.receiver_permanent_address != null ? transaction.receiver_permanent_address : "");
            data.receiver_phone_number = (transaction.receiver_phone_number != null ? transaction.receiver_phone_number : "");
            data.receiver_account_number = (transaction.receiver_account_number != null ? transaction.receiver_account_number : "");
            data.createdAt = (transaction.createdAt != null ? transaction.createdAt : "");
            data.status_id = (transaction.Status.id != null ? transaction.Status.id : "");
            data.status = (transaction.Status.status != null ? transaction.Status.status : "");
            data.send_paymentMethod_id = (transaction.Payment.id != null ? transaction.Payment.id : "");
            data.send_paymentMethod = (transaction.Payment.name != null ? transaction.Payment.name : "");
            // data.receive_paymentMethod_id = (transaction.receiveMethod.id != null ? transaction.receiveMethod.id : "");
            data.receive_paymentMethod = (transaction.receiveMethod != null ? transaction.receiveMethod.name : "");
            data.send_currency_id = (transaction.Currency.id != null ? transaction.Currency.id : "");
            data.send_currency = (transaction.Currency.name != null ? transaction.Currency.name : "");
            // data.receive_currency_id = (transaction.reciveCurrency.id != null ? transaction.reciveCurrency.id : "");
            data.receive_currency = (transaction.reciveCurrency != null ? transaction.reciveCurrency.name : "");
            result.push(data);
        }
        res.send(result);
    })
}

exports.receivedTransactions = (req, res) => {
    models.Transaction.findAll({
        include: [{
            model: models.TransactionStatus
        }, {
            model: models.PaymentMethod
        }, {
            model: models.Currency
        }, {
            model: models.Currency,
            as: 'reciveCurrency'
        }, {
            model: models.PaymentMethod,
            as: 'receiveMethod'
        }],
        where: {
            receive_operator: req.params.operator
        }
    }).then(transactions => {
        result = [];
        for(transaction of transactions) {
            data = {};
            data.transaction = ( transaction.id != null ?  transaction.id : "");
            data.send_department = (transaction.send_department != null ? transaction.send_department : "");
            data.sender_fullname = (transaction.sender_fullname != null ?  transaction.sender_fullname : "");
            data.sender_passport_info = ((transaction.sender_passport_series != null && transaction.sender_passport_number != null) ? `${transaction.sender_passport_series} ${transaction.sender_passport_number}` : ""); 
            data.sender_passport_date_of_issue = (transaction.sender_passport_date_of_issue != null ? transaction.sender_passport_date_of_issue : "");
            data.sender_passport_date_of_expiry = (transaction.sender_passport_date_of_expiry != null ? transaction.sender_passport_date_of_expiry : "");
            data.sender_passport_place_of_given = (transaction.sender_passport_place_of_given != null ? transaction.sender_passport_place_of_given : "");
            data.sender_permanent_address = (transaction.sender_permanent_address != null ? transaction.sender_permanent_address : "");
            data.sender_phone_number = (transaction.sender_phone_number != null ? transaction.sender_phone_number : "");
            data.sender_account_number = (transaction.sender_account_number != null ? transaction.sender_account_number : "");
            data.send_amount_in_number = (transaction.send_amount_in_number != null ? transaction.send_amount_in_number : "");
            data.send_amount_in_word = (transaction.send_amount_in_word != null ? transaction.send_amount_in_word: "");
            data.receive_department = (transaction.receive_department != null ? transaction.receive_department : "");
            data.receiver_fullname = (transaction.receiver_fullname != null ? transaction.receiver_fullname : "");
            data.receiver_passport_info = ((transaction.receiver_passport_series != null && transaction.receiver_passport_number != null) ? `${transaction.receiver_passport_series} ${transaction.receiver_passport_number}` : "") 
            data.receiver_passport_date_of_issue = (transaction.receiver_passport_date_of_issue != null ? transaction.receiver_passport_date_of_issue : "");
            data.receiver_passport_date_of_expiry = (transaction.receiver_passport_date_of_expiry != null ? transaction.receiver_passport_date_of_expiry : "");
            data.receiver_passport_place_of_given = (transaction.receiver_passport_place_of_given != null ? transaction.receiver_passport_place_of_given : "");
            data.receiver_permanent_address = (transaction.receiver_permanent_address != null ? transaction.receiver_permanent_address : "");
            data.receiver_phone_number = (transaction.receiver_phone_number != null ? transaction.receiver_phone_number : "");
            data.receiver_account_number = (transaction.receiver_account_number != null ? transaction.receiver_account_number : "");
            data.createdAt = (transaction.createdAt != null ? transaction.createdAt : "");
            data.status_id = (transaction.Status.id != null ? transaction.Status.id : "");
            data.status = (transaction.Status.status != null ? transaction.Status.status : "");
            data.send_paymentMethod_id = (transaction.Payment.id != null ? transaction.Payment.id : "");
            data.send_paymentMethod = (transaction.Payment.name != null ? transaction.Payment.name : "");
            // data.receive_paymentMethod_id = (transaction.receiveMethod.id != null ? transaction.receiveMethod.id : "");
            data.receive_paymentMethod = (transaction.receiveMethod != null ? transaction.receiveMethod.name : "");
            data.send_currency_id = (transaction.Currency.id != null ? transaction.Currency.id : "");
            data.send_currency = (transaction.Currency.name != null ? transaction.Currency.name : "");
            // data.receive_currency_id = (transaction.reciveCurrency.id != null ? transaction.reciveCurrency.id : "");
            data.receive_currency = (transaction.reciveCurrency != null ? transaction.reciveCurrency.name : "");
            result.push(data);
        }
        res.send(result);
    })
}

exports.searchTransactionByAloqaMobile = (req, res) => {
    models.AloqaMobileTransactions.findOne({
        attributes: [
            'id',
            'sender_full_name',
            'sender_card_number',
            'amount',
            'receiver_full_name',
            'bank_profit',
            'createdAt',
            'status'
        ],
        include: [{
            model: models.TransactionStatus,
            attributes:['status']
        }],
        where: {
            secretCode: req.params.secretCode
        }
    }).then(transactions => {
        var obj = {
            test: {
                transaction_id:  transactions.id,
                sender_full_name: transactions.sender_full_name,
                sender_card_number: transactions.sender_card_number,
                amount: transactions.amount,
                receiver_full_name: transactions.receiver_full_name,
                status: transactions.Status.status,
                createdAt: transactions.createdAt ,
                bank_profit: transactions.bank_profit
            }
        }
        var transaction = Object.values(obj)
        res.send({
            transaction,
            message: "Пул ўтказмаси топилди",
            success: true
        })
    }).catch(e => {
        res.send({
            message: "Ўтказма топилмади"
        });
    });
}

exports.receiveTransactionFromAloqaMobile = (req, res) => {
    var body = _.pick(req.body, [
        'receive_operator',
        'receive_department', 
        'receiver_firstName',
        'receiver_lastName',
        'receiver_middleName',
        'receiver_passport_series',
        'receiver_passport_number',
        'receiver_passport_date_of_issue',
        'receiver_passport_date_of_expiry',
        'receiver_passport_place_of_given',
        'receiver_permanent_address',
        'receiver_phone_number',
        'receiver_account_number',
        'status'
    ]);
    models.AloqaMobileTransactions.update(body, {
        where: {
            secretCode: req.params.secretCode
        }
    }).then(() => {
        res.send({
            message: "Ўтказма қабул қилинди",
            success: true
        })
    });
}

exports.receivedTransactionsByAloqaMobile = (req, res) => {
    models.AloqaMobileTransactions.findAll({
        include: [{
            model: models.TransactionStatus,
            attributes: ['status']
        }, {
            model: models.User,
            attributes: ['firstName', 'lastName', 'middleName']
        }]
    }).then(result => {
        res.send(result);
    });
}

exports.createTransactionsByMobile = (req, res) => {
    if(
        req.body.sender_full_name &&
        req.body.sender_card_number &&
        req.body.amount &&
        req.body.receiver_full_name &&
        req.body.bank_profit &&
        req.body.date &&
        req.body.hash
    ) {
        var body = {
            sender_full_name:req.body.sender_full_name,
            sender_card_number:req.body.sender_card_number,
            amount:(req.body.amount/100),
            receiver_full_name:req.body.receiver_full_name,
            bank_profit: (req.body.bank_profit/100),
            createdAt: req.body.date,
            hash: req.body.hash,
            status:1,
        };
    } else {
        res.status(500).send({
            message: "Маълумотлар кам"
        });
    }

    models.AloqaMobileTransactions.create(body).then(result => {
        res.status(200).send({
            message: "Ўтказма амалга оширилди",
            secretCode: result.secretCode
        });
    });
}
exports.getSecretCodeWithHash = (req, res) => {
    models.AloqaMobileTransactions.findOne({
        attributes: ['secretCode'],
        include: [{
            model: models.TransactionStatus
        }],
        where: {
            hash: req.body.hash
        }
    }).then(result => {
        if(result) {
            res.send({
                secretCode: result.secretCode,
                status: result.Status.status
            });
        } else {
            res.status(404).send({
                message: "Топилмади"
            })
        }
    })
}
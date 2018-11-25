const _ = require('lodash');
const models = require('../models');

// ADD NEW OPERATOR
exports.add = (req, res) => {
    var body = _.pick(req.body, ['firstName', 'lastName', 'middleName', 'username', 'password', 'roleId', 'branchId']);
    models.User.create(body).then(() => {
        res.send({
            message: "Оператор кошилди",
            success: true
        });
    }).catch(err => {
        console.log(err);
        res.send({
            message: "Хатолик яна уриниб коринг",
            success: false
        });
    });
}

// LIST ALL OPERATORS 
exports.allUsers = (req, res) => {
    const users = models.User.findAll({
        attributes: [ 'id', 'firstName', 'lastName', 'middleName', 'username'],
        include: [{
            model: models.Role,
            attributes: ['id', 'name']
        },{
            model: models.Branch,
            attributes: ['id', 'MFO', 'department']
        }]
    }).then(users => {
        result = [];
        for(user of users) {
            data = {};
            data.operator_id = user.id;
            data.firstName = user.firstName;
            data.lastName = user.lastName;
            data.middleName = user.middleName;
            data.role = user.Role.name;
            data.MFO = user.Branch.MFO;
            data.Branch = user.Branch.department;
            result.push(data);
        }

        res.send(result);
    });
}

//FETCH ALL DEPARTMENTS
exports.getDepartmentList = (req, res) => {
    models.Branch.findAll({
        attributes: ['id', 'MFO', 'department']
    }).then(departments => {
        res.send({
            departments: departments
        });
    });
}

// ADD NEW DEPARTMENTS
exports.postDepartments = (req, res) => {
    var body = _.pick(req.body, ['MFO', 'department']);
    models.Branch.create(body).then(() => {
        res.send({
            message: 'Филиал кошилди',
            success: true
        })
    }).catch(err => {
        console.log(err);
        res.send({
            message: "Тармокдаги хатолик",
            success: false
        })
    })
}

// FETCH ALL USER ROLES
exports.getRoles = (req, res) => {
    models.Role.findAll({
        attributes: ['id', 'name']
    }).then(roles => {
        res.send(roles);
    })
}

exports.getTransactions = (req, res) => {
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
        }]
    }).then(transactions => {
        result = [];
        for(transaction of transactions) {
            data = {};
            data.transaction = transaction.id;
            data.send_department = transaction.send_department;
            data.sender_fullname = transaction.sender_fullname;
            data.passport_info = `${transaction.sender_passport_series} ${transaction.sender_passport_number}`
            // data.sender_passport_series = transaction.sender_passport_series;
            // data.sender_passport_number = transaction.sender_passport_number;
            data.sender_passport_date_of_issue = transaction.sender_passport_date_of_issue;
            data.sender_passport_date_of_expiry = transaction.sender_passport_date_of_expiry;
            data.sender_passport_place_of_given = transaction.sender_passport_place_of_given;
            data.sender_permanent_address = transaction.sender_permanent_address;
            data.sender_phone_number = transaction.sender_phone_number;
            data.sender_account_number = transaction.sender_account_number;
            data.send_amount_in_number = transaction.send_amount_in_number;
            data.send_amount_in_word = transaction.send_amount_in_word;
            data.receive_department = transaction.receive_department;
            data.receiver_fullname = transaction.receiver_fullname;
            data.receiver_passport_series = transaction.receiver_passport_series;
            data.receiver_passport_number = transaction.receiver_passport_number;
            data.receiver_passport_date_of_issue = transaction.receiver_passport_date_of_issue;
            data.receiver_passport_date_of_expiry = transaction.receiver_passport_date_of_expiry;
            data.receiver_passport_place_of_given = transaction.receiver_passport_place_of_given;
            data.receiver_permanent_address = transaction.receiver_permanent_address;
            data.receiver_phone_number = transaction.receiver_phone_number;
            data.receiver_account_number = transaction.receiver_account_number;
            data.createdAt = transaction.createdAt;
            data.status_id = transaction.Status.id;
            data.status = transaction.Status.status;
            data.send_paymentMethod_id = transaction.Payment.id;
            data.send_paymentMethod = transaction.Payment.name;
            data.receive_paymentMethod_id = transaction.receiveMethod.id;
            data.receive_paymentMethod = transaction.receiveMethod.name;
            data.send_currency_id = transaction.Currency.id;
            data.send_currency = transaction.Currency.name;
            data.receive_currency_id = transaction.reciveCurrency.id;
            data.receive_currency = transaction.reciveCurrency.name;
            result.push(data);

        }
        res.send(result);
    });
}


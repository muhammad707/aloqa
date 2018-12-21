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
            data.fullName = `${user.firstName} ${user.lastName} ${user.middleName}`
            // data.firstName = user.firstName;
            // data.lastName = user.lastName;
            // data.middleName = user.middleName;
            data.role = user.Role.name;
            data.MFO = user.Branch.MFO;
            data.Branch = user.Branch.department;
            data.username = user.username;
            result.push(data);
        }

        res.send(result);
        console.log(result);
    });
}

//FETCH ALL DEPARTMENTS
exports.getDepartmentList = (req, res) => {
    models.Branch.findAll({
        attributes: ['id', 'MFO', 'department'],
    }).then(departments => {
        
        result = [];
        for(department of departments) {
            data = {};
            data.department_id = department.id;
            data.MFO = department.MFO;
            data.department = department.department;
            // data.status = department.DepartmentStatus.status;
            result.push(data);
        }
        res.send({
            result
        });
    });
}

// ADD NEW DEPARTMENTS
exports.postDepartments = (req, res) => {
    var body = _.pick(req.body, ['MFO', 'department', 'status']);
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
    });
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
        // res.send(transactions);
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
            data.updatedAt = (transaction.updatedAt != null ? transaction.updatedAt : "");
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
            data.bank_profit = (transaction.bank_profit != null ? transaction.bank_profit : "");
            result.push(data);
        }
        res.send(result);
    });
}

exports.deleteDepartments = (req, res) => {
    models.Branch.update( {
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.send({
            message: "Филиал  очирилди",
            success: true
        });
    });
}

exports.updateDepartment = (req, res) => {
    var body = _.pick(req.body, ['department_id','MFO', 'department']);
    models.Branch.update(body, {
        where: {
            id: body.department_id
        }
    }).then(() => {
        res.send({
            message: "Узгартирилди",
            success: true
        });
    });
}

exports.deleteOperators = (req, res) => {
    console.log(req.params.id);
    models.User.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.send({
            message: "Оператор учирилди",
            success: true
        });
    }).catch(() => {
        res.send({
            message: "Тармокдаги хатолик",
            success: false
        });
    });
}

exports.updateOperators = (req, res) => {
    var operator_id = req.body.operator_id;
    var body = _.pick(req.body, ['operator_id','firstName', 'lastName', 'middleName', 'username', 'password', 'roleId', 'branchId']);
    models.User.update(body, {
        where:{
            id: body.operator_id
        }
    }).then(() => {
        res.send({
            message: "Узгартрилди"
        })
    });
}


exports.addRole = (req, res) => {
    var body = _.pick(req.body, ['name']);
    models.Role.create(body).then(() => {
        res.send({
            message: "Рол кушилди",
            success: true
        });
    }).catch(err => {
        res.send({
            message: "Тармокдаги хатолик",
            success: false
        });
    });
}

exports.getCurrencyList = (req, res) => {
    models.Currency.findAll({
        attributes: ['id', 'name']
    }).then(result => {
        res.send(result);
    });
}

exports.addCurrency = (req, res) => {
    var body = _.pick(req.body, ['id', 'name']);
    models.Currency.create(body).then(() => {
        console.log(body);
        res.send({
            message: "Валюта кушилди",
            success: true
        });
    }).catch(() => {
        res.send({
            message: "Тармокдаги хатолик",
            success: false
        });
    });
}

exports.addCommission = (req, res) => {
    var body = _.pick(req.body, ['value']);
    models.Commission.update(body, {
        where: {
            id: 1
        }
    }).then(() => {
        res.send({
            success: true,
            message: "Банк хизмат хақи қўшилди"
        });
    }).catch(e => {
        res.send({
            message: "Тармоқдаги хатолик"
        });
    })
}

exports.fetchCommission = (req, res) => {
    models.Commission.findAll({
        attributes: ['id', 'value', 'updatedAt']
    }).then(result => {
        res.send(result);
    });
}



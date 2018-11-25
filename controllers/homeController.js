const models = require('../models');

exports.RoleAuthenticated = (req, res) => {
   res.send(req.user);
}

exports.dashboard = (req, res) => {
    models.User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'middleName'],
        include: [{
            model: models.Branch,
            attributes: ['MFO', 'department']
        }, {
            model: models.Role,
            attributes: ['id', 'name']
        }],
        where: {
            id: req.user.id
        }
    }).then(result => {
       res.json({
           result
       });
    });
}
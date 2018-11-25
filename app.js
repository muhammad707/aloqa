const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const homeControllers = require('./controllers/homeController');
const adminControllers = require('./controllers/adminControllers');
const userControllers = require('./controllers/userControllers');
const auth = require('./config/role');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(passport.initialize());

require('./config/passport')(passport);
// Routes

app.get('/send', passport.authenticate('jwt', { session: false}), homeControllers.dashboard);
app.get('/user/me',  passport.authenticate('jwt', { session: false}), homeControllers.RoleAuthenticated);

app.post('/admin/add',  passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.add);
app.get('/admin/operators', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.allUsers);
app.get('/admin/department/list', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.getDepartmentList);
app.post('/api/adddepartment', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.postDepartments);
app.get('/admin/role', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.getRoles);
app.get('/admin/transactions', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.getTransactions);

app.post('/api/auth/login', userControllers.postLogin);
app.post('/api/createTransaction', passport.authenticate('jwt', { session: false}), userControllers.createTransaction);
app.post('/api/confirmtransaction/:secretCode', passport.authenticate('jwt', { session: false}), userControllers.confirmTransaction);
app.post('/api/searchtransaction',  passport.authenticate('jwt', { session: false}), userControllers.searchTransaction);
app.get('/api/currencylist', passport.authenticate('jwt', { session: false}), userControllers.currencyList);
app.get('/api/paymentmethodlist', passport.authenticate('jwt', { session: false}), userControllers.paymentMethodList);

module.exports = app;
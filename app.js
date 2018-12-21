const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const homeControllers = require('./controllers/homeController');
const adminControllers = require('./controllers/adminControllers');
const userControllers = require('./controllers/userControllers');
const auth = require('./config/role');
const keys = require('./config/config');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(passport.initialize());

require('./config/passport')(passport);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }
// Routes

app.get('/send', passport.authenticate('jwt', { session: false}), homeControllers.dashboard);
app.get('/user/me',  passport.authenticate('jwt', { session: false}), homeControllers.RoleAuthenticated);

app.post('/admin/operators/add', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.add);
app.get('/admin/operators', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.allUsers);
app.get('/admin/department/list', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.getDepartmentList);
app.post('/admin/department/add', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.postDepartments);
app.post('/admin/department/update', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.updateDepartment);
app.get('/admin/role', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.getRoles);
app.get('/admin/transactions', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.getTransactions);
app.get('/admin/departments/delete/:id',  passport.authenticate('jwt', { session: false}), auth.permit(1),   adminControllers.deleteDepartments);
app.get('/admin/operators/delete/:id',  passport.authenticate('jwt', { session: false}), auth.permit(1),   adminControllers.deleteOperators);
app.post('/admin/operators/update',  passport.authenticate('jwt', { session: false}), auth.permit(1),   adminControllers.updateOperators);
app.get('/admin/roles',  passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.getRoles);
app.get('/admin/currencies',  passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.getCurrencyList);
app.post('/admin/roles/add',  passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.addRole);
app.post('/admin/currency/add', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.addCurrency);
app.post('/admin/commision/update', passport.authenticate('jwt', { session: false}), auth.permit(1), adminControllers.addCommission);
app.get('/admin/commission/fetch', passport.authenticate('jwt', { session: false}), adminControllers.fetchCommission);


app.post('/api/auth/login', userControllers.postLogin);
app.post('/api/createtransaction', passport.authenticate('jwt', { session: false}), userControllers.createTransaction);
app.post('/api/confirmtransaction/:secretCode', passport.authenticate('jwt', { session: false}), userControllers.confirmTransaction);
app.post('/api/searchtransaction',  passport.authenticate('jwt', { session: false}), userControllers.searchTransaction);
app.get('/api/currencylist', passport.authenticate('jwt', { session: false}), userControllers.currencyList);
app.get('/api/paymentmethodlist', passport.authenticate('jwt', { session: false}), userControllers.paymentMethodList);
app.get('/api/printsenderinfo/:secretCode', passport.authenticate('jwt', { session: false}), userControllers.getInfoToPrint);
// app.get('/api/myTransactions/send', passport.authenticate('jwt', { session: false}), userControllers.sentTransactions);
app.get('/api/transactions/:operator', passport.authenticate('jwt', { session: false}), userControllers.sentTransactions);
app.post('/api/mobile/createtransaction', passport.authenticate('jwt', { session: false}), userControllers.createTransactionByAloqaMobile);
app.get('/api/aloqamobile/:secretCode', passport.authenticate('jwt', { session: false}), userControllers.searchTransactionByAloqaMobile);

module.exports = app;
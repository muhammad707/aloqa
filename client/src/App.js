import React, { Component } from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Landing from './components/operator/Landing';
import AuthenticatedComponent from './components/AuthenticatedComponent';
import SiderDemo from './components/operator/SendPayment';
import SearchTransaction from './components/operator/SearchTransaction';
import AdminLanding from './components/admin/AdminLanding';
import Department from './components/admin/Department';
import Operators from './components/admin/Operators';
import Transactions from './components/admin/Transactions';
import Print from './components/operator/Print';
import OperatorTransactions from './components/operator/Transactions';
import Commision from './components/admin/Commision';
import Role from './components/admin/Role';
import Currency from './components/admin/Currency';
import AloqaMobileTransactions from './components/operator/aloqaMobileTransactions';
import OperatorTransactionsReceived from './components/operator/receivedAloqaMobileTransactions';
import AdminAloqaMobileTransactions from './components/admin/AloqaMobileTransactions';
class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/" exact component={Home} />
          <Route path="/print" component={Print}/>
          <AuthenticatedComponent>
            <Route path="/operators" component={Operators} />
            <Route path="/department" component={Department} />
            <Route path="/admin" component={AdminLanding} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/info" component={Landing}/>
            <Route path="/send" component={SiderDemo} />
            {/* <Route path="/receive" component={ReceivePayment} /> */}
            <Route path="/search" component={SearchTransaction}/>
            <Route path="/sentExpressTransactions" component={OperatorTransactions} />
            <Route path="/receivedExpressTransactions" component={OperatorTransactionsReceived} />
            <Route path="/commision" component={Commision} />
            <Route path="/roles" component={Role} />
            <Route path="/currency" component={Currency} />
            <Route path="/aloqamobiletransactions" component={AloqaMobileTransactions} />
            <Route path="/AdminAloqaMobileTransactions" component={AdminAloqaMobileTransactions} />
          </AuthenticatedComponent>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

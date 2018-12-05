import React, { Component } from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Landing from './components/operator/Landing';
import AuthenticatedComponent from './components/AuthenticatedComponent';
import SiderDemo from './components/operator/SendPayment';
import ReceivePayment from './components/operator/ReceivePayment';
import SearchTransaction from './components/operator/SearchTransaction';
import AdminLanding from './components/admin/AdminLanding';
import Department from './components/admin/Department';
import Operators from './components/admin/Operators';
import Transactions from './components/admin/Transactions';
import Settings from './components/admin/Settings';
import Print from './components/operator/Print';
import OperatorTransactions from './components/operator/Transactions';
class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/" exact component={Home} />
          <Route path="/print/secretCode" component={Print}/>
          <AuthenticatedComponent>
            <Route path="/operators" component={Operators} />
            <Route path="/department" component={Department} />
            <Route path="/admin" component={AdminLanding} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/settings" component={Settings} />
            <Route path="/info" component={Landing}/>
            <Route path="/send" component={SiderDemo} />
            <Route path="/receive" component={ReceivePayment} />
            <Route path="/search" component={SearchTransaction}/>
            <Route path="/myTransactions" component={OperatorTransactions} />
          </AuthenticatedComponent>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

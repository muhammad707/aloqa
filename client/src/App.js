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
import RoleAuthenticated from './components/RoleAuthenticated';
// import  RoleAuthenticated  from './components/RoleAuthenticated';
// import { getRole } from './helpers/role';
class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/" exact component={Home} />
          {/* <AuthenticatedComponent> */}
            <RoleAuthenticated>
              <Route path="/department" component={Department} />
              <Route path="/admin" component={AdminLanding} />
              <Route path="/operators" component={Operators} />
              <Route path="/transactions" component={Transactions} />
            </RoleAuthenticated>
            <Route path="/info" component={Landing}/>
            <Route path="/send" component={SiderDemo} />
            <Route path="/receive" component={ReceivePayment} />
            <Route path="/search" component={SearchTransaction}/>
          {/* </AuthenticatedComponent> */}
          
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

import React, {Component} from 'react';
import {getJwt} from "../helpers/jwt";
import axios from 'axios';
import {withRouter} from 'react-router-dom';
class RoleAuthenticated extends Component {
    constructor(props) {
        super(props);
    }

    getPathForRole(role) {
        switch (role) {
          case '1':
              return '/admin'
          case 'operator':
              return '/3'
          case 'departament':
              return '/department'
          default:
              return '/login'
        }
  
      }
      componentWillMount() {
          axios.get('/user/me', {
              headers: {
                  Authorization: getJwt()
              }
          }).then(user => {
              console.log(user);
              if(user.data.roleId !== 1) {
                  this.props.history.push('/login');
              }
            // this.redirectRouteForGivenRole(user.data.role);
          }).catch(err => {
              localStorage.removeItem('token');
              this.props.history.push('/login');
          });
      }
  

    render() {
        // if(this.state.user === undefined) {
        //     return (
        //         <div id="loader">
        //             Please wait...
        //         </div>
        //     );
        // }

        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}

export default withRouter(RoleAuthenticated);
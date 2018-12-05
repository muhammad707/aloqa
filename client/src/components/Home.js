import React, { Component } from 'react';
import {getJwt} from '../helpers/jwt';
import { getRole } from '../helpers/role';
class Home extends Component {
    constructor(props) {
        super(props);
        console.log(getRole());
        if(getJwt()!=='' && getRole() === 'superadmin'){
            this.props.history.push('/admin');
        }else if(getJwt()!=='' && getRole() === 'operator') {            
            this.props.history.push('/info');
        } else {
            this.props.history.push('/login')
        }
    }
    render(){
    return (
        <div>
            
        </div>
     )
    }
};

export default Home;
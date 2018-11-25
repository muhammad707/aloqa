import React, { Component } from 'react';
import {getJwt} from '../helpers/jwt';

class Home extends Component {
    constructor(props) {
        super(props);
        if(getJwt()!==''){
            this.props.history.push('/info');
        }else{            
            this.props.history.push('/login');
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
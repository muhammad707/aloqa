import React, {Component} from 'react';
import {getJwt} from "../helpers/jwt";
import { getRole } from '../helpers/role';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class RoleAuthenticated extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            role: undefined
        }
        
    }

    componentDidMount() {
        // console.log(getJwt());
        axios.get('/send', {
            headers: {
                Authorization: getJwt()
            }
        }).then(user => {
            this.setState({
                user: user.data
                // role: user.data.role
            });
            if(getRole() === 'operator') {
                this.props.history.push('/info')
            } else {
                this.props.history.push('/login');
            }
            
           
        }).catch(err => {
            localStorage.removeItem('token');
            this.props.history.push('/login');
        });
    }   

    render() {
        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}

export default withRouter(RoleAuthenticated);
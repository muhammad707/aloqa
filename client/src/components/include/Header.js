import React, {Component} from "react";
import {Layout, Menu, Icon} from 'antd';
import { getJwt } from '../../helpers/jwt';
import { withRouter} from "react-router-dom";
import axios from 'axios';

const {SubMenu} = Menu;
class Header extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        // console.log(props.history);
    }

    state = { 
        name: undefined
    }

    componentDidMount() {
        axios.get('/send', {
            headers: {
                Authorization: getJwt()
            }
        }).then(res => {
            this.setState({
                id: res.data.result[0].id,
                name: res.data.result[0].firstName
            });
            console.log(this.state.name);
        });
    }
    logout() {
        localStorage.removeItem("token");
        this.props.history.push('/login');
    }

    render() {
        return (
            <div>
                <Layout.Header style={{background: "#fff"}}>
                    <div className="logo"/>
                    <Menu
                        style={{float: "right", lineHeight: '64px'}}
                        mode="horizontal">
                        <SubMenu title={<span className="submenu-title-wrapper">
                            <Icon type="user"/> {this.state.name } <Icon type="down" style={{ fontSize: '12px'}}/></span>}>
                            <Menu.Item key="logout" onClick={e => this.logout()}>
                                <Icon type="logout"/>
                                <span className="nav-text">Выход</span>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Layout.Header>
            </div>
        );
    }
}
export default withRouter(Header);
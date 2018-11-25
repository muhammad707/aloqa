import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import { NavLink,withRouter } from "react-router-dom";

const { Sider } = Layout;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    // console.log(props.history);
  }
  logout() {
    localStorage.removeItem("token");
    this.props.history.push('/login');
  }
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  render() {
    return (
      <div>
        <Sider
        style={{height:"200vh", width:"1000px" }}
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline">
            <Menu.Item key="/info">
              <NavLink to="/info">
                <Icon type="user" />
                <span className="nav-text">Бош сахифа</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="/send">
              <NavLink to="/send">
                <Icon type="shop" />
                <span className="nav-text">Пул ўтказмасини юбориш</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="/receive">
              <NavLink to="/receive">
                <Icon type="shopping-cart" />
                <span className="nav-text">Пул ўтказмасини қабул қилиш</span>
              </NavLink>
            </Menu.Item>

             <Menu.Item key="/search">
              <NavLink to="/search">
                <Icon type="shopping-cart" />
                <span className="nav-text">Пул ўтказмасини излаш</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="logout">  
            <Icon type="logout" />              
                <span className="nav-text" onClick={e=>this.logout()}>Logout</span>
            </Menu.Item>

          </Menu>
        </Sider>
      </div>
    );
  }
}

export default withRouter(Sidebar);

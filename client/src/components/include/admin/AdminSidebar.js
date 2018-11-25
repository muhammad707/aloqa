import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import { NavLink,withRouter } from "react-router-dom";

const { Sider } = Layout;

class AdminSidebar extends Component {
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
            <Menu.Item key="/admin">
              <NavLink to="/admin">
                <Icon type="user" />
                <span className="nav-text">Бош сахифа</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="/department">
              <NavLink to="/depart
              ment">
                <Icon type="shop" />
                <span className="nav-text">Филиаллар</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="/operators">
              <NavLink to="/operators">
                <Icon type="shopping-cart" />
                <span className="nav-text">Операторлар</span>
              </NavLink>
            </Menu.Item>

             <Menu.Item key="/transactions">
              <NavLink to="/transactions">
                <Icon type="shopping-cart" />
                <span className="nav-text">Отказмалар</span>
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

export default withRouter(AdminSidebar);

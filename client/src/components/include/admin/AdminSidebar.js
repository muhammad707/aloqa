import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import { NavLink,withRouter } from "react-router-dom";
const SubMenu = Menu.SubMenu;
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
                <span className="nav-text">Бош саҳифа</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="/department">
              <NavLink to="/department">
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
            <SubMenu
              key="sub1"
              title={<span><Icon type="setting" /><span>Ўтказмалар</span></span>}
            >
              <Menu.Item key="/transactions">
              <NavLink to="/transactions">
                <span className="nav-text">Банк ўтказмалари</span>
              </NavLink>
              </Menu.Item>
              <Menu.Item key="/AdminAloqaMobileTransactions">
                <NavLink to="/AdminAloqaMobileTransactions">
                  <span className="nav-text">AloqaMobile ўтказмалари</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="setting" /><span>Созламалар</span></span>}
            >
              <Menu.Item key="/commision">
              <NavLink to="/commision">
                <span className="nav-text">Банк хизмат ҳақлари</span>
              </NavLink>
              </Menu.Item>
              <Menu.Item key="/roles">
                <NavLink to="/roles">
                  <span className="nav-text">Рўллар</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/currency">
                <NavLink to="/currency">
                  <span className="nav-text">Валюталар</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>

            <Menu.Item key="logout">  
            <Icon type="logout" />              
                <span className="nav-text" onClick={e=>this.logout()}>Чиқиш</span>
            </Menu.Item>

          </Menu>
        </Sider>
      </div>
    );
  }
}

export default withRouter(AdminSidebar);

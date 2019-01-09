import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import { NavLink,withRouter } from "react-router-dom";
const SubMenu = Menu.SubMenu;
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
                <span className="nav-text">Ўтказмани юбориш</span>
              </NavLink>
            </Menu.Item>

             {/* <Menu.Item key="/search">
              <NavLink to="/search">
                <Icon type="shopping-cart" />
                <span className="nav-text">Ўтказмани қабул қилиш</span>
              </NavLink>
            </Menu.Item> */}
            <SubMenu
              key="sub1"
              title={<span><Icon type="setting" /><span>Ўтказмани қабул қилиш</span></span>}
            >
              <Menu.Item key="/search">
                <NavLink to="/search">
                  <span className="nav-text">Банк ўтказмалари</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/aloqamobiletransactions">
                <NavLink to="/aloqamobiletransactions">
                  <span className="nav-text">AloqaMobile ўтказмалари</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
            {/* <Menu.Item key="/myTransactions">
              <NavLink to="/myTransactions">
                <Icon type="shopping-cart" />
                <span className="nav-text">Ўтказмалар</span>
              </NavLink>
            </Menu.Item> */}
            <SubMenu
              key="sub2"
              title={<span><Icon type="setting" /><span>Ўтказмалар</span></span>}
            >
              <Menu.Item key="/sentExpressTransactions">
                <NavLink to="/sentExpressTransactions">
                  <span className="nav-text">Юборилган</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/receivedExpressTransactions">
                <NavLink to="/receivedExpressTransactions">
                  <span className="nav-text">Қабул қилинган</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/transactionAloqaMobile">
                <NavLink to="/transactionAloqaMobile">
                  <span className="nav-text">AloqaMobile ўтказмалари</span>
                </NavLink>
              </Menu.Item>
            </SubMenu>
            {/* <Menu.Item key="/aloqamobiletransactions">
              <NavLink to="/aloqamobiletransactions">
                <Icon type="shopping-cart" />
                <span className="nav-text">AloqaMobile</span>
              </NavLink>
            </Menu.Item> */}

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

export default withRouter(Sidebar);

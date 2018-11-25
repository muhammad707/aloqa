import React, { Component } from "react";
import Sidebar from '../include/Sidebar';
import Header from '../include/Header';
import Footer from '../include/Footer';
import { Layout } from 'antd';
const { Content } = Layout;
class DefaultLayout extends Component {
    
  render() {
    return (
      <div>
        <Layout>
            <Layout>
                <Sidebar />
                <Layout>
                    <Header />
                    <Content style={{ margin: '24px 16px', paddingLeft: 24, background: '#fff', minHeight: 280 }}>
                        {this.props.children}
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </Layout>
      </div>
    );
  }
}

export default DefaultLayout;

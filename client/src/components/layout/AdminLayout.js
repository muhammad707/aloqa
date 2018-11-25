import React, { Component } from "react";
import AdminSidebar from '../include/admin/AdminSidebar';
import AdminHeader from '../include/admin/AdminHeader';
// import Footer from '../include/Footer';
import { Layout } from 'antd';
const { Content } = Layout;
class AdminLayout extends Component {
    
  render() {
    return (
      <div>
        <Layout>
            <Layout>
                <AdminSidebar />
                <Layout>
                    <AdminHeader />
                    <Content style={{ margin: '24px 16px', paddingLeft: 24, background: '#fff', minHeight: 280 }}>
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
      </div>
    );
  }
}

export default AdminLayout;

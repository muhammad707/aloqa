import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Breadcrumb,  Button, Table, Icon, Modal, Form, Input, Row, Col } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import Column from 'antd/lib/table/Column';
const FormItem = Form.Item;

class AdminAloqaMobileTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: undefined
        }

    }
    componentWillMount() {
        this.fetchAloqaMobileTransactions();
    }
    fetchAloqaMobileTransactions() {
        axios.get('/admin/mobile/transactions', {
            headers: {
                Authorization: getJwt()
            }
        }).then(result => {
            // console.log(result.data)
            const listItems = (
                <Table rowKey="transaction_id" dataSource={result.data}>
                    <Column
                        title="Тартиб раками"
                        key="transaction_id"
                        dataIndex="transaction_id" />
                    <Column 
                        title="Юборувчи"
                        key="sender_full_name"
                        dataIndex="sender_full_name" />
                    <Column 
                        title="Суммаси"
                        key="amount"
                        dataIndex="amount" />
                    <Column 
                        title="Банк фойдаси"
                        key="bank_profit"
                        dataIndex="bank_profit" />
                    <Column 
                        title="Банк фойдаси"
                        key="createdAt"
                        dataIndex="createdAt" />
                    <Column 
                        title="Статус"
                        key="status"
                        dataIndex="status" />
                </Table>
            );
            this.setState({
                transactions: listItems
            })
        })
    }

    render() {
        return (
            <AdminLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Бош админстратор</Breadcrumb.Item>
                    <Breadcrumb.Item>AloqaMobile орқали амалга оширилган ўтказмалар</Breadcrumb.Item>
                </Breadcrumb>
                <h1>
                    Ўтказмалар
                </h1>
                {this.state.transactions}

            </AdminLayout>
        );
    }
}

export default AdminAloqaMobileTransactions;
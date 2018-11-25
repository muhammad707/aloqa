import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Breadcrumb, Select,  Button, Table,notification, Icon, Modal, Form, Input, Row, Col } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import Column from 'antd/lib/table/Column';
const Option = Select.Option;
const FormItem = Form.Item;

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: undefined,
            visible: false,
            transactions2: undefined
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    componentDidMount() {
        this.fetchTransactions();
    }
    showModal = () => {
        this.setState({
            visible: true
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false
        });
    }

    handleOk = () => {

    }

    fetchTransactions() {
        axios.get('/admin/transactions', {
            headers: {
                Authorization: getJwt()
            }
        }).then(transactions => {
            console.log(transactions.data);
            this.setState({
                transactions2: transactions.data
            })
            const listItems = (
                <Table rowKey="transaction" dataSource={transactions.data}>
                    <Column 
                         title="Тартиб раками"
                         key="transaction"
                         dataIndex="transaction" />
                    <Column 
                         title="Юборувчи"
                         key="sender_fullname"
                         dataIndex="sender_fullname" />
                    <Column 
                         title="Юборилган филиал"
                         key="send_department"
                         dataIndex="send_department" />
                    <Column 
                         title="Суммаси"
                         key="send_amount_in_number"
                         dataIndex="send_amount_in_number" />
                    <Column 
                         title="Олувчи"
                         key="receiver_fullname"
                         dataIndex="receiver_fullname" />
                    <Column 
                         title="Пул юборилган филиал"
                         key="receive_department"
                         dataIndex="receive_department" />
                    <Column 
                         title="Статус"
                         key="status"
                         dataIndex="status" />
                    <Column 
                        title="Батафсил" 
                        key="action"
                        render =  { () => <Button onClick={this.showModal} type="primary"><Icon type="edit"></Icon></Button> } /> 
                    
                </Table>
            );
            this.setState({
                transactions: listItems
            })
        })
    }

    render() {
        const { visible } = this.state;
        return(
            <AdminLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Бош админстратор</Breadcrumb.Item>
                    <Breadcrumb.Item>Отказмалар</Breadcrumb.Item>
                </Breadcrumb>
                <h1>
                    Отказмалар
                </h1>
                {this.state.transactions}
                <Modal 
                    title={ `Отказма` } 
                    visible={visible}
                    width={1300}
                    centered
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer = {[
                        <Button key="back" onClick={this.handleCancel}>Кайтиш</Button>
                       ]}>
                       <Row gutter={18}>
                        <Col className="gutter-row" span={8}>
                            <Form>
                                <FormItem {...this.formItemLayout} label="Махсус код">
                                    <Input name="" value={this.state.secretCode}  disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Ф.И.Ш">
                                    <Input name="receiver_fullname" value={this.state.fullName} placeholder="Ф.И.Ш" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пасспорт маьлумотлари">
                                    <Input value={this.state.passport_info} placeholder="Пасспорт маьлумотлари" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пул микдори">
                                    <Input value={this.state.amount} placeholder="Пул микдори" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пул бирлиги">
                                    <Input value={this.state.currency} placeholder="Пул бирлиги" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Статус">
                                    <Input value={this.state.status} disabled/>
                                </FormItem>
                            </Form>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Form>
                                <FormItem {...this.formItemLayout} label="Махсус код">
                                    <Input name="" value={this.state.secretCode}  disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Ф.И.Ш">
                                    <Input name="receiver_fullname" value={this.state.fullName} placeholder="Ф.И.Ш" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пасспорт маьлумотлари">
                                    <Input value={this.state.passport_info} placeholder="Пасспорт маьлумотлари" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пул микдори">
                                    <Input value={this.state.amount} placeholder="Пул микдори" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пул бирлиги">
                                    <Input value={this.state.currency} placeholder="Пул бирлиги" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Статус">
                                    <Input value={this.state.status} disabled/>
                                </FormItem>
                                </Form>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Form>
                                <FormItem {...this.formItemLayout} label="Махсус код">
                                    <Input name="" value={this.state.secretCode}  disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Ф.И.Ш">
                                    <Input name="receiver_fullname" value={this.state.fullName} placeholder="Ф.И.Ш" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пасспорт маьлумотлари">
                                    <Input value={this.state.passport_info} placeholder="Пасспорт маьлумотлари" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пул микдори">
                                    <Input value={this.state.amount} placeholder="Пул микдори" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пул бирлиги">
                                    <Input value={this.state.currency} placeholder="Пул бирлиги" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Статус">
                                    <Input value={this.state.status} disabled/>
                                </FormItem>
                                </Form>
                        </Col>
                       </Row>
                    </Modal>

            </AdminLayout>
        );
    }
}

export default Transactions;
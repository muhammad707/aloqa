import React, { Component } from 'react';
import AdminLayout from '../layout/Default';
import { Breadcrumb,  Button, Table, Icon, Modal, Form, Input, Row, Col } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import Column from 'antd/lib/table/Column';
const FormItem = Form.Item;

class OperatorTransactionsReceived extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: undefined,
            operator: undefined,
            visible: false,
            transactions2: undefined
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onView = this.onView.bind(this);
    }

    componentWillMount() {
        // this.fetchOperator();
        this.fetchTransactions();
    }

    fetchOperator() {
        
    }
    showModal = () => {
        this.setState({
            visible: true
        });
    }

    onView(data) {
        console.log(data);
        this.setState({
            transactions_id: data.transaction,
            createdAt: data.createdAt,
            receiver_passport_info: data.receiver_passport_info,
            receive_currency: data.receive_currency,
            receive_department: data.receive_department,
            receive_paymentMethod: data.receive_paymentMethod,
            receiver_account_number: data.receiver_account_number,
            receiver_fullname: data.receiver_fullname,
            receiver_passport_date_of_expiry: data.receiver_passport_date_of_expiry,
            receiver_passport_date_of_issue: data.receiver_passport_date_of_issue,
            receiver_passport_number: data.receiver_passport_number,
            receiver_passport_place_of_given: data.receiver_passport_place_of_given,
            receiver_passport_series: data.receiver_passport_series,
            receiver_permanent_address: data.receiver_permanent_address,
            receiver_phone_number: data.receiver_phone_number,
            send_amount_in_number: data.send_amount_in_number,
            send_amount_in_word: data.send_amount_in_word,
            send_currency: data.send_currency,
            send_department: data.send_department,
            send_paymentMethod: data.send_paymentMethod,
            sender_account_number: data.sender_account_number,
            sender_fullname: data.sender_fullname,
            sender_passport_info: data.sender_passport_info,
            sender_passport_date_of_expiry: data.sender_passport_date_of_expiry,
            sender_passport_date_of_issue: data.sender_passport_date_of_issue,
            sender_passport_place_of_given: data.sender_passport_place_of_given,
            sender_permanent_address: data.sender_permanent_address,
            sender_phone_number: data.sender_phone_number,
            status: data.status
        });
        this.showModal();
    }

    handleCancel = () => {
        this.setState({
            visible: false
        });
    }

    handleOk = () => {

    }

    fetchTransactions() {
        
        axios.get('/send', {
            headers: {
                Authorization: getJwt()
            }
        }).then(res => {
            var operator = res.data.result[0].id;
            axios.get('/api/transactions/received/' + operator, {
                headers: {
                    Authorization: getJwt()
                }
            }).then(res => {
                console.log(res.data);
                this.setState({
                    transactions2: res.data
                });
                const listItems = (
                    <Table rowKey="transaction" dataSource={res.data}>
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
                        render={(text, record) => (
                            <div>
                                <Icon type="edit" onClick={() => this.onView(record)}/>
                            </div>
                        )} />
                    
                </Table>
                );
                this.setState({
                    transactions: listItems
                })
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
                                <FormItem  label="Ф.И.Ш">
                                    <Input name="" value={this.state.sender_fullname}  disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пасспорт маьлумотлари">
                                    <Input name="sender_passport_info" value={this.state.sender_passport_info} placeholder="Ф.И.Ш" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Пасспорт маьлумотлари">
                                    <Input value={this.state.passport_info} placeholder="Пасспорт маьлумотлари" disabled/>
                                </FormItem>
                                <FormItem  label="Берилган вакти">
                                    <Input value={this.state.sender_passport_date_of_issue} placeholder="Пул микдори" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Амал килиш муддати">
                                    <Input value={this.state.sender_passport_date_of_expiry} placeholder="Пул бирлиги" disabled/>
                                </FormItem>
                                <FormItem label="Ким томонидан берилган">
                                    <Input value={this.state.sender_passport_place_of_given} disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Манзили">
                                    <Input value={this.state.sender_permanent_address} disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Тел. номер">
                                    <Input value={this.state.sender_phone_number} disabled/>
                                </FormItem>
                                <FormItem  label="Хисоб раками">
                                    <Input value={this.state.sender_account_number} disabled/>
                                </FormItem>
                                <FormItem  label="Юборилган пул шакли">
                                    <Input value={this.state.send_paymentMethod} disabled/>
                                </FormItem>
                                <FormItem  label="Юборилган пул бирлиги">
                                    <Input value={this.state.send_currency} disabled/>
                                </FormItem>
                            </Form>
                        </Col>
                        <Col className="gutter-row" span={8}>
                                <FormItem  label="Ф.И.Ш">
                                    <Input name="" value={this.state.receiver_fullname}  disabled/>
                                </FormItem>
                                <FormItem  label="Пасспорт маьлумотлари">
                                    <Input name="receiver_fullname" value={this.state.receiver_passport_info} placeholder="Ф.И.Ш" disabled/>
                                </FormItem>
                                <FormItem  label="Пасспорт маьлумотлари">
                                    <Input value={this.state.passport_info} placeholder="Пасспорт маьлумотлари" disabled/>
                                </FormItem>
                                <FormItem  label="Берилган вакти">
                                    <Input value={this.state.receiver_passport_date_of_issue} placeholder="Пул микдори" disabled/>
                                </FormItem>
                                <FormItem label="Амал килиш муддати">
                                    <Input value={this.state.receiver_passport_date_of_expiry} placeholder="Пул бирлиги" disabled/>
                                </FormItem>
                                <FormItem label="Ким томонидан берилган">
                                    <Input value={this.state.receiver_passport_place_of_given} placeholder="Пул бирлиги" disabled/>
                                </FormItem>
                                <FormItem  label="Манзили">
                                    <Input value={this.state.receiver_permanent_address} disabled/>
                                </FormItem>
                                <FormItem  label="Тел. номер">
                                    <Input value={this.state.receiver_phone_number} disabled/>
                                </FormItem>
                                <FormItem label="Хисоб раками">
                                    <Input value={this.state.receiver_account_number} disabled/>
                                </FormItem>
                                <FormItem  label="Кабул килинган пул шакли">
                                    <Input value={this.state.receive_paymentMethod} disabled/>
                                </FormItem>
                                <FormItem  label="Кабул килинган пул бирлиги">
                                    <Input value={this.state.receive_currency} disabled/>
                                </FormItem>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <FormItem  label="Тартиб раками">
                                <Input name="" value={this.state.transactions_id}  disabled/>
                            </FormItem>
                            <FormItem  label="Качон юборилган">
                                <Input name="receiver_fullname" value={this.state.createdAt} placeholder="Ф.И.Ш" disabled/>
                            </FormItem>
                            <FormItem label="Юборилган филиал">
                                <Input value={this.state.send_department} placeholder="Пасспорт маьлумотлари" disabled/>
                            </FormItem>
                            <FormItem label="Кабул килган филиал">
                                <Input value={this.state.receive_department} placeholder="Пул микдори" disabled/>
                            </FormItem>
                            <FormItem  label="Статус">
                                <Input value={this.state.status} placeholder="Пул бирлиги" disabled/>
                            </FormItem>
                            <FormItem {...this.formItemLayout} label="Статус">
                                <Input value={this.state.status} disabled/>
                            </FormItem>
                        </Col>
                       </Row>
                    </Modal>
                
            </AdminLayout>
        );
    }
}
export default OperatorTransactionsReceived;
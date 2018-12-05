import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import { Table, Row, Breadcrumb, notification, Col, Button, Icon, Modal, Form, Input } from 'antd';
import Column from 'antd/lib/table/Column';
import { truncate } from 'fs';
const FormItem = Form.Item;
class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            confirmLoading: false,
            confirmLoading2: undefined,
            visible: false,
            currencies: undefined,
            roles: undefined,
            ModalText: "Рол кушиш",
            user_role: undefined,
            currency: undefined,
            currency_id: undefined
        }
        this.change = this.change.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleAdd2 = this.handleAdd2.bind(this);
    }

    componentWillMount() {
        this.fetchRoleList();
        this.fetchCurrencyList();
    }

    change(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
      }

    showModal = () => {
        this.setState({
            visible: true
        });
    }

    fetchRoleList() {
        this.setState({
            loading: true
        });
        axios.get('/admin/role', {
            headers: {
                Authorization: getJwt()
            }
        }).then(res => {
            console.log(res.data);
            const listItems = (
                <Table rowKey="id" dataSource={res.data}>
                <Column 
                    title="Тартиб раками"
                    key="id"
                    dataIndex="id" />
                    <Column 
                        title="Роли"
                        key="name"
                        dataIndex="name" />
                </Table>
            );
            this.setState({
                roles: listItems
            });
        });
    }

    fetchCurrencyList() {
        axios.get('/admin/currencies', {
            headers: {
                Authorization: getJwt()
            }
        }).then(res => {
            console.log(res.data);
            const listItems = (
                <Table rowKey="id" dataSource={res.data}>
                <Column 
                    title="Тартиб раками"
                    key="id"
                    dataIndex="id" />
                    <Column 
                        title="Валюта тури"
                        key="name"
                        dataIndex="name" />
                </Table>
            );

            this.setState({
                currencies: listItems
            });
        }).catch(err => {

        });
    }

    handleAdd = () => {
        if(this.state.user_role) {
            this.setState({
                confirmLoading: true
            });
            let formData = {};
            formData.name = this.state.user_role;
            console.log(formData);
            axios.post('/admin/roles/add', formData, {
                headers: {
                    Authorization: getJwt()
                }
            }).then(res => {
                if(res.data.success) {
                    this.setState({
                        confirmLoading: false,
                        user_role: ""
                    });
                    notification["success"]({
                        message: res.data.message
                    });
                    this.fetchRoleList();
                } else {
                    notification["error"]({
                        message: "Тармокдаги хатолик"
                    });
                }
            }).catch(() => {
              console.log("err");
            });
            this.setState({
                visible: false
            });
        }  else {
            notification["error"]({
                message: "Маьлумот кам"
            });
        }
    }

    handleAdd2 = () => {
        if(this.state.currency_id && this.state.currency) {
            this.setState({
                confirmLoading2: true
            });
            let form = {};
            form.id = this.state.currency_id;
            form.name = this.state.currency;
            console.log(form);
            axios.post('/admin/currency/add', form, {
                headers: {
                    Authorization: getJwt()
                }
            }).then(res => {
                if(res.data.success) {
                    this.setState({
                        confirmLoading2: false,
                        currency_id: "",
                        currency: ""
                    });
                    notification["success"]({
                        message: res.data.message
                    });
                    this.fetchCurrencyList();
                } else {
                    notification["error"]({
                        message: res.data.message
                    });
                }
            }).catch(() => {
                console.log("err");
            });
            this.setState({
                visible: false
            });
        } else {
            notification["error"]({
                message: "Маьлумот кам"
            });
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false
        });
    }

    render() {
        const { loading} = this.state;
        return (
            <div>
                <AdminLayout>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Бош админстратор</Breadcrumb.Item>
                        <Breadcrumb.Item>Созламалар</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row gutter={18}>
                        <Col className="gutter-row" span={9} offset={2}>
                        <div style={{ margin: '30px'}}>
                            <Button type="primary" onClick={this.showModal}>
                            <Icon type="plus">
                            </Icon>
                                Рол кушиш
                            </Button>
                            <Modal title={this.state.ModalText}
                            visible={this.state.visible}
                            onOk={this.handleAdd}
                            confirmLoading={this.state.confirmLoading2}
                            onCancel={this.handleCancel}
                        footer = {[
                            <Button key="back" onClick={this.handleCancel}>Кайтиш</Button>,
                            <Button key="submit" type="primary" onClick={this.handleAdd}>Юбориш</Button>
                        ]}>
                                <Form>
                                    <FormItem label="Рол номи">
                                        <Input name="user_role" placeholder="Рол номи" onChange={e => this.change(e)} />
                                    </FormItem>
                                </Form>
                            </Modal>
                            </div>
                            {this.state.roles}
                        </Col>
                        <Col className="gutter-row" span={9} offset={2}>
                        <div style={{ margin: '30px'}}>
                            <Button type="primary" onClick={this.showModal}>
                            <Icon type="plus">
                            </Icon>
                                Валюта кушиш
                            </Button>
                            <Modal title={this.state.ModalText}
                            visible={this.state.visible}
                            onOk={this.handleAdd2}
                            confirmLoading={this.state.confirmLoading}
                            onCancel={this.handleCancel}
                        footer = {[
                            <Button key="back" onClick={this.handleCancel}>Кайтиш</Button>,
                            <Button key="submit" type="primary" onClick={this.handleAdd2}>Юбориш</Button>
                        ]}>
                                <Form>
                                    <FormItem label="Рол номи">
                                        <Input name="currency_id" placeholder="Валюта коди" onChange={e => this.change(e)} />
                                    </FormItem>
                                    <FormItem label="Валюта номи">
                                        <Input name="currency" placeholder="Валюта номи" onChange={e => this.change(e)} />
                                    </FormItem>
                                </Form>
                            </Modal>
                            </div>
                            {this.state.currencies}
                        </Col>
                    </Row>

                </AdminLayout>
            </div>
        );
    }
}

export default Settings;
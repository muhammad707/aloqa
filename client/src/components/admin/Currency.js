import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import { Breadcrumb, Table, Form, Col, Button, Icon, Input, Modal, notification } from 'antd';
import Column from 'antd/lib/table/Column';
const FormItem = Form.Item;

class Currency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            ModalText: 'Пул бирлигини қўшиш',
            currencies: undefined
        }
        this.change = this.change.bind(this);
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    }

    change(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
    }

    componentWillMount() {
        this.fetchCurrencyList();
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
        return (
            <AdminLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Бош админстратор</Breadcrumb.Item>
                        <Breadcrumb.Item>Созламалар</Breadcrumb.Item>
                </Breadcrumb>
                <Col className="gutter-row" span={9} offset={2}>
                    <div style={{ margin: '30px'}}>
                        <Button type="primary" onClick={this.showModal}>
                        <Icon type="plus">
                        </Icon>
                            Валюта кўшиш
                        </Button>
                        <Modal title={this.state.ModalText}
                        visible={this.state.visible}
                        onOk={this.handleAdd}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleCancel}
                    footer = {[
                        <Button key="back" onClick={this.handleCancel}>Қайтиш</Button>,
                        <Button key="submit" type="primary" onClick={this.handleAdd}>Юбориш</Button>
                    ]}>
                            <Form>
                                <FormItem label="Валюта коди">
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
            </AdminLayout>
        );
    }

}

export default Currency;
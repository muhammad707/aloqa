import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import { Breadcrumb, Table, Form, Row, Col, Button, Icon, Input, Modal, notification } from 'antd';
import Column from 'antd/lib/table/Column';
const FormItem = Form.Item;

class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            roles: undefined,
            ModalText: "Рўл қўшиш",
            user_role: undefined
        }
        this.change = this.change.bind(this);
    }

    componentWillMount() {
        this.fetchRoleList();
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

    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    render() {
        return (
            <AdminLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Банк бош админстратор</Breadcrumb.Item>
                    <Breadcrumb.Item>Рўллар</Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={18}>
                <Col className="gutter-row" span={18} offset={2}>
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
                </Row>
            </AdminLayout>
        )
    }
}

export default Role;
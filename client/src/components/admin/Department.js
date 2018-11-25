import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Breadcrumb, Button, Table,notification, Icon, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import Column from 'antd/lib/table/Column';
const FormItem = Form.Item;

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: undefined,
            loading: false,
            visible: false,
            MFO: undefined,
            department: undefined
        }
        this.handleAdd = this.handleAdd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.change = this.change.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount(){ 
        this.fetchDepartments();
    }
    
    change(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
      }

    fetchDepartments = () => {
        this.setState({
            loading: true
        });

        axios.get('/admin/department/list', {
            headers: {
                Authorization: getJwt()
            }
        }).then(list => {
            console.log(list.data);
            const listItems = (
                <Table rowKey="id" dataSource={list.data.departments}>
                    <Column 
                        title="Тартиб раками" 
                        key="id" 
                        dataIndex="id" />
                    <Column 
                        title="МФО" 
                        key="MFO" 
                        dataIndex="MFO" />
                    <Column 
                        title="Филиаллар номлари"
                        key="department"
                        dataIndex="department" />
                </Table>
            );
            this.setState({
                departments: listItems,
                loading: false
            });
        }).catch(err => {
            this.setState({
                loading: false
            });
            notification["error"]({
                message: "Error"
            });
        });

    }

    showModal = () => {
        this.setState({
            visible: true
        });
    }

    handleAdd = () => {
        let formData = {};
        formData.MFO = this.state.MFO;
        formData.department = this.state.department;
        axios.post('/api/adddepartment', formData, {
            headers: {
                Authorization: getJwt()
            }
        }).then(res => {
            if(res.data.success) {
                notification["success"]({
                    message: res.data.message
                });
                this.fetchDepartments();
            } else {
                notification["error"]({
                    message: res.data.message
                })
            }
        }).catch(err => {
            console.log(err);
        });
        console.log(formData);
        this.setState({
            visible: false
        });
        this.fetchDepartments();

    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    render() {
        // const { getFieldDecorator } = this.props.form;
        const { loading} = this.state;
        return (
            <AdminLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Бош админстратор</Breadcrumb.Item>
                    <Breadcrumb.Item>Филиаллар</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ margin: '30px'}}>
                    <Button type="primary" onClick={this.showModal}>
                    <Icon type="plus">
                    </Icon>
                        Филиал кошиш
                    </Button>
                    <Modal title="Филиал кошиш"
                    visible={this.state.visible}
                    onOk={this.handleAdd}
                    onCancel={this.handleCancel}
                   footer = {[
                    <Button key="back" onClick={this.handleCancel}>Кайтиш</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleAdd}>Юбориш</Button>
                   ]}>
                        <Form>
                            <FormItem label="МФО">
                                <Input name="MFO" placeholder="МФО" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Филиал номи">
                                <Input name="department" placeholder="Филиал номи" onChange={e => this.change(e)} />
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
                {this.state.departments}
            </AdminLayout>
        );
    }
}

export default Department;
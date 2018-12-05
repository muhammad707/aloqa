import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Breadcrumb, Button, Table,notification, Icon, Modal, Form, Input, Popconfirm, Divider } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import Column from 'antd/lib/table/Column';
const FormItem = Form.Item;

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: undefined,
            confirmLoading: false,
            visible: false,
            MFO: undefined,
            department: undefined,
            id: undefined,
            url: "add",
            ModalText: "Кошиш"
        }
        this.handleAdd = this.handleAdd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.change = this.change.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onEdit = this.onEdit.bind(this);

        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount(){ 
        this.fetchDepartments();
    }

    onDelete(id) {
        axios.get('/admin/departments/delete/' + id, {
            headers: {
                Authorization: getJwt()
            }
        }).then(res => {
            if(res.data.success) {
                notification["success"]({
                    message:  res.data.message
                });
                this.fetchDepartments();
            }
        }).catch(err => {
            notification['error']({
                message: "Хатолик"
            });
        });
    }

    onEdit(data) {
        this.setState({
            MFO: data.MFO,
            department: data.department,
            ModalText: "Озгартириш",
            id: data.id,
            url: "update"
        });
        this.showModal();
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
                    <Column 
                        title="Бошкариш" 
                        key="action"
                        render={(text, record) => (
                            <div>
                                <Icon type="edit" onClick={() => this.onEdit(record)}/>
                                <Divider type="vertical"/>
                                <Popconfirm
                                    title="Уверен ли удалить продукт ?"
                                    onConfirm={() => {
                                        this.onDelete(record.id);
                                    }}
                                    okText="Да"
                                    cancelText="Нет">
                                    <Icon type="delete"/>
                                </Popconfirm>
                            </div>
                        )} /> 
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
        if(this.state.MFO && this.state.department) {
            this.setState({
                confirmLoading: true
            });
            let formData = {};
            formData.department_id = this.state.id;
            formData.MFO = this.state.MFO;
            formData.department = this.state.department;
            console.log(formData);
            axios.post('/admin/department/' + this.state.url, formData, {
                headers: {
                    Authorization: getJwt()
                }
            }).then(res => {
                if(res.data.success) {
                    this.setState({
                        MFO: "",
                        department: "",
                        confirmLoading: false
                    })
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
        } else {
            notification["error"]({
                message: "Хатолик",
                description: "Маьлумот етарли емас"
            });
        }
        

    }
    
    handleCancel = () => {
        this.setState({
            visible: false,
            ModalText: "Кошиш",
            url: "add",
            MFO: "",
            department: ""
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
                    <Modal title={this.state.ModalText}
                    visible={this.state.visible}
                    onOk={this.handleAdd}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                   footer = {[
                    <Button key="back" onClick={this.handleCancel}>Кайтиш</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleAdd}>Юбориш</Button>
                   ]}>
                        <Form>
                            <FormItem label="МФО">
                                <Input name="MFO" value={this.state.MFO} placeholder="МФО" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Филиал номи">
                                <Input name="department"  value={this.state.department} placeholder="Филиал номи" onChange={e => this.change(e)} />
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
import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Breadcrumb, Select,  Button, Table,notification, Icon, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import Column from 'antd/lib/table/Column';
const Option = Select.Option;
const FormItem = Form.Item;

class Operators extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operators: undefined,
            departments: [],
            roles: [],
            loading: false,
            confirmLoading: false,
            visible: false,
            visible2: false,
            firstName: undefined,
            lastName: undefined,
            middleName: undefined,
            MFO: undefined,
            branchId: undefined,
            roleId: undefined,
            username: undefined,
            password: undefined

        }
        // this.handleAdd = this.handleAdd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.change = this.change.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelect2 = this.handleSelect2.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    componentDidMount(){
        this.fetchDepartments();
        this.fetchRoles();
        this.fetchOperators();
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

    showModal2 = () => {
        this.setState({
            visible2: true
        });
    }

    handleSelect = (value) => {
        this.setState({
            branchId: value
        });
    }

    handleSelect2 = (value) => {
        this.setState({
            roleId: value
        });
    }


    fetchOperators = () => {
        this.setState({
            loading: true
        });

        axios.get('/admin/operators', {
            headers: {
                Authorization: getJwt()
            }
        }).then(list => {
            console.log(list.data);
            const listItems = (
                <Table rowKey="operator_id" dataSource={list.data}>
                    <Column 
                        title="Исм" 
                        key="firstName"
                        dataIndex="firstName" />
                    <Column 
                        title="Фамилия" 
                        key="lastName"
                        dataIndex="lastName" />
                    <Column 
                        title="Отасининг исми" 
                        key="middleName"
                        dataIndex="middleName" />
                    <Column 
                        title="МФО" 
                        key="MFO"
                        dataIndex="MFO" />
                    <Column 
                        title="Филиал номи" 
                        key="Branch"
                        dataIndex="Branch" />
                    <Column 
                        title="Бошкариш" 
                        key="action"
                        render =  { () => <Button onClick={this.showModal2} type="primary"><Icon type="edit"></Icon></Button> } /> 
                </Table>
            );
            this.setState({
                operators: listItems,
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

    fetchDepartments = () => {
        axios.get('/admin/department/list', {
            headers: {
                Authorization: getJwt()
            }
        }).then(list => {
            const data = list.data.departments.map(department => ({
                id: department.id,
                value: department.department
            }));
            this.setState({
                departments: data
            });
        });
    }

    fetchRoles = () => {
        axios.get('/admin/role', {
            headers: {
                Authorization: getJwt()
            }
        }).then(roles => {
            const data = roles.data.map(role => ({
                id: role.id,
                value: role.name
            }));
            this.setState({
                roles: data
            })
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false
        });
    }

    handleOk = () => {
        
        if(this.state.firstName &&
           this.state.lastName &&
           this.state.middleName &&
           this.state.branchId &&
           this.state.roleId &&
           this.state.username && 
           this.state.password) {
               this.setState({
                confirmLoading: true
               });
            let formData = {};
            formData.firstName = this.state.firstName;
            formData.lastName = this.state.lastName;
            formData.middleName = this.state.middleName;
            formData.branchId = this.state.branchId;
            formData.roleId = this.state.roleId;
            formData.username = this.state.username;
            formData.password = this.state.password;
            console.log(formData);
            
            axios.post('/admin/add', formData, {
                headers: {
                    Authorization: getJwt()
                }
            }).then(res => {
                console.log(res.data);
                if(res.data.success) {
                    notification["success"]({
                        message: res.data.message
                    });
                    this.fetchOperators();
                    this.setState({ loading: true });
                    setTimeout(() => {
                         this.setState({ loading: false, visible: false});
                    }, 3000);
                }
            })
            
        } else {
            notification["error"]({
                message: "Хатолик",
                description: "Маьлумот кам"
            })
        }
    }

    render() {
        // const { getFieldDecorator } = this.props.form;
        const { departments, roles } = this.state;
        const { loading} = this.state;
        return (
            <AdminLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Бош админстратор</Breadcrumb.Item>
                    <Breadcrumb.Item>Операторлар</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ margin: '30px'}}>
                    <Button type="primary" onClick={this.showModal}>
                    <Icon type="plus">
                    </Icon>
                    Оператор кошиш
                    </Button>
                    <Modal title="Оператор кошиш"
                    style={{ top: 20 }}
                    visible={this.state.visible}
                    onOk={this.handleAdd}
                    onCancel={this.handleCancel}
                   footer = {[
                    <Button key="back" onClick={this.handleCancel}>Кайтиш</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>Юбориш</Button>
                   ]}>
                    <Form>
                        <FormItem label="Исм">
                                <Input name="firstName" placeholder="Исм" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Фамилияси">
                                <Input name="lastName" placeholder="Фамилия" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Отасининг исми">
                                <Input name="middleName" placeholder="Отасининг исми" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="МФО">
                                <Select name="branchId" size="default" onChange={this.handleSelect}>
                                    {departments.map(d => <Option key={d.id}>{d.value}</Option> )}
                                </Select>
                            </FormItem>
                            <FormItem label="Логин">
                                <Input name="username" placeholder="Логин" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Парол">
                                <Input name="password" placeholder="Парол" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Роли">
                                <Select name="roleId" size="default" onChange={this.handleSelect2}>
                                    {roles.map(d => <Option key={d.id}>{d.value}</Option> )}
                                </Select>
                            </FormItem>
                            
                        </Form>
                    </Modal>
                </div>
                {this.state.operators}
            </AdminLayout>
        );
    }
}

export default Operators;
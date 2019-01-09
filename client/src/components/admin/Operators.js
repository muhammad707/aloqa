import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Breadcrumb, Select,  Button, Table,notification, Icon, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import Column from 'antd/lib/table/Column';
import '../../App.css';
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
            password: undefined,
            status: "1",
            modalText: "Оператор кошиш",
            url: "add",
            id: undefined, 
            searchName: '',
            searchRole: '',
            searchMFO: ''

        }
        this.handleCancel = this.handleCancel.bind(this);
        this.change = this.change.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelect2 = this.handleSelect2.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onEdit = this.onEdit.bind(this);
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

    handleSearchName = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchName: selectedKeys[0] });
      }

    handleResetName = clearFilters => () => {
        clearFilters();
        this.setState({ searchName: '' });
      }

    handleSearchRole = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchRole: selectedKeys[0] });
    }

    handleResetRole = clearFilters => () => {
        clearFilters();
        this.setState({ searchRole: '' });
    }

    handleSearchMFO = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchMFO: selectedKeys[0] });
        }
    
        handleResetMFO = clearFilters => () => {
            clearFilters();
            this.setState({ searchMFO: '' });
        }

    // onDelete(id) {
    //     axios.get('/admin/operators/delete/' + id, {
    //         headers: {
    //             Authorization: getJwt()
    //         }
    //     }).then(res => {
    //         console.log(res.data);
    //         if(res.data.success) {
    //             notification['success']({
    //                 message:  res.data.message
    //             });
    //             this.fetchOperators();
    //         } else {
    //             notification['error']({
    //                 message:  res.data.message
    //             });
    //         }
    //     }).catch(err => {
    //         notification['error']({
    //             message: "Хатолик"
    //         });
    //     })
    // }

    onEdit(data) {
        console.log(data);
        this.setState({
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            MFO: data.MFO,
            username: data.username,
            url: "update",
            modalText: "Озгартириш",
            id: data.operator_id
        });
        this.showModal();
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
                        key="fullName"
                        dataIndex="fullName"
                        filterDropdown = {({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                            <div className="custom-filter-dropdown">
                                <Input
                                    ref={ele => this.searchInput = ele}
                                    placeholder="Ф.И.Ш бўйича қидириш"
                                    value={selectedKeys[0]}
                                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={this.handleSearchName(selectedKeys, confirm)}
                                />
                                <Button type="primary" onClick={this.handleSearchName(selectedKeys, confirm)}>Поиск</Button>
                                <Button onClick={this.handleResetName(clearFilters)}>Сброс</Button>
                            </div>
                        )}
                        filterIcon={filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}}/>}
                        onFilter={(value, record) => record.fullName ? record.fullName.toLowerCase().includes(value.toLowerCase()) : record.fullName}
                        onFilterDropdownVisibleChange={(visible) => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        }}
                        render = {(fullName) => {
                            const {searchName} = this.state;
                            console.log(fullName);
                            return searchName ? (
                                <span>
                                    {fullName.split(new RegExp(`(${searchName})`, 'gi')).map((fragment, i) => (
                                    fragment.toLowerCase() === searchName.toLowerCase()
                                        ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                                    ))}
                                </span>
                            ): fullName;
                        }} />
                    <Column 
                        title="МФО" 
                        key="MFO"
                        dataIndex="MFO"
                        filterDropdown = {({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                            <div className="custom-filter-dropdown">
                                <Input
                                    ref={ele => this.searchInput = ele}
                                    placeholder="МФО бўйича қидириш"
                                    value={selectedKeys[0]}
                                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={this.handleSearchMFO(selectedKeys, confirm)}
                                />
                                <Button type="primary" onClick={this.handleSearchMFO(selectedKeys, confirm)}>Поиск</Button>
                                <Button onClick={this.handleResetMFO(clearFilters)}>Сброс</Button>
                            </div>
                        )}
                        filterIcon={filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}}/>}
                        onFilter={(value, record) => record.MFO ? record.MFO.toLowerCase().includes(value.toLowerCase()) : record.MFO}
                        onFilterDropdownVisibleChange={(visible) => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        }} 
                        render = {(MFO) => {
                            const {searchMFO} = this.state;
                            console.log(MFO);
                            return MFO ? (
                                <span>
                                    {MFO.split(new RegExp(`(${searchMFO})`, 'gi')).map((fragment, i) => (
                                    fragment.toLowerCase() === searchMFO.toLowerCase()
                                        ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                                    ))}
                                </span>
                            ): MFO;
                        }} />
                    <Column 
                        title="Филиал номи"
                        key="Branch"
                        dataIndex="Branch" />
                    <Column 
                        title="Рўли" 
                        key="role"
                        dataIndex="role"
                        filterDropdown = {({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                            <div className="custom-filter-dropdown">
                                <Input
                                    ref={ele => this.searchInput = ele}
                                    placeholder="Логин бўйича қидириш"
                                    value={selectedKeys[0]}
                                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={this.handleSearchRole(selectedKeys, confirm)}
                                />
                                <Button type="primary" onClick={this.handleSearchRole(selectedKeys, confirm)}>Поиск</Button>
                                <Button onClick={this.handleResetRole(clearFilters)}>Сброс</Button>
                            </div>
                        )}
                        filterIcon={filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}}/>}
                        onFilter={(value, record) => record.role ? record.role.toLowerCase().includes(value.toLowerCase()) : record.role}
                        onFilterDropdownVisibleChange={(visible) => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        }} 
                        render = {(username) => {
                            const {searchRole} = this.state;
                            console.log(username);
                            return searchRole ? (
                                <span>
                                    {username.split(new RegExp(`(${searchRole})`, 'gi')).map((fragment, i) => (
                                    fragment.toLowerCase() === searchRole.toLowerCase()
                                        ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                                    ))}
                                </span>
                            ): username;
                        }}/>
                    <Column 
                        title="Бошкариш" 
                        key="action"
                        render={(text, record) => (
                            <div>
                                <Icon type="edit" onClick={() => this.onEdit(record)}/>
                            </div>
                        )} /> 
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
            const data = list.data.result.map(department => ({
                id: department.department_id,
                value: department.department,
                status: department.status
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
            visible: false,
            firstName: "",
            lastName: "",
            middleName: "",
            username: "",
            modalText: "Кушиш",
            url: "add"
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
            formData.operator_id = this.state.id;
            formData.firstName = this.state.firstName;
            formData.lastName = this.state.lastName;
            formData.middleName = this.state.middleName;
            formData.branchId = this.state.branchId;
            formData.roleId = this.state.roleId;
            formData.username = this.state.username;
            formData.password = this.state.password;
            formData.status = this.state.status;
            console.log(formData);
            
            axios.post('/admin/operators/' + this.state.url, formData, {
                headers: {
                    Authorization: getJwt()
                }
            }).then(res => {
                console.log(res.data);
                if(res.data.success) {
                    this.setState({ 
                        loading: true,
                        firstName: "",
                        lastName: "",
                        middleName: "",
                        username: "",
                        password: "",
                        url: "add"
                    });
                    notification["success"]({
                        message: res.data.message
                    });
                   this.fetchOperators();
                }
            });
            this.setState({
                visible: false
            });
            this.fetchOperators();
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
                    <Modal title={this.state.modalText}
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
                                <Input name="firstName" value = {this.state.firstName} placeholder="Исм" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Фамилияси">
                                <Input name="lastName" value={this.state.lastName} placeholder="Фамилия" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Отасининг исми">
                                <Input name="middleName" value={this.state.middleName} placeholder="Отасининг исми" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="МФО">
                                <Select name="branchId" size="default" onChange={this.handleSelect}>
                                    {departments.map(d => <Option key={d.id}>{d.value}</Option> )}
                                </Select>
                            </FormItem>
                            <FormItem label="Логин">
                                <Input name="username" value={this.state.username} placeholder="Логин" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem label="Парол">
                                <Input name="password" value={this.state.password} placeholder="Парол" onChange={e => this.change(e)} />
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

export default Form.create()(Operators);
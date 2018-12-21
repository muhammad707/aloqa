import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Breadcrumb,  Button, Table, Icon, Modal, Form, Input, Row, Col } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import Column from 'antd/lib/table/Column';
const FormItem = Form.Item;

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: undefined,
            visible: false,
            transactions2: undefined,
            searchSenderByName: '',
            searchByDepartment: '',
            searchByReceiverName: '',
            searchReceiveDepartment: '',
            filteredInfo: null,
            sortedInfo: null
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onView = this.onView.bind(this);
    }

    componentDidMount() {
        this.fetchTransactions();
    }
    showModal = () => {
        this.setState({
            visible: true
        });
    }

    handleSearchSenderByName = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchSenderByName: selectedKeys[0] });
    }

    handleResetSenderByName = clearFilters => () => {
        clearFilters();
        this.setState({ searchSenderByName: '' });
    }

    handleSearchSendDepartment = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchByDepartment: selectedKeys[0] });
    }

    handleResetSendDepartment = clearFilters => () => {
        clearFilters();
        this.setState({ searchByDepartment: '' });
    }

    handleSearchByReceiverName = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchByReceiverName: selectedKeys[0] });
    }

    handleResetByReceiverName = clearFilters => () => {
        clearFilters();
        this.setState({ searchByReceiverName: '' });
    }

    handleSearchByReceiveDepartment = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchReceiveDepartment: selectedKeys[0] });
    }

    handleResetByReceiveDepartment = clearFilters => () => {
        clearFilters();
        this.setState({ searchReceiveDepartment: '' });
    }

    setAgeSort = () => {
        this.setState({
          sortedInfo: {
            order: 'descend',
            columnKey: 'age',
          },
        });
    }

    clearFilters = () => {
        this.setState({ filteredInfo: null });
    }
    
    clearAll = () => {
    this.setState({
        filteredInfo: null,
        sortedInfo: null,
        });
    }

    handleChange = ( filters, sorter) => {
        // console.log('Various parameters', pagination, filters, sorter);
        this.setState({
          filteredInfo: filters,
          sortedInfo: sorter,
        });
    }

    onView(data) {
        console.log(data);
        this.setState({
            transactions_id: data.transaction,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
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
            status: data.status,
            bank_profit: data.bank_profit
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
        axios.get('/admin/transactions', {
            headers: {
                Authorization: getJwt()
            }
        }).then(transactions => {
            console.log(transactions.data);
            this.setState({
                transactions2: transactions.data,
                filteredInfo: transactions.data,
                // sortedInfo: transactions.data
            });
            const listItems = (
                <Table rowKey="transaction" dataSource={transactions.data}>
                    <Column 
                         title="Тартиб раками"
                         key="transaction"
                         dataIndex="transaction" />
                    <Column 
                         title="Юборувчи"
                         key="sender_fullname"
                         dataIndex="sender_fullname"
                         filterDropdown = {({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                            <div className="custom-filter-dropdown">
                                <Input
                                    ref={ele => this.searchInput = ele}
                                    placeholder="Ф.И.Ш бўйича қидириш"
                                    value={selectedKeys[0]}
                                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={this.handleSearchSenderByName(selectedKeys, confirm)}
                                />
                                <Button type="primary" onClick={this.handleSearchSenderByName(selectedKeys, confirm)}>Поиск</Button>
                                <Button onClick={this.handleResetSenderByName(clearFilters)}>Сброс</Button>
                            </div>
                        )}
                        filterIcon={filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}}/>}
                        onFilter={(value, record) => record.sender_fullname ? record.sender_fullname.toLowerCase().includes(value.toLowerCase()) : record.sender_fullname}
                        onFilterDropdownVisibleChange={(visible) => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        }} 
                        render = {(fullName) => {
                            const {searchSenderByName} = this.state;
                            // console.log(fullName);
                            return searchSenderByName ? (
                                <span>
                                    {fullName.split(new RegExp(`(${searchSenderByName})`, 'gi')).map((fragment, i) => (
                                    fragment.toLowerCase() === searchSenderByName.toLowerCase()
                                        ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                                    ))}
                                </span>
                            ): fullName;
                        }} />
                    <Column 
                         title="Юборилган филиал"
                         key="send_department"
                         dataIndex="send_department"
                         filterDropdown = {({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                            <div className="custom-filter-dropdown">
                                <Input
                                    ref={ele => this.searchInput = ele}
                                    placeholder="Юборилган филиал бўйича қидириш"
                                    value={selectedKeys[0]}
                                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={this.handleSearchSendDepartment(selectedKeys, confirm)}
                                />
                                <Button type="primary" onClick={this.handleSearchSendDepartment(selectedKeys, confirm)}>Поиск</Button>
                                <Button onClick={this.handleResetSendDepartment(clearFilters)}>Сброс</Button>
                            </div>
                        )}
                        filterIcon={filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}}/>}
                        onFilter={(value, record) => record.send_department ? record.send_department.toLowerCase().includes(value.toLowerCase()) : record.send_department}
                        onFilterDropdownVisibleChange={(visible) => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        }} 
                        render = {(fullName) => {
                            const {searchByDepartment} = this.state;
                            // console.log(fullName);
                            return searchByDepartment ? (
                                <span>
                                    {fullName.split(new RegExp(`(${searchByDepartment})`, 'gi')).map((fragment, i) => (
                                    fragment.toLowerCase() === searchByDepartment.toLowerCase()
                                        ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                                    ))}
                                </span>
                            ): fullName;
                        }} />
                    <Column 
                         title="Суммаси"
                         key="send_amount_in_number"
                         dataIndex="send_amount_in_number"
                        //  defaultSortOrder='descend'
                         sorter={(a, b) => a.send_amount_in_number - b.send_amount_in_number} />
                    <Column 
                         title="Олувчи"
                         key="receiver_fullname"
                         dataIndex="receiver_fullname"
                         filterDropdown = {({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                            <div className="custom-filter-dropdown">
                                <Input
                                    ref={ele => this.searchInput = ele}
                                    placeholder="Олувчи Ф.И.Ш бўйича қидириш"
                                    value={selectedKeys[0]}
                                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={this.handleSearchByReceiverName(selectedKeys, confirm)}
                                />
                                <Button type="primary" onClick={this.handleSearchByReceiverName(selectedKeys, confirm)}>Поиск</Button>
                                <Button onClick={this.handleResetByReceiverName(clearFilters)}>Сброс</Button>
                            </div>
                        )}
                        filterIcon={filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}}/>}
                        onFilter={(value, record) => record.receiver_fullname ? record.receiver_fullname.toLowerCase().includes(value.toLowerCase()) : record.receiver_fullname}
                        onFilterDropdownVisibleChange={(visible) => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        }}
                        render = {(fullName) => {
                            const {searchByReceiverName} = this.state;
                            // console.log(fullName);
                            return searchByReceiverName ? (
                                <span>
                                    {fullName.split(new RegExp(`(${searchByReceiverName})`, 'gi')).map((fragment, i) => (
                                    fragment.toLowerCase() === searchByReceiverName.toLowerCase()
                                        ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                                    ))}
                                </span>
                            ): fullName;
                        }}  />
                    <Column 
                         title="Пул юборилган филиал"
                         key="receive_department"
                         dataIndex="receive_department"
                         filterDropdown = {({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                            <div className="custom-filter-dropdown">
                                <Input
                                    ref={ele => this.searchInput = ele}
                                    placeholder="Олувчи Ф.И.Ш бўйича қидириш"
                                    value={selectedKeys[0]}
                                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={this.handleSearchByReceiveDepartment(selectedKeys, confirm)}
                                />
                                <Button type="primary" onClick={this.handleResetByReceiveDepartment(selectedKeys, confirm)}>Поиск</Button>
                                <Button onClick={this.handleResetByReceiveDepartment(clearFilters)}>Сброс</Button>
                            </div>
                        )}
                        filterIcon={filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}}/>}
                        onFilter={(value, record) => record.receive_department ? record.receive_department.toLowerCase().includes(value.toLowerCase()) : record.receive_department}
                        onFilterDropdownVisibleChange={(visible) => {
                            if (visible) {
                                setTimeout(() => {
                                    this.searchInput.focus();
                                });
                            }
                        }}
                        render = {(fullName) => {
                            const {searchReceiveDepartment} = this.state;
                            // console.log(fullName);
                            return searchReceiveDepartment ? (
                                <span>
                                    {fullName.split(new RegExp(`(${searchReceiveDepartment})`, 'gi')).map((fragment, i) => (
                                    fragment.toLowerCase() === searchReceiveDepartment.toLowerCase()
                                        ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                                    ))}
                                </span>
                            ): fullName;
                        }} />
                    <Column 
                         title="Статус"
                         key="status"
                         dataIndex="status"
                         filters={[
                            { text: 'создан', value: 'создан' },
                            { text: 'оплачен', value: 'оплачен' }
                         ]}
                        //  filteredValue={this.state.filteredInfo.status ? this.state.filteredInfo.status : null }
                        onFilter= {(value, record) => record.status.indexOf(value) === 0}
                        //  sorter={(a, b) => a.status.length - b.status.length}
                        //  sortOrder={this.state.sortedInfo.columnKey === 'name' && this.state.sortedInfo.status}
                         />
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
    }

   

    render() {
        let { visible, sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [{
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'оплачен', value: 'оплачен' },
                { text: 'создан', value: 'создан' },
              ],
            filteredValue: filteredInfo.status || null,
            onFilter: (value, record) => record.status.includes(value),
            sorter: (a, b) => a.status.length - b.status.length,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        }]
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
                                    <Input value={this.state.sender_passport_date_of_issue} placeholder="Берилган вакти" disabled/>
                                </FormItem>
                                <FormItem {...this.formItemLayout} label="Амал килиш муддати">
                                    <Input value={this.state.sender_passport_date_of_expiry} placeholder="Амал килиш муддати" disabled/>
                                </FormItem>
                                <FormItem label="Ким томонидан берилган">
                                    <Input value={this.state.sender_passport_place_of_given} disabled placeholder="Ким томонидан берилган" />
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
                                <FormItem  label="Качон юборилган">
                                <Input name="" value={this.state.createdAt} placeholder="" disabled/>
                                </FormItem>
                                <FormItem  label="Юборилган сумма">
                                <Input name="" value={this.state.send_amount_in_number} placeholder="" disabled/>
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
                                    <Input value={this.state.receiver_passport_date_of_issue} placeholder="Берилган вакти" disabled/>
                                </FormItem>
                                <FormItem label="Амал килиш муддати">
                                    <Input value={this.state.receiver_passport_date_of_expiry} placeholder="Амал килиш муддати" disabled/>
                                </FormItem>
                                <FormItem label="Ким томонидан берилган">
                                    <Input value={this.state.receiver_passport_place_of_given} placeholder="Ким томонидан берилган" disabled/>
                                </FormItem>
                                <FormItem  label="Манзили">
                                    <Input value={this.state.receiver_permanent_address} placeholder="Манзили" disabled/>
                                </FormItem>
                                <FormItem  label="Телефон рақами">
                                    <Input value={this.state.receiver_phone_number} placeholder="Телефон рақами" disabled/>
                                </FormItem>
                                <FormItem label="Хисоб раками">
                                    <Input value={this.state.receiver_account_number} placeholder="Хисоб раками" disabled/>
                                </FormItem>
                                <FormItem  label="Кабул килинган пул шакли">
                                    <Input value={this.state.receive_paymentMethod} disabled/>
                                </FormItem>
                                <FormItem  label="Кабул килинган пул бирлиги">
                                    <Input value={this.state.receive_currency} disabled/>
                                </FormItem>
                                <FormItem  label="Качон юборилган">
                                <Input name="" value={this.state.updatedAt} placeholder="" disabled/>
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <FormItem  label="Тартиб раками">
                                <Input name="" value={this.state.transactions_id}  disabled/>
                            </FormItem>
                            <FormItem label="Юборилган филиал">
                                <Input value={this.state.send_department} placeholder="Пасспорт маьлумотлари" disabled/>
                            </FormItem>
                            <FormItem label="Кабул килган филиал">
                                <Input value={this.state.receive_department} placeholder="Кабул килган филиал" disabled/>
                            </FormItem>
                            <FormItem  label="Статус">
                                <Input value={this.state.status} placeholder="Статус" disabled/>
                            </FormItem>
                            <FormItem  label="Банк фойдаси">
                                <Input value={this.state.bank_profit} placeholder="Банк фойдаси" disabled/>
                            </FormItem>
                        </Col>
                       </Row>
                    </Modal>

            </AdminLayout>
        );
    }
}

export default Transactions;
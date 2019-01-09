import React, { Component } from 'react';
import AdminLayout from '../layout/AdminLayout';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
import { Table, Breadcrumb, notification, Tooltip, Button, Icon, Modal, Form, Input } from 'antd';
import Column from 'antd/lib/table/Column';
const FormItem = Form.Item;
function formatNumber(value) {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = ` ${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}%` : ''}`;
  }

class Commision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            commission: 1,
            commissions: undefined
        }
        this.handleAdd = this.handleAdd.bind(this);
        // this.handleCancel = this.handleCancel.bind(this);
        // this.change = this.change.bind(this);
        // this.onDelete = this.onDelete.bind(this);
        // this.onEdit = this.onEdit.bind(this);
    }

    componentWillMount(){ 
        this.fetchCommision();
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
    onChange = e => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
          this.setState({
            [e.target.name]: e.target.value
          });
        }
       }

    change(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
      }

      fetchCommision = () => {
          axios.get('/admin/commission/fetch', {
              headers: {
                  Authorization: getJwt()
              }
          }).then(res => {
              const listItems = (
                <Table rowKey="id" dataSource={res.data}>
                <Column 
                    title="Банк хизмат хақи (фоизда)" 
                    key="commissionRate" 
                    dataIndex="commissionRate" />
                <Column 
                    title="Ўзгартирилган санаси" 
                    key="updatedAt" 
                    dataIndex="updatedAt" />
            </Table>
              );
              this.setState({
                commissions: listItems,
                loading: false
              })
          })
      }

    showModal = () => {
        this.setState({
            visible: true
        });
    }

    handleAdd = () => {
        if(this.state.commission) {
            let formData = {};
            formData.value = this.state.commission;
            // console.log(formData);
            axios.post('/admin/commision/update', formData, {
                headers: {
                    Authorization: getJwt()
                }
            }).then((res) => {
                if(res.data.success) {
                    notification['success']({
                        message: res.data.message
                    });
                }
                this.fetchCommision();
            }).catch(err => {
                console.log(err);
            });
            this.setState({
                visible: false
            })
        } else {
            notification['error']({
                message: "Маълумотлар кам"
            });
        }
    }
    
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    render() {
        const { loading, commission } = this.state;
        const title = commission ? (
            <span className="numeric-input-title">
              {commission !== '-' ? formatNumber(commission) : '-'}
            </span>
          ) : 'Нарх киритинг';
        return (
            <AdminLayout>
                 <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Банк бош админстратори</Breadcrumb.Item>
                        <Breadcrumb.Item>Банк хизмат ҳақлари</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ margin: '30px'}}>
                    <Button type="primary" onClick={this.showModal}>
                    <Icon type="plus">
                    </Icon>
                        Банк хизмат хақини янгилаш
                    </Button>
                    <Modal title={this.state.ModalText}
                    visible={this.state.visible}
                    onOk={this.handleAdd}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                   footer = {[
                    <Button key="back" onClick={this.handleCancel}>Бекор қилиш</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleAdd}>Ўзгартириш</Button>
                   ]}>
                        <Form>
                            
                            <FormItem label="Миқдори">
                            <Tooltip 
                                trigger={['focus']}
                                title={title}
                                placement="topLeft"
                                overlayClassName="numeric-input">
                                <Input size="default" value={this.state.commission} name="commission" placeholder="Пул ўтказмасининг миқдори (сон билан)" id="success" onChange={e => this.onChange(e)} />
                            </Tooltip>
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
                {this.state.commissions};
            </AdminLayout>
        );
    }
}

export default Commision;
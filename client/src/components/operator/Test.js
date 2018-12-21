import React, { Component } from 'react';
import axios from 'axios';
import DefaultLayout from '../layout/Default';
import { getJwt } from '../../helpers/jwt';
import CurrencyFormat from 'react-currency-format';
import { Button, Breadcrumb, Row, Col, Form, Input, Select } from 'antd';
import './Input.css';
const FormItem = Form.Item;
const Option = Select.Option;
class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: undefined,
            phone_number: undefined,
            accountNumber: undefined,
            dateOfSend: undefined
        }
    }
    change(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
    }

    handleAdd = () => {
        let formData = {};
        formData.amount = this.state.amount;
        formData.dateOfSend = this.state.dateOfSend;
        var date = Date.parse(formData.dateOfSend);
        
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <DefaultLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div  style={{ marginLeft: '50px', background: '#fff' }}>
                    <h2>Пул ўтказмасини юбориш</h2>
                    <Form id="form" onSubmit={this.handleSubmit}>
                        <Row gutter={21}>
                            <Col className="gutter-row" span={7}>
                                <FormItem label="Фамилияси">
                                {getFieldDecorator('lastName', {
                                    rules: [{ required: true, message: 'Please input lastname' }]
                                }) (
                                    <input className="input" size="large" name="lastName" placeholder="Фамилияси" />
                                )}   
                                </FormItem>   
                            </Col>
                            <Col className="gutter-row" span={7}>
                                <FormItem label="Исми">
                                    <input className="input" size="large" placeholder="Исми" name="firstName" />
                                </FormItem>  
                            </Col>
                            <Col className="gutter-row" span={7}>
                                <FormItem label="Отасининг исми">
                                    <input className="input" size="large" placeholder="Отасининг исми" name="middleName" />
                                </FormItem>  
                            </Col>
                        </Row>
                        <Row gutter={21}>
                            <Col className="gutter-row" span={4}>
                                <FormItem label="Паспорт серияси">
                                    <input className="input" size="large" style={{ width: '100%'}} thousandSeparator={true} name="sender_passport_series" onChange={e => this.change(e)} />
                                </FormItem>   
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <FormItem label="Паспорт номери">
                                    <CurrencyFormat placeholder="Паспорт номери" className="input" style={{ width: '100%'}} maxLength="7" name="sender_passport_number" onChange={e => this.change(e)} />
                                </FormItem>   
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem label="Берилган вақти">
                                    <CurrencyFormat className="input" style={{ width: '100%'}} name="sender_passport_date_of_issue" format="##.##.####" placeholder="DD.MM.YYYY" mask={['D', 'D','M', 'M', 'Y', 'Y', 'Y', 'Y']} onChange={e => this.change(e)}/> <br />
                                </FormItem>   
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem label="Амал қилиш муддати">
                                <CurrencyFormat className="input" style={{ width: '100%'}} name="sender_passport_date_of_expiry" format="##.##.####" placeholder="DD.MM.YYYY" mask={['D', 'D','M', 'M', 'Y', 'Y', 'Y', 'Y']} onChange={e => this.change(e)}/> <br />
                                </FormItem>   
                            </Col>
                        </Row>
                        <Row gutter={21}>
                            <Col span={13}>
                                <FormItem label="Паспорт берилган жойи">
                                    <input className="input" size="large" placeholder="Паспорт берилган жойи" style={{ width: '100%'}} thousandSeparator={true} name="sender_passport_place_of_given" onChange={e => this.change(e)} />
                                </FormItem> 
                            </Col>
                            <Col span={8}>
                                <FormItem label="Телефон рақами">
                                <CurrencyFormat className="input" name="sender_phone_number" style={{ width: '100%' }} format="+998 (##) ###-####" mask="_" onChange={e => this.change(e)} placeholder="+998 ( __ ) ___-____" />
                                </FormItem> 
                            </Col>
                        </Row>
                        <Row gutter={21}>
                            <Col span={21}>
                                <FormItem label="Яшаш манзили">
                                    <input className="input" size="large" placeholder="Яшаш манзили" name="sender_address" />
                                </FormItem> 
                            </Col>
                        </Row>
                        <Row gutter={21}>
                            <Col span={21}>
                                <FormItem label="Ҳисобварақ рақами">
                                    <CurrencyFormat className="input" name="sender_account_number" placeholder="Ҳисобварақ рақами" format="##### ### # ######## ###" mask="_" style={{ width: '100%'}} name="amount" onChange={e => this.change(e)} />
                                </FormItem> 
                            </Col>
                        </Row>
                        <Row gutter={21}>
                            <Col span={10}>
                                <FormItem label="Пул ўтказмасининг тури">
                                    <Select size="large" name="send_payment_method" onChange={this.handleSelect2}>
                                        {/* {send_payment_methods.map(d => <Option key={d.id}>{d.value}</Option> )} */}
                                        <Option key="1">UZS</Option>
                                        <Option key="2">USD</Option>
                                    </Select>
                                </FormItem> 
                            </Col>
                            <Col span={11}>
                                <FormItem label="Топширилган пул шакли">
                                    <Select size="large" name="send_payment_method" onChange={this.handleSelect2}>
                                        {/* {send_payment_methods.map(d => <Option key={d.id}>{d.value}</Option> )} */}
                                        <Option key="1">Нақд</Option>
                                        <Option key="2">Нақдмас</Option>
                                    </Select>
                                </FormItem> 
                            </Col>
                        </Row>
                        <Row gutter={21}>
                            <Col span={10}>
                                <FormItem label="Пул ўтказмасининг миқдори (сон билан)">
                                    <CurrencyFormat className="input" thousandSeparator={true} placeholder="Пул ўтказмасининг миқдори (сон билан)" style={{ width: '100%'}} name="amount" onChange={e => this.change(e)} />
                                </FormItem> 
                            </Col>
                            <Col span={11}>
                                <FormItem label="Пул ўтказмасининг миқдори (сўз билан)">
                                    <input className="input" size="large" placeholder="Пул ўтказмасининг миқдори (сўз билан)" style={{ width: '100%'}} name="amount" onChange={e => this.change(e)} />
                                </FormItem> 
                            </Col>
                        </Row>
                        <Button htmlType="submit" type="primary" >Send</Button>
                    </Form>
                    
                    <br />
                    
                </div>
                
            </DefaultLayout>
        )
    }
}

export default Form.create()(Test);
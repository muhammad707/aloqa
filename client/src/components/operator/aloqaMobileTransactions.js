import React, { Component } from 'react';
import DefaultLayout from '../layout/Default';
import axios from 'axios';
import CurrencyFormat from 'react-currency-format';
import './Input.css';
import { Breadcrumb,
        Row, 
        Col, 
        Form, 
        Input, 
        Button, 
        message, 
        Table,
        Icon,
        Modal,
        DatePicker, 
        Select,
        notification
         } from 'antd';
import Column from 'antd/lib/table/Column';
import { getJwt } from '../../helpers/jwt';
const FormItem = Form.Item;
const Option = Select.Option;

class AloqaMobileTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            isLoading: false,
            secretCode: undefined,
            mobileTransactions: undefined,
            secretCode: undefined,
            sender_fullName: undefined,
            sender_cardNumber: undefined,
            send_amount_in_number: undefined,
            createdAt: undefined,
            status: undefined,
            receive_department: undefined,
            receiver_firstName: undefined,
            receiver_lastName: undefined,
            receiver_middleName: undefined,
            receiver_passport_series: undefined,
            receiver_passport_number: undefined,
            receiver_passport_date_of_issue: undefined,
            receiver_passport_date_of_expiry: undefined,
            receiver_passport_place_of_given: undefined,
            receiver_permanent_address: undefined,
            receiver_phone_number: undefined,
            receiver_account_number: undefined,
            receive_currency_types: [],
            receive_currency_type: undefined,
            receive_payment_methods: [],
            receive_payment_method: undefined
        }
        this.change = this.change.bind(this);
    }

    formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
        },
        wrapperCol: {
                xs: { span: 24 },
                sm: { span: 17 },
            },
        }; 
    showModal = () => {
        this.setState({
            visible: true
        })
    } 

    handleCancel = () => {
        this.setState({ visible: false })
    }
        
    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { secretCode } = this.state;
        let that = this;
        that.setState({
            isLoading: true
        });

        axios.get('/api/aloqamobile/' + this.state.secretCode,{
            headers: {
                Authorization: getJwt()
            }
        }).then(res => {
            this.setState({
                fullName: res.data.transaction[0].sender_fullName,
                send_amount_in_number: res.data.transaction[0].send_amount_in_number,
                sender_cardNumber: res.data.transaction[0].sender_cardNumber,
                createdAt: res.data.transaction[0].createdAt,
                status: res.data.transaction[0].status
            })
            const listItem = (
                <Table rowKey ="transaction_id" dataSource={res.data.transaction} >
                    <Column 
                        title="Ф.И.Ш"
                        key="sender_fullName"
                        dataIndex="sender_fullName" />
                    <Column 
                        title="Жўнатма микдори"
                        key="send_amount_in_number"
                        dataIndex="send_amount_in_number" />
                    <Column 
                        title="Карта рақами"
                        key="sender_cardNumber"
                        dataIndex="sender_cardNumber" />
                    <Column 
                        title="Статус"
                        key="status"
                        dataIndex="status" />
                    <Column 
                        title="Қабул қилиш" 
                        key="action"
                        render={() => (
                            <div>
                                <Button disabled={this.state.status === 'оплачен' ? true : false} onClick={() => this.showModal()}>
                                    <Icon  type="edit"/>
                                </Button>
                            </div>
                        )} />
                </Table>
            );
            this.setState({
                mobileTransactions: listItem
            })
        }, () => {
            console.log(this.state.transaction);
        })
    }

    handleOk = (e) => {
        e.preventDefault();
        if(this.state.receiver_firstName &&
           this.state.receiver_lastName &&
           this.state.receiver_middleName &&
           this.state.receiver_passport_series &&
           this.state.receiver_passport_number &&
           this.state.receiver_passport_date_of_issue &&
           this.state.receiver_passport_date_of_expiry &&
           this.state.receiver_passport_place_of_given &&
           this.state.receiver_phone_number && 
           this.state.receiver_permanent_address &&
           this.state.receiver_account_number
           ) {
                let formData = {};
                formData.receiver_fullName = `${this.state.receiver_lastName} ${this.state.receiver_firstName} ${this.state.receiver_middleName}`;
                formData.receiver_passport_series = this.state.receiver_passport_series;
                formData.receiver_passport_number = this.state.receiver_passport_number;
                formData.receiver_passport_date_of_issue = this.state.receiver_passport_date_of_issue;
                formData.receiver_passport_date_of_expiry = this.state.receiver_passport_date_of_expiry;
                formData.receiver_passport_place_of_given = this.state.receiver_passport_place_of_given;
                formData.receiver_account_number = this.state.receiver_account_number;
                formData.receiver_phone_number = this.state.receiver_phone_number;
                formData.receiver_permanent_address = this.state.receiver_permanent_address;
                console.log(formData);
           } else {
               notification['error']({
                   message: 'Маълумот етарли эмас'
               })
           }
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, loading } = this.state;
        return (
            <DefaultLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Оператор</Breadcrumb.Item>
                <Breadcrumb.Item>AloqaMobile орқали амалга оширилган ўтказмани излаш</Breadcrumb.Item>
                </Breadcrumb>
                <h2 style={{ textAlign: 'center'}}>Пул ўтказмасини излаш (AloqaMobile)</h2>
                <Form onSubmit = {(e) => this.handleSubmit(e)}>
                        <Row gutter={18}>
                            <Col span={14} offset={2}>
                                <FormItem {...this.formItemLayout }
                                    label="Махсус код">
                                     {getFieldDecorator('secretCode', {
                                         rules: [{ required: true, message: 'Махсус кодни киритинг', whitespace: true }],
                                      })(
                                        <Input placeholder="Махсус код" name="secretCode" size="large" onChange={e => this.change(e)}/>
                                        )}
                                 </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem>
                                    <Button 
                                        type="primary"  
                                        htmlType="submit" 
                                        size="large" 
                                        loading={this.state.loading}
                                        style={{ float: 'right' }}>
                                        Ўтказмани излаш
                                        </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    {this.state.mobileTransactions} 
                    <Modal 
                    title={`Жўнатмани кабул килиш (${this.state.createdAt})`}
                    visible={visible}
                    width={1300}
                    centered
                   onOk = { this.handleOk} 
                   onCancel = { this.handleCancel} 
                   footer = {[
                    <Button key="back" onClick={this.handleCancel}>Бекор қилиш</Button>,
                    <Button htmlType="submit" key="submit" type="primary" loading={loading} >Қабул қилиш</Button>
                   ]}>
                    <Row  gutter={18}>
                        <Col className="gutter-row" span={10}>
                           <Form onSubmit={(e) => this.handleSubmit(e)}>
                               <FormItem {...this.formItemLayout} label="Махсус код">
                                    <input className="input" name="" value={this.state.secretCode}  disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Ф.И.Ш">
                                    <input className="input" name="receiver_fullname" value={this.state.fullName} placeholder="Ф.И.Ш" disabled />
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Пул микдори">
                                    <CurrencyFormat thousandSeparator={true} className="input" value={this.state.send_amount_in_number} placeholder="Пул микдори" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Ҳисобварақ рақами">
                                    <input className="input" value={this.state.sender_cardNumber} placeholder="Ҳисобварақ рақами" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Қачон юборилган">
                                    <input className="input" value={this.state.createdAt} placeholder="Пул бирлиги" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Статус">
                                    <input className="input" value={this.state.status} disabled/>
                               </FormItem>
                           </Form>
                        </Col>
                        <Col className="gutter-row" span={13}>
                        <Form>
                            <FormItem {...this.formItemLayout} hasFeedback validateStatus="success"  label="Фамилияси">
                                <Input  className="input" name="receiver_lastName" id="success" placeholder="Олучининг фамилияси" onChange={e => this.change(e)}/> 
                            </FormItem>
                            <FormItem {...this.formItemLayout} hasFeedback validateStatus="success"  label="Исми">
                                <input className="input" name="receiver_firstName" id="success" placeholder="Олучининг исми" onChange={e => this.change(e)}/>  
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success" label="Отасининг исми">
                                <input className="input" name="receiver_middleName" id="success" placeholder="Отасининг исми" onChange={e => this.change(e)}/>
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success"  label="Пасспорт сериаси">
                                <input className="input" name="receiver_passport_series" maxLength="2" id="success" placeholder="Пасспорт сериаси" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success"  label="Пасспорт номери">
                                <CurrencyFormat className="input" name="receiver_passport_number" maxLength="7" id="success" placeholder="Пасспорт номери" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success"  label="Берилган вакти">
                                <CurrencyFormat className="input" format="##.##.####" placeholder="DD.MM.YYYY" mask={['D', 'D','M', 'M', 'Y', 'Y', 'Y', 'Y']} name="receiver_passport_date_of_issue" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success"  label="Амал қилиш муддати">
                                <CurrencyFormat className="input" name="receiver_passport_date_of_expiry"format="##.##.####" placeholder="DD.MM.YYYY" mask={['D', 'D','M', 'M', 'Y', 'Y', 'Y', 'Y']} onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success"  label="Пасспорт берилган жойи">
                                <input className="input" name="receiver_passport_place_of_given" id="success" placeholder="Пасспорт берилган жойи" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success"  label="Тел. номер">
                                <CurrencyFormat className="input" name="receiver_phone_number" id="success" format="+998 (##) ###-####" mask="_" placeholder="+998 (__) ___-____" onChange={e => this.change(e)}/>
                            </FormItem>
                            <FormItem   {...this.formItemLayout} hasFeedback validateStatus="success"  label="Манзили">
                                <input className="input" name="receiver_permanent_address" placeholder="Манзили" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success"  label="Ҳисобварақ рақами">
                                <CurrencyFormat className="input" name="receiver_account_number" id="success"  placeholder="Ҳисобварақ рақами" format="##### ### # ######## ###" mask="_" onChange={e => this.change(e)} />
                            </FormItem>
                           </Form>
                        </Col>
                    </Row>  
                </Modal>
            </DefaultLayout>
        )
    }
}
export default Form.create()(AloqaMobileTransactions);
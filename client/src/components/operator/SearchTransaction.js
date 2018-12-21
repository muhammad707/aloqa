import React, { Component } from 'react';
import axios from 'axios';
import DefaultLayout from '../layout/Default';
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
class SearchTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            transaction: [],
            isLoading: false,
            loading: false,
            transaction_id: "",
            secretCode: "",
            fullName: "",
            passport_info:"",
            amount: "",
            name: "",
            currency: "",
            paymentMethod: undefined,
            phone_number: undefined,
            account_number: undefined,
            status: 2,
            createdAt: "",
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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.showModal = this.showModal.bind(this);
        this.change = this.change.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleDate2 = this.handleDate2.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelect2 = this.handleSelect2.bind(this);
    } 

    componentDidMount() {
        axios.get('/send', {
            headers: {
                Authorization: getJwt()
            }
        }).then((res => {
            this.setState({ 
                operator_id: res.data.result[0].id,
                receive_department: res.data.result[0].Branch.MFO 
            })
        }));

        axios.get('/api/currencylist', {
            headers: {
              Authorization: getJwt()
            }
          }).then(res => {
            const data = res.data.currencies.map(currency => ({
              id: currency.id,
              value: `${currency.name}`
            }));
            this.setState({
              receive_currency_types: data
            });
          });

        axios.get('/api/paymentmethodlist', {
            headers: {
              Authorization: getJwt()
            }
          }).then(res => {
            const data = res.data.methods.map(method => ({
              id: method.id,
              value: `${method.name}`
            }));
            this.setState({
              receive_payment_methods: data
            });
        });
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

        axios.post('/api/searchtransaction',  {
            secretCode: secretCode
        }, {
            headers: {
                Authorization: getJwt()
            }
        }).then((res) => {
            // console.log(res.data.array[0].status)
            if(res.data.success) {
                this.setState({
                    secretCode: res.data.array[0].secretCode,
                    transaction_id: res.data.array[0].transaction_id,
                    fullName: res.data.array[0].sender_fullname,
                    passport_info: res.data.array[0].sender_passport_info,
                    amount: res.data.array[0].amount,
                    currency: res.data.array[0].currency,
                    createdAt: res.data.array[0].createdAt,
                    status: res.data.array[0].status,
                    account_number: res.data.array[0].account_number,
                    paymentMethod: res.data.array[0].paymentMethod,
                    phone_number: res.data.array[0].phone_number
                });
                const listItem = (
                        <Table rowKey="transaction_id" dataSource={res.data.array}>
                            <Column 
                                title="Ф.И.Ш"
                                key="sender_fullname"
                                dataIndex="sender_fullname" />
                            <Column 
                                title="Пасспорт маълумотлари"
                                key="sender_passport_info"
                                dataIndex="sender_passport_info" />
                            <Column 
                                title="Жўнатма микдори"
                                key="amount"
                                dataIndex="amount" />
                            <Column 
                                title="Пул бирлиги"
                                key="currency"
                                dataIndex="currency" />
                            <Column 
                                title="Ўтказма коди"
                                key="secretCode"
                                dataIndex="secretCode" />
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
                    transaction: listItem,   
                })
                notification['success']({
                    message: res.data.message
                })
            } 
        }).catch(e => {
            notification['error']({
                message: "Ўтказма мавжуд эмас"
            });
        });

        console.log(that.state.isLoading);

    }

    handleDate = event => {
        this.setState({
            receiver_passport_date_of_issue: event._d
          });
    }

    handleDate2 = event => {
        this.setState({
            receiver_passport_date_of_expiry: event._d
          });
    }

    handleSelect = (value) => {
        console.log(value);
        this.setState({
          receive_currency_type: value
        }, () => {
          console.log(this.state.receive_currency_type);
        });
      }
    
      handleSelect2 = (value) => {
        this.setState({
          receive_payment_method: value
        }, () => {
          console.log(this.state.receive_payment_method);
        });
      }
    
   
    handleOk = () => {

        if(this.state.receive_department && 
            this.state.receiver_firstName &&
            this.state.receiver_lastName &&
            this.state.receiver_middleName &&
            this.state.receiver_passport_series &&
            this.state.receiver_passport_number &&
            this.state.receiver_passport_date_of_issue &&
            this.state.receiver_passport_place_of_given &&
            this.state.receiver_permanent_address &&
            this.state.receiver_phone_number &&
            this.state.receiver_account_number &&
            this.state.receive_currency_type &&
            this.state.receive_payment_method) {

            this.setState({ loading: false, visible: false});

            let formData = {};
            formData.receive_operator = this.state.operator_id;
            formData.receive_department = this.state.receive_department;
            formData.receiver_fullname = `${this.state.receiver_lastName} ${this.state.receiver_firstName} ${this.state.receiver_middleName}`;
            formData.receiver_passport_series = this.state.receiver_passport_series;
            formData.receiver_passport_number = this.state.receiver_passport_number;
            formData.receiver_passport_date_of_issue = this.state.receiver_passport_date_of_issue;
            formData.receiver_passport_date_of_expiry = this.state.receiver_passport_date_of_expiry;
            formData.receiver_passport_place_of_given = this.state.receiver_passport_place_of_given;
            formData.receiver_permanent_address = this.state.receiver_permanent_address;
            formData.receiver_phone_number = this.state.receiver_phone_number;
            formData.receiver_account_number = this.state.receiver_account_number;
            formData.receive_currency_type = this.state.receive_currency_type;
            formData.receive_payment_method = this.state.receive_payment_method;
            formData.secretCode = this.state.secretCode;
            formData.status = "2";
            console.log(formData);

            axios.post('/api/confirmtransaction/' + this.state.secretCode, formData, {
                headers: {
                    Authorization: getJwt()
                }
            }).then(res => {
                if(res.data.success) {
                    message.success(res.data.message);
                    this.setState({
                        status: 'оплачен'
                    });
                }
            
            }).catch(e => {
                console.log("err");
            });
        } else {
            notification["error"]({
                message: "Маьлумот кам"
            });
        }
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }
   
      render() {
        const { getFieldDecorator, } = this.props.form;
        const { visible, loading, receive_currency_types, receive_payment_methods } = this.state;
          return (
            <DefaultLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Оператор</Breadcrumb.Item>
                <Breadcrumb.Item>Пул ўтказмасини излаш</Breadcrumb.Item>
                </Breadcrumb>  
                <div>
                    <h1 style={{ textAlign: 'center'}}>Пул ўтказмасини излаш</h1>
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
                                        Отказмани излаш
                                        </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    {/* <Table rowKey="transaction_id" columns={this.columns} 
                            dataSource={this.state.transaction}/> */}
                    {this.state.transaction}
                </div>
                <Modal 
                    title={`Жўнатмани кабул килиш (${this.state.createdAt})`}
                    visible={visible}
                    width={1300}
                    centered
                   onOk = { this.handleOk} 
                   onCancel = { this.handleCancel} 
                   footer = {[
                    <Button key="back" onClick={this.handleCancel}>Бекор қилиш</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>Қабул қилиш</Button>
                   ]}>
                    <Row  gutter={18}>
                        <Col className="gutter-row" span={10}>
                           <Form>
                               <FormItem {...this.formItemLayout} label="Махсус код">
                                    <input className="input" name="" value={this.state.secretCode}  disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Ф.И.Ш">
                                    <input className="input" name="receiver_fullname" value={this.state.fullName} placeholder="Ф.И.Ш" disabled />
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Пасспорт маълумотлари">
                                    <input className="input" value={this.state.passport_info} placeholder="Пасспорт маълумотлари" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Телефон рақами">
                                    <input className="input" value={this.state.phone_number} placeholder="Пул бирлиги" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Пул микдори">
                                    <CurrencyFormat thousandSeparator={true} className="input" value={this.state.amount} placeholder="Пул микдори" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Ҳисобварақ рақами">
                                    <input className="input" value={this.state.account_number} placeholder="Ҳисобварақ рақами" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Юборилган пул шакли">
                                    <input className="input" value={this.state.paymentMethod} placeholder="Ҳисобварақ рақами" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Пул бирлиги">
                                    <input className="input" value={this.state.currency} placeholder="Пул бирлиги" disabled/>
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
                                <input className="input" name="receiver_lastName" id="success" placeholder="Олучининг фамилияси" onChange={e => this.change(e)}/>
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
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success"  label="Қабул қилинган пул тури">
                            <Select
                                name="receive_currency_type"
                                size="large"
                                onChange={this.handleSelect}>
                                {receive_currency_types.map(d => <Option key={d.id}>{d.value}</Option> )}
                            </Select>
                            </FormItem>
                            <FormItem  {...this.formItemLayout} hasFeedback validateStatus="success" label="Қабул қилинган пул шакли">
                            <Select size="large" name="receive_payment_method" onChange={this.handleSelect2}>
                                {receive_payment_methods.map(d => <Option key={d.id}>{d.value}</Option> )}
                            </Select>
                            </FormItem>
                            
                           </Form>
                        </Col>
                    </Row>  
                </Modal>
            </DefaultLayout>
          );
      }
}
export default Form.create()(SearchTransaction);
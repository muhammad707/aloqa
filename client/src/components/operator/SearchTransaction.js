import React, { Component } from 'react';
import axios from 'axios';
import DefaultLayout from '../layout/Default';
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
        Select
         } from 'antd';
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
            status: 2,
            createdAt: "",
            receive_department: undefined,
            receiver_fullname: undefined,
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
            this.setState({ receive_department: res.data.result[0].Branch.MFO })
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

    columns = [{
        title: 'Ф.И.Ш',
        dataIndex: 'sender_fullname',
        key: 'sender_fullname'
    }, {
        title: 'Пасспорт маьлумотлари',
        dataIndex: 'sender_passport_info',
        key: 'sender_passport_info'
    }, {
        title: 'Жонатма микдори',
        dataIndex: 'amount',
        key: 'amount'
    }, {
        title: 'Пул бирлиги',
        dataIndex: 'currency',
        key: 'currency'
    }, {
        title: 'Отказма коди',
        dataIndex: 'secretCode',
        key: 'secretCode'
    }, {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status'
    }, {
        title: 'Кабул килиш',
        key: 'action',
        render: () => <Button onClick={this.showModal} type="primary"><Icon type="edit"></Icon></Button>
    }];
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
            console.log(res.data.array[0].status)
            if(res.data.success) {
                this.setState({
                    transaction: res.data.array,   
                    secretCode: res.data.array[0].secretCode,
                    transaction_id: res.data.array[0].transaction_id,
                    fullName: res.data.array[0].sender_fullname,
                    passport_info: res.data.array[0].sender_passport_info,
                    amount: res.data.array[0].amount,
                    currency: res.data.array[0].currency,
                    createdAt: res.data.array[0].createdAt,
                    status: res.data.array[0].status
                });
                message.success(res.data.message);
            } 
            else { 
                this.setState({
                    secretCode: ""
                });
                message.error("Tranaction not found");
            }
        }).catch(e => {
            that.setState({
                isLoading: false
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

        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false});
        }, 3000);

        let formData = {};
        formData.receive_department = this.state.receive_department;
        formData.receiver_fullname = this.state.receiver_fullname;
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
                <Breadcrumb.Item>Пул отказмасини излаш</Breadcrumb.Item>
                </Breadcrumb>  
                <div>
                    <h1 style={{ textAlign: 'center'}}>Пул отказмасини излаш</h1>
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
                    <Table rowKey="transaction_id" columns={this.columns} 
                            dataSource={this.state.transaction}/>
                </div>
                <Modal 
                    title={`Жонатмани кабул килиш (${this.state.createdAt})`}
                    visible={visible}
                    width={1300}
                    centered
                   onOk = { this.handleOk} 
                   onCancel = { this.handleCancel} 
                   footer = {[
                    <Button key="back" onClick={this.handleCancel}>Кайтиш</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>Юбориш</Button>
                   ]}>
                    <Row  gutter={18}>
                        <Col className="gutter-row" span={11}>
                           <Form>
                               <FormItem {...this.formItemLayout} label="Махсус код">
                                    <Input name="" value={this.state.secretCode}  disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Ф.И.Ш">
                                    <Input name="receiver_fullname" value={this.state.fullName} placeholder="Ф.И.Ш" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Пасспорт маьлумотлари">
                                    <Input value={this.state.passport_info} placeholder="Пасспорт маьлумотлари" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Пул микдори">
                                    <Input value={this.state.amount} placeholder="Пул микдори" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Пул бирлиги">
                                    <Input value={this.state.currency} placeholder="Пул бирлиги" disabled/>
                               </FormItem>
                               <FormItem {...this.formItemLayout} label="Статус">
                                    <Input value={this.state.status} disabled/>
                               </FormItem>
                           </Form>
                        </Col>
                        <Col className="gutter-row" span={12}>
                        <Form>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Ф.И.Ш">
                                <Input name="receiver_fullname" id="success" placeholder="Ф.И.Ш" onChange={e => this.change(e)}/>
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Пасспорт сериаси">
                                <Input name="receiver_passport_series" id="success" placeholder="Пасспорт сериаси" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Пасспорт номери">
                                <Input name="receiver_passport_number" id="success" placeholder="Пасспорт номери" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Берилган вакти">
                                <DatePicker size="default" name="receiver_passport_date_of_issue" placeholder="Паспорт берилган санаси" style={{ width: '100%' }} onChange={e => this.handleDate(e)} />
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Амал килиш муддати">
                                <DatePicker size="default" name="receiver_passport_date_of_expiry" placeholder="Амал қилиш муддати" style={{ width: '100%' }} onChange={e => this.handleDate2(e)} />
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Пасспорт берилган жойи">
                                <Input name="receiver_passport_place_of_given" id="success" placeholder="Пасспорт берилган жойи" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Тел. номер">
                                <Input name="receiver_phone_number" id="success" placeholder="Тел. номер"  onChange={e => this.change(e)}/>
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Манзили">
                                <Input name="receiver_permanent_address" placeholder="Манзили" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Ҳисобварақ рақами">
                                <Input name="receiver_account_number" id="success" placeholder="Ҳисобварақ рақами" onChange={e => this.change(e)} />
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Кабул килинган пул тури">
                            <Select
                                name="receive_currency_type"
                                size="default"
                                onChange={this.handleSelect}>
                                {receive_currency_types.map(d => <Option key={d.id}>{d.value}</Option> )}
                            </Select>
                            </FormItem>
                            <FormItem hasFeedback validateStatus="success" {...this.formItemLayout} label="Кабул килинган пул шакли">
                            <Select name="receive_payment_method" size="default" onChange={this.handleSelect2}>
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
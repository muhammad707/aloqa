import React, { Component } from 'react';
import CurrencyFormat from 'react-currency-format';
import './Input.css';
import {
  Breadcrumb,
  Form,
  Select,
  Row,
  Col,
  Button,
  message,
  Tooltip,
  notification,
  Input
} from 'antd';

import DefaultLayout from '../layout/Default';
import '../../index.css';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
const FormItem = Form.Item;
const Option = Select.Option;

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
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

// function convertStringToDouble(value) {
//   var str = value.replace(/,/g, '');
//   return parseFloat(str);
// }

function calculateTotalPrice(price, commission) {
  return (price + (price*(commission/100)));
}



class PaymentSend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      confirmDirty: false,
      send_department: undefined,
      operator_id: undefined,
      operator_name: undefined,
      sender_lastName: undefined,
      sender_firstName: undefined,
      sender_middleName: undefined,
      sender_passport_series: undefined,
      sender_passport_number: undefined,
      sender_passport_date_of_issue:undefined,
      sender_passport_date_of_expiry: undefined,
      sender_passport_place_of_given: undefined,
      sender_permanent_address: undefined,
      sender_phone_number: undefined,
      sender_account_number: undefined,
      send_amount_in_number: undefined,
      send_amount_in_word: undefined,
      total_amount_in_number: undefined,
      bank_profit: undefined,
      confirmLoading: false,
      send_currency_types: [],
      send_currency_type: undefined,
      send_payment_methods: [],
      send_payment_method: undefined, 
      visible: false,
      secretCode: undefined,
      status: "1",
      commission: undefined,
      receiver_fullName_from_Sender: undefined
      
    };
    this.change = this.change.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.handleChange2 = this.handleChange2.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelect2 = this.handleSelect2.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    // this.handleOk2 = this.handleOk2.bind(this);
    this.onchangePassportSeries = this.onchangePassportSeries.bind(this);
  }


  componentDidMount() {
    axios.get('/send', {
      headers: {
        Authorization: getJwt()
      }
    }).then(res => {
      this.setState({
        operator_id: res.data.result[0].id,
        operator_name: `${res.data.result[0].firstName} ${res.data.result[0].lastName} ${res.data.result[0].middleName}`,
        send_department: res.data.result[0].Branch.MFO
      });
    });
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
        send_currency_types: data
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
        send_payment_methods: data
      });
    });
    this.fetchCommission();
  }

  fetchCommission() {
    axios.get('/admin/commission/fetch', {
      headers: {
        Authorization: getJwt()
      }
    }).then(res => {
      this.setState({
        commission: res.data[0].value
      });
    });
  }

  handleSubmit = (e) => {
    if (
      this.state.send_department &&
      this.state.sender_lastName &&
      this.state.sender_firstName &&
      this.state.sender_middleName &&
      this.state.sender_passport_series &&
      this.state.sender_passport_number &&
      this.state.sender_passport_date_of_issue &&
      this.state.sender_passport_date_of_expiry &&
      this.state.sender_passport_place_of_given &&
      this.state.sender_permanent_address &&
      this.state.sender_phone_number &&
      this.state.sender_account_number &&
      this.state.send_amount_in_number &&
      this.state.send_amount_in_word &&
      this.state.send_currency_type &&
      this.state.send_payment_method
    ) {
      let formData = {};
      formData.send_operator = this.state.operator_id;
      formData.send_department = this.state.send_department;
      formData.sender_firstName = this.state.sender_firstName;
      formData.sender_lastName = this.state.sender_lastName;
      formData.sender_middleName = this.state.sender_middleName;
      formData.receiver_fullName_from_Sender = this.state.receiver_fullName_from_Sender;
      formData.sender_passport_series = this.state.sender_passport_series.toUpperCase();
      formData.sender_passport_number = this.state.sender_passport_number;
      formData.sender_passport_date_of_issue = this.state.sender_passport_date_of_issue;
      formData.sender_passport_date_of_expiry = this.state.sender_passport_date_of_expiry;
      formData.sender_passport_place_of_given = this.state.sender_passport_place_of_given;
      formData.sender_permanent_address = this.state.sender_permanent_address;
      formData.send_currency_type = this.state.send_currency_type;
      formData.send_payment_method = this.state.send_payment_method;
      formData.sender_account_number = this.state.sender_account_number;
      formData.sender_phone_number =this.state.sender_phone_number;
      formData.send_amount_in_number = this.state.send_amount_in_number;
      formData.send_amount_in_word = this.state.send_amount_in_word;
      formData.status = this.state.status;
      // formData.total_amount_in_number = calculateTotalPrice(parseInt(this.state.send_amount_in_number), parseFloat(this.state.commission));
      formData.bank_profit = (calculateTotalPrice(parseInt(this.state.send_amount_in_number), parseFloat(this.state.commission)) - parseFloat(this.state.send_amount_in_number));
      console.log(formData);
      axios.post('/api/createtransaction', formData, {
        headers: {
          Authorization: getJwt()
        }
      }).then(res => {
        console.log(res.data);
        if(res.data.success) {
          message.success(res.data.message);
          this.setState({
            secretCode: res.data.secretCode
          });
          // Modal.confirm({
          //   title: 'Отказма',
          //   content: ' Отказма амалга оширилсинми',
          //   onOk() {
          //     Modal.success({
          //       title: "Success",
          //       content: res.data.secretCode,
                
          //     })
          //   },
          //   okText: 'Амалга ошириш',
          //   cancelText: 'Бекор килиш',
            
          // });
          this.props.history.push('/print');
          this.setState({
            sender_lastName: "",
            sender_firstName: "",
            sender_middleName: "",
            sender_passport_series: "",
            sender_passport_number: "",
            sender_passport_date_of_issue: "",
            sender_passport_date_of_expiry: "",
            sender_passport_place_of_given: "",
            sender_permanent_address: "",
            sender_phone_number: "",
            sender_account_number: "",
            send_amount_in_number: "",
            send_amount_in_word: ""
          });
        }
      });
    } else {
      // Modal.error({
      //   title: 'Ўтказмани юбориш',
      //   content: 'Маълумотлар кам'
      // });
      notification['error']({
        message: "Маълумотлар кам"
      })
    }
  }


  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
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

 onChangePrice = () => {

 }

 onchangePassportSeries = e => {
  const { value } = e.target;
  const reg = /^([A-Z]*)$/;
  if (reg.test(value) || value === '') {
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

  handleSelect = (value) => {
    console.log(value);
    this.setState({
      send_currency_type: value
    }, () => {
      console.log(this.state.send_currency_type);
    });
  }

  handleSelect2 = (value) => {
    this.setState({
      send_payment_method: value
    }, () => {
      console.log(this.state.send_payment_method);
    });
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // }
  
  render() {
    let { send_amount_in_number, send_currency_types, send_payment_methods } = this.state;
    let title = send_amount_in_number ? (
      <span className="numeric-input-title">
        {send_amount_in_number !== '-' ? formatNumber(send_amount_in_number) : '-'}
      </span>
    ) : 'Суммани киритинг';
    const { getFieldDecorator } = this.props.form;      
    return (
     <DefaultLayout>
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div  style={{ marginLeft: '50px', background: '#fff' }}>
            <h2>Пул ўтказмасини юбориш</h2>
            <Form id="form">
                <Row gutter={21}>
                    <Col className="gutter-row" span={7}>
                        <FormItem label="Фамилияси">
                          <input className="input" name="sender_lastName" placeholder="Фамилияси" onChange={e => this.change(e)} />
                        </FormItem>   
                    </Col>
                    <Col className="gutter-row" span={7}>
                        <FormItem label="Исми"> 
                            <input className="input" size="large" placeholder="Исми" name="sender_firstName" onChange={e => this.change(e)} />
                        </FormItem>  
                    </Col>
                    <Col className="gutter-row" span={7}>
                        <FormItem label="Отасининг исми">
                              <input className="input" size="large" placeholder="Отасининг исми" name="sender_middleName" onChange={e => this.change(e)} />
                        </FormItem>  
                    </Col>
                </Row>
                <Row gutter={21}>
                    <Col className="gutter-row" span={4}>
                        <FormItem label="Паспорт серияси">
                                <input className="input" placeholder="Паспорт серияси" style={{ width: '100%'}} name="sender_passport_series" maxLength="2" onChange={e => this.change(e)} />
                        </FormItem>   
                    </Col>
                    <Col className="gutter-row" span={5}>
                        <FormItem label="Паспорт номери">
                                <CurrencyFormat value={this.state.sender_passport_number} placeholder="Паспорт номери" className="input"  maxLength="7" name="sender_passport_number" onChange={e => this.change(e)} />
                        </FormItem>   
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <FormItem label="Берилган вақти">
                                <CurrencyFormat value={this.state.sender_passport_date_of_issue} className="input" style={{ width: '100%'}} name="sender_passport_date_of_issue" format="##.##.####" placeholder="DD.MM.YYYY" mask={['D', 'D','M', 'M', 'Y', 'Y', 'Y', 'Y']} onChange={e => this.change(e)}/>
                        </FormItem>   
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <FormItem label="Амал қилиш муддати">
                                <CurrencyFormat value={this.state.sender_passport_date_of_expiry} className="input" style={{ width: '100%'}} name="sender_passport_date_of_expiry" format="##.##.####" placeholder="DD.MM.YYYY" mask={['D', 'D','M', 'M', 'Y', 'Y', 'Y', 'Y']} onChange={e => this.change(e)}/>
                        
                        </FormItem>   
                    </Col>
                </Row>
                <Row gutter={21}>
                    <Col span={13}>
                        <FormItem label="Паспорт берилган жойи">      
                          <input className="input" size="large" placeholder="Паспорт берилган жойи" style={{ width: '100%'}} name="sender_passport_place_of_given" onChange={e => this.change(e)} />
                        </FormItem> 
                    </Col>
                    <Col span={8}>
                        <FormItem label="Телефон рақами">
                                <CurrencyFormat value={this.state.sender_phone_number} className="input" name="sender_phone_number" style={{ width: '100%' }} format="+998 (##) ###-####" mask="_" onChange={e => this.change(e)} placeholder="+998 ( __ ) ___-____" />
                        </FormItem> 
                    </Col>
                </Row>
                <Row gutter={21}>
                    <Col span={21}>
                        <FormItem label="Яшаш манзили">
                                <input  className="input" size="large" placeholder="Яшаш манзили" name="sender_permanent_address" onChange={e => this.change(e)} />
                        </FormItem> 
                    </Col>
                </Row>
                <Row gutter={21}>
                    <Col span={21}>
                        <FormItem label="Ҳисобварақ рақами">
                                <CurrencyFormat  className="input" name="sender_account_number" placeholder="Ҳисобварақ рақами" format="##### ### # ######## ###" mask="_" style={{ width: '100%'}} onChange={e => this.change(e)} />
                        </FormItem> 
                    </Col>
                </Row>
                <Row gutter={21}>
                    <Col span={10}>
                        <FormItem label="Пул ўтказмасининг тури">
                                <Select size="large" name="send_currency_type" onChange={this.handleSelect}>
                                  {send_currency_types.map(d => <Option key={d.id}>{d.value}</Option> )}
                                </Select>
                        </FormItem> 
                    </Col>
                    <Col span={11}>
                        <FormItem label="Топширилган пул шакли">
                                <Select size="large" name="send_payment_method" onChange={this.handleSelect2}>
                                {send_payment_methods.map(d => <Option key={d.id}>{d.value}</Option> )}
                        
                            </Select>
                        </FormItem> 
                    </Col>
                </Row>
                <Row gutter={21}>
                    <Col span={10}>
                        <FormItem label="Пул ўтказмасининг миқдори (сон билан)">
                            {/* <CurrencyFormat className="input" thousandSeparator={true} placeholder="Пул ўтказмасининг миқдори (сон билан)" style={{ width: '100%'}} name="send_amount_in_number" onChange={e => this.change(e)} /> */}
                            <Tooltip 
                                trigger={['focus']}
                                title={title}
                                placement="topLeft"
                                overlayClassName="numeric-input">
                                    <CurrencyFormat className="input" name="send_amount_in_number" placeholder="Пул ўтказмасининг миқдори (сон билан)" id="success" onChange={e => this.onChange(e)} />
                            </Tooltip>
                        </FormItem> 
                    </Col>
                    <Col span={11}>
                        <FormItem label="Пул ўтказмасининг миқдори (сўз билан)">
                                    <input className="input" size="large" placeholder="Пул ўтказмасининг миқдори (сўз билан)" style={{ width: '100%'}} name="send_amount_in_word" onChange={e => this.change(e)} />
                        </FormItem> 
                    </Col>
                </Row>
                <Row gutter={21}>
                    <Col span={10}>
                        <FormItem label="Банк хизмати">
                            <CurrencyFormat  className="input" thousandSeparator={true} disabled  placeholder="Банк хизмати" style={{ width: '100%'}}  name="commission" value={ this.state.send_amount_in_number ? (parseInt(this.state.send_amount_in_number, 10) + parseInt(this.state.send_amount_in_number) * (parseFloat(this.state.commission))/100) - parseFloat(this.state.send_amount_in_number): ""} onChange={e => this.change(e)} />
                        </FormItem> 
                    </Col>
                    <Col span={11}>
                        <FormItem label="Юборувчидан олинадиган жами сумма">
                            <CurrencyFormat name="total_amount_in_number" className="input" thousandSeparator={true} placeholder="Юборувчидан олинадиган жами сумма" style={{ width: '100%'}} value={ this.state.send_amount_in_number ? (parseInt(this.state.send_amount_in_number, 10) + parseInt(this.state.send_amount_in_number) * (parseFloat(this.state.commission))/100): ""}  onChange={e => this.change(e)} />
                        </FormItem> 
                    </Col>
                </Row>
                <Row gutter={21}>
                    <Col span={21}>
                        <FormItem label="Олувчининг тўлиқ исми шарфи">
                          <input  className="input" name="receiver_fullName_from_Sender" placeholder="Олувчининг тўлиқ исми шарфи" onChange={e => this.change(e)} />
                        </FormItem> 
                    </Col>
                </Row>
                <Row gutter={21}>
                  <Col style={{ float: "left" }} className="gutter-row" span={10}>
                    <Button htmlType="submit" type="primary" onClick={this.handleSubmit} size="large" style={{ float: 'right' }}>Маълумотларни сақлаш</Button>
                  </Col>
              </Row>
              
            </Form>
        </div>
    </DefaultLayout>
    );
  }
  
}
export default Form.create()(PaymentSend);

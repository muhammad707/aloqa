import React, { Component } from 'react';
import moment from "moment";
// import { NavLink } from 'react-router-dom';
import {
  Breadcrumb,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Button,
  Modal
} from 'antd';

import DefaultLayout from '../layout/Default';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
const FormItem = Form.Item;
const Option = Select.Option;
// const AutoCompleteOption = AutoComplete.Option;


class PaymentSend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      confirmDirty: false,
      send_department: undefined,
      sender_fullname: "",
      sender_passport_series: undefined,
      sender_passport_number: undefined,
      sender_passport_date_of_issue: moment(),
      sender_passport_date_of_expiry: moment(),
      sender_passport_place_of_given: undefined,
      sender_permanent_address: undefined,
      sender_phone_number: undefined,
      sender_account_number: undefined,
      send_amount_in_number: undefined,
      send_amount_in_word: undefined,
      confirmLoading: false,
      send_currency_types: [],
      send_currency_type: undefined,
      send_payment_methods: [],
      send_payment_method: undefined, 
      visible: false,
      secretCode: undefined,
      status: "1"
      
    };
    this.change = this.change.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelect2 = this.handleSelect2.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }


  componentDidMount() {
    axios.get('/send', {
      headers: {
        Authorization: getJwt()
      }
    }).then(res => {
      this.setState({
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
  }


  handleOk = () => {
    if (this.state.send_department &&
      this.state.sender_fullname &&
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
      this.setState({
        confirmLoading: true
      });
      
      let formData = {};
      formData.send_department = this.state.send_department;
      formData.sender_fullname = this.state.sender_fullname;
      formData.sender_passport_series = this.state.sender_passport_series;
      formData.sender_passport_number = this.state.sender_passport_number;
      formData.sender_passport_date_of_issue = this.state.sender_passport_date_of_issue;
      formData.sender_passport_date_of_expiry = this.state.sender_passport_date_of_expiry;
      formData.sender_passport_place_of_given = this.state.sender_passport_place_of_given;
      formData.sender_permanent_address = this.state.sender_permanent_address;
      formData.send_currency_type = this.state.send_currency_type;
      formData.send_payment_method = this.state.send_payment_method;
      formData.sender_account_number = this.state.sender_account_number;
      formData.sender_phone_number = this.state.sender_phone_number;
      formData.send_amount_in_number = this.state.send_amount_in_number;
      formData.send_amount_in_word = this.state.send_amount_in_word;
      formData.status = this.state.status;
      console.log(formData);

      axios.post('/api/createTransaction', formData, {
        headers: {
          Authorization: getJwt()
        }
      }).then(res => {
        console.log(res.data);
        if(res.data.success) {
          // message.success(res.data.message);
          this.setState({
            secretCode: res.data.secretCode
          })
          Modal.confirm({
            title: 'Transaction',
            content: ' You want to accept transaction',
            onOk() {
              Modal.success({
                title: "Success",
                content: res.data.secretCode
              })
            },
            okText: 'Confirm',
            cancelText: 'Cancel',
          });
        }
      });
    } else {
      Modal.error({
        title: 'Transaction',
        content: 'Not enough information'
      });
      
    }
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
  }


  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleChange = (event) => {
    this.setState({
      sender_passport_date_of_issue: event._d
    });
  }
  handleChange2 = (event) => {
    this.setState({
      sender_passport_date_of_expiry: event._d
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
  render() {
    const { send_currency_types, send_payment_methods } = this.state;
    return (
      <DefaultLayout>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginLeft: '50px', background: '#fff' }}>
          <h2>Пул ўтказмасини юбориш</h2>
          <Form onSubmit={this.handleSubmit} id="form">
            <Row>
              <Col span={16} >
                <FormItem label="Ф.И.Ш" hasFeedback validateStatus="success">
                  <Input size="default" name="sender_fullname" placeholder="Ф.И.Ш" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <FormItem label="Паспорт серияси" hasFeedback validateStatus="success">
                  <Input size="default" name="sender_passport_series" placeholder="Паспорт серияси" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={10}>
                <FormItem label="Паспорт рақами" hasFeedback validateStatus="success">
                  <Input size="default" name="sender_passport_number" placeholder="Паспорт рақами" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <FormItem label="Паспорт берилган санаси" hasFeedback validateStatus="success">
                  <DatePicker size="default" name="sender_passport_date_of_issue" placeholder="Паспорт берилган санаси" style={{ width: '100%' }} onChange={e => this.handleChange(e)} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={8}>
                <FormItem label="Амал қилиш муддати" hasFeedback validateStatus="success">
                  <DatePicker size="default" name="sender_passport_date_of_expiry" placeholder="Амал қилиш муддати" style={{ width: '100%' }} onChange={e => this.handleChange2(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8} >
                <FormItem label="Паспорт берилган жойи" hasFeedback validateStatus="success">
                  <Input size="default" name="sender_passport_place_of_given" placeholder="Паспорт берилган жойи" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="Тел. номер" hasFeedback validateStatus="success">
                  <Input size="default" name="sender_phone_number" placeholder="Тел. номер  " id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16} >
                <FormItem label="Манзил" hasFeedback validateStatus="success">
                  <Input size="default" name="sender_permanent_address" placeholder="Манзил" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col span={16} >
                <FormItem label="Ҳисобварақ рақами " hasFeedback validateStatus="success">
                  <Input size="default" name="sender_account_number" placeholder="Ҳисобварақ рақами " id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <FormItem label="Пул ўтказмасининг тури" hasFeedback validateStatus="success">
                  <Select
                    name="send_currency_type"
                    size="default"
                    onChange={this.handleSelect}>
                      {send_currency_types.map(d => <Option key={d.id}>{d.value}</Option> )}
                  </Select>
                </FormItem>
              </Col>
              <Col className="gutter-row" span={8}>
                <FormItem label="Топширилган пул шакли" hasFeedback validateStatus="success">
                  <Select name="send_payment_method" size="default" onChange={this.handleSelect2}>
                    {send_payment_methods.map(d => <Option key={d.id}>{d.value}</Option> )}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <FormItem label="Пул ўтказмасининг миқдори сонда" hasFeedback validateStatus="success">
                  <Input size="default" name="send_amount_in_number" placeholder="Пул ўтказмасининг миқдори сонда" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={8}>
                <FormItem label="Пул ўтказмасининг миқдори сўз билан" hasFeedback validateStatus="success">
                  <Input size="default" name="send_amount_in_word" placeholder="Пул ўтказмасининг миқдори сўз билан" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Button type="primary" onClick={this.handleOk} size="large" style={{ float: 'right' }}>Маълумотларни сақлаш</Button>
              </Col>
              <Col className="gutter-row" span={8}>
                <Button type="submit" size="default" style={{ float: 'right' }}>Чоп этиш</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </DefaultLayout>
    );
  }
}

export default Form.create()(PaymentSend);
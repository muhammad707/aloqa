import React, { Component } from 'react';
import moment from "moment";
import {
  Breadcrumb,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Button
} from 'antd';

import DefaultLayout from '../layout/Default';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';
const FormItem = Form.Item;
const Option = Select.Option;
// const AutoCompleteOption = AutoComplete.Option;


class PaymentReceive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      confirmDirty: false,
      receive_department: undefined,
      receiver_fullname: undefined,
      receiver_passport_series: undefined,
      receiver_passport_number: undefined,
      receiver_passport_date_of_issue: moment(),
      receiver_passport_date_of_expiry: moment(),
      receiver_passport_place_of_given: undefined,
      receiver_permanent_address: undefined,
      receiver_phone_number: undefined,
      receiver_account_number: undefined,
      confirmLoading: false,
      receive_currency_types: [],
      receive_currency_type: undefined,
      receive_payment_methods: [],
      receive_payment_method: undefined
    };
    this.change = this.change.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelect2 = this.handleSelect2.bind(this);
  }

  componentDidMount() {
    axios.get('/send', {
      headers: {
        Authorization: getJwt()
      }
    }).then(res => {
      this.setState({
        receive_department: res.data.result[0].Branch.MFO
      })
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
      })
    })
  }

  handleOk = () => {
    if (this.state.receive_department &&
      this.state.receiver_fullname &&
      this.state.receiver_passport_series &&
      this.state.receiver_passport_number &&
      this.state.receiver_passport_date_of_issue &&
      this.state.receiver_passport_date_of_expiry &&
      this.state.receiver_passport_place_of_given &&
      this.state.receiver_permanent_address &&
      this.state.receiver_phone_number &&
      this.state.receiver_account_number &&
      this.state.receive_currency_type &&
      this.state.receive_payment_method
    ) {
      this.setState({
        confirmLoading: true
      });
      // const {
      //   send_department,
      //   sender_fullname,
      //   sender_passport_series,
      //   sender_passport_number,
      //   sender_passport_date_of_issue,
      //   sender_passport_date_of_expiry,
      //   sender_passport_place_of_given,
      //   sender_permanent_address,
      //   sender_phone_number,
      //   sender_account_number,
      //   send_amount_in_number,
      //   send_amount_in_word } = this.state;

      let formData = {};
      formData.receive_department = this.state.receive_department;
      formData.receiver_fullname = this.state.receiver_fullname;
      formData.receiver_passport_series = this.state.receiver_passport_series;
      formData.receiver_passport_number = this.state.receiver_passport_number;
      formData.receiver_passport_date_of_issue = this.state.receiver_passport_date_of_issue;
      formData.receiver_passport_date_of_expiry = this.state.receiver_passport_date_of_expiry;
      formData.receiver_passport_place_of_given = this.state.receiver_passport_place_of_given;
      formData.receiver_permanent_address = this.state.receiver_permanent_address;
      formData.receive_currency_type = this.state.receive_currency_type;
      formData.receive_payment_method = this.state.receive_payment_method;
      formData.receiver_account_number = this.state.receiver_account_number;
      formData.receiver_phone_number = this.state.receiver_phone_number;
      console.log(formData);

      axios.post('/api/confirmtransaction', formData, {
        headers: {
          Authorization: getJwt()
        }
      }).then(res => {
        console.log(res);
      })
    } else {
      console.log("error")
    }
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleChange = (event) => {
    this.setState({
      receiver_passport_date_of_issue: event._d
    });
  }

  handleChange2 = (event) => {
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

  render() {
    const { receive_currency_types, receive_payment_methods } = this.state;
    return (
      <DefaultLayout>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginLeft: '50px', background: '#fff' }}>
          <h2>Пул ўтказмасини кабул килиш</h2>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={16} >
                <FormItem label="Ф.И.Ш" hasFeedback validateStatus="success">
                  <Input size="default" name="receiver_fullname" placeholder="Ф.И.Ш" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <FormItem label="Паспорт серияси" hasFeedback validateStatus="success">
                  <Input size="default" name="receiver_passport_series" placeholder="Паспорт серияси" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={10}>
                <FormItem label="Паспорт рақами" hasFeedback validateStatus="success">
                  <Input size="default" name="receiver_passport_number" placeholder="Паспорт рақами" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <FormItem label="Паспорт берилган санаси" hasFeedback validateStatus="success">
                  <DatePicker size="default" name="receiver_passport_date_of_issue" placeholder="Паспорт берилган санаси" style={{ width: '100%' }} onChange={e => this.handleChange(e)} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={8}>
                <FormItem label="Амал қилиш муддати" hasFeedback validateStatus="success">
                  <DatePicker size="default" name="receiver_passport_date_of_expiry" placeholder="Амал қилиш муддати" style={{ width: '100%' }} onChange={e => this.handleChange2(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8} >
                <FormItem label="Паспорт берилган жойи" hasFeedback validateStatus="success">
                  <Input size="default" name="receiver_passport_place_of_given" placeholder="Паспорт берилган жойи" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem label="Тел. номер" hasFeedback validateStatus="success">
                  <Input size="default" name="receiver_phone_number" placeholder="Тел. номер  " id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16} >
                <FormItem label="Манзил" hasFeedback validateStatus="success">
                  <Input size="default" name="receiver_permanent_address" placeholder="Манзил" id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col span={16} >
                <FormItem label="Ҳисобварақ рақами " hasFeedback validateStatus="success">
                  <Input size="default" name="receiver_account_number" placeholder="Ҳисобварақ рақами " id="success" onChange={e => this.change(e)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <FormItem label="Кабул килинган пул тури" hasFeedback validateStatus="success">
                  <Select
                    name="receive_currency_type"
                    size="default"
                    onChange={this.handleSelect}>
                      {receive_currency_types.map(d => <Option key={d.id}>{d.value}</Option> )}
                  </Select>
                </FormItem>
              </Col>
              <Col className="gutter-row" span={8}>
                <FormItem label="Кабул килинган пул шакли" hasFeedback validateStatus="success">
                  <Select name="receive_payment_method" size="default" onChange={this.handleSelect2}>
                    {receive_payment_methods.map(d => <Option key={d.id}>{d.value}</Option> )}
                  </Select>
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

export default Form.create()(PaymentReceive);
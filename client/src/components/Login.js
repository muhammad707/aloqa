import React, { Component } from "react";
import axios from "axios";
import { getRole } from '../helpers/role';
import {Row, Col, Input, Icon, Button, Form, notification} from "antd";
const FormItem = Form.Item;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            username: "",
            password: "",
            token: "",
            isLoading: false
        };
        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);
    }
    change(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit(e) {
        e.preventDefault();

        const { username, password } = this.state;
        let that = this;
        this.setState({
            isLoading: true
        });

        console.log(that.state.isLoading);

        axios.post( '/api/auth/login',
            {
                username: username,
                password: password
            },
            {headers: {"Content-Type": "application/json"}}
        ).then(function(res){
            // console.log(res.data.role);
            localStorage.setItem(
                'token',
               res.data.token
            );
            localStorage.setItem(
                'role',
                res.data.role
            )
            console.log(getRole());
            if(getRole().trim() === 'superadmin') {
                console.log('I am inside');
                that.props.history.push('/admin');
            } else if(getRole() === 'operator') {
                that.props.history.push('/info');
            }
            // console.log(res.data);
            that.setState({
                isLoading:false
            });
        }).catch(function(err) {
            that.setState({
                isLoading: false
            });
            notification['error']({
                message: 'Ошибка',
                description: 'Логин или пароль неправильный',
            });
            console.log(err);
        });
    }

    render() {
        const styleForm = {
            background: "#fff",
            padding: "20px",
            boxShadow: "1px 0 20px rgba(0,0,0,.08)",
            maxWidth: "400px",
            width: "90%",
            marginTop: "70px"
        };

        return (
            <div style={{height: "100vh", background: "url('images/auth-bg.jpg') no-repeat center center"}}>
                <Row>
                    <Col span={6} offset={9} style={styleForm}>
                        <div style={{textAlign: "center"}}>
                            <img
                                width="30%"
                                style={{marginBottom: "10px", marginTop: "10px"}}
                                src="/images/logo.png"
                                alt="Hello"
                            />
                        </div>
                        <Form onSubmit={(e)=>this.submit(e)}>
                            <FormItem>
                                <Input
                                    prefix={
                                        <Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>
                                    }
                                    name="username"
                                    value={this.state.username}
                                    onChange={e => this.change(e)}
                                    placeholder="Введите логин"
                                />
                            </FormItem>
                            <Input
                                prefix={
                                    <Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>
                                }
                                type="password"
                                id="signin-password"
                                name="password"
                                value={this.state.password}
                                onChange={e => this.change(e)}
                                placeholder="Введите пароль"
                            />
                            <FormItem />
                            <FormItem>
                                <Button
                                    type="primary"
                                    style={{width: "100%"}}
                                    htmlType="submit"
                                    loading={this.state.isLoading}>
                                    <Icon type="login" theme="outlined"/> Войти
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Login;
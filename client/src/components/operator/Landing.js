import React, { Component } from 'react';
import DefaultLayout from '../layout/Default';
import { Row, Col, Breadcrumb, Avatar } from 'antd';
import axios from 'axios';
import { getJwt } from '../../helpers/jwt';

class Landing extends Component {

    state = {
        firstName: undefined,
        lastName: undefined,
        middleName: undefined,
        MFO: undefined,
        branch: undefined
    }

    componentDidMount() {
        axios.get('/send', {
            headers: {
                Authorization: getJwt()
            }
        }).then(res => {
            this.setState({
                firstName: res.data.result[0].firstName,
                lastName: res.data.result[0].lastName,
                middleName: res.data.result[0].middleName,
                branch: res.data.result[0].Branch.department,
                MFO: res.data.result[0].Branch.MFO
            });
        });
        console.log(this.state.branch);
    }

    render() {
        return (
            <DefaultLayout>
                <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Operator</Breadcrumb.Item>
                <Breadcrumb.Item>Ma'lumotlar</Breadcrumb.Item>
                </Breadcrumb>  
                <Row gutter={18}>
                    <Col className="gutter-row" span={6} offset={2}>
                        
                        <div style={{ textAlign: 'left'}}>
                        <Avatar size={120} icon="user" style={{ textAlign: 'center'}} />
                            <h2>
                                {this.state.firstName} {this.state.lastName}
                            </h2>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <div style={{ fontSize: '16px', paddingBottom: '40px'}}>
                            Ф.И.Ш
                        </div>
                        <div style={{ fontSize: '16px', paddingBottom: '40px'}}>
                        Филиал номи
                        </div>
                        <div style={{ fontSize: '16px', paddingBottom: '40px'}}>
                            МФО
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div style={{ fontSize: '16px', paddingBottom: '40px'}}>
                           { this.state.firstName} { this.state.lastName } { this.state.middleName }
                        </div>
                        <div style={{ fontSize: '16px', paddingBottom: '40px'}}>
                            {this.state.branch}
                        </div>
                        <div style={{ fontSize: '16px', paddingBottom: '40px'}}>
                            { this.state.MFO }
                        </div>
                    </Col>
                </Row>      
            </DefaultLayout>
        );
    }
}
export default Landing;
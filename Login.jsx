import React, { Component } from 'react';
import './_Login.scss';
import Auth from './Auth';
import { Redirect } from 'react-router';
import ReactModal from 'react-responsive-modal';
import { HashRouter as Router, Route, Link } from "react-router-dom";



class Login extends Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            isLoading: false,
            redirTo: false,
            registerModal: false,
            email: { text: "", isvalid: false }, //validations texts
            username: { text: "", isvalid: false },
            password: { text: "", isvalid: false },
            realm: { text: "", isvalid: false },
            isValid: false
        }

    }
    handleLogin(e) {
        e.preventDefault();

        let email = this.refs.email.value;
        let pw = this.refs.pw.value;
        this.setState({ isLoading: true });

        Auth.authenticate(email, pw, (isAuthenticated, role) => {

            this.setState({ isLoading: false });
            if (isAuthenticated === false) {
                alert("Login Failed, \n Try again");
                return;
            }
            if (isAuthenticated === true) {
                { this.props.navHeader() };
                if (this.props.postLoginCb)
                    this.props.postLoginCb();
                this.setState({ redirTo: '/' });

            }
        });

    }

    openRegModal = () => {
        this.setState({ registerModal: !this.state.registerModal });
    }

    handleInputChange = (event) => {
        let val = event.target.value;
        if (val.length < 3) return;
        switch (event.target.id) {
            case "registerPrivateName":
                {
                    if (/[0-9]/.test(val)) {
                        event.target.value = val.substring(0, val.length - 1);
                        this.setState({ realm: { text: "Name cannot contain digits!", isvalid: false } });
                        return;
                    }
                    let part = val.split(" ");
                    if (part.length == 1) {
                        this.setState({ realm: { text: "Include family name please.", isvalid: false } });
                        return;
                    }
                    let regex = /^[a-zA-zא-ת]{4,20}/;
                    if (regex.test(val)) {
                        this.setState({ realm: { text: "", isvalid: true } });
                        return;
                    }
                    else
                        this.setState({ realm: { text: "name must be at least 4 chars and limited for 20.", isvalid: false } });
                }
            case "registerEmail":
                {
                    let part = val.split("@");
                    if (part.length > 2) {
                        this.setState({ email: { text: "Sould contain only one @.", isvalid: false } });
                        return;
                    }
                    if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(val) && !this.state.email.isvalid) {
                        this.setState({ email: { text: "", isvalid: true } });
                        return;
                    }
                    break;
                }
            case "registerUserName":
                {
                    if (/[!@#$%^&*)(_+-=)]/.test(val)) {
                        this.setState({ username: { text: "Do not include !@#$%^&*)(_+=-)", isvalid: false } });
                        return;
                    }
                    if (val.length > 16) {
                        this.setState({ username: { text: "Try shorter user-name", isvalid: false } });
                        return;
                    }
                    if (val.includes(" ")) {
                        this.setState({ username: { text: "User name cannot include blank space.", isvalid: false } });
                        return;
                    }
                    if (val.length < 16 && val.length > 3) {
                        this.setState({ username: { text: "", isvalid: true } });
                        return;
                    }
                    break;
                }
            case "registerPasswd":
                {
                    let reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&()]).{8,18}/;

                    if (reg.test(val)) {
                        this.setState({ password: { text: "", isvalid: true } });
                        return;
                    }
                    if (!/[A-Z]/.test(val)) {
                        this.setState({ password: { text: " password must contain at least one uppercase letter", isvalid: false } });
                        return;
                    }
                    if (!/[a-z]/.test(val)) {
                        this.setState({ password: { text: "password must contain at least one lowercase letter (a-z)", isvalid: false } });
                        return;
                    }
                    if (!/[!@#$%^&()]/.test(val)) {
                        this.setState({ password: { text: "password should contain one of the following carachters: !@#$%^&() ", isvalid: false } });
                        return;
                    }
                    if (!/[0-9]/.test(val)) {
                        this.setState({ password: { text: "password must contain digits.", isvalid: false } });
                        return;
                    }
                    break;
                }
        }
    }


    register = (e) => {
        e.preventDefault();
        if (!(this.state.realm.isvalid && this.state.username.isvalid &&
            this.state.password && this.state.email.isvalid)) {
            alert("one of the fields is invalid");
            return false;
        }
        let fd = new FormData(document.getElementById("registrationForm"));
        Auth.register(fd, 'Login successed!!');
    }

    
    render() {
        if (this.state.redirTo != false) {
            return (<Redirect to={{
                pathname: '/home', state: this.state
            }} />);

        } else
            return (
                <div className='loginPage'>

                    <div className='loginBox'>
                        <div className='frow'>

                        </div>
                        <form className="form" onSubmit={this.handleLogin}>
                            <p className="mt-1">ברוכים הבאים !</p>
                            <div className='form-group'>
                                <input className="form-control" type='email' ref='email' placeholder='מייל' required />
                            </div>
                            <div className='form-group'>
                                <input className="form-control" type='password' ref='pw' placeholder='סיסמא' required />
                            </div>
                            <div className='form-group'>
                                {this.state.isLoading ?
                                    <button className='btn btn-warning'>מתחבר...</button> :
                                    <button onClick={this.handleLogin} type='button' className='btn btn-warning login_input'  >היכנס</button>
                                }
                            </div>
                        </form>
                        <div className='frow'>
                            <p onClick={this.openRegModal}>לא רשומים? הירשמו עכשיו!</p>
                            <ReactModal closeOnOverlayClick shouldCloseOnEsc showCloseIcon open={this.state.registerModal} center onClose={this.openRegModal}>
                                <form className="form" id="registrationForm" style={{ textAlign: 'center' }} onSubmit={this.register}>
                                    <p className="mt-3">מלאו את הפרטים הבאים</p>
                                    <div className="form-group">
                                        <label for="registerPrivateName">הכנס שם פרטי</label>
                                        <input onChange={this.handleInputChange} name='realm' id="registerPrivateName" className="form-control" type='text' required placeholder="הכנס את שמך"></input>
                                        <div className="validationError">{this.state.realm.text}</div>
                                    </div>
                                    <div className="form-group">
                                        <label for="registerEmail">הכנס כתובת מייל</label>
                                        <input onChange={this.handleInputChange} name='email' id="registerEmail" className="form-control" type='email' required placeholder={"example@gmail.com"}></input>
                                        <div className="validationError">{this.state.email.text}</div>
                                    </div>
                                    <div className="form-group">
                                        <label for="registerUserName">הכנס שם משתמש</label>
                                        <input onChange={this.handleInputChange} name='username' id="registerUserName" className="form-control" type='text' required placeholder="הכנס שם משתמש"></input>
                                        <div className="validationError">{this.state.username.text}</div>
                                    </div>
                                    <div className="form-group">
                                        <label for="registerPasswd">הכנס סיסמא</label>
                                        <input required name='password' id="registerPasswd" className="form-control" type='password' required placeholder="הכנס סיסמא" onChange={this.handleInputChange}></input>
                                        <div className="validationError">{this.state.password.text}</div>
                                    </div>
                                    <button className='btn btn-warning' type='submit'>הירשם!</button>
                                </form>
                            </ReactModal>
                        </div>


                    </div>
                </div>
            )
    }

}

export default Login;

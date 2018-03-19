import React, { Component } from 'react';

import './login_modal.css';

import LoginForm from './login_form';
import RegisterForm from './register_form';

class LoginModal extends Component {
  constructor(props) {
    super(props);

    this.state = { isRegister: false };

    this.toggleRegister = this.toggleRegister.bind(this);
  }

  toggleRegister() {
    this.setState({ isRegister: !this.state.isRegister });
  }

  render() {
    const loginOrRegister = this.state.isRegister
      ? <RegisterForm
        toggleRegister={ this.toggleRegister } />
      : <LoginForm
        closeModal={ this.props.closeModal }
        toggleRegister={ this.toggleRegister }
        login={ this.props.login }
        user={ this.props.user }/>;

    return (
      <div className='login_modal'>
        <div className='login_modal__box'>
          { loginOrRegister }
        </div>
      </div>
    )
  }
}

export default LoginModal;

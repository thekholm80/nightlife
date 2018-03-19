import React, { Component } from 'react';

import './login_form.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display_name: "",
      password: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleInputChange(event) {
    const newStateObj = {};

    newStateObj[event.target.id] = event.target.value;

    this.setState(newStateObj);
  }

  handleFocus(event) {
    if (event.target.value) {
      event.target.setSelectionRange(0, event.target.value.length);
    }
  }

  submit(event) {
    event.preventDefault();

    if (!this.state.display_name || !this.state.password) {
      this.setState({ message: "User name and password are required" }, () => {
        setTimeout(() => this.setState({ message: '' }), 1250);
      });

      return;
    }

    this.props.login(this.state.display_name, this.state.password);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.hasOwnProperty('error')) {
      this.setState({ message: nextProps.user.error }, () => {
        setTimeout(() => this.setState({ message: '' }), 1250);
      });

      return;
    }

    this.props.closeModal();
  }

  render() {
    const message = this.state.message
      ? <div className='login_form__message'>{ this.state.message }</div>
      : <div />;

    return (
      <div className='login_form'>
        <div className='login_form__title'>Login</div>
        { message }
        <form onSubmit={ this.submit } className='login_form__form'>
          <input type='text'
            id='display_name'
            value={ this.state.display_name }
            onChange={ this.handleInputChange }
            placeholder='User Name'
          />
          <input type='password'
            id='password'
            value={ this.state.password }
            onChange={ this.handleInputChange }
            placeholder='Password'
          />
          <input type='submit' value='Login' />
        </form>
        <div className='login_form__button_row'>
          <div className='login_form__button'
            onClick={ this.props.toggleRegister }>Register</div>
          <div className='login_form__button'
            onClick={ this.props.closeModal }>Cancel</div>
        </div>
      </div>
    )
  }
}

export default LoginForm;

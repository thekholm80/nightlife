import React, { Component } from 'react';
import axios from 'axios';

import './register_form.css';

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display_name: "",
      first_name: "",
      last_name: "",
      password: "",
      confirmPassword: "",
      message: ""
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
    // validate form
    if (!this.state.display_name
        && !this.state.password
        && !this.state.first_name
        && !this.state.last_name
        && !this.state.confirmPassword) {
      this.setState({ message: "All fields are required"}, () => {
        setTimeout(() => this.setState({ message: '' }), 1250);
      });

      return;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ message: "Passwords must match"}, () => {
        setTimeout(() => this.setState({ message: '' }), 1250);
      });

      return;
    }

    // withCredentials is required to send cookies with request
    const instance = axios.create(
      { withCredentials: true }
    );

    const url = '/auth/register',
          postData = {
            display_name: this.state.display_name,
            password: this.state.password,
            first_name: this.state.first_name,
            last_name: this.state.last_name
          };

    instance({
      method: 'post',
      url: url,
      data: postData
    }).then(response => {
      // check for error response
      if (response.data.hasOwnProperty('error')) {
        console.warn(response.data);
        this.setState({ message: response.data.error }, () => {
          setTimeout(() => this.setState({ message: '' }), 1250);
        });

        return;
      }

      this.setState({ message: "Success!" }, () => {
        setTimeout(() => {
          this.props.toggleRegister();
        }, 750);
      });
    }).catch(err => console.warn("Error register post", err));
  }

  render() {
    const message = this.state.message
      ? <div className='register_form__message'>{ this.state.message }</div>
      : <div />;
    return (
      <div className='register_form'>
        <div className='register_form__title'>Register</div>
        { message }
        <form onSubmit={ this.submit } className='register_form__form'>
          <input type='text'
            id='display_name'
            value={ this.state.display_name }
            onChange={ this.handleInputChange }
            onFocus={ this.handleFocus }
            placeholder='User Name'
          />
          <input type='text'
            id='first_name'
            value={ this.state.first_name }
            onChange={ this.handleInputChange }
            onFocus={ this.handleFocus }
            placeholder='First Name'
          />
          <input type='text'
            id='last_name'
            value={ this.state.last_name }
            onChange={ this.handleInputChange }
            onFocus={ this.handleFocus }
            placeholder='Last Name'
          />
          <input type='password'
            id='password'
            value={ this.state.password }
            onChange={ this.handleInputChange }
            onFocus={ this.handleFocus }
            placeholder='Password'
          />
          <input type='password'
            id='confirmPassword'
            value={ this.state.confirmPassword }
            onChange={ this.handleInputChange }
            onFocus={ this.handleFocus }
            placeholder='Confirm Password'
          />
          <input type='submit' value='Register' />
        </form>
        <div className='register_form__button_row'>
          <div className='register_form__button'
            onClick={ this.props.toggleRegister }>Back to Login</div>
        </div>
      </div>
    )
  }
}

export default RegisterForm;

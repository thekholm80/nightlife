import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './header_login.css';

import LoginButton from '../components/header/login_button';
import LogoutButton from '../components/header/logout_button';
import LoginModal from '../components/header/login_modal';

import { userLogin, userLogout } from '../actions/index';

class HeaderLogin extends Component {
  constructor(props) {
    super(props);

    this.state = { isModalOpen: false };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  handleLogin(display_name, password) {
    this.props.userLogin(display_name, password);
    //this.setState({ isModalOpen: false });
  }

  handleLogout() {
    this.props.userLogout();
  }

  render() {
    const loginModal = this.state.isModalOpen
          && <LoginModal closeModal={ this.toggleModal }
            login={ this.handleLogin }
            user={ this.props.user } />;

    const loginMessage = (this.props.user && this.props.user.display_name)
          ? <div>Hello, { this.props.user.display_name }</div>
          : <div>You are not logged in</div>;

    const button = (this.props.user && this.props.user.display_name)
          ? <LogoutButton handleClick={ this.handleLogout } />
          : <LoginButton handleClick={ this.toggleModal } />;

    return (
      <div className='header__login'>
        { loginModal }
        { loginMessage }
        { button }
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = dispatch => bindActionCreators(
  { userLogin, userLogout }, dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(HeaderLogin);

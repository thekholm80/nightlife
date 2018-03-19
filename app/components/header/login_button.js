import React from 'react';

import './login_button.css';

const LoginButton = props => {
  return (
    <div className='login' onClick={ props.handleClick }>Login</div>
  );
}

export default LoginButton;

import React from 'react';

import './logout_button.css';

const LogoutButton = props => {
  return (
    <div className="logout" onClick={ props.handleClick }>Logout</div>
  );
}

export default LogoutButton;

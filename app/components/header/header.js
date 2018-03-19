import React from 'react';

import './header.css';

import HeaderLogin from '../../containers/header_login';

const Header = () => {
  return (
    <div className='header'>
      <div className='header__title'>Nightlife Coordination</div>
      <HeaderLogin />
    </div>
  )
}

export default Header;

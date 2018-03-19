import React from 'react';

import './app.css';
require('../../server/public/favicon.ico');

import Header from './header/header';
import Search from '../containers/search';
import Results from '../containers/results/results';

const App = () => {
  return (
    <div className='app'>
      <Header />
      <Search />
      <Results />
    </div>
  )
}

export default App;

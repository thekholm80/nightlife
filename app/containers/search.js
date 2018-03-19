import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './search.css';

import { runSearch } from '../actions/index';


class Search extends Component {
  constructor(props) {
      super(props);

      this.state = { searchString: '' };

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleFocus = this.handleFocus.bind(this);
      this.submit = this.submit.bind(this);
  }

  handleInputChange(event) {
    this.setState({ searchString: event.target.value });
  }

  handleFocus(event) {
    if (event.target.value) {
      event.target.setSelectionRange(0, event.target.value.length);
    }
  }

  submit(event) {
    event.preventDefault();

    if (!this.state.searchString) return;

    this.props.runSearch(this.state.searchString);
  }

  render() {
    return (
      <div className='search'>
        <form onSubmit={ this.submit } className='search__form'>
          <input type='text'
            value={ this.state.searchString }
            placeholder='Which city?'
            onChange={ this.handleInputChange }
            onFocus={ this.handleFocus }
          />
          <input type='submit' value='Search' />
        </form>
        <div className='search__yelp'>Powered by:</div>
        <a href='https://biz.yelp.com/' target='_blank'>
          <img src={ require('../assets/Yelp_trademark_RGB.png') } />
        </a>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  { runSearch }, dispatch
);

export default connect(null, mapDispatchToProps)(Search);

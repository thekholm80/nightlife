import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { connect } from 'react-redux';

import './results.css';

import BarListItem from '../../components/barListItem';

const Results = props => {
  const resultsList = (props.data && props.data.hasOwnProperty('barListByLocation'))
    && props.data.barListByLocation.map(bar => <BarListItem key={ bar.id } bar={ bar } />);

  return (
    <div className='results'>
      { resultsList }
    </div>
  )
}

const BarListByLocation = gql`
  query BarListByLocation($loc: String!) {
    barListByLocation(loc: $loc) {
      id
      name
      location {
        display_address
      }
      display_phone
      attending_count
      error
    }
  }
`;

const mapStateToProps = ({ loc }) => {
  return { loc };
};

const ResultsWithData = graphql(BarListByLocation, {
  skip: ({ loc }) => !loc,
  options: props => ({
    variables: {
      loc: props.loc
    }
  })
})(Results);

const ResultsWithDataAndProps = connect(mapStateToProps)(ResultsWithData);

export default ResultsWithDataAndProps;

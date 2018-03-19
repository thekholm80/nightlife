import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { connect } from 'react-redux';

import './barDetails.css';

class BarDetails extends Component {
  constructor(props) {
    super(props);

    this.state = { isUserCheckedIn: false };

    this.checkIn = this.checkIn.bind(this);
    this.checkOut = this.checkOut.bind(this);
  }

  checkIn() {
    // verify user is logged in
    if (!this.props.user) {
      this.props.updateMessage("You must be logged in to do that");

      setTimeout(() => {
        this.props.updateMessage('');
      }, 1250);

      return;
    }
    // graphql mutation this.props.addMeToBar(display_name, bar_id)
    const { user: { display_name }, barID } = this.props;

    this.props.addMeToBar({
      variables: {
        display_name,
        bar_id: barID
      }
    }).then(this.props.data.refetch());
  }

  checkOut() {
    // verify user is logged in
    if (!this.props.user) {
      this.props.updateMessage("You must be logged in to do that");

      setTimeout(() => {
        this.props.updateMessage('');
      }, 1250);

      return;
    }
    // graphql mutation this.props.removeMeFromBar()
    const { user: { display_name }, barID } = this.props;

    this.props.removeMeFromBar({
      variables: {
        display_name,
        bar_id: barID
      }
    }).then(() => {
      this.props.data.refetch();
      this.setState({ isUserCheckedIn: false });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.hasOwnProperty('barDetailsByID') && nextProps.user) {
      const { attendees } = nextProps.data.barDetailsByID;
      const { display_name } = nextProps.user;

      const isFound = attendees.reduce((a, b) => {
        return b.display_name == display_name ? true : a;
      }, false);

      if (isFound) this.setState({ isUserCheckedIn: true });
    }

    if (!nextProps.user && this.state.isUserCheckedIn) {
      this.setState({ isUserCheckedIn: false });
    }
  }

  render() {
    const showDetails = this.props.data.loading
      ? <div>Loading...</div>
      : <div className='bar_details'>
        <img src={ this.props.data.barDetailsByID.photos[0] }
        alt='Bar photo' />
        <div className='bar_details__info'>
          <div>Rating: { this.props.data.barDetailsByID.rating }</div>
          <div>Categories: { this.props.data.barDetailsByID.categories.map((item, i) => {
            return <div key={ i } className='bar_details__info-indent'>{ item.title }</div>;
          })}</div>
          <div>Attendees: { this.props.data.barDetailsByID.attendees.map((item, i) => {
            return <div key={ i } className='bar_details__info-indent'>{ item.display_name }</div>
          })}</div>
        </div>
      </div>;

      const addOrRemove = this.state.isUserCheckedIn
        ? <div className='bar_details__button_row-button' onClick={ this.checkOut }>
          Remove me
        </div>
        : <div className='bar_details__button_row-button' onClick={ this.checkIn }>
          Add me
        </div>;

    return (
      <div>
        { showDetails }
        <div className='bar_details__button_row'>
          <div className='bar_details__button_row-button' onClick={ this.props.collapse }>
            Collapse
          </div>
          { addOrRemove }
        </div>
      </div>
    )
  }
}

const BarDetailsByID = gql`
  query BarDetailsByID($id: String!) {
    barDetailsByID(id: $id) {
      id
      name
      categories {
        alias
        title
      }
      rating
      photos
      attendees {
        display_name
      }
      error
    }
  }
`;

const AddMeToBar = gql`
  mutation AddMeToBar($display_name: String!, $bar_id: String!) {
    addMeToBar(display_name: $display_name, bar_id: $bar_id) {
      attending {
        display_name
      }
    }
  }
`;

const RemoveMeFromBar = gql`
  mutation RemoveMeFromBar($display_name: String!, $bar_id: String!) {
    removeMeFromBar(display_name: $display_name, bar_id: $bar_id) {
      attending {
        display_name
      }
    }
  }
`;

// const BarDetailsWithData = graphql(BarDetailsByID, {
//   options: props => ({
//     variables: {
//       id: props.barID
//     }
//   })
// })(BarDetails);

const mapStateToProps = ({ user }) => ({ user });

// const BarDetailsWithDataAndProps = connect(mapStateToProps)(BarDetailsWithData);
//
// export default BarDetailsWithDataAndProps;

export default compose(
  graphql(BarDetailsByID, {
    options: props => ({
      variables: {
        id: props.barID
      }
    })
  }),
  graphql(AddMeToBar, {
    name: 'addMeToBar'
  }),
  graphql(RemoveMeFromBar, {
    name: 'removeMeFromBar'
  }),
  connect(mapStateToProps)
)(BarDetails);

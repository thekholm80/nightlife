import React, { Component } from 'react';

import './barListItem.css';

import BarDetails from '../containers/results/barDetails';

class BarListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
      message: ''
    }

    this.toggleExpand = this.toggleExpand.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
  }

  toggleExpand() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  handleClick() {
    return !this.state.isExpanded && this.toggleExpand();
  }

  updateMessage(message) {
    this.setState({ message: message });
  }

  render() {
    const { bar } = this.props;
    const imageAlt = `Image from ${ bar.name }`;
    const containerClass = this.state.isExpanded
      ? "bar_list_item-active"
      : "bar_list_item";

    const message = this.state.message
      && <div className='bar_list_item__message'>{ this.state.message }</div>;

    const barDetails = this.state.isExpanded
      && <BarDetails barID={ bar.id } collapse={ this.toggleExpand } updateMessage={ this.updateMessage } />;

    return (
      <div className={ containerClass } onClick={ this.handleClick }>
        <a href={ bar.url } target='_blank'>{ bar.name }</a>
        { bar.location.display_address.map((line, i) => <div key={ i }>{ line }</div>) }
        <div>{ bar.display_phone }</div>
        <div className='bar_list_item__attending'>
          Checked in: { bar.attending_count }
        </div>
        { message }
        { barDetails }
      </div>
    )
  }
}

export default BarListItem;

/*
return (
  <div className='bar_list_item'>
    <div className='bar_list_item__top' onClick={ this.handleClick }>
      <img src={ bar.image_url } alt={ imageAlt }/>
      <div>
        <a href={ bar.url } target='_blank'>{ bar.name }</a>
        { bar.location.display_address.map((line, i) => <div key={ i }>{ line }</div>) }
        <div>{ bar.display_phone }</div>
        <div onClick={ this.handleClick } id={ bar.id } className='bar_list_item__attending'>
          Checked in: { bar.attending_count }
        </div>
      </div>
    </div>
    { barDetails }
  </div>
)
*/

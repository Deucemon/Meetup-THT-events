import React, { Component } from 'react';
import './TextBlock.css';

export default class TextBlock extends Component {
  render() {
    return (
      <div className="TextBlock">

        <h1>
          {this.props.title}
        </h1>
        
        {this.props.children}

      </div>
    )
  }
}

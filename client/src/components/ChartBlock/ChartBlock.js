import React, { Component } from 'react';
import './ChartBlock.css';

export default class ChartBlock extends Component {
  render() {
    return (
      <div className="ChartBlock" style={{backgroundColor: this.props.backgroundColor}}>

        <h1>
          {this.props.primaryStat} {this.props.title}
        </h1>
        
        <div>

          <small>
            {this.props.secondaryStat}
          </small>

        </div>

      </div>
    )
  }
}

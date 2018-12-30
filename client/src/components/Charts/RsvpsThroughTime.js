import React, { Component } from 'react';
import './RsvpsThroughTime.css';
import { Bar } from 'react-chartjs-2';

export default class RsvpsThroughTime extends Component {
  render() {

    const randomScalingFactor = () => {
      let min = 1;
      let max = 5;
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    const barChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'The Hague',
        backgroundColor: '#49b07b',
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ]
      }, {
        label: 'The Hague Tech',
        backgroundColor: '#1126a9',
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ]
      }]
    };
    return (
      <div className="RsvpsThroughTime">

        <Bar
          data={barChartData}
          width={100}
          height={40}
          options={{
            title: {
              display: true,
              text: 'RSVP\'s through time: The Hague (Tech)'
            },
            tooltips: {
              mode: 'index',
              intersect: false
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 50,
                bottom: 50
              }
            },
            responsive: true,
            scales: {
              xAxes: [{
                stacked: true,
              }],
              yAxes: [{
                stacked: true
              }]
            }
            // maintainAspectRatio: false
          }}
        />

      </div>
    )
  }
}

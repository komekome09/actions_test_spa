import React from 'react';
import logo from './logo.svg';
import './App.css';

class FlightTable extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th colSpan={2}>The table header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>the table body</td>
            <td>with two column</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default class FlightBoard extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <FlightTable />
        </header>
      </div>
    );
  }
}
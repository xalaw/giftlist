import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Cookies from 'js-cookie';
import logo from './logo.svg';
import { isLoggedIn } from './actions/auth';
import './App.css';

class App extends Component {
  componentDidMount() {
    const accessToken = Cookies.get('accessToken');
    if(accessToken) {
      console.log('You are logged in.');
      this.props.dispatch(isLoggedIn());
      console.log('Dispatch?');
    }
  }

  render() {
    console.log('this.props.isLoggedIn: ',this.props.isLoggedIn);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {!this.props.isLoggedIn ? <a href={'/api/auth/google'} className='login-btn' >LOGIN</a> : <h1>Welcome!</h1>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {isLoggedIn: state.authReducer.isLoggedIn,}
};

export default connect(mapStateToProps)(App);

import React, { Component } from 'react';
import './index.css';
//import App from './App';
import CameraApp from './App';
import Navbar from './Navbar';

class Root extends Component {
    render() {
        return(
            <div className = "root">
                <Navbar/>
                <CameraApp/>
            </div>
        )
    }
  }
  
  export default Root;

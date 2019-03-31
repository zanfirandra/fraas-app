import React, { Component } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './App.css';

/* class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;

 */
class CameraApp extends Component {
  state = {
    imageData: null,
    image_name:'',
    saveImage: false
  }
//setRef and capture methods are used to call activate the webcam and capture the image.
  setRef = webcam => {
    this.webcam = webcam;
  }

  capture = () => {
    const imgSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imgSrc
    })
  }
//onClickRetake callback function allows you to retake the image if you are not satisfied with the current image.
  onClickRetake = (e) => {
    e.persist();
    this.setState({
      imageData: null
    })
  }
//onClickSave to change the saveImage state, which will allow me to turn off the webcam after I take a picture with a conditional statement.
  onClickSave = async (e) => {
    let imageObj =  {
      image_name: this.state.image_name,
      image_data: this.state.imageData
    }
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
    };
    var response = await axios.post('/', imageObj, axiosConfig )
    console.log(response)
    
  }
//handleChange callback allows the user to input a filename if they wish to 
  handleChange = (e) => {
    e.persist();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSaveSubmit = (e) => {
    /* e.preventDefault();
    let imageObj =  {
      image_name: this.state.image_name,
      job_id: this.props.job.id,
      image_data: this.state.imageData
    }

    this.props.saveJobImage(imageObj); */
    
  }

  saveForm = () => {
    return (
      <div>
        <form on onSubmit = {this.handleSaveSubmit}>
          <p>
            <label>Image name: </label>
            <input type = "text"
              name = "image_name"
              value = {this.state.image_name}
              onChange = {this.handleChange}/>
              <input type = "submit" value = "Save"/>
          </p>
        </form>
      </div>
    )
  }

  render() {
    //videoConstraints object stores the saved image parameters, and which camera to use.
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user'
    };

    return (
      <div>
        <Webcam 
          audio = {false}
          height = {350}
          ref = {this.setRef}
          screenshotFormat = "image/jpeg"
          width = {350}
          videoConstraints = {videoConstraints} />
          <div className = "button-container"><button onClick = {this.capture}>Capture photo</button></div>
          {this.state.imageData ? <div>
            <p><img src = {this.state.imageData} alt = "" /></p>
            <span><button onClick = {this.onClickRetake}>Retake?</button></span>
            <span><button onClick = {this.onClickSave}>Save?</button></span>
          </div> 
          : null}
      </div>
    )
  }
}

export default CameraApp;
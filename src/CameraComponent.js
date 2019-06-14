import React, { Component } from "react";
import Webcam from "react-webcam";
import { Button } from "react-bootstrap";

import "./app.css";

class CameraApp extends Component {
  state = {
    imageData: null,
    savedImage: false
  };
  //setRef and capture methods are used to call activate the webcam and capture the image.
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imgSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imgSrc
    });
  };
  //onClickRetake callback function allows you to retake the image if you are not satisfied with the current image.
  onClickRetake = e => {
    e.persist();
    this.setState({
      imageData: null
    });
  };
  //onClickSave to change the saveImage state, which will allow me to turn off the webcam after I take a picture with a conditional statement.
  onClickSave = async e => {
    await this.setState({
      savedImage: true
    });
    this.props.handleImageData(this.state);
  };

  //handleChange callback allows the user to input a filename if they wish to
  handleChange = e => {
    e.persist();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    //videoConstraints object stores the saved image parameters, and which camera to use.
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        />
        <div className="button-container">
          <Button id="capture" variant="light" onClick={this.capture}>
            Capture photo
          </Button>
        </div>
        {this.state.imageData ? (
          <div>
            <p>
              <img src={this.state.imageData} alt="" />
            </p>
            <span>
              <Button id="retake" variant="light" onClick={this.onClickRetake}>
                Retake
              </Button>
            </span>
            <span>
              <Button id="save" variant="light" onClick={this.onClickSave}>
                Save
              </Button>
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}

export default CameraApp;

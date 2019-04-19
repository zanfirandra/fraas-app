import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import CameraApp from "./CameraComponent";

const styles = theme => ({
  root: {
    width: "90%"
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

function getSteps() {
  return ["Enter your name", "Take a selfie", "Submit data"];
}

/* function getStepContent(step, saveImage) {
  switch (step) {
    case 0:
      return nameInput;
    case 1:
      return cammeraStep(saveImage);
    case 2:
      return "This is the bit I really care about!";
    default:
      return "Unknown step";
  }
} */

class HorizontalLinearStepper extends React.Component {
  constructor() {
    super();
    this.handleImageData = this.handleImageData.bind(this);
    this.handleSubmitInfo = this.handleSubmitInfo.bind(this);
  }

  state = {
    activeStep: 0,
    imageData: null,
    inputValue: ""
  };

  nameInput = () => {
    return <input placeholder="John Doe..." onChange={this.updateInputValue} />;
  };

  getStepContent(step) {
    switch (step) {
      case 0:
        return this.nameInput();
      case 1:
        return this.cammeraStep();
      case 2:
        return "This is the bit I really care about!";
      default:
        return "Unknown step";
    }
  }

  updateInputValue = evt => {
    this.setState({
      inputValue: evt.target.value
    });
  };

  cammeraStep = () => {
    return <CameraApp handleImageData={this.handleImageData} />;
  };

  handleImageData = __state => {
    console.log(__state);
    this.setState({
      imageData: __state.imageData,
      savedImage: __state.savedImage
    });
  };

  handleNext = () => {
    const { activeStep } = this.state;
    const steps = getSteps();
    this.setState({
      activeStep: activeStep + 1,
      saveImage: activeStep === 1 ? true : false
    });
    // finish step
    if (activeStep === steps.length - 1 && this.state.savedImage) {
      this.handleSubmitInfo();
    }
  };

  async handleSubmitInfo() {
    let imageObj = {
      image_data: this.state.imageData,
      user_name: this.state.inputValue
    };
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    var response = await axios.post("/", imageObj, axiosConfig);
    console.log(response);
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {};
            const labelProps = {};

            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&apos;re finished
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>
                {this.getStepContent(activeStep)}
              </Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(HorizontalLinearStepper);

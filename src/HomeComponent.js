import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl
} from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import CameraApp from "./CameraComponent";
import { authService } from "./auth";
import Modal from "react-bootstrap/Modal";
import "./app.css";

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

class HorizontalLinearStepper extends React.Component {
  constructor() {
    super();
    this.handleImageData = this.handleImageData.bind(this);
    this.handleSubmitInfo = this.handleSubmitInfo.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.state = {
      activeStep: 0,
      imageData: null,
      inputValue: "",
      showModal: false,
      modalTitle: "",
      modalBody: "",
      spoofed: true
    };
  }

  nameInput = () => {
    return (
      <div>
        <label htmlFor="basic-url">Enter your name</label>
        <InputGroup
          className="mb-3"
          placeholder="John Doe..."
          onChange={this.updateInputValue}
        >
          <FormControl placeholder="Username" />
        </InputGroup>
      </div>
    );
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

  handleImageData = async __state => {
    await this.setState({
      imageData: __state.imageData,
      savedImage: __state.savedImage
    });
    const response = await authService.performLivenessDetection(
      this.state.imageData
    );
    console.log(response);
    this.setState({
      showModal: true,
      modalBody: response.success || response.error,
      spoofed: response.error ? true : false
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
    let userInfo = {
      image_data: this.state.imageData,
      user_name: this.state.inputValue
    };
    let isGranted;
    const response = await authService.sendDataforAuth(userInfo);

    if (response === true) {
      isGranted = await authService.accessPrivateResources();
      console.log("handleAccesResources: isGranted ", isGranted);
      if (isGranted.success) {
        this.setState({
          showModal: true,
          modalTitle: "Success",
          modalBody:
            " Welcome, " +
            userInfo.user_name +
            " . You have been recognized. Now you can access your private resources!"
        });
      } else {
        this.setState({
          showModal: true,
          modalTitle: "Error",
          modalBody: isGranted.error
        });
      }
    } else {
      this.setState({
        showModal: true,
        modalTitle: "Error",
        modalBody: response
      });
    }
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      spoofed: true
    });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    const { spoofed } = this.state;

    return (
      <Container className={classes.root}>
        <Row>
          <Col>
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
          </Col>
        </Row>
        <Row>
          <Col />
          <Col>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button
                  variant="light"
                  onClick={this.handleReset}
                  className={classes.button}
                >
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
                    variant="light"
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                    className={classes.button}
                    id="left"
                  >
                    Back
                  </Button>

                  <Button
                    variant="light"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                    id="right"
                    disabled={spoofed && activeStep !== 0}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            )}
          </Col>
          <Col />
        </Row>

        <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalBody}</Modal.Body>
        </Modal>
      </Container>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(HorizontalLinearStepper);

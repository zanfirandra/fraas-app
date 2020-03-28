This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `flask run --port=2000`

Runs the python server in the development mode on port 2000.

Before you run this command:
Open Command Prompt. Activate python enviroment within Scripts folder, running 'activate' command.

- ...fraas-app\py-env\Scripts>activate

- (py-env)...fraas-app\servers\pythonServer>set FLASK_APP=service_recognition.py

- (py-env)...fraas-app\servers\pythonServer>set FLASK_DEBUG=1
  (on mac use 'export' instead of 'set')
- (py-env)...fraas-app\servers\pythonServer>flask run --port=2000

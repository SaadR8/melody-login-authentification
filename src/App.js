import React from 'react';
import './App.css';
import Form from './components/Form'
import Mic from './components/Mic'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/audio">
          <Mic />
        </Route>
        <Route path="/">
          <Form />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

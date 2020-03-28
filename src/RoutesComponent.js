import React from "react";
import { Switch, Route } from "react-router-dom";
import HomeComponent from "./HomeComponent";

const RoutesComponent = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
    </Switch>
  </main>
);

export default RoutesComponent;

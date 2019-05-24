import React from "react";
import { Switch, Route } from "react-router-dom";
import HomeComponent from "./HomeComponent";
import ThirdPartyComponent from "./ThirdPartyComponent";

const RoutesComponent = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
      <Route path="/third-party" component={ThirdPartyComponent} />
    </Switch>
  </main>
);

export default RoutesComponent;

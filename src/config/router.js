import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../containers/home";
import SingleFolder from "../containers/singlefolder";

class AppRouter extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/foldersystem/:id" component={Home} />
        <Route
          exact
          path="/foldersystem/:id/:foldername"
          component={SingleFolder}
        />
        <Route
          exact
          path="/foldersystem/:id/:foldername/:cnd"
          component={SingleFolder}
        />
      </Router>
    );
  }
}

export default AppRouter;

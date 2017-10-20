import React from "react";
import Articles from "./pages/Articles";
import Saved from "./pages/Saved";
import Nav from "./components/Nav";
import { BrowserRouter as Router, Route} from "react-router-dom"
// switch?

const App = () =>
<Router>
  <div>
    <Nav />
      <Route path="/" component={Articles} />
      <Route exact path="/saved" component={Saved} />
  </div>
</Router>;

export default App;

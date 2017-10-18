import React from "react";
import "./Jumbotron.css"

const Jumbotron = (props) =>
  <div className="jumbotron" id={props.id}>
    {props.children}
  </div>;

export default Jumbotron;
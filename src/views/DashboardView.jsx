import React, { useState, useEffect, useMemo } from "react";
import IterationShowcase from "../components/iterationShowcase.jsx";

import Button from "@mui/material/Button";

import * as localStorageHelper from "../helpers/localStorageHelper.js";

const DashboardView = (props) => {
  const [myIterations, setMyIterations] = useState([]);

  const [selectedIteration, setSelectedIteration] = useState();

  useEffect(() => {
    // load myIterations from local storage
    let tmp = localStorageHelper.getMyIterationsFromLocalStorage();
    if (tmp === null) {
      tmp = [];
    }
    setMyIterations(tmp);
    return () => {
      // clean up
      console.log("clean up in DashboardView.jsx");
    };
  }, []);

  const createNewIterationBtnClicked = () => {
    props.startView("create-iteration");
  };

  const getIterationShowcase = () => {
    if (selectedIteration) {
      return <IterationShowcase iteration={selectedIteration} />;
    } else {
      return <div></div>;
    }
  };

  const openIterationShowcase = (id) => {
    if (selectedIteration && selectedIteration.id == id) {
      setSelectedIteration();
      return;
    }
    setSelectedIteration(myIterations.find((iteration) => iteration.id === id));
  };

  const clearAllIterations = () => {
    localStorageHelper.clearAllIterations();
    setSelectedIteration();
    setMyIterations([]);
  };

  const sortedIterations = useMemo(() => {
    return myIterations.sort((a, b) => (a.myTitle > b.myTitle ? 1 : -1));
  }, [myIterations]);

  /**
   * Loads and returns the JSX element representing the list of iterations.
   *
   * @return {JSX.Element} The JSX element representing the list of iterations.
   */
  const loadMyIterationsList = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {sortedIterations.map((iteration) => {
          return (
            <div
              key={iteration.id}
              className="iterations-container"
              style={
                selectedIteration && selectedIteration.id === iteration.id
                  ? selectedIterationContainerStyle
                  : myIterationContainerStyle
              }
              onClick={() => openIterationShowcase(iteration.id)}
            >
              <div className="iteration-title">{iteration.myTitle}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const getIterationShowcaseContainer = () => {
    if (selectedIteration) {
      return (
        <div style={selectedIterationShowcaseContainerStyle}>
          {getIterationShowcase()}
        </div>
      );
    }
  };

  const myStyle = {
    padding: "1rem",
    margin: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const myIterationContainerStyle = {
    padding: "1rem",
    margin: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    width: "20rem",
    textAlign: "center",
  };

  const selectedIterationContainerStyle = {
    padding: "1rem",
    margin: "1rem",
    border: "2px solid black",
    borderRadius: "4px",
    backgroundColor: "#f0f0f0",
    width: "20rem",
    textAlign: "center",
    cursor: "pointer",
  };

  const selectedIterationShowcaseContainerStyle = {
    padding: "1rem",
    margin: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div className="dashboard-container row" style={myStyle}>
      <div className="my-iterations-container col">
        <h1>My Iterations</h1>
        {loadMyIterationsList()}
        <div className="button-bar row">
          <Button onClick={clearAllIterations}>Clear All Iterations</Button>
          <Button variant="contained" onClick={createNewIterationBtnClicked}>
            Create New Iteration
          </Button>
        </div>
      </div>
      <div className="iteration-showcase-container col">
        {getIterationShowcaseContainer()}
      </div>
    </div>
  );
};

export default DashboardView;

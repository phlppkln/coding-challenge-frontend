import React, { useEffect, useState } from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import Button from "@mui/material/Button";

import * as localStorageHelper from "../helpers/localStorageHelper.js";

const IterationShowcase = (props) => {
  const myIteration = props.iteration;
  const [myTitle, setMyTitle] = useState("");

  useEffect(() => {
    reloadIteration();
  }, [myIteration, props.iteration]);

  const reloadIteration = () => {
    setMyTitle(myIteration.myTitle);
  };

  const deleteIteration = () => {
    console.log("deleteIteration()");

    localStorageHelper.removeIterationFromLocalStorage(myIteration.id);
    window.location.reload();
  };

  const questionsList = myIteration.myAnswers.map((answer, index) => {
    return (
      <div>
        <div
          key={index}>
          <h3>{answer.question}</h3>
        </div>
        <div>
          Antworten:
          {answer.answers.map((answerResults, index) => {
            return (
              <div
                key={index}>
                <p>
                  {answerResults.selected ? (
                    <CheckCircleOutlinedIcon
                      style={{ color: "green", fontSize: "1.7em" }}
                    />
                  ) : (
                    <CancelOutlinedIcon
                      style={{ color: "gray", fontSize: "1.2em" }}
                    />
                  )}{" "}
                  {answerResults.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <>
      <h1>{myTitle}</h1>
      <div>
        <p>Datum: {new Date(myIteration.createdAt).toString()}</p>
        <p>
          Status:{" "}
          {myIteration.finished ? "abgeschlossen" : "nicht abgeschlossen"}
        </p>
      </div>

      {questionsList}

      <Button variant="contained" onClick={deleteIteration}>
        Delete
      </Button>
    </>
  );
};

export default IterationShowcase;

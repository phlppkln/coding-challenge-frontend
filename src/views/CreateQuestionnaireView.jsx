import React from "react";
import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Question from "../components/new-iteration/Question.jsx";

import * as localStorageHelper from "../helpers/localStorageHelper.js";

/**
 * A React component that represents the view for creating a new iteration.
 * First we get the questions from the JSON file. We then construct an array of Question components for the stepper.
 * We then render the stepper with the Question components.
 * If we click the create button, we save the title and the questions in the local storage and navigate to the dashboard view.
 *
 * Error handling is done in this component. We show an error message if the title is not set. We show an error message if the question is not finished (at least two answers need to be selected).
 *
 * @param {object} props - The properties passed to the component.
 * @return {JSX.Element} The JSX element representing the component.
 */
function CreateIterationView(props) {
  const [questionnaireSteps, setQuestionnaireSteps] = useState([]); // Question.jsx views for the questionnaire stepper
  const [activeQuestionStep, setActiveQuestionStep] = useState(0); // Index of the active question step
  const [questionStepFinished, setQuestionStepFinished] = useState(false); // true if current question step is finished
  const [showErrorMessage, setShowErrorMessage] = useState(false); // true if there is an error with the current question step
  const [showErrorMessageMissingTitle, setShowErrorMessageMissingTitle] =
    useState(false); // true if the title is not set

  const [newQuestionnaireText, setQuestionnaireText] = useState([]);
  const [myTitle, setMyTitle] = useState("");
  const [myQuestionnaire, setMyQuestionnaire] = useState([]);

  const [createDisabled, setCreateDisabled] = useState(true);

  useEffect(() => {
    // reset question step finished and show error message if active question step changes
    setQuestionStepFinished(false);
    setShowErrorMessage(false);
  }, [activeQuestionStep]);

  useEffect(() => {
    // check if create button should be disabled
    isCreateDisabled();
  }, [questionStepFinished, activeQuestionStep, myTitle]);

  useEffect(() => {
    // fetch questions from json file
    if (newQuestionnaireText.length === 0) {
      fetch("/data/questions.json")
        .then((response) => response.json())
        .then((data) => setQuestionnaireText(data))
        .catch((error) => console.error(error));
    }

    // if newQuestionnaireText is not empty and myQuestionnaire is empty, create myQuestionnaire
    if (newQuestionnaireText.length > 0 && myQuestionnaire.length === 0) {
      createMyQuestionnaire();
    }
  }, [newQuestionnaireText]);

  useEffect(() => {
    // if myQuestionnaire is not empty, fill myQuestionnaireSteps
    if (myQuestionnaire.length > 0) {
      fillMyQuestionnaireSteps();
    }
  }, [myQuestionnaire]);

  /**
   * Fills the questionnaire steps with questions from the myQuestionnaire array.
   */
  const fillMyQuestionnaireSteps = () => {
    let tmps = [];
    for (let i = 0; i < myQuestionnaire.length; i++) {
      tmps.push(
        <Question
          key={myQuestionnaire[i].questionId}
          questionText={myQuestionnaire[i].question}
          myAnswers={myQuestionnaire[i].answers}
          updateMyParentAnswers={updateMyQuestionnaireAnswers}
          questionFinished={handleQuestionFinished}
          questionNotFinished={handleQuestionNotFinished}
          editable={true}
        />
      );
    }
    setQuestionnaireSteps(tmps);
  };

  // wrapper functions for questionStepFinished state
  const handleQuestionFinished = () => {
    setQuestionStepFinished(true);
  };

  const handleQuestionNotFinished = () => {
    setQuestionStepFinished(false);
  };

  const createMyQuestionnaire = () => {
    // create a new questionnaire in myQuestionnaire
    let tmpQuestionnaire = [];
    for (let i = 0; i < newQuestionnaireText.length; i++) {
      //create answers array
      let tmpQuestionnaireAnswersObj = [];
      for (let j = 0; j < newQuestionnaireText[i].answers.length; j++) {
        //create answers object
        tmpQuestionnaireAnswersObj.push({
          text: newQuestionnaireText[i].answers[j],
          selected: false,
        });
      }

      tmpQuestionnaire.push({
        question: newQuestionnaireText[i].question,
        questionId: newQuestionnaireText[i].id,
        answers: tmpQuestionnaireAnswersObj,
      });
    }
    setMyQuestionnaire(tmpQuestionnaire);
  };

  /**
   * add my new iteration of the questionnaire to local storage
   * @param {boolean} iterationFinished true if iteration is finished
   */
  const addIterationToLocalStorage = (iterationFinished) => {
    const newIteration = {
      createdAt: new Date(),
      finished: iterationFinished,
      deleted: false,
      myTitle: myTitle,
      myAnswers: myQuestionnaire,
    };

    localStorageHelper.addIterationToLocalStorage(newIteration);
  };

  const createIterationBtnClicked = () => {
    // check if title is set
    if (myTitle === "") {
      setShowErrorMessageMissingTitle(true);
    }
    // check if question is finished
    if (!questionStepFinished) {
      setShowErrorMessage(true);
    }

    // if title is set and question is finished
    if (myTitle !== "" && questionStepFinished) {
      addIterationToLocalStorage(true);
      props.startView("dashboard");
    }    
  };

  const cancelBtnClicked = () => {
    addIterationToLocalStorage(false);
    props.startView("dashboard");
  };

  const updateMyQuestionnaireAnswers = (questionText, answers) => {
    // find question with questionText from myQuestionnaire
    let myQuestion = myQuestionnaire.find((q) => q.question === questionText);
    //update answers of myQuestionnaire where myQuestionnaire.question = questionText
    myQuestion.answers = answers;

    // update myQuestionnaire
    setMyQuestionnaire(myQuestionnaire);
  };

  const handleNext = () => {
    if (questionStepFinished) {
      setActiveQuestionStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setShowErrorMessage(true);
    }
  };

  const isCreateDisabled = () => {
    if (activeQuestionStep != questionnaireSteps.length - 1) {
      setCreateDisabled(true);
    } else {
      setCreateDisabled(false);
    }
  };

  const myStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <>
      <div style={myStyle}>
        <h1>New Iteration</h1>
        <TextField
          id="outlined-basic"
          label="Your Iteration Title (required)"
          variant="outlined"
          value={myTitle}
          onChange={(event) => setMyTitle(event.target.value)}
        />
        <Box
          className="{question-step-container"
          sx={{ height: 255, maxWidth: 400, width: "100%", p: 2 }}
        >
          {questionnaireSteps[activeQuestionStep]}
        </Box>
        <MobileStepper
          variant="text"
          steps={questionnaireSteps.length}
          position="static"
          activeStep={activeQuestionStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeQuestionStep === questionnaireSteps.length - 1}
            >
              Next
            </Button>
          }
        />
        <div>
          {showErrorMessage ? (
            <div style={{ color: "red" }}>
              <p>Please select at least one answer</p>
            </div>
          ) : null}
        </div>
        <div>
          {showErrorMessageMissingTitle ? (
            <div style={{ color: "red" }}>
              <p>Please enter a title</p>
            </div>
          ) : null}
        </div>
        <div className="button-bar">
          <Button variant="outlined" onClick={cancelBtnClicked}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={createDisabled}
            onClick={createIterationBtnClicked}
          >
            Create
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateIterationView;

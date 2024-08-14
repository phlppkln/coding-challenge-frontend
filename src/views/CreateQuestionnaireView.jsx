import React from "react";
import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Question from "../components/new-iteration/Question.jsx";

/**
 * A React component that represents the view for creating a new iteration.
 *
 * @param {object} props - The properties passed to the component.
 * @return {JSX.Element} The JSX element representing the component.
 */
function CreateIterationView(props) {
  const [questionnaireSteps, setQuestionnaireSteps] = useState([]);
  const [activeQuestionStep, setActiveQuestionStep] = useState(0);
  const [questionStepFinished, setQuestionStepFinished] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showErrorMessageMissingTitle, setShowErrorMessageMissingTitle] = useState(false);

  const [newQuestionnaireText, setQuestionnaireText] = useState([]);
  const [myTitle, setMyTitle] = useState("");
  const [myQuestionnaire, setMyQuestionnaire] = useState([]);

  const [createDisabled, setCreateDisabled] = useState(true);

  useEffect(() => {
    setQuestionStepFinished(false);
    setShowErrorMessage(false);
  }, [activeQuestionStep]);

  useEffect(() => {
    isCreateDisabled();
  }, [questionStepFinished, activeQuestionStep, myTitle]);

  useEffect(() => {
    // load new questionnaire from json
    if (newQuestionnaireText.length === 0) {
      fetch("data/questions.json")
        .then((response) => response.json())
        .then((data) => setQuestionnaireText(data))
        .catch((error) => console.error(error));
    }

    if (newQuestionnaireText.length > 0 && myQuestionnaire.length === 0) {
      createMyQuestionnaire();
    }
  }, [newQuestionnaireText]);

  useEffect(() => {
    if (myQuestionnaire.length > 0) {
      fillMyQuestionnaireSteps();
    }
  }, [myQuestionnaire]);

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
    let iterations = JSON.parse(localStorage.getItem("myIterations"));

    if (iterations === null || iterations.length === 0) {
      iterations = [];
    }

    const newIteration = {
      id: iterations.length + 1,
      createdAt: new Date(),
      finished: iterationFinished,
      deleted: false,
      myTitle: myTitle,
      myAnswers: myQuestionnaire,
    };

    iterations.push(newIteration);
    localStorage.setItem("myIterations", JSON.stringify(iterations));
  };

  const createIterationBtnClicked = () => {
    if(myTitle === "") {
      setShowErrorMessageMissingTitle(true);
    } 
    if (!questionStepFinished) {
      setShowErrorMessage(true);
    }
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
    // update myQuestionnaire
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

  const handleBack = () => {
    setActiveQuestionStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isCreateDisabled = () => {
    if (
      activeQuestionStep != questionnaireSteps.length - 1
    ) {
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
        <h1>Neue Iteration</h1>
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
          /*           backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeQuestionStep === 0}
            >
              Back
            </Button>
          } */
        />
        <div>{showErrorMessage ? (<div style={{color: "red"}}><p>Please select at least two answers</p></div>) : null}</div>
        <div>{showErrorMessageMissingTitle ? (<div style={{color: "red"}}><p>Please enter a title</p></div>) : null}</div>
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

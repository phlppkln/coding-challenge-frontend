import React, { useState } from "react";

import {
  FormControlLabel,
  Checkbox,
} from "@mui/material";

/**
 * A React functional component that renders a question with multiple choice answers.
 *
 * @param {Object} props - The component props.
 * @param {string} props.questionText - The text of the question.
 * @param {Array<Object>} props.myAnswers - The answers to the question, where each answer is an object with 'text' and 'selected' properties.
 * @param {Function} props.updateMyParentAnswers - A callback function to update the parent component's answers.
 * @param {boolean} props.editable - Whether the answers can be edited.
 * @return {JSX.Element} The rendered question component.
 */
const Question = (props) => {

  const [myAnswers, setMyAnswers] = useState(props.myAnswers);

  const handleChange = (event, answer, index) => {
    // set answer to selected in myAnswers
    const updatedAnswers = [...myAnswers];
    updatedAnswers[index].selected = event.target.checked;
    setMyAnswers(updatedAnswers);

    // update parent component
    props.updateMyParentAnswers(props.questionText, myAnswers);

    // if at least two answers are selected, enable next button in parent component
    if (myAnswers.filter((a) => a.selected).length >= 2) {
      props.questionFinished();
    } else {
      props.questionNotFinished();
    }
  };

  const myStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "2rem",
  };

  return (
    <div style={myStyle}>
      <p>{props.questionText}</p>
      {myAnswers.map((answer, index) => (
        <FormControlLabel
          key={index}
          label={answer.text}
          control={            
          <Checkbox 
            checked={answer.selected}
            onChange={(event) => handleChange(event, answer, index)} />
          }
        />
      ))}
    </div>
  );
};

export default Question;

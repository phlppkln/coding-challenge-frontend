import React from "react";

const Question = (props) => {

    const myStyle = {
        color: "red"
    }

  return (
    <div style={ myStyle }>
      <div className="question">{props.question}</div>
      <div className="answers">{props.answers}</div>
    </div>
  );
};

export default Question;

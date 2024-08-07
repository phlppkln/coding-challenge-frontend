import React from 'react'
import { useEffect, useState } from 'react'

import TextField from '@mui/material/TextField'

import Question from '../components/new-iteration/Question.jsx'

function CreateIterationForm() {

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      // load mockup questions from json
      fetch('data/questions.json')
        .then((response) => response.json())
        .then((data) => setQuestions(data))
        .catch((error) => console.error(error))
    }, [])

  return (
    <>
    <div>
      <h1>Neuer Fragebogen</h1>
      <TextField id="outlined-basic" label="Your Iteration Title" variant="outlined" />

      {questions.map((question) => (
        <Question
          key={question.id}
          question={question.question}
          answers={question.answers}
        />
      ))}
    </div>
    </>
  )
}

export default CreateIterationForm;
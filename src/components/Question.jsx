import { useState } from "react";
import { nanoid } from 'nanoid'
import Answer from './Answer'

export default function Question(props) {
  // Store which of the 4 corresponding answers has been selected (null / value)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // Create four answers
  const allAnswers = props.answers.map((answer) => {
    return <Answer key={nanoid()} value={answer} selectedAnswer={selectedAnswer} setSelectedAnswer={setSelectedAnswer}/>
  })

  return (
      <section className="question">
        <p className="question__title">{props.question}</p>
        <div className="question__option-container">
          {allAnswers}
        </div>
      </section>
  )
}
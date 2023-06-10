import { useState } from 'react'
import { nanoid } from 'nanoid'
import Answer from './Answer'

export default function Question(props) {
  // Create four answers
  const allAnswers = props.answers.map((answer) => {
    return <Answer key={nanoid()} toggleSelect={toggleSelect} value={answer} />
  })

  // Select an answer
  function toggleSelect(event) {
    // First letting user select / deselect what they want
    event.target.classList.toggle('question__option--selected')

    // Check which answer has the selected class
    const answers = event.target.parentNode.childNodes
    let selectedIndex;
    answers.forEach((answer, index) => {
      if (answer.classList.contains('question__option--selected')) {
        selectedIndex = index
      }
    })

    if (selectedIndex) {
      // If some answer was clicked && something has the selected class (user didn't just deselect) -> remove all selections, then select the target (to make sure only 1 answer is selected)
      answers.forEach((answer) => answer.classList.remove('question__option--selected'))
      event.target.classList.add('question__option--selected')
    }
  }

  return (
      <section className="question">
        <p className="question__title">{props.question}</p>
        <div className="question__option-container">
          {allAnswers}
        </div>
      </section>
  )
}
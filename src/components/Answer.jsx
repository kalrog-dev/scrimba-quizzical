import { useState, useEffect } from "react";

export default function Answer(props) {
  // A concatenated string of all modifier classes for an answer after the quiz evaluation
  const [modifierClassNames, setModifierClassNames] = useState('question__option')
  
  // Evaluate user's answers
  useEffect(() => {
    if (props.showAnswers) {
      // Create a temporary binding to set mofifier classes with in the end
      let tempClasses = 'question__option'

      // Disable pointer events for all answers
      tempClasses += ' question__option--disabled'

      // If there is no selected answer, select the correct one and make incorrect ones light
      if (props.selectedAnswer === null) {
        tempClasses += (props.correctAnswer === props.value) 
          ? ' question__option--selected' 
          : ' question__option--light'
      }
      // Correct answers whether has the user selected them or not
      else if (props.correctAnswer === props.value) {
        tempClasses += ' question__option--success'
      }
      // Answers user selected and are not correct
      else if (props.selectedAnswer === props.value && props.selectedAnswer !== props.correctAnswer) {
        tempClasses += ' question__option--error question__option--light'
      }
      // Incorrect answers, but not selected either
      else {
        tempClasses += ' question__option--light'
      }

      // Update modifier classes all at once
      setModifierClassNames(tempClasses)
    }
  }, [props.showAnswers])

  // Before quiz evaluation, add or remove '--selected' modifier class from the answer user has clicked
  function getClassNames() {
    return props.selectedAnswer === props.value
        ? 'question__option question__option--selected'
        : 'question__option'
  }

  // Update the selectedAnswer state to then add/remove 'question__option--selected' class based on that
  const handleAnswerClick = () => {
    if (props.selectedAnswer === props.value) {
      // If the selected answer has been clicked, deselect it
      props.setSelectedAnswers(prevSelectedAnswers => {
        const arr = prevSelectedAnswers.slice()
        arr[props.questionIndex] = null
        return arr
      })
    } else {
      // If new answer has been clicked, select it
      props.setSelectedAnswers(prevSelectedAnswers => {
        const arr = prevSelectedAnswers.slice()
        arr[props.questionIndex] = props.value
        return arr
      })
    }
  }

  return (
    <button className={props.showAnswers ? modifierClassNames : getClassNames()} onClick={handleAnswerClick}>
      {props.value}
    </button>
  )
}
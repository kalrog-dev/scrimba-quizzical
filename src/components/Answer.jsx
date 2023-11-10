import { useState, useEffect } from "react";

export default function Answer(props) {
  // A concatenated string of all modifier classes for an answer after the quiz evaluation
  const [answerClasses, setAnswerClasses] = useState('question__option')
  
  // Evaluate user's answers
  useEffect(() => {
    // Run if the quiz should be evaluated
    if (props.showAnswers) {
      // Create a temporary object to update mofifier classes with at the end
      let tempClasses = 'question__option'

      // Disable pointer events for all answers
      tempClasses += ' question__option--disabled'

      // If there is no selected answer for this question  
      if (props.selectedAnswer === null) {
        // Highlight the correct answer with just the "selected" class
        if (props.correctAnswer === props.value) {
          tempClasses += ' question__option--selected'
        } 
        // Make the incorrect answers light
        else {
          tempClasses += ' question__option--light'
        }
      }
      // Correct answers whether has the user selected them or not
      else if (props.correctAnswer === props.value) {
        tempClasses += ' question__option--success'
      }
      // Answers user selected and are not correct
      else if (props.selectedAnswer === props.value && props.selectedAnswer !== props.correctAnswer) {
        tempClasses += ' question__option--error'
        tempClasses += ' question__option--light'
      }
      // Incorrect answers, but not selected either
      else {
        tempClasses += ' question__option--light'
      }

      // Update modifier classes all at once
      setAnswerClasses(tempClasses)
    }
  }, [props.showAnswers])

  // Add or remove '--selected' modifier class from the answer user has clicked
  function toggleSelect() {
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
    <button className={props.showAnswers ? answerClasses : toggleSelect()} onClick={handleAnswerClick}>
      {props.value}
    </button>
  )
}
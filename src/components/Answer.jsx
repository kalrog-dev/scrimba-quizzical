import { useState } from 'react'

export default function Answer(props) {
  const [answerClasses, setAnswerClasses] = useState(['question__option'])

  const handleAnswerClick = event => {
    setAnswerClasses(prevAnswerClasses => {
      console.log(prevAnswerClasses)
      // First letting user select / deselect what they want
      if (prevAnswerClasses.includes('question__option--selected')) {
        // Add selected modifier class
        prevAnswerClasses.push('question__option--selected')
      } else {
        // Remove selected modifier class
        const index = prevAnswerClasses.indexOf('question__option--selected')
        prevAnswerClasses.splice(index, 1)
      }

      // Check which answer has the selected class

    })
  }

  console.log(answerClasses);

  return (
    <button className={answerClasses.join(" ")} onClick={handleAnswerClick}>
      {props.value}
    </button>
  );
}
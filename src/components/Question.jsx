import { nanoid } from 'nanoid'
import Answer from './Answer'

export default function Question(props) {
  // Store which one of the four corresponding answers has been selected (null / value)
  const selectedAnswer = props.selectedAnswers[props.questionIndex]

  // Create four answers associated with this question
  const allAnswers = props.answers.map((answer) => 
    <Answer 
      key={nanoid()} 
      value={answer} 
      showAnswers={props.showAnswers}
      correctAnswer={props.correct}
      selectedAnswer={selectedAnswer}
      selectedAnswers={props.selectedAnswers}
      setSelectedAnswers={props.setSelectedAnswers}
      questionIndex={props.questionIndex}
    />
  )

  return (
    <section className="question">
      <p className="question__title">{props.question}</p>
      <div className="question__option-container">
        {allAnswers}
      </div>
    </section>
  )
}
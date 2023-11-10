export default function Answer(props) {
  // Update the selectedAnswer state to then add/remove 'question__option--selected' class
  const handleAnswerClick = () => {
    if (props.selectedAnswer === props.value) {
      // If the selected answer has been clicked, deselect it
      props.setSelectedAnswer(null)
    } else {
      // If new answer has been clicked, select it
      props.setSelectedAnswer(props.value)
    }
  }

  return (
    <button
      className={
        props.selectedAnswer === props.value
          ? "question__option question__option--selected"
          : "question__option"
      }
      onClick={handleAnswerClick}
    >
      {props.value}
    </button>
  )
}
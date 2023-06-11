export default function Intro(props) {
  return (
    <div className="intro-container">
      <div className="intro">
        <h1 className="intro__title">Quizzical</h1>
        <p className="intro__description">Computer science quiz app</p>
        <button className="intro__btn btn" onClick={props.startQuiz}>Start quiz</button>
      </div>
    </div>
  )
}
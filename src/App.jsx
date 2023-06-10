import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import {decode} from 'html-entities';
import Intro from './components/Intro'
import Question from './components/Question'
import './App.scss'

export default function App() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizData, setQuizData] = useState([])

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=6 &category=18&difficulty=easy&type=multiple')
      .then(res => res.json())
      .then(data => setQuizData(data.results))
      .catch(err => alert(err))
  }, [])

  // Generate question components
  const allQuestions = quizData.map((item) => {
    // Decode question and answers
    const question = decode(item.question)
    const correct = decode(item.correct_answer)
    const incorrectArr = item.incorrect_answers.map(e => decode(e))

    // Create question components
    return (
      <Question 
        key={nanoid()}
        question={question}
        answers={[...incorrectArr, correct]}
      />
    )
  })

  return (
    <div className="wrapper">
      {/* <Intro /> */}
      <div className="quiz">
        {allQuestions}
      </div>
    </div>
  )
}

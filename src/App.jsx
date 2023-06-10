import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import {decode} from 'html-entities';
import Intro from './components/Intro'
import Question from './components/Question'
import './App.scss'

export default function App() {
  const [quizStarted, setQuizStarted] = useState(true)
  const [quizData, setQuizData] = useState([])
  const [showAnswers, setShowAnswers] = useState(false)

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=6 &category=18&difficulty=easy&type=multiple')
      .then(res => res.json())
      .then(data => {
        let tempData = data.results.map((item) => {
          // Decode question and answers, then shuffle answers
          const question = decode(item.question)
          const correct = decode(item.correct_answer)
          const incorrectArr = item.incorrect_answers.map(e => decode(e))
          const answersArr = [...incorrectArr, correct]
          shuffleArray(answersArr)

          return {
            ...item,
            question: question,
            correct_answer: correct,
            incorrect_answers: incorrectArr,
            answersArr: answersArr
          }
        })
        setQuizData(tempData)
      })
      .catch(err => alert(err))
  }, [])

  // Generate question components when the Quiz is started
  const allQuestions = quizData.map((item) => {
    return (
      <Question 
        key={nanoid()}
        question={item.question}
        answers={item.answersArr}
        correct={item.correct_answer}
      />
    )
  })

  // Randomize array in-place using Durstenfeld shuffle algorithm
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }

  function score() {
    setShowAnswers(prevShowAnswers => !prevShowAnswers)
  }

  useEffect(() => {
    const answers = document.querySelectorAll('.question__option')
    let correctArr = [];
    
    // Create an array of correct answers
    if (showAnswers) {
      allQuestions.forEach(e => {
        correctArr.push(e.props.correct)
      })
    }

    // Show correct answers
    answers.forEach(e => {
      if (correctArr.includes(e.textContent)) {
        e.classList.add('question__option--success')
        correctArr.shift()
      }
    })
  }, [showAnswers])

  return (
    <div className="wrapper">
      {/* <Intro /> */}
      <div className="quiz">
        {allQuestions}
        <button className="btn" onClick={score}>Check answers</button>
      </div>
    </div>
  )
}

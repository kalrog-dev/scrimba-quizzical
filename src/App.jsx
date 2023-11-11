import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'
import Intro from './components/Intro'
import Question from './components/Question'
import './App.scss'

export default function App() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizData, setQuizData] = useState([])
  const [showAnswers, setShowAnswers] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState([null, null, null, null, null, null])

  const totalQuestions = selectedAnswers.length
  const url = `https://opentdb.com/api.php?amount=${totalQuestions}&category=18&difficulty=easy&type=multiple`

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        let tempData = data.results.map((item) => {
          // Decode each question and answers, then shuffle the answers array
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
  const allQuestions = quizData.map((item, index) => {
    return (
      <Question 
        key={nanoid()}
        question={item.question}
        answers={item.answersArr}
        correct={item.correct_answer}
        showAnswers={showAnswers}
        selectedAnswers={selectedAnswers}
        setSelectedAnswers={setSelectedAnswers}
        questionIndex={index}
      />
    )
  })

  // Randomize array in-place using Durstenfeld shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }
  
  // Show correct answers by applying modifier classes to each answer in Answer.jsx
  function updateAnswers() {
    setShowAnswers(prevShowAnswers => !prevShowAnswers)
  }

  // Compare correct answers with the selected answers and return the total of correct answers selected
  function getTotalCorrect() {
    const correctAnswers = quizData.map(item => item.correct_answer)
    return correctAnswers.reduce((total, answer, index) => answer === selectedAnswers[index] ? total + 1 : total, 0)
  }

  const button = showAnswers ? 
    <a className="btn" href="index.html">Play again</a> :
    <button className="btn" onClick={() => updateAnswers()}>Check answers</button>

  const quiz = (
    <div className="quiz">
      {allQuestions}
      <section className="evaluation">
        {showAnswers && <p className="evaluation__score">You scored {getTotalCorrect()}/{totalQuestions} correct answers</p>}
        {button}
      </section>
    </div>
  )

  function startQuiz() {
    setQuizStarted(prevQuizStarted => !prevQuizStarted)
  }

  return (
    <>
      {quizStarted ? quiz : <Intro startQuiz={startQuiz} />}
    </>
  )
}

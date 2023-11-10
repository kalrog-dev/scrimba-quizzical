import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import {decode} from 'html-entities'
import Intro from './components/Intro'
import Question from './components/Question'
import './App.scss'

export default function App() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizData, setQuizData] = useState([])
  const [showAnswers, setShowAnswers] = useState(false)
  const [userAnswersArr, setUserAnswersArr] = useState([])
  const [correctAnswersArr, setCorrectAnswersArr] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState([null, null, null, null, null, null])

  const totalQuestions = 6
  const url = `https://opentdb.com/api.php?amount=${totalQuestions}&category=18&difficulty=easy&type=multiple`

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        let tempCorrectAnswersArr = []
        let tempData = data.results.map((item) => {
          // Decode question and answers, then shuffle answers
          const question = decode(item.question)
          const correct = decode(item.correct_answer)
          const incorrectArr = item.incorrect_answers.map(e => decode(e))
          const answersArr = [...incorrectArr, correct]
          shuffleArray(answersArr)

          tempCorrectAnswersArr.push(correct)

          return {
            ...item,
            question: question,
            correct_answer: correct,
            incorrect_answers: incorrectArr,
            answersArr: answersArr
          }
        })
        setCorrectAnswersArr(tempCorrectAnswersArr)
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
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }

  // Add selected class to answers based on userAnswersArr
  const questions = document.querySelectorAll('.question__option-container')
  questions.forEach((e, index) => {
    const questionIndex = index;
    // Iterate through 6 questions
    e.childNodes.forEach((e, index) => {
      // Iterate through 4 answers
      if (userAnswersArr[questionIndex] === index) {
        e.classList.add('question__option--selected')
      }
    })
  })

  // Get the answers selected by user
  function getUserAnswers() {
    // Search all questions for the answers with the selected class
    const questions = document.querySelectorAll('.question__option-container')
    let tempAnswers = [];

    questions.forEach((e, index) => {
      // Iterate through 6 questions  //props.updateAnswers(arr)
      const questionIndex = index
      let answerIndex = -1
      
      // Try to find user's selection in this block, else default to -1
      e.childNodes.forEach((e, index) => {
        // Iterate through 4 answers
        if (e.classList.contains('question__option--selected')) {
          answerIndex = index
        }
      })

      // Update the result
      tempAnswers.push(answerIndex)
    })

    return tempAnswers
  }
  
  // Update the state with user's selection of answers
  function updateAnswers() {
    const newArray = getUserAnswers()
    setUserAnswersArr(newArray)
    setShowAnswers(prevShowAnswers => !prevShowAnswers)
  }

  function getTotalCorrect() {
    let totalCorrectCount = 0;
    const answerContainers = document.querySelectorAll('.question__option-container')
    answerContainers.forEach((e, containerIndex) => {
      // Iterate through question containers
      e.childNodes.forEach((e, index) => {
        // Iterate through answers
        if (e.textContent === correctAnswersArr[containerIndex] 
          && index === userAnswersArr[containerIndex]) {
          // Correct answers which user selected
          totalCorrectCount++
        }
      })
    })
    return totalCorrectCount
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
      {quizStarted ? quiz : <Intro startQuiz={startQuiz}/>}
    </>
  )
}

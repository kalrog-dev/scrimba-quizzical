import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import {decode} from 'html-entities'
import Intro from './components/Intro'
import Question from './components/Question'
import './App.scss'

export default function App() {
  const [quizStarted, setQuizStarted] = useState(true)
  const [quizData, setQuizData] = useState([])
  const [showAnswers, setShowAnswers] = useState(false)
  const [userAnswersArr, setUserAnswersArr] = useState([])

  console.log(userAnswersArr)

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=6&category=18&difficulty=easy&type=multiple')
      .then(res => res.json())
      .then(data => { console.log('api call')
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
        // Correct answer
        e.classList.add('question__option--success')
        correctArr.shift()
      } else {
        // Wrong answer
        e.classList.add('question__option--light')

        // Wrong selection
        console.log(e)
        // if (e.classList.includes('question__option--selected')) {
        //   e.classList.add('question__option--error')
        // }
      }
    })
  }, [showAnswers])

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
  
  // Update the state with user's selection
  function updateAnswers() {
    const newArray = getUserAnswers()
    setUserAnswersArr(newArray)
    setShowAnswers(prevShowAnswers => !prevShowAnswers)
  }

  return (
    <div className="wrapper">
      {/* <Intro /> */}
      <div className="quiz">
        {allQuestions}
        <button className="btn" onClick={() => updateAnswers()}>Check answers</button>
      </div>
    </div>
  )
}

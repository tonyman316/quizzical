import { useState } from 'react'
import { useEffect } from 'react'
import { nanoid } from 'nanoid'
import Question from './Question'
import './App.css'

function App() {
  const [isStarted, setIsStarted] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isAgain, setIsAgain] = useState(false)
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    console.log("Effect ran")
    resetGame()
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
      .then(res => res.json())
      .then(data => buildQuestions(data.results))
  }, [isAgain])

  /**
   * Build questions array from api data
   */
  function buildQuestions(data) {
    let newQuestions = data.slice()
    for (let i = 0; i < newQuestions.length; i++) {
      newQuestions[i].answers = populateAnswers(newQuestions[i])
      newQuestions[i].id = nanoid()
      newQuestions[i].question = fixPunctuation(newQuestions[i].question)
    }
    setQuestions(newQuestions)
  }

  function fixPunctuation(text) {
    const quotRegex = /&quot;/gi,
          apostropheRegex = /&#039;/g,
          andRegex = /&amp;/gi
    return text.replace(quotRegex, "'").replace(apostropheRegex, "'").replace(andRegex, "&")
  }

  function getRandomIndex(question) {
    let numberOfAnswers = question.incorrect_answers.length + 1
    return Math.floor(Math.random() * numberOfAnswers)
  }

  function populateAnswers(question) {
      let ans = [],
          newArray = question.incorrect_answers.slice()
      newArray.splice(getRandomIndex(question), 0, question.correct_answer)
      
      for (let i = 0; i < newArray.length; i++) {
        ans.push(
          {
            id: nanoid(),
            value: fixPunctuation(newArray[i]),
            isCorrect: newArray[i] === question.correct_answer,
            isChosen: false
          }
        )
      }
      return ans
  }

  /**
   * Build questionElements from questions
   */
  const questionElements = questions.map(question => {
    return (
      <Question
        key={question.id}
        id={question.id}
        question={question.question}
        answers={question.answers}
        correctAnswer={question.correct_answer}
        isChecked={isChecked}
        chooseAnswer={(event) => chooseAnswer(event)}
      />
    )
  })

  function chooseAnswer(event) {
    const target = event.target,
          questionId = target.attributes.questionid.value,
          chosenAnswerId = target.id

    setQuestions(oldQuestions => oldQuestions.map(question => {
      return question.id === questionId ?
              {...question, answers: updateChosenAnswers(question.answers, chosenAnswerId)} 
                                        : question
    }))
  }

  function updateChosenAnswers(answers, chosenAnswerId) {
    return answers.map(answer => {
      return answer.id === chosenAnswerId ? {...answer, isChosen: true} 
                                          : {...answer, isChosen: false}   
    })
  }

  function startQuiz() {
    setIsStarted(true)
    console.log("start quiz")
  }

  function playAgain() {
    console.log("play again")
    setIsAgain(true)
  }

  function resetGame() {
    setIsAgain(false)
    setIsChecked(false)
    setScore(0)
  }

  function checkAnswers() {
    console.log("check answers")
    setIsChecked(true)
    setQuestions(oldQuestions => oldQuestions.map(question => {
        return {...question, answers: updateCorrectAnswers(question.answers, question.correct_answer)}
      })
    )
    calculateScore()
  }

  function updateCorrectAnswers(answers, correctAnswer) {
    return answers.map(answer => {
      return answer.value === correctAnswer ? 
              {...answer, isCorrect: true}  : answer
    })
  }

  function calculateScore() {
    questions.forEach(function (question) {
      question.answers.forEach(function (answer) {
        if (answer.isCorrect && answer.isChosen) {
          setScore(oldScore => oldScore + 1)
        }
      })
    })
  }

  return (
    <div className="App">
      {isStarted ? 
        <div className="questions-card">
        {questionElements}
        {!isChecked ? 
          <button onClick={checkAnswers} className="check-answers-button">Check Answers</button>
        : <div className="stats-container">
          <span>You scored {score}/5 correct answers</span>
          <button onClick={playAgain} className="play-again-button">Play Again</button>
          </div>
        }
        </div>
      : <div className="start-card">
          <h2 className="title">Quizzical</h2>
          <p className="sub-title">A Mini Triva Game </p>
          <button onClick={startQuiz} className="start-button">Start Quiz</button>
        </div>
      }
    </div>
  )
}

export default App

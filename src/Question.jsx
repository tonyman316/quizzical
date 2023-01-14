import './Question.css'

export default function Question(props) {

    const answerElements = props.answers.map(answer => {
        return (
            <button 
                onClick={props.chooseAnswer}
                id={answer.id}
                questionid={props.id}
                className={getAnswerButtonClassName(answer)}>
                {answer.value}
            </button>
        )
    })

    function getAnswerButtonClassName(answer) {
        return !props.isChecked ?
                answer.isChosen ? "answer-button-isChosen answer-button"
                                : "answer-button-isNotChosen answer-button"
                : answer.isCorrect ? "answer-button-isCorrect answer-button"
                : answer.isChosen  ? "answer-button-isNotCorrect answer-button"
                                   : "answer-button-others answer-button"
    }

    return (
        <div className="question-container">
            <h3 className="question">{props.question}
                <div className="answer-container">{answerElements}</div>
            </h3>
            <hr className="line-breaker" />
        </div>
    )
}
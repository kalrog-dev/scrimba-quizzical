import { nanoid } from 'nanoid'

export default function Question(props) {
    const allOptions = props.answers.map(answer => {
        return <span className="question__option" key={nanoid()}>{answer}</span>
    })

    return (
        <section className="question">
          <p className="question__title">{props.question}</p>
          <div className="question__option-container">
            {allOptions}
          </div>
        </section>
    )
}
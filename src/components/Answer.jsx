export default function Answer(props) {
    return (
        <button className="question__option" onClick={props.toggleSelect}>{props.value}</button>
    )
}
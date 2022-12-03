export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "var(--light-color)" : "white"
    }
    
    let diceNum = "one"
    if (props.value === 2) {
        diceNum = "two"
    }
    if (props.value === 3) {
        diceNum = "three"
    }
    if (props.value === 4) {
        diceNum = "four"
    }
    if (props.value === 5) {
        diceNum = "five"
    }
    if (props.value === 6) {
        diceNum = "six"
    }
    
    return (
        <div 
            className={`die-face ${diceNum}`}
            style={styles}
            onClick={props.holdDice}
        >
            <span className="dot"> </span>
            {props.value >= 2 && <span className="dot"> </span>}
            {props.value >= 3 && <span className="dot"> </span>}
            {props.value >= 4 && <span className="dot"> </span>}
            {props.value >= 5 && <span className="dot"> </span>} 
            {props.value === 6 && <span className="dot"> </span>}            
        </div>
    )
}
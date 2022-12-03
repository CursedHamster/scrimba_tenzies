import { useState, useEffect } from "react"
import { useWindowSize } from "react-use"
import "./App.css"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import { flushSync } from "react-dom"

export default function App() {
    const {width, height} = useWindowSize()

    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rolls, setRolls] = useState(0)
    const [timeSpent, setTimeSpent] = useState(0)
    
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            const oldTimeSpent = getTimeFromLocalStorage()
            const oldRolls = getRollsFromLocalStorage()
            setTenzies(true)
            setTimeSpent(prevTimeSpent => {
                const newTimeSpent = new Date().getTime() - prevTimeSpent

                localStorage.setItem("tenzies", JSON.stringify({
                    time: (oldTimeSpent === null || newTimeSpent < oldTimeSpent)
                    ? newTimeSpent
                    : oldTimeSpent,
                    rolls: (oldRolls === null || rolls < oldRolls)
                    ? rolls
                    : oldRolls
                }))
                return newTimeSpent
            })
        }
    }, [dice])

    useEffect(() => {
        setTimeSpent(new Date().getTime())
    }, [])

    function getTimeFromLocalStorage() {
        if (JSON.parse(localStorage.getItem("tenzies")) === null) {
            localStorage.setItem("tenzies", JSON.stringify({
                time: null,
                rolls: null
            }))
        }
        return JSON.parse(localStorage.getItem("tenzies")).time
    }

    function getRollsFromLocalStorage() {
        if (JSON.parse(localStorage.getItem("tenzies")) === null) {
            localStorage.setItem("tenzies", JSON.stringify({
                time: null,
                rolls: null
            }))
        }
        return JSON.parse(localStorage.getItem("tenzies")).rolls
    }

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        setRolls(prevRolls => prevRolls + 1)
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setTimeSpent(new Date().getTime())
            setRolls(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti width={width - 30} colors={["#66B53A", "#ECF65A", "#F65A96", "#B55CE3", "#5CCCE3"]} />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">
                {
                tenzies
                ? `You won!
                Total number of rolls spent: ${rolls}. 
                Total time spent: 
                ${Math.floor((timeSpent / 1000) / 60)}m 
                ${Math.floor((timeSpent / 1000)) % 60}s
                ${Math.floor(timeSpent) % 1000}ms.`
                : "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."
            }</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            {tenzies && <p className="record-time">Your record time spent: {Math.floor((getTimeFromLocalStorage() / 1000) / 60)}m {Math.floor((getTimeFromLocalStorage() / 1000)) % 60}s {Math.floor(getTimeFromLocalStorage() % 1000)}ms. Your record number of rolls spent: {getRollsFromLocalStorage()}.</p>}
        </main>
    )
}
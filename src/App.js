import './App.css';
import Board from './components/Board'
import KeyBoard from './components/KeyBoard';
import GameOver from './components/GameOver';
import React, { useState, useEffect, createContext } from 'react'
import { boardDefault, generateWordSet } from './Words';

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault)
  const [currentAttempt, setCurrentAttempt] = useState({ attempt: 0, letterPos: 0 })
  const [wordSet, setWordSet] = useState(new Set())
  const [correctWord, setCorrectWord] = useState("")
  const [disabledLetters, setDisabledLetters] = useState([])
  const [gameOver, setGameOver] = useState({gameOver: false, guessedWord: false})

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet)
      setCorrectWord(words.todaysWord)
   })
  }, [])
  

  const onSelectLetter = (keyVal) => {
    if (currentAttempt.letterPos > 4) return;
    const newBoard = [...board]
    newBoard[currentAttempt.attempt][currentAttempt.letterPos] = keyVal;
    setBoard(newBoard)
    setCurrentAttempt({ ...currentAttempt, letterPos: currentAttempt.letterPos + 1 })
  }

  const onEnter = () => {
    if (currentAttempt.letterPos !== 5) return;

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currentAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLowerCase())) {
      setCurrentAttempt({ attempt: currentAttempt.attempt + 1, letterPos: 0 });
    } else {
      alert("Word not found");
    }

    if (currWord.toLowerCase() === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }
    if (currentAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }
  };

  const onDelete = () => {
    if (currentAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currentAttempt.attempt][currentAttempt.letterPos - 1] = "";
    setBoard(newBoard);
    setCurrentAttempt({ ...currentAttempt, letterPos: currentAttempt.letterPos - 1 });
  }

  return (
    <div className="App">
      <nav>
        <h1> Wordle </h1>
      </nav>
      <AppContext.Provider value={{ board, setBoard, currentAttempt, setCurrentAttempt, onSelectLetter, onEnter, onDelete, correctWord, setDisabledLetters, disabledLetters, gameOver, setGameOver }}>
        <div className='game'>
          <Board />
          {gameOver.gameOver ? <GameOver /> : <KeyBoard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;

import { createContext, useContext, useState } from "react";
const WordContext = createContext(); // Create the context

export const WordProvider = ({ children }) => {
  const minWordLength = 3;
  const maxWordlength = 7;
  const [word, setWord] = useState('');
  const [settings, setSettings] = useState({wordLength: 5, difficulty: -1});

  const getNewWord = () => {
    let length = settings.wordLength;
    
    if(length == -1){
      length = Math.round(Math.random() * (maxWordlength - minWordLength)) + minWordLength
    }

    console.log(length)

    let difficulty = settings.difficulty;
    
    if(difficulty == -1){
        difficulty = Math.round(Math.random()*3)
    }

    fetch("/get-word?wordLength=" + length + "&difficulty=" + difficulty)
    .then(response => response.json())
    .then(data =>{ setWord(data[0].word)})
    .catch(error => console.error("Error:", error));
  }

  return (
    <WordContext.Provider value={[word, getNewWord, settings, setSettings]}>
      {children}
    </WordContext.Provider>
  );
};

export default WordContext;
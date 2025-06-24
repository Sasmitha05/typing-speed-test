import React, { useEffect, useRef, useState } from "react";

const paragraphs = [
  `Once upon a time, a little rabbit named Ruby loved to hop through the green forest and chase butterflies.`,
  `In a quiet village, a boy found a magic pencil that brought all his drawings to life, including a dancing dinosaur.`,
  `Ellie the elephant wanted to fly, so her jungle friends tied balloons to her back and she soared through the clouds.`,
  `Luna the cat discovered a hidden door in her backyard that led to a secret land made entirely of candy and chocolate.`,
  `A tiny turtle named Timmy decided to race a fast rabbit, and with patience and determination, he won the race.`
];

const getRandomParagraph = () => {
  const index = Math.floor(Math.random() * paragraphs.length);
  return paragraphs[index];
}

function TypingTest() {
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [charStatus, setCharStatus] = useState([]);
  const [strictMode, setStrictMode] = useState(true);
  const [accuracy, setAccuracy] = useState(0);
  const [paragraphText, setParagraphText] = useState(getRandomParagraph());

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (started && !intervalRef.current) {
      startTimeRef.current = new Date();
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTimeRef.current) / 1000);
        setTimer(elapsed);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [started]);

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  const calculateStats = (correct, totalTyped) => {
    const elapsedSeconds = Math.max(1, Math.floor((new Date() - startTimeRef.current) / 1000));
    const minutes = elapsedSeconds / 60;
    const newWpm = Math.round(correct / 5 / minutes) || 0;
    const newAccuracy = Math.round((correct / totalTyped) * 100) || 0;
    setWpm(newWpm);
    setAccuracy(newAccuracy);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    if (!started) setStarted(true);

    let newStatus = [];
    let correct = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === paragraphText[i]) {
        correct++;
        newStatus.push("correct");
      } else {
        newStatus.push("incorrect");
      }
    }

    setCharStatus(newStatus);

    if (value.length >= paragraphText.length) {
      stopTimer();
      calculateStats(correct, value.length);
      inputRef.current.disabled = true;
    }
  };

  const handleKeyDown = (e) => {
    if (
      strictMode &&
      (e.key === "Backspace" || e.key === "Delete") &&
      charStatus[charStatus.length - 1] === "incorrect"
    ) {
      e.preventDefault();
    }
  };

  const restart = () => {
    const newPara = getRandomParagraph();
    setParagraphText(newPara);
    setInput('');
    setTimer(0);
    setWpm(0);
    setAccuracy(0);
    setStarted(false);
    stopTimer();
    setCharStatus([]);
    inputRef.current.disabled = false;
    inputRef.current.focus();
  };

  return (
    <div className="container">
      <h1>Typing Speed Test</h1>
      <p id="text-display">
        {[...paragraphText].map((char, i) => {
          let className = "";
          if (input[i] === undefined) className = "";
          else if (input[i] === char) className = "correct";
          else className = "incorrect";

          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </p>
      <textarea
        id="input-area"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        placeholder="Start typing..."
      ></textarea>
      <div id="stats">
        <p>Time: <span id="timer">{timer}</span>s</p>
        <p>Speed: <span id="wpm">{wpm}</span> WPM</p>
        <p>Accuracy: <span id="accuracy">{accuracy}</span>%</p>
      </div>
      <button id="restart" onClick={restart}>Restart</button>
      <button
        id="mode"
        className={strictMode ? 'red-mode' : 'green-mode'}
        onClick={() => setStrictMode(!strictMode)}
      >
        {strictMode ? "Disable Strict Mode" : "Enable Strict Mode"}
      </button>
    </div>
  );
}

export default TypingTest;

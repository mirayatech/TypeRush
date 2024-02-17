import React, { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";
import { useTypeRushStore } from "../../store";

export function Home() {
  const { points, earnedPoints, setPoints, setEarnedPoints } =
    useTypeRushStore();
  const [mistakes, setMistakes] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const text = "I love you";
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    const focusInput = () => {
      setIsFocused(true);
      inputRef.current?.focus();
    };

    const handleKeyPress = () => {
      focusInput();
    };

    const handleClick = () => {
      focusInput();
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isFocused && !isCompleted && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer <= 0) {
      setIsCompleted(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocused, isCompleted, timer]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) setStartTime(Date.now());
    if (isCompleted || timer <= 0) return;

    let newValue = event.target.value;
    let currentMistakes = mistakes;

    if (newValue.length >= text.length) {
      newValue = newValue.slice(0, text.length);
      setIsCompleted(true);
      setEndTime(Date.now());
      calculatePoints(currentMistakes);
    }

    if (!isCompleted && newValue.length > input.length) {
      const lastTypedChar = newValue[newValue.length - 1];
      const correctChar = text[newValue.length - 1];
      if (lastTypedChar !== correctChar) {
        currentMistakes += 1;
        setMistakes(currentMistakes);
      }
    }

    setInput(newValue);
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const timeTaken = (endTime - startTime) / 60000;
    const wordCount = text.split(" ").length;
    return (wordCount / timeTaken).toFixed(2);
  };

  const calculatePoints = (mistakes: number) => {
    const textLength = text.replace(/\s/g, "").length;
    let pointsEarned = 0;

    if (mistakes < textLength) {
      if (mistakes === 0) {
        pointsEarned = 100;
      } else if (mistakes <= 5) {
        pointsEarned = 80;
      } else if (mistakes <= 10) {
        pointsEarned = 60;
      } else if (mistakes <= 15) {
        pointsEarned = 40;
      } else {
        pointsEarned = 20;
      }
    }

    setEarnedPoints(pointsEarned);
  };

  const handleReplay = () => {
    setInput("");
    setMistakes(0);
    setIsCompleted(false);
    setEarnedPoints(0);
    setPoints(points + earnedPoints);
    inputRef.current?.focus();
    setPoints(points - mistakes + earnedPoints);
  };

  const renderText = (): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    let inputIndex = 0;

    const textWords = text.split(/\s+/);
    textWords.forEach((word, wordIndex) => {
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const inputChar = input[inputIndex];

        if (inputIndex < input.length) {
          elements.push(
            <span
              key={`${wordIndex}-${i}`}
              style={{ color: inputChar === char ? "black" : "red" }}
            >
              {char}
            </span>
          );
        } else {
          elements.push(
            <span key={`${wordIndex}-${i}`} style={{ color: "gray" }}>
              {char}
            </span>
          );
        }
        inputIndex++;
      }

      if (wordIndex < textWords.length - 1) {
        elements.push(
          <span
            key={`space-${wordIndex}`}
            style={{
              color: "gray",
            }}
          >
            {" "}
          </span>
        );
        inputIndex++;
      }
    });

    return elements;
  };

  return (
    <div className={styles.wrapper}>
      {!isFocused && <div>Click or start typing for focus</div>}

      {isCompleted ? (
        <div>
          <p>You've finished typing the sentence!</p>
          <p>WPM: {calculateWPM()}</p>
          <p>Total Points: {points - mistakes + earnedPoints}</p>
          <p>Points Earned: {earnedPoints}</p>
          <p>Letter Mistakes: {mistakes}</p>

          <p>
            Total Points Calculation:{" "}
            {`(${points} initial points) - (${mistakes} mistakes) + (${earnedPoints} earned points) = ${
              points - mistakes + earnedPoints
            }`}
          </p>
          <button onClick={handleReplay} className={styles.replayButton}>
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div>Time left: {timer} seconds</div>
          <div>Mistakes: {mistakes}</div>
          <div>Points: {points}</div>
          <div className={styles.text}>{renderText()}</div>
          <input
            type="text"
            value={input}
            ref={inputRef}
            onChange={handleChange}
            className="sr-only"
            placeholder="Start typing..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            readOnly={isCompleted}
          />
        </>
      )}
    </div>
  );
}

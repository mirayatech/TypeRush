import React, { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

export function Home() {
  const [input, setInput] = useState<string>("");
  const [mistakes, setMistakes] = useState<number>(0);
  const [points, setPoints] = useState<number>(100);
  const text = "I love you";
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mistakePenalty = 2;
  const accuracyBonus = 10;
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    let newValue = event.target.value;
    let currentMistakes = mistakes;

    if (newValue.length >= text.length) {
      newValue = newValue.slice(0, text.length);
      if (newValue.length === text.length) {
        setIsCompleted(true);
      }
    }

    if (newValue.length > input.length) {
      const lastTypedChar = newValue[newValue.length - 1];
      const correctChar = text[newValue.length - 1];
      if (lastTypedChar !== correctChar) {
        currentMistakes += 1;
        setMistakes(currentMistakes);
        setPoints((prevPoints) => prevPoints - mistakePenalty);
      }
    }

    if (newValue === text && currentMistakes === 0) {
      setPoints((prevPoints) => prevPoints + accuracyBonus);
    }

    setInput(newValue);
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
        const space = input[inputIndex] === " " ? input[inputIndex] : " ";
        elements.push(
          <span
            key={`space-${wordIndex}`}
            style={{
              color:
                inputIndex < input.length && input[inputIndex] !== " "
                  ? "red"
                  : "black",
            }}
          >
            {space}
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
      <div>Mistakes: {mistakes}</div>
      <div>Points: {points}</div>
      {isCompleted && (
        <div>
          <p>You've finished typing the sentence!</p>
          <p>Points Earned: {points}</p>
          <p>Letter Mistakes: {mistakes}</p>
        </div>
      )}
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
    </div>
  );
}

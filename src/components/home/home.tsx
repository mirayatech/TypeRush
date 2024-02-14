import React, { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

export function Home() {
  const [input, setInput] = useState<string>("");
  const [mistakes, setMistakes] = useState<number>(0);
  const text = "I love you";
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    let newValue = event.target.value;

    if (newValue.length > text.length) {
      newValue = newValue.slice(0, text.length);
    } else {
      if (newValue.length > input.length) {
        const lastTypedChar = newValue[newValue.length - 1];
        const correctChar = text[newValue.length - 1];
        if (lastTypedChar !== correctChar) {
          setMistakes((prevMistakes) => prevMistakes + 1);
        }
      }
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

    for (; inputIndex < input.length; inputIndex++) {
      elements.push(
        <span key={`extra-${inputIndex}`} style={{ color: "red" }}>
          {input[inputIndex]}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className={styles.wrapper}>
      {!isFocused && <div>Click or start typing for focus</div>}
      <div>Mistakes: {mistakes}</div>
      <div className={styles.text}>{renderText()}</div>
      <input
        type="text"
        value={input}
        ref={inputRef}
        className="sr-only"
        onChange={handleChange}
        placeholder="Start typing..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

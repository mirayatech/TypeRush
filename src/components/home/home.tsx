import React, { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

export function Home() {
  const [input, setInput] = useState<string>("");
  const text =
    "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an";

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
    setInput(event.target.value);
  };

  const renderText = (): JSX.Element[] => {
    const textWords = text.split(/\s+/);
    const inputWords = input.split(/\s+/);
    const elements: JSX.Element[] = [];

    textWords.forEach((word, wordIndex) => {
      let inputWord = inputWords[wordIndex] || "";
      let extraChars = "";

      if (inputWord.length > word.length) {
        extraChars = inputWord.slice(word.length);
        inputWord = inputWord.slice(0, word.length);
      }

      for (let i = 0; i < word.length; i++) {
        if (i < inputWord.length) {
          if (word[i] === inputWord[i]) {
            elements.push(
              <span key={`${wordIndex}-${i}`} style={{ color: "black" }}>
                {word[i]}
              </span>
            );
          } else {
            elements.push(
              <span key={`${wordIndex}-${i}`} style={{ color: "red" }}>
                {word[i]}
              </span>
            );
          }
        } else {
          elements.push(
            <span key={`${wordIndex}-${i}`} style={{ color: "gray" }}>
              {word[i]}
            </span>
          );
        }
      }

      if (extraChars) {
        elements.push(
          <span key={`${wordIndex}-extra`} style={{ color: "blue" }}>
            {extraChars}
          </span>
        );
      }

      if (wordIndex < textWords.length - 1) {
        elements.push(
          <span key={`space-${wordIndex}`} style={{ color: "black" }}>
            {" "}
          </span>
        );
      }
    });

    return elements;
  };

  return (
    <div className={styles.wrapper}>
      {!isFocused && <div>Click or start typing for focus</div>}

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

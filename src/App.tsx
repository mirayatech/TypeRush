import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState<string>("");
  const text = "I love food very much.";

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
    <div>
      <h1>TypeRush</h1>
      <div style={{ fontSize: "20px" }}>{renderText()}</div>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
}

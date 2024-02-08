import { useState } from "react";

export default function App() {
  const [input, setInput] = useState<string>("");
  const text = "I love food very much.";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const renderText = () => {
    return text.split("").map((char, index) => {
      let color;
      if (index < input.length) {
        color = char === input[index] ? "black" : "red";
      } else {
        color = "gray";
      }
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div>
      <h1>TypeRush</h1>
      <div style={{ fontSize: "20px" }}>{renderText()}</div>
      <input type="text" value={input} onChange={handleChange} />
    </div>
  );
}

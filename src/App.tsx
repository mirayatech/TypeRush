import { Routes, Route } from "react-router-dom";
import { Home } from "./components";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

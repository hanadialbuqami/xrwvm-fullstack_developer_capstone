import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";
import RegisterContainer from "./components/Register/Register"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<RegisterContainer/>} />

    </Routes>
  );
}
export default App;

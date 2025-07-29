import { BrowserRouter } from "react-router-dom";
import './App.scss';
import Router from "./router";

function App() {
  return (
    <div id="backgroundSystem">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
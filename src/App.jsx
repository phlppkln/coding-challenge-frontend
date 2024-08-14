import { useState } from "react";
import "./App.css";

import CreateIterationView from "./views/CreateQuestionnaireView.jsx";
import DashboardView from "./views/DashboardView.jsx";

/* 

local storage object structure

myIterations:[{
  - id: number
    createdAt: Date
    finished: boolean
    deleted: boolean
    myTitle: string
    myAnswers: [{
      - question: string
      - answers: [{
        - text: string
        - selected: boolean
      }]
    }]
}]
 */

function App() {
  const [currentView, setCurrentView] = useState("");

  /**
   * basic custom router for application
   * @param { string } view - name of view to load
   */
  const getView = () => {
    if (currentView === "") {
      return <DashboardView startView={setCurrentView} />;
    } else if (currentView === "dashboard") {
      return <DashboardView startView={setCurrentView} />;
    } else if (currentView === "create-iteration") {
      return <CreateIterationView startView={setCurrentView} />;
    }
  };

  return <div className="App container">{getView()}</div>;
}

export default App;

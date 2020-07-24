import React from 'react'
import Step from './components/step/Step'
import './Main.css'

const sampleJSON = {
  "string": "PluralSight",
  "number": 1
};

function Main() {
  return (
    <div className="Main">
      <header className="Main-header">
        <p>
          Workflow Title
        </p>
        <Step />
      </header>
    </div>
  );
}

export default Main;
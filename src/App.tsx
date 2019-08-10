import React from 'react';
import * as Matter from 'matter-js';
import './App.css';
import 'matter-wrap';

Matter.use('matter-wrap');

// aliases
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
// const Common = Matter.Common;
const MouseConstraint = Matter.MouseConstraint;
const Mouse = Matter.Mouse;
const World = Matter.World;
const Bodies = Matter.Bodies;

const engine = Engine.create();
const world = engine.world;

const M = {
    ballPool() {

    }
}


const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
        // type code
        </p>

      </header>
      <div id="matter-mount">

      </div>
    </div>
  );
}

export default App;

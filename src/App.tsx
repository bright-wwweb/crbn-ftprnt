import React, { useEffect } from 'react';
import * as Matter from 'matter-js';
import random from 'lodash.random';
import './App.css';
import 'matter-wrap';

Matter.use('matter-wrap');

// aliases
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const MouseConstraint = Matter.MouseConstraint;
const Mouse = Matter.Mouse;
const World = Matter.World;
const Bodies = Matter.Bodies;

const engine = Engine.create();
const world = engine.world;

// add bodies
const stack = Composites.stack(
    20,
    20,
    10,
    5,
    0,
    0,
    (x: any, y: any) => {
    let sides = Math.round(random(1, 8));

    // triangles can be a little unstable, so avoid until fixed
    sides = (sides === 3) ? 4 : sides;

    // round the edges of some bodies
    let chamfer: any = null;
    if (sides > 2 && random(1, true) > 0.7) {
        chamfer = {
            radius: 10
        };
    }

    switch (Math.round(random(0, 1))) {
        case 0:
            if (random() < 0.8) {
                return Bodies.rectangle(x, y, random(25, 50), random(25, 50), { chamfer });
            } else {
                return Bodies.rectangle(x, y, random(80, 120), random(25, 30), { chamfer });
            }
        case 1:
            return Bodies.polygon(x, y, sides, random(25, 50), { chamfer });
    }
});

const App: React.FC = () => {

    useEffect(() => {
        const render = Render.create({
            engine,
            options: {
                width: 800,
                height: 600,
            },
            element: document.querySelector("#matter-canvas") as HTMLElement,
        })
        Render.run(render);
        // create runner
        const runner = Runner.create({
            isFixed: true,
        });
        Runner.run(runner, engine)
        World.add(world, stack)
        World.add(world, [
            // walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        // add mouse control
        const mouse = Mouse.create(render.canvas)
        const constrain: Matter.Constraint = {
            stiffness: 0.2,
            render: {
                visible: false,
            }
        }
        const mc: Matter.IMouseConstraintDefinition = {
            mouse,
            constrain,
        }
        const mouseConstraint = MouseConstraint.create(engine, mc);

        World.add(world, mouseConstraint);

        // keep the mouse in sync with rendering
        // render.mouse = mouse;

        // fit the render viewport to the scene
        // TODO: fix this lookAt call
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        });
    })

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    // type code
                </p>
            </header>

            <div id="matter-mount">
                <canvas id="matter-canvas"></canvas>
            </div>
        </div>
    );
}

export default App;

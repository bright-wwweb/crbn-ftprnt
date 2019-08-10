import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import './App.css';

const App: React.FC = () => {
    let ref = useRef(null)
    const H = 600
    const W = 800

    useEffect(() => {
        d3.select(ref.current)
            .append('circle')
            .attr('r', 5)
            .attr('cx', W / 2)
            .attr('cy', H / 2)
            .attr('fill', 'red')
    })

    return (
        <div className="App">
            <header className="App-header">
                <pre> // </pre>
            </header>

            <svg id="viz-mount" width={W} height={H} ref={ref}></svg>

            <header className="App-footer">
                <pre>
                  <p><small>CRBN_FT_PRNT</small></p>
                  <p><small>THE BRIGHT WWWEB × MMMANYFOLD + WCOR</small></p>
                </pre>
            </header>
        </div>
    );
}

export default App;

import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"
import Links from "./components/Links";
import Nodes from "./components/Nodes";

import './App.css'

interface IProps {
    width: number
    height: number
    graph: d3Graph
}

const App: React.FC<IProps> = (props) => {
    let svgRef = useRef(null)
    const W = props.width
    const H = props.height

    let simulation: any = null

    useEffect(() => {
        const node = d3.selectAll(".node")
        const link = d3.selectAll(".link")

        simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d: any) {
                return d.id
            }))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(props.width / 2, props.height / 2))
            .nodes(props.graph.nodes)

        function ticked() {
            link
                .attr("x1", function(d: any) {
                    return d.source.x
                })
                .attr("y1", function(d: any) {
                    return d.source.y
                })
                .attr("x2", function(d: any) {
                    return d.target.x
                })
                .attr("y2", function(d: any) {
                    return d.target.y
                })

            node
                .attr("cx", function(d: any) {
                    return d.x
                })
                .attr("cy", function(d: any) {
                    return d.y
                })
        }

        simulation.force("link").links(props.graph.links)
        // TODO: fix this call
        // simulation.nodes(props.graph.nodes).on("tick", ticked)

        // red dot
        d3.select(svgRef.current)
            .append("circle")
            .attr("r", 5)
            .attr("cx", W / 2)
            .attr("cy", H / 2)
            .attr("fill", 'red')
    })

    return (
        <div className="App">
            <header className="App-header">
                <pre> // </pre>
            </header>

            <svg id="viz-mount" width={W} height={H} ref={svgRef}>
                <Links links={props.graph.links} />
                <Nodes nodes={props.graph.nodes} simulation={simulation} />
                {/*<Labels nodes={props.graph.nodes} />*/}
            </svg>

            <header className="App-footer">
                <pre>
                  <p><small>CRBN_FT_PRNT</small></p>
                  <p><small>THE BRIGHT WWWEB × MMMANYFOLD + WCOR</small></p>
                </pre>
            </header>
        </div>
    )
}

export default App

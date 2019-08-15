import React, { useState, useEffect } from 'react'
import * as d3 from "d3"
import Links from "./components/Links"
import Nodes from "./components/Nodes"
import Labels from "./components/Labels"
import './App.css'

interface IProps {
    width: number
    height: number
    resp: respType
}

type respType =
| "A"
| "B"
| "C"

// treeState
// {
//     A: {
//         1: {
//                 parent: null,
//                 leftChild: 2,
//                 rightChild: null, 
//             },
//         2: {
//                 parent: 1,
//                 leftChild: null,
//                 rightChild: null,
//             }
//     },
//     B: {
//     }
// }

const App: React.FC<IProps> = ({ width, height, resp }) => {
    const [treeState, setTreeState] = useState<any>({
        A: {}, 
        B: {}, 
        C: {}
    })
    const [graph, setGraph] = useState<d3Graph>({nodes:[], links:[]})

    let simulation: any = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d: any) {
            return d.id
        }))
        .force("charge", d3.forceManyBody().strength(-75))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .nodes(graph.nodes)

    simulation.force("link").links(graph.links)

    useEffect(() => {
        const node = d3.selectAll(".node")
        const link = d3.selectAll(".link")
        const label = d3.selectAll(".label");

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

            label
                .attr("x", function (d: any) {
                    return d.x + 5;
                })
                .attr("y", function (d: any) {
                    return d.y + 5;
                })
        }

        simulation.nodes(graph.nodes).on("tick", ticked)
    })

    const _handleNewResponse = () => {
        const nodeId = Object.keys(treeState[resp]).length
        let [ parent, leftChild, rightChild ]: any = [null, null, null]
        if (nodeId > 0) {
            for(let i=0; i<nodeId; i++) {
                let node = treeState[resp][i]
                if (!node.leftChild) {
                    node.leftChild = nodeId
                    parent = i
                } else if (!node.rightChild) {
                    node.rightChild = nodeId
                    parent = i
                }
            }
        }
        treeState[resp][nodeId] = {
            parent,
            leftChild,
            rightChild, 
        }
    }

    const createRootNode = () => {
        // do something
        // setgraph()
    }

    return (
        <div className="App">
            <header className="App-header">
                <pre> // </pre>
            </header>

            <svg className="viz-mount" width={width} height={height}>
                <Links links={graph.links} />
                <Nodes nodes={graph.nodes} simulation={simulation} />
                <Labels nodes={graph.nodes} />
            </svg>

            <header className="App-footer">
                <pre>
                  <p><small>CRBN_FT_PRNT</small></p>
                  <p><small>BRIGHT WWWEB × MMMANYFOLD + WCOR</small></p>
                </pre>
            </header>
        </div>
    )
}

export default App

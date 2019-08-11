import React, { useEffect, useRef } from "react"
import * as d3 from 'd3'

interface INodeProps {
    node: d3Node
    color: string
}

interface INodesProps {
    nodes: d3Node[]
    simulation: any
}


const Node: React.FC<INodeProps> = (props) => {
    const ref = useRef(null)

    useEffect(() => {
        d3.select(ref.current).data([props.node])
    })

    return (
        <circle className="node"
                r={5}
                fill={props.color}
                ref={ref}>
            <title>{props.node.id}</title>
        </circle>
    )
}

const Nodes: React.FC<INodesProps> = (props) => {
    const color = d3.scaleOrdinal(d3.schemeCategory10)
    const nodes = props.nodes.map((node: d3Node, index: number) => {
        return <Node key={index} node={node} color={color(node.group.toString())}/>
    })

    useEffect(() => {
        const simulation = props.simulation

        // function onDragStart(d: any) {
        //     if (!d3.event.active) {
        //         simulation.alphaTarget(0.3).restart()
        //     }
        //     d.fx = d.x
        //     d.fy = d.y
        // }
        //
        // function onDrag(d: any) {
        //     d.fx = d3.event.x
        //     d.fy = d3.event.y
        // }
        //
        // function onDragEnd(d: any) {
        //     if (!d3.event.active) {
        //         simulation.alphaTarget(0)
        //     }
        //     d.fx = null
        //     d.fy = null
        // }

        // d3.selectAll(".node")
        //     .call(
        //         d3.drag()
        //             .on("start", onDragStart)
        //             .on("drag", onDrag)
        //             .on("end", onDragEnd))
    })

    return (
        <g className="nodes">
            {nodes}
        </g>
    )
}

export default Nodes

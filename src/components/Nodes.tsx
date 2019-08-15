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

    return (
        <g className="nodes">
            {nodes}
        </g>
    )
}

export default Nodes

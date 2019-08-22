import React, { useEffect, useRef } from "react"
import * as d3 from 'd3'

interface INodeProps {
  node: d3Node
  color: string
  simulation?: any
}

interface INodesProps {
  nodes: d3Node[]
  simulation?: any
}

const drag = (simulation: any) => {
  function dragstarted(d: any) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    if (!d.fx) {
      d.fx = d.x;
      d.fy = d.y;
    } else {
      d.fx = d.fy = null;
    }
  }

  function dragged(d: any) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d: any) {
    if (!d3.event.active) simulation.alphaTarget(0);

    // save fixed locations to localStorage
    localStorage.setItem(
      "positions",
      JSON.stringify(
        simulation
          .nodes()
          .map((d: any, i: number) => ({ i, fx: d.fx, fy: d.fy }))
          .filter((d: any) => d.fx)
      )
    )
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

const Node: React.FC<INodeProps> = (props) => {
  const ref = useRef(null)



  useEffect(() => {
    // apply fixed positions found in localStorage
    const fx = JSON.parse(localStorage.getItem("positions"))
    if (fx && fx.length > 0) {
      for (const f of fx) {
        const i = f.i
        const fx = f.fx
        const fy = f.fy
        if (i && props.node[i] && fx && fy) {
          props.node[i].fx = fx;
          props.node[i].fy = fy;
        }
      }
    }

    d3.select(ref.current)
      .data([props.node])
      .call(drag(props.simulation));
  }, [props.node])

  const handleColor = () => {
    let color = props.color
    if (props.node.id === "ORIGIN") {
      color = "#000"
    } else if (props.node.id.includes("A")) {
      color = "#1f77b4"
    }
    return color
  }

  return (
    <circle className="node"
          r={props.node.id === "ORIGIN"? 15 : 10}
          fill={handleColor()}
          ref={ref}>
      <title>{props.node.id}</title>
    </circle>
  )
}

const Nodes: React.FC<INodesProps> = (props) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const nodes = props.nodes.map((node: d3Node, index: number) => {
    return (
      <Node
        key={index}
        node={node}
        color={color(node.group.toString())}
        simulation={props.simulation}/>
    )
  })

  return (
    <g className="nodes">
      {nodes}
    </g>
  )
  }

  export default Nodes

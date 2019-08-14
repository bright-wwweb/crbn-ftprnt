import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

interface ILabelProps {
  node: d3Node
}

interface ILabelsProps {
  nodes: d3Node[] 
}

const Label: React.FC<ILabelProps> = (props) => {
  const ref = useRef(null)

  useEffect(() => {
    d3.select(ref.current).data([props.node]);
  })

  return (
    <text className="label" ref={ref}>
      {props.node.id}
    </text>
  )
}

const Labels: React.FC<ILabelsProps> = (props) => {
  const labels = props.nodes.map((node: d3Node, index: number) => {
    return <Label key={index} node={node} />
  });

  return (
    <g className="labels">
      {labels}
    </g>
  )
}

export default Labels
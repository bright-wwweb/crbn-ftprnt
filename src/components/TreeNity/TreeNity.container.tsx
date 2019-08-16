import * as d3 from "d3";
import './TreeNity.scss';
import React, { FC, useState, useEffect } from 'react';
import { Links, Nodes, Labels } from 'components/index';

interface Props {
  width: number
  height: number
  resp: respType
}

type respType =
| "A"
| "B"
| "C"

interface State { }


const TreeNity: FC<Props> = ({width, height, resp}) => {
  const[graph, setGraph] = useState<d3Graph>({ nodes: [], links: [] });
  const [treeState, setTreeState] = useState<any>({
    A: {},
    B: {},
    C: {}
  });

  let simulation: any = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d: any) {
      return d.id
    }))
    .force("charge", d3.forceManyBody().strength(-75))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .nodes(graph.nodes)

  simulation.force("link").links(graph.links);

  useEffect(() => {
    const node = d3.selectAll(".node")
    const link = d3.selectAll(".link")
    const label = d3.selectAll(".label");

    function ticked() {
      link
        .attr("x1", function (d: any) {
          return d.source.x
        })
        .attr("y1", function (d: any) {
          return d.source.y
        })
        .attr("x2", function (d: any) {
          return d.target.x
        })
        .attr("y2", function (d: any) {
          return d.target.y
        })

      node
        .attr("cx", function (d: any) {
          return d.x
        })
        .attr("cy", function (d: any) {
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
    let [parent, leftChild, rightChild]: any = [null, null, null]
    if (nodeId > 0) {
      for (let i = 0; i < nodeId; i++) {
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

  return (
    <svg className="viz-mount" width={width} height={height}>
      <Links links={graph.links} />
      <Nodes nodes={graph.nodes} simulation={simulation} />
      <Labels nodes={graph.nodes} />
    </svg>
  )
};

export default TreeNity;
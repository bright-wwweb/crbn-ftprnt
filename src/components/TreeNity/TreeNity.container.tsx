import * as d3 from "d3";
import './TreeNity.scss';
import React, { FC, useState, useEffect } from 'react';
import { Links, Nodes, Labels } from 'components/index';

interface Props {
  width: number
  height: number
  resp: respType
}

interface State { }

const TreeNity: FC<Props> = ({width, height, resp}) => {
  const[graph, setGraph] = useState<d3Graph>({ nodes: [], links: [] });
  const[parent, setParent] = useState<number | null>(null);
  const[currNode, setCurrNode] = useState<number>(0);
  const [treeState] = useState<any>({
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
          return d.parent.x
        })
        .attr("y1", function (d: any) {
          return d.parent.y
        })
        .attr("x2", function (d: any) {
          return d.self.x
        })
        .attr("y2", function (d: any) {
          return d.self.y
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
      _handleNewResponse();
      _createNodeEntry();
      _createLinkEntry();
  })

  const _handleNewResponse = () => {
    setCurrNode(Object.keys(treeState[resp]).length);
    let [leftChild, rightChild]: any = [null, null]
    if (currNode > 0) {
      for (let i = 0; i < currNode; i++) {
        let node = treeState[resp][i]
        if (!node.leftChild) {
          node.leftChild = currNode
          setParent(i)
        } else if (!node.rightChild) {
          node.rightChild = currNode
          setParent(i)
        }
      }
    }
    treeState[resp][currNode] = {
      parent,
      leftChild,
      rightChild,
    }
  }

  // resp is (A, B, or C) & it represents the tree that is being updated
  // nodeIds is list of nodeIds that were updated (parent and new treeState entry)
  const _createNodeEntry = () => {
    // returnval should look like: 
    // { id: "ARDUINO A", group: 1 },
    let group;
    switch (resp) {
      case "A":
        group = 1; break
      case "B":
        group = 2; break
      case "C":
        group = 3; break
      default:
        throw new Error(`Gurrlll this ain't A B nor C. Check yoself. Wut came thru for resp: ${resp}`)
    }
    graph.nodes.push({
      id: `${resp}${currNode}`,
      group
    });

    setGraph(graph)
  }

  const _createLinkEntry = () => {
    graph.links.push(
      {
        parent: `${resp}${parent}`,
        self: `${resp}${currNode}`,
        value: 1
      }
    )
    setGraph(graph);
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
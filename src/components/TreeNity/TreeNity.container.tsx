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
  const[source, setSource] = useState<number | null>(null);
  const[target, setTarget] = useState<number>(0);
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

  simulation.force("link").links(graph.links)

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
  })

  function _handleNewResponse() {
    const newTargetId = Object.keys(treeState[resp]).length
    let [leftChild, rightChild, newSourceId]: any = [null, null, null]
    if (newTargetId > 0) {
      // FIXME: REFACTOR ME SO I'M NOT A FOR LOOP, BE MATHY :D
      for (let i = 0; i < newTargetId; i++) {
        let node = treeState[resp][i]
        if (!node.leftChild) {
          node.leftChild = newTargetId
          newSourceId = i;
          break
        } else if (!node.rightChild) {
          node.rightChild = newTargetId
          newSourceId = i;
          break
        }
      }
    }
    const targetObj = {
      source: newSourceId,
      leftChild,
      rightChild,
    }
    const newT = {
      ...treeState,
      [resp]: { ...treeState[resp], [newTargetId]: targetObj }
    }
    setSource(newSourceId)
    setTarget(newTargetId)
    setTreeState(newT)
  }

  // resp is (A, B, or C) & it represents the tree that is being updated
  // nodeIds is list of nodeIds that were updated (parent and new treeState entry)
  function _createNodeEntry() {
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
      id: `${resp}${target}`,
      group
    });

    setGraph(graph)
  }

  function _createLinkEntry() {
    graph.links.push(
      {
        source: `${resp}${source}`,
        target: `${resp}${target}`,
        value: 1
      }
    )
    setGraph(graph);
  }

  return (
    <>
      <button onClick={_handleNewResponse}>ADD NODE</button>
      <svg className="viz-mount" width={width} height={height}>
        <Links links={graph.links} />
        <Nodes nodes={graph.nodes} simulation={simulation} />
        <Labels nodes={graph.nodes} />
      </svg>
    </>
  )
};

export default TreeNity;
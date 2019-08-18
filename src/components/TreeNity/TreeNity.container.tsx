import * as d3 from "d3";
import './TreeNity.scss';
import React, { FC, useState, useEffect } from 'react';
import { Links, Nodes, Labels } from 'components/index';

interface Props {
  width: number
  height: number
  // resp: respType
}

const TreeNity: FC<Props> = ({width, height}) => {
  const[graph, setGraph] = useState<d3Graph>({ nodes: [], links: [] });
  const[source, setSource] = useState<number | null>(null);
  const[target, setTarget] = useState<number>(0)
  const [resp, setResp] = useState<respType>("A")

  const [treeState, setTreeState] = useState<any>({
    A: {},
    B: {},
    C: {}
  });

  let simulation: any = d3.forceSimulation(graph.nodes)
    .force("link", d3.forceLink().id(function (d: any) {
      return d.id
    }))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(width / 2, height / 2))

  simulation.force("link").links(graph.links)

  useEffect(() => {
    _createNodeEntry()
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
    simulation.force("link").links(graph.links)
  }, [target, source])

  function _handleNewResponse(manualResp: respType) {
    const newTargetId = Object.keys(treeState[manualResp]).length
    let [leftChild, rightChild, newSourceId]: any = [null, null, null]
    if (newTargetId > 0) {
      // FIXME: REFACTOR ME SO I'M NOT A FOR LOOP, BE MATHY :D
      for (let i = 0; i < newTargetId; i++) {
        let node = treeState[manualResp][i]
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
    // FOR TESTING ONLY:
    setResp(manualResp)
  }

  // resp is (A, B, or C) & it represents the tree that is being updated
  function _createNodeEntry() {
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
    const newGraph = {
      nodes: graph.nodes.concat({
        id: `${resp}${target}`,
        group}),
      links: _createLinkEntry()
    }
    simulation.stop()
    setGraph(newGraph)
    simulation.restart()
    simulation.alpha(1)
  }

  function _createLinkEntry() {
    if (source !== null) {
      return graph.links.concat(
        {
          source: `${resp}${source}`,
          target: `${resp}${target}`,
          value: 1
        }
      )
    } else {
      return graph.links
    }
  }

  return (
    <>
      <button onClick={() => {_handleNewResponse("A")}}>ADD BLUE NODE</button>
      <button onClick={() => {_handleNewResponse("B")}}>ADD ANOTHER NODE</button>
      <button onClick={() => {_handleNewResponse("C")}}>ADD LAST NODE</button>
      <svg className="viz-mount" width={width} height={height}>
        <Links links={graph.links} />
        <Nodes nodes={graph.nodes} />
        <Labels nodes={graph.nodes} />
      </svg>
    </>
  )
};

export default TreeNity;
import * as d3 from "d3";
import './TreeNity.scss';
import React, { FC, useState, useEffect } from 'react';
import { Links, Nodes, Labels } from 'components/index';

interface Props {
  width: number
  height: number
  signal: signalType
  signalCount: number
  handleClickSignal: Function
}

// custom hook that combines useState with local storage check
// const useStateOrLocalStorage = (localStorageKey: string, initialValue: any) => {
//   const [value, setValue] = useState(
//     JSON.parse(localStorage.getItem(localStorageKey)) || initialValue
//   );
//   useEffect(() => {
//     localStorage.setItem(localStorageKey, JSON.stringify(value))
//   }, [value]);

//   return [value, setValue];
// };

const TreeNity: FC<Props> = ({
  width, height, signal, signalCount, handleClickSignal
}) => {

  const [graph, setGraph] = useState<d3Graph>({
    nodes: [{
      id: "ORIGIN",
      group: 4
    }
    ],
    links: [],
  });

  const [source, setSource] = useState<number | null>(null);
  const [target, setTarget] = useState<number>(0)

  const [treeState, setTreeState] = useState<any>({
    A: {},
    B: {},
    C: {},
  });

  let simulation: any = d3.forceSimulation(graph.nodes)
    .force("link", d3.forceLink().id(function(d: any) {
      return d.id
    }))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2))

  simulation.force("link").links(graph.links)

  useEffect(() => {
    if (signal) {
      _handleNewSignal()
    }
  }, [signalCount])

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
          return d.x = Math.max(5, Math.min(width - 5, d.x))
        })
        .attr("cy", function(d: any) {
          return d.y = Math.max(5, Math.min(height - 5, d.y))
        })

      label
        .attr("x", function(d: any) {
          return d.x + 5;
        })
        .attr("y", function(d: any) {
          return d.y + 5;
        })
    }

    simulation.nodes(graph.nodes).on("tick", ticked)
    simulation.force("link").links(graph.links)
  }, [target])

  function _handleNewSignal() {
    const newTargetId = Object.keys(treeState[signal]).length
    let [leftChild, rightChild, newSourceId]: any = [null, null, null]
    if (newTargetId > 0) {
      // FIXME: REFACTOR ME SO I'M NOT A FOR LOOP, BE MATHY :D
      for (let i = 0; i < newTargetId; i++) {
        let node = treeState[signal][i]
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
      [signal]: {
        ...treeState[signal],
        [newTargetId]: targetObj
      }
    }

    setSource(newSourceId)
    setTarget(newTargetId)
    setTreeState(newT)
    _createNodeEntry()
  }

  // signal is (A, B, or C) & it represents the tree that is being updated
  function _createNodeEntry() {
    let group: number
    let newGraph: d3Graph

    switch (signal) {
      case "A":
        group = 1;
        break
      case "B":
        group = 2;
        break
      case "C":
        group = 3;
        break
      default:
        throw new Error(`Gurrlll this ain't A B nor C. Check yoself. Wut came thru for signal: ${signal}`)
    }

    if (signal) {
      newGraph = {
        nodes: graph.nodes.concat({
          id: `${signal}${target}`,
          group,
        }),
        links: _createLinkEntry()
      }
    } else {
      newGraph = graph
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
          source: `${signal}${source}`,
          target: `${signal}${target}`,
          value: 1
        }
      )
    } else {
      return graph.links.concat(
        {
          source: "ORIGIN",
          target: `${signal}${target}`,
          value: 1
        }
      )
    }
  }

  return (
    <div id="viz-container">
      <svg className="viz-mount" width={width} height={height}>
        <Links links={graph.links}/>
        <Nodes nodes={graph.nodes}/>
        <Labels nodes={graph.nodes}/>
      </svg>
      <div id="btn-container">
        <button onClick={() => {handleClickSignal("A")}}>ADD BLUE NODE</button>
        <button onClick={() => {handleClickSignal("B")}}>ADD RED NODE</button>
        <button onClick={() => {handleClickSignal("C")}}>ADD GREEN NODE</button>
      </div>
    </div>
  )
};

export default TreeNity;

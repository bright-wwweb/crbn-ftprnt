type d3Node = {
    id: string,
    group: number,
} & SimulationNodeDatum;

type d3Link = {
    source: string,
    target: string,
    value: number,
};

type d3Graph = {
    nodes: d3Node[],
    links: d3Link[],
};

type respType =
| "A"
| "B"
| "C"
| ""
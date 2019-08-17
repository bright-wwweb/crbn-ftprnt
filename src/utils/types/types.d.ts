type d3Node = {
    id: string,
    group: number,
} & SimulationNodeDatum;

type d3Link = {
    parent: string,
    self: string,
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

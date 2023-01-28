/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
*/
import type {BlueprintItemModel, LinkModel} from '../model/store';

export class GraphVertex {
    public readonly item: BlueprintItemModel;
    public inputEdges?: GraphEdge[] = undefined;
    public outputEdges?: GraphEdge[] = undefined;
    public index?: number = undefined;
    public lowlink = 0;
    public onStack = false;

    constructor(item: BlueprintItemModel) {
        this.item = item;
    }
}

export class GraphEdge {
    public readonly link: LinkModel;
    public readonly inputVertex: GraphVertex;
    public readonly outputVertex: GraphVertex;

    constructor(link: LinkModel, inputVertex: GraphVertex, outputVertex: GraphVertex) {
        this.link = link;
        this.inputVertex = inputVertex;
        this.outputVertex = outputVertex;
    }
}

//we are using Tarjan's strongly connected components algorithm to walk graph and to find SCC/cycles
//we may get here middle point of graph, so inside we use depth-first search (DFS) graph walker to walk upwards
//because Tarjan's algorithm only walks downwards
type ArrayScc = BlueprintItemModel[][];
type ArraySccVertex = GraphVertex[][];

export class TarjanGraphWalker {
    private readonly vertexMapping = new Map<string, GraphVertex>();
    private index = 0;
    private stack: GraphVertex[] = [];
    private readonly arraySeparateGraphs: ArrayScc[] = [];
    private currentArrayScc: ArraySccVertex = [];
    walkGraph(items: IterableIterator<BlueprintItemModel>) {
        //if we have full blueprint here - we may encounter several independent graphs
        //for example we have full graph update when we just loaded data
        for(const item of items) {
            const vertex = this.mapVertex(item);
            if(vertex.index === undefined) {
                this.strongconnect(vertex);
                this.walkEntireGraph();
            }
        }
        return this.arraySeparateGraphs;
    }
    private walkEntireGraph() {
        //we walked entire graph downwards, now we walk upwards from everything found
        //until we exhausted everything
        //this way we'll walk entire graph
        const allFoundEdges: ArrayScc = [];
        do {
            const currentlyFound = this.currentArrayScc;
            this.currentArrayScc = [];
            for(const found of currentlyFound) {
                allFoundEdges.push(found.map((vertex) => vertex.item));
                for(const vertex of found) {
                    this.walkUpward(vertex);
                }
            }
        } while(this.currentArrayScc.length);
        this.arraySeparateGraphs.push(allFoundEdges);
    }
    private walkUpward(vertex: GraphVertex) {
        const upperEdges = this.findEdges(vertex, false);
        for(const edge of upperEdges) {
            const upperVertex = edge.outputVertex;
            if(upperVertex.index === undefined) {
                this.strongconnect(upperVertex);
                this.walkUpward(upperVertex);
            }
        }
    }
    private mapVertex(item: BlueprintItemModel) {
        let vertex = this.vertexMapping.get(item.key);
        if(!vertex) {
            vertex = new GraphVertex(item);
            this.vertexMapping.set(item.key, vertex);
        }
        return vertex;
    }
    private findEdges(vertex: GraphVertex, outbound: boolean) {
        let edges = outbound ? vertex.outputEdges : vertex.inputEdges;
        if(edges)
            return edges;

        edges = [];
        if(outbound)
            vertex.outputEdges = edges;
        else
            vertex.inputEdges = edges;

        const recipe = vertex.item.selectedRecipe;
        if(!recipe)
            return edges;

        const flows = outbound ? recipe.output : recipe.input;
        for(const flow of flows) {
            const links = flow.links;
            for(const link of links) {
                //output recipe is connected to input of linked recipe
                const otherFlow = outbound ? link.input : link.output;
                if(otherFlow?.ownerItem) {
                    const otherVertex = this.mapVertex(otherFlow.ownerItem);
                    const inputVertex = outbound ? otherVertex : vertex;
                    const outputVertex = outbound ? vertex : otherVertex;
                    edges.push(new GraphEdge(link, inputVertex, outputVertex));
                }
            }
        }
        return edges;
    }
    //https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
    private strongconnect(vertex: GraphVertex) {
        const index = this.index++;
        vertex.index = index;
        vertex.lowlink = index;
        this.stack.push(vertex);
        vertex.onStack = true;

        const lowerEdges = this.findEdges(vertex, true);
        for(const edge of lowerEdges) {
            const lowerVertex = edge.inputVertex;
            if(lowerVertex.index === undefined) {
                // Successor w has not yet been visited; recurse on it
                this.strongconnect(lowerVertex);
                vertex.lowlink = Math.min(vertex.lowlink, lowerVertex.lowlink);
            } else if(lowerVertex.onStack) {
                // Successor w is in stack S and hence in the current SCC
                // If w is not on stack, then (v, w) is an edge pointing to an SCC already found and must be ignored
                // Note: The next line may look odd - but is correct.
                // It says w.index not w.lowlink; that is deliberate and from the original paper
                vertex.lowlink = Math.min(vertex.lowlink, lowerVertex.index);
            }
        }

        // If v is a root node, pop the stack and generate an SCC
        if(vertex.lowlink == vertex.index) {
            //start a new strongly connected component
            const scc: GraphVertex[] = [];
            for(;;) {
                const w = this.stack.pop();
                if(w) {
                    w.onStack = false;
                    scc.push(w);
                }
                if(w === vertex)
                    break;
            }
            this.currentArrayScc.push(scc);
        }
    }
}

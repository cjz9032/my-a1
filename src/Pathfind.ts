import { Grid } from './Grid'
import { PNode } from './PNode'
import { Matrix } from './Matrix'

interface IPoint {
  x: number
  y: number
}

type Heuristic = (a: IPoint, b: IPoint) => number

let count = 0

function delay() {
  if (++count > 0) {
    count = 0
    return new Promise((resolve) => window.requestAnimationFrame(resolve))
  }
}

export class PathFinder {
  public startNode!: PNode
  public endNode!: PNode
  public currentNode!: PNode
  public heuristic: Heuristic = PathFinder.Heuristic.Manhattan
  public diagonalEnabled = false

  static Heuristic = {
    Manhattan: (a: IPoint, b: IPoint) =>
      Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
    Euclidean: (a: IPoint, b: IPoint) =>
      Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }

  constructor(public grid: Grid) {}

  private getPath(node: PNode) {
    let result: IPoint[] = []

    while (node) {
      result = [{ x: node.x, y: node.y }].concat(result)
      node = node.parent!
    }

    return result
  }

  async search(start: IPoint, end: IPoint) {
    let currentNode: PNode | undefined
    const gridNeighborsDirections = this.diagonalEnabled
      ? Matrix.NEIGHBORS_ALL
      : Matrix.NEIGHBORS_ADJACENT

    this.startNode = this.grid.get(start.x, start.y)
    this.endNode = this.grid.get(end.x, end.y)

    const opened: PNode[] = [this.startNode]

    this.startNode.h =
      this.heuristic(this.startNode, this.endNode) *
      this.startNode.getCost(this.endNode)
    /* eslint-disable */
    while ((currentNode = opened.shift())) {
      if (currentNode.closed) continue

      this.currentNode = currentNode

      if (currentNode === this.endNode) {
        return this.endNode
      }

      const neighbors = this.grid.neighborsOf(
        currentNode.x,
        currentNode.y,
        gridNeighborsDirections
      )

      for (const neigh of neighbors) {
        if (!neigh || neigh.closed || !neigh.canWalk) continue

        const gscore = currentNode.g * neigh.getCost(currentNode)

        if (!neigh.visited || gscore < neigh.g) {
          neigh.parent = currentNode
          neigh.h =
            neigh.h ||
            this.heuristic(neigh, this.endNode) * neigh.getCost(neigh)
          neigh.g = gscore

          if (!neigh.visited) {
            neigh.visited = true
            opened.push(neigh)
          }
        }
      }

      currentNode.closed = true

      opened.sort((a, b) => a.f - b.f)

      // Somente para renderizar a animação
      await delay()
    }

    return Promise.reject(new Error('Caminho não encontrado!'))
  }
}

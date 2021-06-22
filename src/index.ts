import { Grid } from './Grid'
import { PathFinder } from './Pathfind'
import { Renderer } from './renderer'
// @ts-ignore
import maze from '@indutny/maze'

const $canvas = document.getElementById('view') as HTMLCanvasElement

$canvas.width = document.documentElement.clientWidth
$canvas.height = document.documentElement.clientHeight

const size = 2000 || Math.floor(Math.min($canvas.width, $canvas.height) / 8)

// let items: number[][] = maze({
//   width: size,
//   height: size
// })
let items = new Array(size).fill(new Array(size).fill(1))
// console.time('bbb')

items = items.map((line) => {
  return line.map((t: any) => {
    return Math.random() > 0.3 ? 1 : 0
  })
})
// console.timeEnd('bbb')

const grid = new Grid(items)
const finder = new PathFinder(grid)

// finder.diagonalEnabled = true

// finder.heuristic = PathFinder.Heuristic.Manhattan

function randomPos() {
  let x: number, y: number

  do {
    x = Math.floor(Math.random() * grid.width)
    y = Math.floor(Math.random() * grid.height)
  } while (!grid.get(x, y).canWalk)

  return { x, y }
}

finder.heuristic = PathFinder.Heuristic.Euclidean
const a = randomPos()
const b = randomPos()
export const renderer = new Renderer($canvas)

console.time('find')
finder
  .search(a, b)
  .finally(() => {
    console.timeEnd('find')
  })
  .then((res) => {
    console.log(res)
  })
  .catch((err) => console.log(err.message))

// function loop() {
//   renderer.render2(finder)
//   window.requestAnimationFrame(loop)
// }

// loop()

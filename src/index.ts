import { Grid } from './Grid'
import { PathFinder } from './Pathfind'
import { Renderer } from './renderer'
import maze from '@indutny/maze'

const $canvas = document.getElementById('view') as HTMLCanvasElement

$canvas.width = document.documentElement.clientWidth
$canvas.height = document.documentElement.clientHeight

const size = 100 || Math.floor(Math.min($canvas.width, $canvas.height) / 8)

const items: number[][] = maze({
  width: size,
  height: size
})

// const items = new Array(50).fill(new Array(50).fill(1))
const grid = new Grid(items)
const finder = new PathFinder(grid)

// finder.diagonalEnabled = true

finder.heuristic = PathFinder.Heuristic.Manhattan

function randomPos() {
  let x: number, y: number

  do {
    x = Math.floor(Math.random() * grid.width)
    y = Math.floor(Math.random() * grid.height)
  } while (!grid.get(x, y).canWalk)

  return { x, y }
}

finder.heuristic = PathFinder.Heuristic.Euclidean

const x = randomPos()
const y = randomPos()

console.time('find')
finder
  .search(x, y)
  .finally(() => {
    console.timeEnd('find')
  })
  .then((res) => {
    console.log(res)
  })
  .catch((err) => console.log(err.message))

const renderer = new Renderer($canvas)

function loop() {
  renderer.render(finder)
  window.requestAnimationFrame(loop)
}

loop()

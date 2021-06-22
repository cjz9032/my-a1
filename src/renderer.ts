import { PathFinder } from './Pathfind'
import { PNode } from './PNode'

const getChannel = (color: number, channel: number) => {
  return (color >> (8 * (3 - channel))) & 0xff
}

function mixChannel(channelA: number, channelB: number, amount: number) {
  return channelA * amount + channelB * (1 - amount)
}

function mix(colorA: number, colorB: number, amount: number) {
  const r = mixChannel(getChannel(colorA, 0), getChannel(colorB, 0), amount)
  const g = mixChannel(getChannel(colorA, 1), getChannel(colorB, 1), amount)
  const b = mixChannel(getChannel(colorA, 2), getChannel(colorB, 2), amount)
  const a = mixChannel(getChannel(colorA, 3), getChannel(colorB, 2), amount)

  return `rgba(${r}, ${g}, ${b}, ${a / 255})`
}

export class Renderer {
  private ctx: CanvasRenderingContext2D

  mapTexture!: ImageData

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  }

  getMapTexture(finder: PathFinder) {
    if (!this.mapTexture) {
      const { canvas, ctx } = this
      const vp = Math.min(canvas.width, canvas.height)
      const dMax = Math.max(finder.grid.width, finder.grid.height)
      const size = vp / dMax
      const r = size / 2
      const d = finder.heuristic(finder.startNode, finder.endNode)

      canvas.width = this.canvas.width
      canvas.height = this.canvas.height

      finder.grid.forEach((node, x, y) => {
        x *= size
        y *= size

        this.ctx.font = '12px monospace'

        if (node === finder.startNode) {
          ctx.fillStyle = '#00FFAA'
          ctx.arc(x + r, y + r, r, 0, Math.PI * 2)
          ctx.fill()
        } else if (node === finder.endNode) {
          ctx.fillStyle = '#FF00AA'
          ctx.arc(x + r, y + r, r, 0, Math.PI * 2)
          ctx.fill()
        } else if (!node.canWalk) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
          ctx.fillRect(x, y, size, size)
        } else if (!node.f) {
          this.ctx.fillStyle = mix(
            0x00ffaa00,
            0xff00aaff,
            finder.heuristic(node, finder.endNode) / d
          )
          this.ctx.fillRect(x, y, size, size)
        }

        // this.ctx.strokeStyle = '#FFFFF'
        // this.ctx.strokeRect(x, y, size, size)
      })

      this.mapTexture = ctx.getImageData(0, 0, canvas.width, canvas.height)
    }

    return this.mapTexture
  }

  render(finder: PathFinder) {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    const vp = Math.min(this.canvas.width, this.canvas.height)
    const dMax = Math.max(finder.grid.width, finder.grid.height)
    const size = vp / dMax
    const center = size / 2
    const d = finder.heuristic(finder.startNode, finder.endNode)

    this.ctx.font = '12px monospace'

    this.ctx.putImageData(this.getMapTexture(finder), 0, 0)

    finder.grid.forEach((node, x, y) => {
      x *= size
      y *= size

      if (node.parent) {
        this.ctx.lineWidth = Math.max(1, size / 8)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'

        this.ctx.beginPath()
        this.ctx.moveTo(x + center, y + center)
        this.ctx.lineTo(
          node.parent.x * size + center,
          node.parent.y * size + center
        )
        this.ctx.closePath()
        this.ctx.stroke()

        this.ctx.arc(x + center, y + center, this.ctx.lineWidth, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.lineWidth = 2
      }

      this.ctx.fillStyle = '#000000'

      // this.ctx.textAlign = 'left'
      // this.ctx.fillText(Math.floor(node.g).toString(), x + p, y + size - p)

      // this.ctx.textAlign = 'end'
      // this.ctx.fillText(
      //   Math.floor(node.h).toString(),
      //   x + size - p,
      //   y + size - p
      // )

      // this.ctx.textAlign = 'start'
      // this.ctx.fillText(Math.floor(node.f).toString(), x + p, y + 12 + p)
    })

    let node: PNode | undefined = finder.currentNode
    let count = 0

    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.ctx.lineWidth = size
    this.ctx.strokeStyle = mix(
      0x00ffaaff,
      0xff00aaff,
      finder.heuristic(node, finder.endNode) / d
    )

    this.ctx.beginPath()

    while (node) {
      if (node.parent) {
        count++
        let { x, y } = node
        x *= size
        y *= size

        if (count <= 1) {
          this.ctx.moveTo(x + center, y + center)
        } else {
          this.ctx.lineTo(
            node.parent.x * size + center,
            node.parent.y * size + center
          )
        }
      }

      node = node.parent
    }

    this.ctx.stroke()

    this.ctx.fillStyle = 'white'
    this.ctx.font = '32px monospace'
    this.ctx.textAlign = 'end'
    this.ctx.shadowOffsetX = 2
    this.ctx.shadowOffsetY = 2
    this.ctx.shadowColor = 'black'

    this.ctx.fillText(String(count), this.canvas.width - 64, 32)
    this.ctx.shadowColor = 'transparent'
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
  }

  render2(finder: PathFinder) {
    const vp = Math.min(this.canvas.width, this.canvas.height)
    const dMax = Math.max(finder.grid.width, finder.grid.height)
    const size = vp / dMax
    const center = size / 2

    let node: PNode | undefined = finder.currentNode
    let count = 0

    while (node) {
      if (node.parent) {
        count++
        let { x, y } = node
        x *= size
        y *= size

        if (count <= 1) {
        } else {
        }
      }

      node = node.parent
    }
  }
}

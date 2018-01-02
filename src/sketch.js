import { Simulation } from './simulation'

const canvas = document.getElementById('fireworks')
const ctx = canvas.getContext('2d')
ctx.globalAlpha = 0.5

const buffer = document.getElementById('buffer')
const bufferCtx = buffer.getContext('2d')

// generate static text on the off-screen canvas
bufferCtx.globalAlpha = 1
bufferCtx.font = '48pt Sans-serif'
bufferCtx.textAlign = 'center'
bufferCtx.textBaseline = 'middle'
bufferCtx.fillStyle = '#111'
bufferCtx.fillRect(0, 0, 800, 128)
bufferCtx.fillStyle = 'rgba(200, 50, 105, 0.8)'
bufferCtx.fillText('Happy New Year', 400, 64)

const sim = new Simulation({
  canvas: canvas,
  timestep: 0.01,
  gravity: 15,
  launchPeriod: 50,
  maxRockets: 50
})

function draw(time = 0) {
  ctx.drawImage(buffer, 0, 0)
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 128, canvas.width, canvas.height)
  sim.update(time)
  sim.render(ctx)
  requestAnimationFrame(draw)
}

draw()

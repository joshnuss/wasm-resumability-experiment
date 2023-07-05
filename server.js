import Fastify from 'fastify'
import fs from 'fs'

const bytes = await fs.promises.readFile('./example.wasm')
const fastify = Fastify({
  logger: true
})

fastify.get('/example.wasm', async (request, reply) => {
  reply
    .type('application/wasm')
    .send(bytes)
})

fastify.get('/', async (request, reply) => {
  const memory = new WebAssembly.Memory({ initial: 1, maximum: 1, shared: true })
  const module = await WebAssembly.instantiate(bytes, {
    js: {
      mem: memory
    }
  })

  const { increment, read } = module.instance.exports

  increment()
  increment()
  increment()

  // copy memory buffer
  const buffer = memory.buffer.slice(0, 1)
  const data = Buffer.from(buffer).toString('base64')

  reply.type('text/html')
  reply.send(`
  <html>
    <body data-state='${data}'>
      Value is <span>${read()}</span>
      <button id="button">increment</button>

      <script>
        window.addEventListener('DOMContentLoaded', async () => {
          const state = document.body.dataset['state']
          const decoded = atob(state)
          const memory = new WebAssembly.Memory({ initial: 1, maximum: 1, shared: true })

          const module = await WebAssembly.instantiateStreaming(fetch('/example.wasm'), {
            js: {
              mem: memory
            }
          })

          copyToArrayBuffer(decoded, memory.buffer)

          const { increment, read } = module.instance.exports
          const span = document.querySelector('span')

          document.querySelector('#button').addEventListener('click', () => {
            span.textContent = increment()
          })
        })

        function copyToArrayBuffer(string, buffer) {
          const typed = new Uint8Array(buffer)

          for (let i = 0; i < string.length; i++) {
            typed[i] = string.charCodeAt(i)
          }
        }
      </script>
    </body>
  </html>
  `)
})

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

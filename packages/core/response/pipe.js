const compress = require('../utils/compressor')

const define = (Response) => {
  Response.prototype.pipe = function (stream, size, compressed = false) {
    const self = this
    self.onAborted(() => {
      if (stream) {
        stream.destroy()
      }
    })
    if (compressed) {
      const compressedStream = compress(stream, self.request.headers, self._headers)
      if (compressedStream) {
        stream = compressedStream
      }
    }
    if (compressed || !size) {
      stream.on('data', (buffer) => {
        if (self._isDone) {
          stream.destroy()
          return
        }
        self.write(
          buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength
          )
        )
      })
    } else {
      stream.on('data', (chunk) => {
        if (self._isDone) {
          stream.destroy()
          return
        }
        const ab = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength)
        const lastOffset = self.getWriteOffset()

        // First try
        const [ok, done] = self.tryEnd(ab, size)

        if (done && stream && stream.destroy && typeof stream.destroy === 'function') {
          stream.destroy()
        } else if (!ok) {
          // pause because backpressure
          stream.pause()

          // Register async handlers for drainage
          self.onWritable((offset) => {
            const [writeOk, writeDone] = self.tryEnd(ab.slice(offset - lastOffset), size)
            if (writeDone && stream && stream.end && typeof stream.end === 'function') {
              stream.end()
            } else if (writeOk && stream && stream.resume && typeof stream.resume === 'function') {
              stream.resume()
            }
            return writeOk
          })
        }
      })
    }
    stream
      .on('error', () => {
        if (!self._isDone) {
          self.writeStatus('500 Internal server error')
          self.end()
        }
        stream.destroy()
      })
      .on('end', () => {
        if (!self._isDone) {
          try {
            self.endOnly()
          } catch (e) {
            self.route.app.logger.error(e)
          }
        }
      })

    return self
  }
}

module.exports = define

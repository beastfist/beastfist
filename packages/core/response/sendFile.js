const mime = require('mime-types')
const { contentType } = mime
const { basename } = require('path')
const fs = require('fs')
const { createReadStream } = fs

// const compress = require('../utils/compressor')

const define = (Response) => {
  Response.prototype.sendFile = function (path, lastModified = true, compressed = false) {
    if (!fs.existsSync(path)) {
      this.statusCode = 404
      this.send(`Path '${path}' doesn't exist`)
      return
    }
    const fileName = basename(path)
    const stat = fs.statSync(path)
    const meta = {
      fileName: basename(path),
      mimeType: contentType(fileName) || 'application/octet-stream',
      stat,
      size: stat.size,
      isDir: stat.isDirectory(),
      mtime: stat.mtime,
      lastModified: stat.mtime.toUTCString()
    }
    if (meta.isDir) {
      this.statusCode = 404
      this.end()
    }
    if (lastModified) {
      meta.mtime.setMilliseconds(0)
      if (this.request.get('if-modified-since')) {
        if (new Date(this.request.get('if-modified-since')) >= meta.mtime) {
          this.writeStatus('304 Not Modified')
          return this.end()
        }
      }
      this.setHeader('last-modified', meta.lastModified)
    }
    this.setHeader('content-type', meta.mimeType)

    // write data
    let start = 0
    let end = 0

    if (this.request.get('range')) {
      [start, end] = this.request.get('range')
        .substr(6)
        .split('-')
        .map((byte) => (byte ? parseInt(byte, 10) : undefined))

      // Chrome patch for work
      if (end === undefined) {
        end = meta.size - 1
      }

      if (start !== undefined) {
        this.writeStatus('206 Partial Content')
        this.setHeader('accept-ranges', 'bytes')
        this.setHeader('content-range', `bytes ${start}-${end}/${meta.size}`)
        meta.size = end - start + 1
      }
    }
    if (end < 0) {
      end = 0
    }

    const stream = end
      ? createReadStream(path, { start, end })
      : createReadStream(path)

    const pipe = this.pipe(stream, meta.size, compressed)
    this.writeHeaders()

    return pipe
  }
}

module.exports = define

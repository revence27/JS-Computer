elf = require '../elf'
fs   = require 'fs'
util = require 'util'

defineElf = () ->
  fch = process.argv[process.argv.length - 1]
  fs.open fch, 'r', (err, fd) ->
    if err
      console.error err
    else
      d = new Buffer 18
      fs.fstat fd, (err, stats) ->
        d = new Buffer stats.size
        fs.read fd, d, 0, stats.size, null, (err, num, buf) ->
          if err
            console.error err
          else
            console.log util.inspect elf.readElf buf
          fs.close fd

defineElf()

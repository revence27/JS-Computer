task 'all', 'Compile all .coffee files', (opts) ->
  cp = require 'child_process'
  fs = require 'fs'
  fs.readdir '.', (err, dem) ->
    procs = for fch in dem when fch.match /\.coffee$/
      sp = cp.spawn 'coffee', ['--watch', '-c', fch]
      sp.stderr.on('data', (x) -> console.error x.toString())
      sp.stdout.on('data', (x) -> console.log x.toString())
      sp.on('exit', (x, y) -> console.log x)
      sp
    process.on 'SIGINT', () ->
      for proc in procs
        sp.kill 'SIGKILL'

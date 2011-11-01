as      = require './assassin'
pretty  = require './prettyavr'

compile = (code) ->
  ram   = new Buffer 256
  code  = as.assemble code
  pc    = 0
  opc   = null
  until (opc = code[pc]) == undefined
    if opc == 0
      pc = pc + 1
    else if 0b1100 == (opc >> 12)
      pc = 0x0FFF & opc
    else
      console.error "Opcode unknown #{opc}"
      break
  ram

exports.compile = compile

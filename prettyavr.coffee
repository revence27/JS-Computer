opcode_tree =
  16:
    0:      'nop'
    38280:  'sleep'
    38168:  'reti'
    38024:  'clc'
    38104:  'clh'
    38136:  'cli'
    38056:  'cln'
    38088:  'cls'
    38120:  'clt'
    38072:  'clv'
    38040:  'clz'
  7:
    74:     (opc) -> "com #{opc & 0x01f0}"
  6:
    9:      (opc) -> "clr #{opc & 0x03ff}"
  4:
    12:     (opc) -> "rjmp #{opc & 0x0fff}"

clean_answer = (ans, opc) ->
  if typeof(ans) == typeof(clean_answer)
    clean_answer (ans opc), opc
  else if typeof(ans) == typeof([])
    clean_answer ans[0] opc
  else
    ans

name_opcode = (opc, max, table) ->
  ans   =  null
  max   ?= 16
  table ?= opcode_tree
  # for width of table
  wds = (w for w of table).sort()
  for width in wds
    uc = opc >> (max - width)
    ans = table[width][uc]
    return clean_answer ans, opc if ans
  "UNKNOWN(#{opc})"

name_opcodes = (opcs, max, table) ->
  max ?= 16
  for opc in opcs
    name_opcode opc, max, table

exports.opcode_tree  = opcode_tree
exports.name_opcode  = name_opcode
exports.name_opcodes = name_opcodes

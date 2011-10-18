opcode_tree =
  16:
    0:    'nop'
    157:  'sleep'
  4:
    3: 'rjmp'

clean_answer = (ans, opc) ->
  if typeof(ans) == typeof(clean_answer)
    clean_answer ans opc
  else if typeof(ans) == typeof([])
    clean_answer ans[0] opc
  else
    ans

name_opcode = (opc, max, table) ->
  ans   =  null
  mask  = 0xffff
  max   ?= 16
  table ?= opcode_tree
  for width of table
    df = max - width
    ans = table[width][opc & (mask >> df)]
    if ans
      if typeof(ans) == typeof(table)
        ans = name_opcode (opc & (mask >> df)), df, ans
      else
        ans = clean_answer ans, opc
  ans

name_opcodes = (opcs, max, table) ->
  max ?= 16
  for opc in opcs
    name_opcode opc, max, table

exports.opcode_tree  = opcode_tree
exports.name_opcode  = name_opcode
exports.name_opcodes = name_opcodes

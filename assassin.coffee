opcode_tree =
  'nop':    [[], 0]
  'sleep':  [[], 38280]
  'reti':   [[], 38168]
  'clc':    [[], 38024]
  'clh':    [[], 38104]
  'cli':    [[], 38136]
  'cln':    [[], 38056]
  'cls':    [[], 38088]
  'clt':    [[], 38120]
  'clv':    [[], 38072]
  'clz':    [[], 38040]
  'rjmp':   [['target'],
          (state, args) ->
            (0b11 << 14) | (0x0FFF & state.labels[args[0]])]

type_test =
  'target': (x) -> x.match /^[a-z_]+$/i

typeTest = (state, data, types) ->
  if types.length != data.length
    throw "Arguments do not match (#{data.join(' ')})"
  for d in [0 ... data.length]
    unless type_test[types[d]] data[d]
      throw "Arguments not the correct type (#{data.join(' ')})"

convert = (cmds) ->
  rez   = []
  data  =
    labels: {}
  for cmd in cmds
    if mtc = cmd.match /(\w+):$/
      data.labels[mtc[1]] = rez.length * 2
      continue
    tous = cmd.split /\s+/
    c1   = opcode_tree[tous[0]]
    unless c1
      throw "Unknown command '#{cmd}'"
    try
      typeTest data, (tous[1 ..]), c1[0]
    catch e
      throw "Wrong arguments for #{tous[0]}: #{e}"
    ans =
      if typeof(c1[1]) == typeof(convert)
        c1[1] data, tous[1 ..]
      else
        c1[1]
    ans = [ans] if typeof(ans) != typeof([])
    rez = rez.concat ans
  rez

assemble = (txt) ->
  cmds  = txt.split "\n"
  ans   = []
  for lgn in cmds
    notrail = lgn.trim()
    continue if notrail == ''
    ans.push notrail
  convert ans

exports.opcode_tree = opcode_tree
exports.convert     = convert
exports.assemble    = assemble

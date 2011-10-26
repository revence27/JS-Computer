as    = require '../assassin'
util  = require 'util'

# util.inspect as.convert ['nop', 'sleep']
ans = '''
beginning:
  nop
  sleep
  rjmp beginning
  later_on:
  sleep
  rjmp beginning
  nop
  rjmp later_on
  nop
  sleep
  rjmp beginning
'''

console.log util.inspect as.assemble ans

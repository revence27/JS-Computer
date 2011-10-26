.org 0000
rjmp beginning
.data
.byte 0x1B
.byte 33
.text
reti
beginning:
  nop
insanity:
  nop
  nop
  nop
  sleep
  clh
  clc
  cli
  cln
  clr r18
  cls
  clt
  rjmp insanity
  clv
  clz
  com r1

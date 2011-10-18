.data
.byte 0x1B
.byte 33
.text
reti
beginning:
  nop
insanity:
  nop
  rjmp insanity
  nop
  rjmp beginning
  nop
  sleep

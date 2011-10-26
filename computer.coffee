as      = require './assassin'
pretty  = require './prettyavr'

# Now, how to proceed?
#
# 1.  BIOS is programmed into the microprocessor.
# 2.  BIOS is also bootloader.
# 3.  In bootloader: run kernel (off disk; first chunk).
# 4.  In kernel: drivers for devices (keys, IR, SMS, screen, disk, battery)
# 5.  In kernel: load shell
# 6.  In shell: respond to commands via devices, execute programs.
#
# But for now, I'll just say I love you.

kernel = '''
beginning:
  sleep
  rjmp beginning
'''

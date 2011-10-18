all:
	@avr-as -o tester tester.asm

test: all
	@coffee elf_test.coffee tester

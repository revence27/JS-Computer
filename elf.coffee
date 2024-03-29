bufTo16 = (buf) ->
  rez = buf[1]
  rez = rez << 8
  rez |= buf[0]
  rez

bufTo32 = (buf) ->
  rez = buf[3]
  rez = rez << 8
  rez |= buf[2]
  rez = rez << 8
  rez |= buf[1]
  rez = rez << 8
  rez |= buf[0]
  rez

getAsciiz = (buf, pos) ->
  ans = ''
  for c in [pos .. buf.length]
    break if buf[c] == 0
    ans = ans + String.fromCharCode(buf[c])
  ans

tokeniseOpcodes = (elf, sections = ['.text', '.rela.text']) ->
  for sec in sections
    tsec = elf[sec].section
    elf[sec].section = for bt in [0 ... tsec.length] by 2
      bufTo16 new Buffer [tsec[bt], tsec[bt + 1] or 0]
  elf

fillInIdent = (elf) ->
  idobj =
    bit_width: (['32', '64'][elf.ident[4] - 1]) + '-bit'
    endianness: (['Little', 'Big'][elf.ident[5] - 1]) + '-endian'
    elf_version: (['Standard', 'Big'][elf.ident[6] - 1]) + ' ELF format'
  elf.ident = idobj
  elf

nameSections = (elf) ->
  sec = elf.section_headers[elf.section_strings_index].section
  elf.section_headers = for s in elf.section_headers
    s.name = getAsciiz sec, s.name
    elf[s.name] = s
    s.name
  elf

fillInSections = (elf, data) ->
  start = elf.section_header_offset
  secs  = for sec in [0 ... elf.section_header_count]
    pnt = start + (sec * elf.section_header_size)
    ans = data.slice(pnt, pnt + elf.section_header_size)
    rez =
      name: bufTo16 ans.slice(0, 4)
      type: ['?'
        'data'
        'symbol table'
        'string table'
        'explicit relocation'
        'hash table'
        'dynamic linking'
        'notes'
        'empty'
        'implicit relocation'
        'reserved'
        'dynamic linking symbols'
        'reserved (processor)'
        'reserved (processor)'
        'index minimum'
        'index maximum'][bufTo16 ans.slice(4, 8)]
      flags: bufTo16 ans.slice(8, 12)
      address: bufTo16 ans.slice(12, 16)
      offset: bufTo16 ans.slice(16, 20)
      size: bufTo16 ans.slice(20, 24)
      link: bufTo16 ans.slice(24, 28)
      info: bufTo16 ans.slice(28, 32)
      address_align: bufTo16 ans.slice(32, 36)
      entry_size: bufTo16 ans.slice(36, 40)
    rez.section = data.slice(rez.offset, rez.offset + rez.size)
    rez
  elf.section_headers = secs
  elf

readElf = (data) ->
  ans =
    ident: data.slice(0, 16)
    type: bufTo16 data.slice(16, 18)
    machine: bufTo16 data.slice(18, 20)
    version: bufTo32 data.slice(20, 24)
    entry: bufTo32 data.slice(24, 28)
    program_header_offset: bufTo32 data.slice(28, 32)
    section_header_offset: bufTo32 data.slice(32, 36)
    flags: bufTo32 data.slice(36, 40)
    elf_header_size: bufTo16 data.slice(40, 42)
    program_header_size: bufTo16 data.slice(42, 44)
    program_header_count: bufTo16 data.slice(44, 46)
    section_header_size: bufTo16 data.slice(46, 48)
    section_header_count: bufTo16 data.slice(48, 50)
    section_strings_index: bufTo16 data.slice(50, 52)
  # fillInSections (fillInIdent ans), data
  tokeniseOpcodes (nameSections (fillInSections (fillInIdent ans), data))

exports.readElf = readElf

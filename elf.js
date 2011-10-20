(function() {
  var bufTo16, bufTo32, fillInIdent, fillInSections, getAsciiz, nameSections, readElf, tokeniseOpcodes;

  bufTo16 = function(buf) {
    var rez;
    rez = buf[1];
    rez = rez << 8;
    rez |= buf[0];
    return rez;
  };

  bufTo32 = function(buf) {
    var rez;
    rez = buf[3];
    rez = rez << 8;
    rez |= buf[2];
    rez = rez << 8;
    rez |= buf[1];
    rez = rez << 8;
    rez |= buf[0];
    return rez;
  };

  getAsciiz = function(buf, pos) {
    var ans, c, _ref;
    ans = '';
    for (c = pos, _ref = buf.length; pos <= _ref ? c <= _ref : c >= _ref; pos <= _ref ? c++ : c--) {
      if (buf[c] === 0) break;
      ans = ans + String.fromCharCode(buf[c]);
    }
    return ans;
  };

  tokeniseOpcodes = function(elf) {
    var bt, tsec;
    tsec = elf['.text'].section;
    elf['.text'].section = (function() {
      var _ref, _results;
      _results = [];
      for (bt = 0, _ref = tsec.length; bt < _ref; bt += 2) {
        _results.push(bufTo16(new Buffer([tsec[bt], tsec[bt + 1] || 0])));
      }
      return _results;
    })();
    return elf;
  };

  fillInIdent = function(elf) {
    var idobj;
    idobj = {
      bit_width: ['32', '64'][elf.ident[4] - 1] + '-bit',
      endianness: ['Little', 'Big'][elf.ident[5] - 1] + '-endian',
      elf_version: ['Standard', 'Big'][elf.ident[6] - 1] + ' ELF format'
    };
    elf.ident = idobj;
    return elf;
  };

  nameSections = function(elf) {
    var s, sec;
    sec = elf.section_headers[elf.section_strings_index].section;
    elf.section_headers = (function() {
      var _i, _len, _ref, _results;
      _ref = elf.section_headers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.name = getAsciiz(sec, s.name);
        elf[s.name] = s;
        _results.push(s.name);
      }
      return _results;
    })();
    return elf;
  };

  fillInSections = function(elf, data) {
    var ans, pnt, rez, sec, secs, start;
    start = elf.section_header_offset;
    secs = (function() {
      var _ref, _results;
      _results = [];
      for (sec = 0, _ref = elf.section_header_count; 0 <= _ref ? sec < _ref : sec > _ref; 0 <= _ref ? sec++ : sec--) {
        pnt = start + (sec * elf.section_header_size);
        ans = data.slice(pnt, pnt + elf.section_header_size);
        rez = {
          name: bufTo16(ans.slice(0, 4)),
          type: ['?', 'data', 'symbol table', 'string table', 'explicit relocation', 'hash table', 'dynamic linking', 'notes', 'empty', 'implicit relocation', 'reserved', 'dynamic linking symbols', 'reserved (processor)', 'reserved (processor)', 'index minimum', 'index maximum'][bufTo16(ans.slice(4, 8))],
          flags: bufTo16(ans.slice(8, 12)),
          address: bufTo16(ans.slice(12, 16)),
          offset: bufTo16(ans.slice(16, 20)),
          size: bufTo16(ans.slice(20, 24)),
          link: bufTo16(ans.slice(24, 28)),
          info: bufTo16(ans.slice(28, 32)),
          address_align: bufTo16(ans.slice(32, 36)),
          entry_size: bufTo16(ans.slice(36, 40))
        };
        rez.section = data.slice(rez.offset, rez.offset + rez.size);
        _results.push(rez);
      }
      return _results;
    })();
    elf.section_headers = secs;
    return elf;
  };

  readElf = function(data) {
    var ans;
    ans = {
      ident: data.slice(0, 16),
      type: bufTo16(data.slice(16, 18)),
      machine: bufTo16(data.slice(18, 20)),
      version: bufTo32(data.slice(20, 24)),
      entry: bufTo32(data.slice(24, 28)),
      program_header_offset: bufTo32(data.slice(28, 32)),
      section_header_offset: bufTo32(data.slice(32, 36)),
      flags: bufTo32(data.slice(36, 40)),
      elf_header_size: bufTo16(data.slice(40, 42)),
      program_header_size: bufTo16(data.slice(42, 44)),
      program_header_count: bufTo16(data.slice(44, 46)),
      section_header_size: bufTo16(data.slice(46, 48)),
      section_header_count: bufTo16(data.slice(48, 50)),
      section_strings_index: bufTo16(data.slice(50, 52))
    };
    return tokeniseOpcodes(nameSections(fillInSections(fillInIdent(ans), data)));
  };

  exports.readElf = readElf;

}).call(this);

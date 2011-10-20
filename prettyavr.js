(function() {
  var clean_answer, name_opcode, name_opcodes, opcode_tree;

  opcode_tree = {
    16: {
      0: 'nop',
      38280: 'sleep',
      38168: 'reti',
      38024: 'clc',
      38104: 'clh',
      38136: 'cli',
      38056: 'cln',
      38088: 'cls',
      38120: 'clt',
      38072: 'clv',
      38040: 'clz'
    },
    7: {
      74: function(opc) {
        return "com " + (opc & 0x01f0);
      }
    },
    6: {
      9: function(opc) {
        return "clr " + (opc & 0x03ff);
      }
    },
    4: {
      12: function(opc) {
        return "rjmp " + (opc & 0x0fff);
      }
    }
  };

  clean_answer = function(ans, opc) {
    if (typeof ans === typeof clean_answer) {
      return clean_answer(ans(opc), opc);
    } else if (typeof ans === typeof []) {
      return clean_answer(ans[0](opc));
    } else {
      return ans;
    }
  };

  name_opcode = function(opc, max, table) {
    var ans, uc, w, wds, width, _i, _len;
    ans = null;
    if (max == null) max = 16;
    if (table == null) table = opcode_tree;
    wds = ((function() {
      var _results;
      _results = [];
      for (w in table) {
        _results.push(w);
      }
      return _results;
    })()).sort();
    for (_i = 0, _len = wds.length; _i < _len; _i++) {
      width = wds[_i];
      uc = opc >> (max - width);
      ans = table[width][uc];
      if (ans) return clean_answer(ans, opc);
    }
    return "UNKNOWN(" + opc + ")";
  };

  name_opcodes = function(opcs, max, table) {
    var opc, _i, _len, _results;
    if (max == null) max = 16;
    _results = [];
    for (_i = 0, _len = opcs.length; _i < _len; _i++) {
      opc = opcs[_i];
      _results.push(name_opcode(opc, max, table));
    }
    return _results;
  };

  exports.opcode_tree = opcode_tree;

  exports.name_opcode = name_opcode;

  exports.name_opcodes = name_opcodes;

}).call(this);

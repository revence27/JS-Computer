(function() {
  var clean_answer, name_opcode, name_opcodes, opcode_tree;
  opcode_tree = {
    16: {
      0: 'nop',
      157: 'sleep'
    },
    4: {
      3: 'rjmp'
    }
  };
  clean_answer = function(ans, opc) {
    if (typeof ans === typeof clean_answer) {
      return clean_answer(ans(opc));
    } else if (typeof ans === typeof []) {
      return clean_answer(ans[0](opc));
    } else {
      return ans;
    }
  };
  name_opcode = function(opc, max, table) {
    var ans, df, mask, width;
    ans = null;
    mask = 0xffff;
    if (max == null) {
      max = 16;
    }
    if (table == null) {
      table = opcode_tree;
    }
    for (width in table) {
      df = max - width;
      ans = table[width][opc & (mask >> df)];
      if (ans) {
        if (typeof ans === typeof table) {
          ans = name_opcode(opc & (mask >> df), df, ans);
        } else {
          ans = clean_answer(ans, opc);
        }
      }
    }
    return ans;
  };
  name_opcodes = function(opcs, max, table) {
    var opc, _i, _len, _results;
    if (max == null) {
      max = 16;
    }
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

(function() {
  var assemble, convert, opcode_tree, typeTest, type_test, util;

  util = require('util');

  opcode_tree = {
    'nop': [[], 0],
    'sleep': [[], 38280],
    'reti': [[], 38168],
    'clc': [[], 38024],
    'clh': [[], 38104],
    'cli': [[], 38136],
    'cln': [[], 38056],
    'cls': [[], 38088],
    'clt': [[], 38120],
    'clv': [[], 38072],
    'clz': [[], 38040],
    'rjmp': [
      ['target'], function(state, args) {
        return (3 << 14) | (0x0FFF & state.labels[args[0]]);
      }
    ]
  };

  type_test = {
    'target': function(x) {
      return x.match(/^[a-z_]+$/i);
    }
  };

  typeTest = function(state, data, types) {
    var d, _ref, _results;
    if (types.length !== data.length) {
      throw "Arguments do not match (" + (data.join(' ')) + ")";
    }
    _results = [];
    for (d = 0, _ref = data.length; 0 <= _ref ? d < _ref : d > _ref; 0 <= _ref ? d++ : d--) {
      if (!type_test[types[d]](data[d])) {
        throw "Arguments not the correct type (" + (data.join(' ')) + ")";
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  convert = function(cmds) {
    var ans, c1, cmd, data, mtc, rez, tous, _i, _len;
    rez = [];
    data = {
      labels: {}
    };
    for (_i = 0, _len = cmds.length; _i < _len; _i++) {
      cmd = cmds[_i];
      if (mtc = cmd.match(/(\w+):$/)) {
        data.labels[mtc[1]] = rez.length * 2;
        continue;
      }
      tous = cmd.split(/\s+/);
      c1 = opcode_tree[tous[0]];
      if (!c1) throw "Unknown command '" + cmd + "'";
      try {
        typeTest(data, tous.slice(1), c1[0]);
      } catch (e) {
        throw "Wrong arguments for " + tous[0] + ": " + e;
      }
      ans = typeof c1[1] === typeof convert ? c1[1](data, tous.slice(1)) : c1[1];
      if (typeof ans !== typeof []) ans = [ans];
      rez = rez.concat(ans);
    }
    return rez;
  };

  assemble = function(txt) {
    var ans, cmds, lgn, notrail, _i, _len;
    cmds = txt.split("\n");
    ans = [];
    for (_i = 0, _len = cmds.length; _i < _len; _i++) {
      lgn = cmds[_i];
      notrail = lgn.trim();
      if (notrail === '') continue;
      ans.push(notrail);
    }
    return convert(ans);
  };

  exports.opcode_tree = opcode_tree;

  exports.convert = convert;

  exports.assemble = assemble;

}).call(this);

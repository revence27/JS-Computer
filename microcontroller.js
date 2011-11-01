(function() {
  var as, compile, pretty;

  as = require('./assassin');

  pretty = require('./prettyavr');

  compile = function(code) {
    var opc, pc, ram;
    ram = new Buffer(256);
    code = as.assemble(code);
    pc = 0;
    opc = null;
    while ((opc = code[pc]) !== void 0) {
      if (opc === 0) {
        pc = pc + 1;
      } else if (12 === (opc >> 12)) {
        pc = 0x0FFF & opc;
      } else {
        console.error("Opcode unknown " + opc);
        break;
      }
    }
    return ram;
  };

  exports.compile = compile;

}).call(this);

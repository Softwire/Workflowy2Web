define([], function () {
  var Spy = function () {
    return {
      count: 0,
      args: [],
      lastArg: function () {
        if (this.args.length === 0) {
          return null;
        } else {
          return this.args[this.args.length - 1];
        }
      }
    };
  };
  var spies = {
    file: new Spy(),
    generate: new Spy(),
    reset: function () {
      this.file = new Spy();
      this.generate = new Spy();
    }
  };
  return function () {
    this.file = function (arg1, arg2) {
      spies.file.count++;
      spies.file.args.push([arg1, arg2]);
    };
    this.generate = function (arg) {
      spies.generate.count++;
      spies.generate.args.push(arg);
      return 'generatedZip';
    };
    this.spies = spies;
  };
});
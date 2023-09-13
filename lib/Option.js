import minimist from "minimist";

export default class Option {
  constructor(argv = null) {
    this.argv = argv;
  }

  parseOptions() {
    return minimist(this.argv.slice(2), {
      boolean: ["d"]
    });
  }
}

import fs from "fs/promises";
import readline from "readline";
import enquirer from "enquirer";
const { Select } = enquirer;

class ModuleImportWriter {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async run() {
    try {
      await this.#selectImportedNpm();
    } catch (err) {
      console.error(err.message);
    } finally {
      this.rl.close();
    }
  }

  async #getInstalledNpmNameList() {
    try {
      const packageData = await fs.readFile("./package.json", "utf8");
      const packageJSON = JSON.parse(packageData);

      const dependenciesKeys = Object.keys(packageJSON.dependencies || {});
      const devDependenciesKeys = Object.keys(packageJSON.devDependencies || {});

      return [...dependenciesKeys, ...devDependenciesKeys];
    } catch (err) {
      console.error(err.message);
    }
  }

  async #selectImportedNpm() {
    try {
      const installedNpmNames = await this.#getInstalledNpmNameList();
      const prompt = new Select({
        message: 'Which modules would you like to import?',
        choices: installedNpmNames,
        multiple: true,
      });

      const selectedModules = await prompt.run();
      return selectedModules;
    } catch (err) {
      console.error(err.message);
    }
  }
}

new ModuleImportWriter().run();

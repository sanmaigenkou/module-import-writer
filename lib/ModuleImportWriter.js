import fs from "fs/promises";
import readline from "readline";
import NpmSelector from "./NpmSelector.js";
import PackageJsonFileManager from "./PackageJsonFileManager.js";

export default class ModuleImportWriter {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.npmSelector = new NpmSelector();
  }

  async run() {
    try {
      await this.#insertImportDeclaration(process.argv[2]);
    } catch (err) {
      console.error(err.message);
    } finally {
      this.rl.close();
    }
  }

  async readPackageJson() {
    try {
      const packageData = await fs.readFile("./package.json");
      return JSON.parse(packageData);
    } catch (err) {
      console.error(err.message);
    }
  }

  async #isModuleType() {
    try {
      const packageJSON = await this.readPackageJson();
      return packageJSON.type === "module";
    } catch (err) {
      console.error(err.message);
    }
  }

  async #getInstalledNpmNameList() {
    try {
      const packageJSON = await this.readPackageJson();

      const dependenciesKeys = Object.keys(packageJSON.dependencies || {});
      const devDependenciesKeys = Object.keys(
        packageJSON.devDependencies || {},
      );

      return [...dependenciesKeys, ...devDependenciesKeys];
    } catch (err) {
      console.error(err.message);
    }
  }

  async #insertImportDeclaration(filePath) {
    try {
      const preinsertedFile = await fs.readFile(filePath);
      const importNpmNames = await this.npmSelector.npmSelect(this.#getInstalledNpmNameList());
      if (importNpmNames.length === 0) {
        console.log("No npm packages available.");
        return;
      }
      const prompt = this.#isModuleType()
        ? (npmName) => `import ${npmName} from "${npmName}";`
        : (npmName) => `const ${npmName} = require("${npmName}");`;
      const insertedContent = importNpmNames.map(prompt).join("\n");
      const postinsertedFile = insertedContent + `\n\n` + preinsertedFile;
      await fs.writeFile(filePath, postinsertedFile);
      console.log("Completed.");
    } catch (err) {
      console.error(err.message);
    }
  }
}

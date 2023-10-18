import fs from "fs/promises";
import NpmSelector from "./NpmSelector.js";
import packageJsonFileManager from "./PackageJsonFileManager.js";

export default class ModuleImportWriter {
  constructor() {
    this.npmSelector = new NpmSelector();
    this.packageJsonFileManager = new packageJsonFileManager();
  }

  async writeImportDeclaration(filePath) {
    try {
      const npmNameList =
        await this.packageJsonFileManager.getInstalledNpmNameList();
      const commandLineMessage =
        "Press the space key to select the modules you want to import.";
      const importNpmNames = await this.npmSelector.npmSelect(
        npmNameList,
        commandLineMessage
      );
      if (importNpmNames.length === 0) {
        console.log("No npm packages available.");
        return;
      }
      const prompt = (await this.packageJsonFileManager.isModuleType())
        ? (npmName) => this.promptEsModule(npmName)
        : (npmName) => this.promptCommonJs(npmName);
      const WritedContent = importNpmNames.map(prompt).join("\n");
      const preWritedFile = await fs.readFile(filePath, "utf8");
      const postWritedFile = WritedContent + `\n\n` + preWritedFile;
      await fs.writeFile(filePath, postWritedFile);
      console.log("Write Complete.");
    } catch (err) {
      console.error(err.message);
    }
  }

  async removeImportDeclaration(filePath) {
    try {
      const removedFile = await fs.readFile(filePath, "utf8");
      const removedFileLines = removedFile.split("\n");
      const pattern = (await this.packageJsonFileManager.isModuleType())
        ? /^import .* from .*;$/
        : /^const .* = require\(".*"\);$/;
      const ImportModuleList = removedFileLines.filter((line) =>
        pattern.test(line)
      );
      const commandLineMessage =
        "Press the space key to select the import statements you want to delete.";
      const removeNpmNames = await this.npmSelector.npmSelect(
        ImportModuleList,
        commandLineMessage
      );
      if (removeNpmNames.length === 0) {
        console.log("No npm packages available.");
        return;
      }
      const postRemovedContent = removedFileLines.filter(
        (prompt) => !removeNpmNames.includes(prompt)
      );
      await fs.writeFile(filePath, postRemovedContent.join("\n"));
      console.log("Delete Complete.");
    } catch (err) {
      console.error(err.message);
    }
  }

  promptEsModule(npmName) {
    return `import ${this.convertCamelCase(npmName)} from "${npmName}";`;
  }

  promptCommonJs(npmName) {
    return `const ${this.convertCamelCase(npmName)} = require("${npmName}");`;
  }

  convertCamelCase(npmName) {
    const pattern = /-(\w)/g;
    const convertUpperCase = npmName.replace(pattern, (character) => {
      return character.toUpperCase();
    });
    return convertUpperCase.replace(/-/g, "");
  }
}

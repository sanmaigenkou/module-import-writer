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
      const preWritedFile = await fs.readFile(filePath, "utf8");
      const npmNameList =
        await this.packageJsonFileManager.getInstalledNpmNameList();
      const importNpmNames = await this.npmSelector.npmSelect(npmNameList);
      if (importNpmNames.length === 0) {
        console.log("No npm packages available.");
        return;
      }
      const prompt = this.packageJsonFileManager.isModuleType()
        ? (npmName) => `import ${npmName} from "${npmName}";`
        : (npmName) => `const ${npmName} = require("${npmName}");`;
      const WritedContent = importNpmNames.map(prompt).join("\n");
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
      const npmNameList =
        await this.packageJsonFileManager.getInstalledNpmNameList();
      const removeNpmNames = await this.npmSelector.npmSelect(npmNameList);
      if (removeNpmNames.length === 0) {
        console.log("No npm packages available.");
        return;
      }
      const prompt = this.packageJsonFileManager.isModuleType()
        ? (npmName) => `import ${npmName} from "${npmName}";`
        : (npmName) => `const ${npmName} = require("${npmName}");`;
      const removedPrompt = removeNpmNames.map(prompt);
      const postRemovedContent = removedFileLines.filter(
        (prompt) => !removedPrompt.includes(prompt)
      );
      await fs.writeFile(filePath, postRemovedContent.join("\n"));
      console.log("Delete Complete.");
    } catch (err) {
      console.error(err.message);
    }
  }
}

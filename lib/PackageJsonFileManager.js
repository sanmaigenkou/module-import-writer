import fs from "fs/promises";

export default class PackageJsonFileManager {
  constructor() {
    this.packageJsonPath = "./package.json";
    this.packageJsonData = this.#readPackageJson();
  }

  async #readPackageJson() {
    try {
      const packageData = await fs.readFile(this.packageJsonPath);
      return JSON.parse(packageData);
    } catch (err) {
      console.error(err.message);
    }
  }

  async isModuleType() {
    try {
      return this.packageJsonData.type === "module";
    } catch (err) {
      console.error(err.message);
    }
  }

  async getInstalledNpmNameList() {
    try {
      const dependenciesKeys = Object.keys(this.packageJsonData.dependencies || {});
      const devDependenciesKeys = Object.keys(
        this.packageJsonData.devDependencies || {},
      );
      return [...dependenciesKeys, ...devDependenciesKeys];
    } catch (err) {
      console.error(err.message);
    }
  }
}

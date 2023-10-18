import fs from "fs/promises";

export default class PackageJsonFileManager {
  constructor() {
    this.packageJsonPath = "./package.json";
  }

  async readPackageJson() {
    try {
      const packageData = await fs.readFile(this.packageJsonPath, "utf8");
      return JSON.parse(packageData);
    } catch (err) {
      console.error(err.message);
    }
  }

  async isModuleType() {
    try {
      const packageJsonData = await this.readPackageJson();
      return (await packageJsonData.type) === "module";
    } catch (err) {
      console.error(err.message);
    }
  }

  async getInstalledNpmNameList() {
    try {
      const packageJsonData = await this.readPackageJson();
      return Object.keys(packageJsonData.dependencies || []);
    } catch (err) {
      console.error(err.message);
    }
  }
}

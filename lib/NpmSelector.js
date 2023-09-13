import enquirer from "enquirer";
const { Select } = enquirer;

export default class NpmSelector {
  constructor() {

  }
async npmSelect(npmList) {
    try {
      const prompt = new Select({
        message:
          "Press the space key to select the modules you want to import.",
        choices: npmList,
        multiple: true,
      });

      return await prompt.run();
    } catch (err) {
      console.error(err.message);
    }
  }
}

import enquirer from "enquirer";
const { Select } = enquirer;

export default class NpmSelector {
  async npmSelect(npmList, commandLineMessage) {
    try {
      const prompt = new Select({
        message: commandLineMessage,
        choices: npmList,
        multiple: true,
      });

      return await prompt.run();
    } catch (err) {
      console.error(err.message);
    }
  }
}

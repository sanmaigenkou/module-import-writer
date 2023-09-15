#!/usr/bin/env node

import ModuleImportWriter from "./lib/ModuleImportWriter.js";
import { Command } from 'commander';
const program = new Command();
import readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

program
  .option('-d')
  .arguments('<filePath>')
  .action(async (filePath) => {
    try {
      const option = program.opts();
      const moduleImportWriter = new ModuleImportWriter();
      if (option.d) {
        await moduleImportWriter.removeImportDeclaration(filePath);
      } else {
        await moduleImportWriter.writeImportDeclaration(filePath);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      rl.close();
    }
  });

program.parse(process.argv);

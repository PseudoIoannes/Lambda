const { program } = require("commander");
const { sendMsg, sendPhoto } = require("./bot.js");

async function main() {
  program
    .command("message <text>")
    .description("Send a message to telegram")
    .action(sendMsg)
    .addHelpText(
      "after",
      `example:
      node app.js message ‘Your message’`
    );

  program
    .command("photo <path>")
    .description("Send a photo to telegram (only local files)")
    .action(sendPhoto)
    .addHelpText(
      "after",
      `example:
      node app.js photo /path/to/photo/picture.png`
    );

  await program.parseAsync();
  process.exit();
}
main();

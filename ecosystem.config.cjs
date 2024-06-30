const fs = require("fs");
const path = require("path");

if (!fs.existsSync(path.resolve("./.env"))) {
  console.error("No .env file found.");
  process.exit(1);
}
const env = fs.readFileSync(path.resolve("./.env"), "utf8");

const envJson = {};
env.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  envJson[key] = value.replace(/(\r\n|\n|\r)/gm, "");
});

module.exports = {
  apps: [
    {
      script: "./build/index.js",
      env: envJson,
    },
  ],
};

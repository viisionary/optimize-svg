const delay = (ms, params = {}) =>
  new Promise((res) => {
    setTimeout(() => {
      res(params);
    }, ms);
  });


const hasChinese = (text) => {
  const chineseReg = /[\u4e00-\u9fa5]/g;

  return chineseReg.test(text);
};
const { readdir, rename, appendFile } = require("fs/promises");
const { translate } = require("./translateByNet");

const toTitleCase = (str =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.charAt(0).toUpperCase() + x.slice(1))
    .join("")
    .replace(/^[0-9]/g, ""));

const prettierFile = (file) => {
  const { exec } = require("child_process");
  exec(`npx prettier --write ${file}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};
// DESC 重命名文件
const OptimizeFileName = async (dir) => {
  const IconObjJson = [];
  try {
    const files = await readdir(dir, { withFileTypes: true });
    for (const file of files) {

      if (hasChinese(file)) {
        const filename = file.split(".svg")[0];
        const consequence = await translate(filename);
        const newIconName = `${toTitleCase(consequence)}`;
        const newIconPath = `${newIconName}.svg`;
        rename(`${dir}/${file}`, `${dir}/${newIconPath}`);
        const code = `
         import ${newIconName}Icon from './${newIconPath}';
        `;
        await appendFile(`${dir}/index.js`, code);

        await delay("1000");
        IconObjJson.push(`${newIconName}Icon`);
      } else {
        const filename = file.split(".svg")[0];
        const newIconName = toTitleCase(filename);
        const newIconPath = `${newIconName}.svg`;
        const code = `
        import ${newIconName}Icon from './${newIconPath}';
        `;
        await appendFile(`${dir}/index.js`, code);
        IconObjJson.push(`${newIconName}Icon`);
      }
    }
    // DESC 自动生成引入文件
    const exportCode = `
        export {
          ${IconObjJson.join(",\n")}
        }`;

    appendFile(`${dir}/index.js`, exportCode);

    prettierFile(`${dir}/index.js`);

  } catch (e) {
  }
};

module.exports = {
  OptimizeFileName,
  hasChinese,
  toTitleCase,
  delay,
  prettierFile
};
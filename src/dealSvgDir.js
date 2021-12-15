const {hasChinese, delay} = require("./optimizeSvg");
const {trans2EnglishName} = require("./trans2EnglishName");
const {readdir, rename, appendFile, stat, rm} = require("fs/promises");

const dealSvgDir = async (dir) => {
    try {
        const files = await readdir(dir, {withFileTypes: true});
        const IconObjJson = [];
        for (const file of files) {
            const isDir = file.isDirectory();
            if (isDir) {
                if (hasChinese(file.name)) {
                    const formatDirName = await trans2EnglishName(file.name);
                    await delay(1000);
                    await rename(`${dir}/${file.name}`, `${dir}/${formatDirName}`);
                    await dealSvgDir(`${dir}/${formatDirName}`);
                } else {
                    await dealSvgDir(`${dir}/${file.name}`);
                }
            }

            if (!file.name.includes(".svg")) {
                continue;
            }
            const filename = file.name.split(".svg")[0];
            const formatName = await trans2EnglishName(filename);
            await delay(1000);
            const newIconPath = `${formatName}.svg`;
            rename(`${dir}/${file.name}`, `${dir}/${newIconPath}`);
            const code = `
         import ${formatName}Icon from './${newIconPath}';
        `;
            const fileCheck = await stat(`${dir}/index.js`).catch(e => false).then(r => true);
            if (fileCheck) {
                await rm(`${dir}/index.js`)
            }
            console.dir(`${dir}/index.js`,)
            await appendFile(`${dir}/index.js`, code);
            await delay(1000);
            IconObjJson.push(`${formatName}Icon`);
        }
        const exportCode = `
        export {
          ${IconObjJson.join(",\n")}
        }`;

        await appendFile(`${dir}/index.js`, exportCode);
    } catch (e) {
        throw e
    }
};

module.exports = {
    dealSvgDir
}
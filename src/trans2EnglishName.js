const {hasChinese, toTitleCase} = require("./optimizeSvg");
const {translate} = require("./translateByNet");
/**
 * 中文翻译+变驼峰、英文变驼峰
 * @param filename
 * @returns {Promise<*>}
 */
const trans2EnglishName = async (filename) => {
    let newEnglishName = "";
    if (hasChinese(filename)) {
        const consequence = await translate(filename);
        newEnglishName = `${toTitleCase(consequence)}`;
    } else {
        newEnglishName = toTitleCase(filename);
    }
    return newEnglishName;
};

module.exports = {
    trans2EnglishName
}
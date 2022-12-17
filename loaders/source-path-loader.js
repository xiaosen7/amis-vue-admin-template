const normalizePath = require('normalize-path');

/**
 * 通过 import schemaPath from "./schema.json?sourcePath" 能够获得schema.json的基于项目根目录的相对路径
 * @type {import("webpack").LoaderDefinition}
 * @returns
 */
const loader = function () {
  const absPath = this.resource.split('?')[0];
  const relativePath = require('path').relative(process.cwd(), absPath);
  return `module.exports = '${normalizePath(relativePath)}'`;
};

module.exports = loader;

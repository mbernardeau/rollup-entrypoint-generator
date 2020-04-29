const path = require('path')
const fsSync = require('fs')
const findInFiles = require('find-in-files')
const flatMap = require('lodash.flatMap')

/**
 * Find correct entry point based on access path
 *
 * - If path points to a folder, resolve to the `index.js` file contained in this folder
 * - If path exists and points to a file, return this path
 * - If path doesn't exist, try to add extentions `.js` or `.jsx`
 *
 * @param {String} relPath Relative path pointing to a JS *module*
 * @return {String} Relative path pointing to the corresponding file
 */
const findCorrectPath = relPath => {
  if (fsSync.existsSync(relPath)) {
    if (fsSync.lstatSync(relPath).isDirectory()) {
      return `${relPath}/index.js`
    }
    return relPath
  }
  if (fsSync.existsSync(`${relPath}.jsx`)) {
    return `${relPath}.jsx`
  }
  if (fsSync.existsSync(`${relPath}.js`)) {
    return `${relPath}.js`
  }
  console.error(relPath, ' does not exist')
}

/**
 * Gather results for an export line (`export { default as ... } from ...`)
 *
 * @param {String} indexPath Access path to the `index.js` file containing the export line
 * @param {String} line Content of the export line
 * @return {Object}
 * @property {String} componentName Name of the exported component
 * @property {String} componentPath Relative path of the found entry point
 */
const formatResultForMatch = indexPath => line => {
  const match = line.match(/^export \{ default as ([a-zA-Z]+) } from '(.\/[a-zA-Z-\\./]+)'$/)

  if (match === null) {
    // If line starts with '//', it's a commented export, ignoring...
    if (!line.startsWith('//')) {
      console.warn('Could not find default only export for "', line, '" in ', indexPath)
    }

    return null
  }

  const [, componentName, componentPath] = match

  const relativePath = findCorrectPath(path.join(indexPath, '..', componentPath))

  return { componentName, componentPath: relativePath }
}

/**
 * Gather all results of a file in an array
 *
 * @param {Array<String, Object>} entry
 * @return {Array}
 */
const formatResultsForFile = ([indexPath, { line }]) => {
  return line.map(formatResultForMatch(indexPath)).filter(e => !!e)
}

const generateEntryPoints = async sourcePath => {
  try {
    const files = await findInFiles.find('export { default as ', sourcePath, 'index.js$')

    const formattedResults = flatMap(Object.entries(files), formatResultsForFile)

    return formattedResults.reduce(
      (prev, { componentName, componentPath }) => ({
        ...prev,
        [componentName]: `./${componentPath.replace(/\\/g, '/')}`,
      }),
      {},
    )
  } catch (e) {
    console.error(e)
  }
}

module.exports = { generateEntryPoints }

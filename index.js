const path = require('path')
const fs = require('fs')
const flatMap = require('lodash.flatmap')
const acorn = require('acorn-loose')
const find = require('find')
const flatten = require('lodash.flatten')

/**
 * @typedef {Object} Options
 * @property {String[]} extensions Array of extensions to try to resolve automatically
 */

/**
 * Find correct entry point based on access path
 *
 * - If path points to a folder, resolve to the `index.js` file contained in this folder
 * - If path exists and points to a file, return this path
 * - If path doesn't exist, try to add extensions `.js` or `.jsx`
 *
 * @param {String} relPath Relative path pointing to a JS *module*
 * @param {Options} opts Options
 * @return {String} Relative path pointing to the corresponding file
 */
const findCorrectPath = (relPath, opts) => {
  if (fs.existsSync(relPath)) {
    if (fs.lstatSync(relPath).isDirectory()) {
      return `${relPath}/index.js`
    }
    return relPath
  }

  const fileByExtension = opts.extensions
    .map(ext => `${relPath}.${ext}`)
    .find(filePath => fs.existsSync(filePath))

  if (fileByExtension) {
    return fileByExtension
  }

  console.warn(`
    Can't find any file at ${relPath} within the extensions ${opts.extensions}. 
    If this file exists and can be defined as an entrypoint, add its extension in the option extensions.
  `)
}

/**
 * Find matching `export { default as` declarations for the given file content.
 *
 * @param {String} filePath Path of the file
 * @param {String} fileContent Content of the file (should be JS code)
 * @param {Options} opts Options
 * @return {Object}
 * @property {String} componentName Name of the exported component
 * @property {String} componentPath Relative path of the found entry point
 */
const findExportDeclarationsForContent = (filePath, fileContent, opts) => {
  const parsed = acorn.parse(fileContent, {
    sourceType: 'module',
  })

  return flatMap(
    parsed.body.filter(expr => expr.type === 'ExportNamedDeclaration'),
    exportDeclaration => {
      const exportedNames = exportDeclaration.specifiers
        .filter(specifier => specifier.type === 'ExportSpecifier')
        .filter(specifier => specifier.local.name === 'default')
        .map(specifier => specifier.exported.name)

      const componentPath = exportDeclaration.source.value

      const relativePath = findCorrectPath(path.join(filePath, '..', componentPath), opts)

      if (!relativePath) {
        return []
      }
      return exportedNames.map(componentName => ({ componentName, componentPath: relativePath }))
    },
  )
}

/**
 * Read the at the given path to parse it and find matching `export { default as` declarations
 *
 * @param {String} filePath Path of the file
 * @param {Options} opts Options
 * @return {Object}
 * @property {String} componentName Name of the exported component
 * @property {String} componentPath Relative path of the found entry point
 */
const findExportDeclarationsForFile = (filePath, opts) => {
  return new Promise(resolve => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      try {
        resolve(findExportDeclarationsForContent(filePath, data, opts))
      } catch (error) {
        console.warn(`Could not parse ${filePath}. No entrypoint will be generated for this file.`)
      }
    })
  })
}

/**
 * Find all files that can contain `export { default as` declarations.
 * Only file paths returned by this method should be parsed.
 *
 * @param {String} sourcePath Base folder of sources
 * @return {String[]} Array of file paths
 */
const findEligibleFiles = sourcePath => {
  return new Promise(resolve => {
    find.file(/index\.js$/, sourcePath, files => resolve(files))
  })
}

const generateEntryPoints = async (sourcePath, opts = { extensions: ['js', 'jsx', 'json'] }) => {
  try {
    const files = await findEligibleFiles(sourcePath)
    const entryPoints = flatten(
      await Promise.all(files.map(filePath => findExportDeclarationsForFile(filePath, opts))),
    )

    return entryPoints.reduce(
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

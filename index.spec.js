/* eslint-env jest */
const { generateEntryPoints } = require('./index')

describe('rollup-entrypoint-generator', () => {
  it('should find correct exports in test source file', async () => {
    const entrypoints = await generateEntryPoints('./test-source')

    expect(entrypoints.ComponentModule).toBe('./test-source/nestedModule/reactModule/component.jsx')
    expect(entrypoints.FolderModule).toBe('./test-source/folderModule/index.js')
    expect(entrypoints.JsModule).toBe('./test-source/jsModule.js')
    expect(entrypoints.JsModuleWithExtension).toBe('./test-source/jsModule.js')
  })
})

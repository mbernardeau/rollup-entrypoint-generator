/* eslint-env jest */
const { generateEntryPoints } = require('./index')

describe('rollup-entrypoint-generator', () => {
  describe('Module finding with default values', () => {
    let consoleSpy
    beforeAll(() => {
      consoleSpy = jest.spyOn(global.console, 'warn')
    })

    afterAll(() => {
      consoleSpy.mockRestore()
    })

    const entrypointsPromise = generateEntryPoints('./test-source')

    it('should correctly find export pointing to jsx file', async () => {
      const entrypoints = await entrypointsPromise
      expect(entrypoints.ComponentModule).toBe(
        './test-source/nestedModule/reactModule/component.jsx',
      )
    })
    it('should correctly find export pointing to folder with index.js file', async () => {
      const entrypoints = await entrypointsPromise

      expect(entrypoints.FolderModule).toBe('./test-source/folderModule/index.js')
    })
    it('should correctly find export alias on same line', async () => {
      const entrypoints = await entrypointsPromise

      expect(entrypoints.FolderModuleAlias).toBe('./test-source/folderModule/index.js')
    })
    it('should correctly find export pointing to js file', async () => {
      const entrypoints = await entrypointsPromise

      expect(entrypoints.JsModule).toBe('./test-source/jsModule.js')
    })
    it('should correctly find export pointing to js file when extension is defined in path', async () => {
      const entrypoints = await entrypointsPromise

      expect(entrypoints.JsModuleWithExtension).toBe('./test-source/jsModule.js')
    })
    it('should ignore line comments', async () => {
      const entrypoints = await entrypointsPromise

      expect(entrypoints.CommentedModuleLine).toBeUndefined()
    })
    it('should ignore block comments', async () => {
      const entrypoints = await entrypointsPromise

      expect(entrypoints.CommentedModuleBlock).toBeUndefined()
    })

    it('should handle file not found', async () => {
      await entrypointsPromise
      expect(consoleSpy.mock.calls[0][0].trim()).toMatchInlineSnapshot(`
        "Can't find any file at test-source/notafile within the extensions js,jsx,json. 
            If this file exists and can be defined as an entrypoint, add its extension in the option extensions."
      `)
    })
  })

  it('should accept custom extensions', async () => {
    const entrypoints = await generateEntryPoints('./test-source', { extensions: ['js', 'svg'] })

    expect(entrypoints.ComponentModule).toBe('./test-source/nestedModule/reactModule/component.svg')
    expect(entrypoints.FolderModule).toBe('./test-source/folderModule/index.js')
    expect(entrypoints.JsModule).toBe('./test-source/jsModule.js')
    expect(entrypoints.JsModuleWithExtension).toBe('./test-source/jsModule.js')
  })
})

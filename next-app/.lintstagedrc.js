const { ESLint } = require('eslint')
const filterAsync = require('node-filter-async').default
const eslintCli = new ESLint()

// All of this below is caused by eslint dropping warnings (File ignored because of a matching ignore pattern.) on ignored files
// solution taken from: https://github.com/okonet/lint-staged#eslint--7
const removeIgnoredFiles = async (files, eslintCli) => {
  const filteredFiles = await filterAsync(files, async (file) => {
    const isIgnored = await eslintCli.isPathIgnored(file)
    return !isIgnored
  })
  return filteredFiles.join(' ')
}

module.exports = {
  '*.{js,ts,jsx,tsx}': async (files) => {
    const filesToLint = await removeIgnoredFiles(files, eslintCli)
    return ['npm run prettier:write', `npm run lint:fix ${filesToLint}`]
  },
}
/**
 * @type {(filenames: string[], delimiter?: string) => string}
 */
function filesList(filenames, delimiter = ',') {
  return filenames
    .map((filename) => {
      return filename.replaceAll(/([()[\]])/g, String.raw`\$1`);
    })
    .join(delimiter);
}

/**
 * @type {Record<string, string | string[] | ((filenames: string[]) => string | string[] | Promise<string | string[]>)>}
 */
export default {
  '{apps,libs,packages}/**/*.{ts,js,cjs,mjs,json,html,css,scss}': (filenames) => [
    `nx affected --target=test --files=${filesList(filenames)} --watch=false --coverage=false`,
  ],
  '*.{js,cjs,mjs,ts,tsx,cts,mts}': (filenames) => [
    `nx affected --target=lint --files=${filesList(filenames)} --fix`,
    `nx affected --target=typecheck --files=${filesList(filenames)}`,
  ],
  '*.{js,cjs,mjs,ts,tsx,cts,mts,json,yml,yaml,md}': (filenames) => [
    `cspell lint --no-progress --no-summary --no-must-find-files ${filesList(filenames, ' ')}`,
  ],
  '*': (filenames) => [
    // Spell check file names
    `sh -c 'echo "${filenames.join('\n')}" | cspell --show-context stdin'`,
    `prettier --write --ignore-unknown ${filesList(filenames, ' ')}`,
    `secretlint ${filesList(filenames, ' ')}`,
  ],
};

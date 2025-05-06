import fs from 'fs';
import path from 'path';
import { Plugin } from 'vite';
import packageJson from './package.json' with { type: 'json' };

async function isCommonJS(depName: string) {
  try {
    const pkg = (await import(`./node_modules/${depName}/package.json`, {
      with: {
        type: 'json'
      }
    })).default;

    if (pkg.type === 'module') return false;

    const mainFile = pkg.module || pkg.main;
    if (mainFile) {
      const ext = path.extname(mainFile);
      if (ext === '.mjs') return false;
      if (ext === '.cjs') return true;
      if (ext === '.js') {
        const contents = fs.readFileSync(`./node_modules/${depName}/${mainFile}`, 'utf8')
        return contents?.includes('require') || contents?.includes('exports.') || contents?.includes('__exportStar')
      }
    }

    return false;
  } catch (err) {
    return false;
  }
}

const checkedDeps = new Set()

const checkDep = async (name: string) => {
  if(checkedDeps.has(name)) return []
  checkedDeps.add(name)
  const jsrDependencyPackageJson = (await import(`./node_modules/${name}/package.json`, {
    with: { type: 'json' }
  })).default

  const promises = Object.keys(jsrDependencyPackageJson.dependencies ?? []).map((dep) => checkDep(dep))
  const deeper = (await Promise.all(promises)).flat()

  const commonJsDeps: string[] = deeper

  if (jsrDependencyPackageJson.dependencies) {

    for ( const dep of Object.keys(jsrDependencyPackageJson.dependencies)) {
      if (await isCommonJS(dep)) {
        commonJsDeps.push(dep)
      }
    }
  }

  return commonJsDeps
}

export const jsr: Plugin = {
  name: 'jsr',
  enforce: 'pre',

  async config(config, { command }) {
    if (command === 'serve') {
      config.optimizeDeps ??= {};
      config.optimizeDeps.include ??= [];

      const jsrDependencies = Object.entries(packageJson.dependencies).filter(([, version]) => version.includes('@jsr'))
      for (const [name] of jsrDependencies) {
        const deps = await checkDep(name)
        config.optimizeDeps.include.push(...new Set(deps));
      }
    }
  },

  async resolveId(id: string, importer: any, options: any) {
    const match = [...id.matchAll(/npm:([@a-zA-Z\-0-9]*\/)?([a-zA-Z\-0-9]*)@\^[0-9]*\.[0-9]*\.[0-9]*(\/[a-zA-Z\-]*)?/gm)]

    if (match[0]) {
      const cleanedId = `${match[0][1] ?? ''}${match[0][2] ?? ''}${match[0][3] ?? ''}`

      const resolved = await this.resolve(cleanedId, importer, {
        skipSelf: true,
        ...options
      })

      if (resolved) return resolved.id
    }

    return null
  }
}

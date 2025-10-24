import { execSync } from 'child_process'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

console.log('🔨 Building library...')

// 运行Vite构建
execSync('vite build --config vite.lib.config.ts', { 
  stdio: 'inherit',
  cwd: rootDir 
})

// 确保lib目录存在
const libDir = resolve(rootDir, 'lib')
if (!existsSync(libDir)) {
  mkdirSync(libDir, { recursive: true })
}

// 生成TypeScript声明文件
console.log('📝 Generating TypeScript declarations...')
execSync('vue-tsc --project tsconfig.lib.json', {
  stdio: 'inherit',
  cwd: rootDir
})

// 复制发布用的package.json
console.log('📦 Copying package.json to lib directory...')
const packageJsonContent = {
  "name": "grid-drag",
  "version": "1.0.0",
  "type": "module",
  "description": "A Vue 3 drag-and-drop grid component library",
  "main": "index.umd.js",
  "module": "index.es.js",
  "types": "index.d.ts",
  "files": [
    "index.es.js",
    "index.es.js.map",
    "index.umd.js", 
    "index.umd.js.map",
    "style.css",
    "index.d.ts",
    "components/",
    "types/",
    "utils/"
  ],
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "import": "./index.es.js",
      "require": "./index.umd.js",
      "default": "./index.es.js"
    },
    "./style.css": {
      "default": "./style.css"
    }
  },
  "keywords": [
    "vue",
    "vue3", 
    "drag",
    "drop",
    "grid",
    "component",
    "ui"
  ],
  "author": "",
  "license": "MIT",
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "homepage": "",
  "bugs": {
    "url": ""
  }
}

writeFileSync(
  resolve(libDir, 'package.json'), 
  JSON.stringify(packageJsonContent, null, 2)
)

console.log('✅ Library build completed!')
console.log('📁 Output directory: lib/')
console.log('📋 Files generated:')
console.log('  - index.es.js (ES module)')
console.log('  - index.umd.js (UMD module)')
console.log('  - style.css (styles)')
console.log('  - index.d.ts (TypeScript declarations)')
console.log('  - package.json (npm package configuration)')
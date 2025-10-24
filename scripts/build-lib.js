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

console.log('✅ Library build completed!')
console.log('📁 Output directory: lib/')
console.log('📋 Files generated:')
console.log('  - index.es.js (ES module)')
console.log('  - index.umd.js (UMD module)')
console.log('  - style.css (styles)')
console.log('  - index.d.ts (TypeScript declarations)')
console.log('  - package.json (npm package configuration)')
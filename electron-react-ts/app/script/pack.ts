import * as packager from 'electron-packager'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as pkg from '../package.json'
import { execSync, spawn } from 'child_process'
import build from './build'
import config from './config'
import chalk from 'chalk'
import { productionPackage, packagerOptions, arch } from './packager.config'
import { getPath } from './util'

const { createPackageWithOptions } = require('asar')
const crossZip = require('cross-zip')

function isUuid4 (str: string) {
  const reg = /[0123456789ABCDEF]{8}-[0123456789ABCDEF]{4}-4[0123456789ABCDEF]{3}-[89AB][0123456789ABCDEF]{3}-[0123456789ABCDEF]{12}/
  return reg.test(str)
}

function bundleProductionCode () {
  return build()
}

function packageApp () {
  return packager(packagerOptions)
}

function writePackageJson (root: string) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path.join(root, 'package.json'), JSON.stringify(productionPackage), 'utf8', (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function rename (appPath: string) {
  let dirName: string | string[] = path.basename(appPath).split('-')
  dirName.splice(1, 0, `v${pkg.version}`)
  dirName = dirName.join('-')
  const newPath = path.join(path.dirname(appPath), dirName)
  if (fs.existsSync(newPath)) {
    console.log(chalk.yellowBright(`[${new Date().toLocaleString()}] Overwriting ${newPath} `))
    await fs.remove(newPath)
  }
  await fs.rename(appPath, newPath)
  return newPath
}

function zip (source: string, target: string): Promise<number> {
  if (!fs.existsSync(path.dirname(target))) fs.mkdirsSync(path.dirname(target))
  return new Promise<number>((resolve, reject) => {
    crossZip.zip(source, target, (err: Error) => {
      if (err) {
        reject(err)
        return
      }
      fs.stat(target, (err, stat) => {
        if (err) {
          reject(err)
          return
        }
        if (!stat.isFile()) {
          reject(new Error('Zip failed.'))
          return
        }
        resolve(stat.size)
      })
    })
  })
  // return new Promise<number>((resolve, reject) => {
  //   const output = fs.createWriteStream(target)
  //   const archive = archiver('zip', {
  //     zlib: { level: 9 }
  //   })

  //   output.on('close', function () {
  //     resolve(archive.pointer())
  //   })

  //   archive.on('error', function (err) {
  //     reject(err)
  //   })

  //   archive.pipe(output)

  //   archive.directory(source, false)

  //   archive.finalize().catch(err => {
  //     reject(err)
  //   })
  // })
}

function zipApp (p: string) {
  return zip(p, p + '.zip')
}

function createDebInstaller (appPath: string) {
  const distRoot = path.dirname(appPath)
  const icon: { [size: string]: string } = {
    '16x16': getPath(config.iconSrcDir, '16x16.png'),
    '24x24': getPath(config.iconSrcDir, '24x24.png'),
    '32x32': getPath(config.iconSrcDir, '32x32.png'),
    '48x48': getPath(config.iconSrcDir, '48x48.png'),
    '64x64': getPath(config.iconSrcDir, '64x64.png'),
    '128x128': getPath(config.iconSrcDir, '128x128.png'),
    '256x256': getPath(config.iconSrcDir, '256x256.png'),
    '512x512': getPath(config.iconSrcDir, '512x512.png'),
    '1024x1024': getPath(config.iconSrcDir, '1024x1024.png')
  }
  fs.mkdirsSync(path.join(distRoot, '.tmp/DEBIAN'))
  fs.writeFileSync(
    path.join(distRoot, '.tmp/DEBIAN/control'),
    `Package: ${pkg.name}
Version: ${pkg.version}-${Math.round(new Date().getTime() / 1000)}
Section: utility
Priority: optional
Architecture: ${arch === 'x64' ? 'amd64' : 'i386'}
Depends: kde-cli-tools | kde-runtime | trash-cli | libglib2.0-bin | gvfs-bin, libgconf-2-4, libgtk-3-0 (>= 3.10.0), libnotify4, libnss3 (>= 2:3.26), libxtst6, xdg-utils
Installed-Size: ${getDirectorySizeSync(appPath)}
Maintainer: ${productionPackage.author}
Homepage: https://github.com/${productionPackage.author}/${pkg.name}
Description: ${pkg.description}
`)

  fs.mkdirsSync(path.join(distRoot, '.tmp/usr/share/applications'))
  fs.writeFileSync(
    path.join(distRoot, `.tmp/usr/share/applications/${pkg.name}.desktop`),
    `[Desktop Entry]
Name=${pkg.name}
Comment=${pkg.description}
GenericName=Utility
Exec=/usr/share/${pkg.name}/${pkg.name}
Icon=${pkg.name}
Type=Application
StartupNotify=true
Categories=Utility;
`)

  for (const size in icon) {
    fs.mkdirsSync(path.join(distRoot, `.tmp/usr/share/icons/hicolor/${size}/apps`))
    fs.copySync(icon[size], path.join(distRoot, `.tmp/usr/share/icons/hicolor/${size}/apps/${pkg.name}.png`))
  }
  fs.copySync(appPath, path.join(distRoot, `.tmp/usr/share/${pkg.name}`))

  execSync(`dpkg -b ./.tmp ./${pkg.name}-v${pkg.version}-linux-${arch}.deb`, { cwd: distRoot, stdio: 'inherit' })
  fs.removeSync(path.join(distRoot, '.tmp'))
}

function getDirectorySizeSync (dir: string) {
  const ls = fs.readdirSync(dir)
  let size = 0
  for (let i = 0; i < ls.length; i++) {
    const item = path.join(dir, ls[i])
    const stat = fs.statSync(item)
    if (stat.isDirectory()) {
      size += getDirectorySizeSync(item)
    } else {
      size += stat.size
    }
  }
  return size
}

async function asarApp (root: string) {
  await createPackageWithOptions(root, path.join(root, '../app.asar'), { unpack: process.platform === 'linux' ? `{*.node,**/${path.basename(config.outputPath)}/${config.iconOutDir}/*.png}` : '*.node' })
  await fs.remove(root)
}

async function zipAsar (root: string) {
  const rootDotDot = path.join(root, '..')
  fs.mkdirsSync(path.join(rootDotDot, '.tmp'))
  await Promise.all([
    fs.copy(path.join(rootDotDot, 'app.asar'), path.join(rootDotDot, '.tmp/app.asar')),
    fs.existsSync(path.join(rootDotDot, 'app.asar.unpacked')) ? fs.copy(path.join(rootDotDot, 'app.asar.unpacked'), path.join(rootDotDot, '.tmp/app.asar.unpacked')) : Promise.resolve()
  ])
  await zip(path.join(rootDotDot, '.tmp'), getPath(config.distPath, `resources-v${productionPackage.version}-${process.platform}-${arch}.zip`))
  fs.removeSync(path.join(rootDotDot, '.tmp'))
}

function inno (sourceDir: string) {
  return new Promise<any>((resolve, reject) => {
    if (!isUuid4(config.inno.appid)) {
      reject(new Error('Please specify [config.inno.appid] in script/config.ts to generate windows installer.'))
      return
    }
    const def: any = {
      Name: pkg.name,
      Version: pkg.version,
      Publisher: pkg.author,
      URL: config.inno.url || pkg.name,
      AppId: `{{${config.inno.appid}}`,
      OutputDir: getPath(config.distPath),
      Arch: arch,
      RepoDir: getPath('..'),
      SourceDir: sourceDir,
      ArchitecturesAllowed: arch === 'ia32' ? '' : 'x64',
      ArchitecturesInstallIn64BitMode: arch === 'ia32' ? '' : 'x64'
    }
    spawn('ISCC.exe', ['/Q', ...Object.keys(def).map(k => `/D${k}=${def[k]}`), getPath('script', 'app.iss')], { stdio: 'inherit' })
      .on('error', reject)
      .on('exit', resolve)
  })
}

export default async function pack () {
  const start = new Date().getTime()

  console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Bundle production code...`))
  await bundleProductionCode()

  process.stdout.write(chalk.greenBright(`[${new Date().toLocaleString()}] `))
  const [appPath] = await packageApp()

  console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Write production package.json...`))
  const root = process.platform === 'darwin' ? path.join(appPath, `${pkg.name}.app/Contents/Resources/app`) : path.join(appPath, 'resources/app')
  await writePackageJson(root)

  console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Install production dependencies...`))
  execSync(`npm install --no-package-lock --production --arch=${arch} --target_arch=${arch} --build-from-source --runtime=electron --target=${pkg.devDependencies.electron} --dist-url=https://atom.io/download/electron`, { cwd: root, stdio: 'inherit' })

  console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Make app.asar...`))
  await asarApp(root)

  console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Zip resources...`))
  await zipAsar(root)

  const newPath = await rename(appPath)

  console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Zip ${newPath}...`))
  const size = await zipApp(newPath)
  console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Total size of zip: ${size} Bytes`))

  if (process.platform === 'linux') {
    console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Create .deb installer...`))
    createDebInstaller(newPath)
  }

  if (process.platform === 'win32') {
    console.log(chalk.greenBright(`[${new Date().toLocaleString()}] Create inno-setup installer...`))
    try {
      await inno(newPath)
    } catch (err) {
      console.log(chalk.yellowBright(`[${new Date().toLocaleString()}] ${err.message} `))
    }
  }

  return (new Date().getTime() - start) / 1000
}

if (require.main === module) {
  pack().then(s => console.log(chalk.greenBright(`\n  Done in ${s} seconds.`))).catch(e => console.log(chalk.redBright(e.toString())))
}

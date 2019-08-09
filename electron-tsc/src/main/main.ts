import '../common/asar'
import { app, BrowserWindow, ipcMain, BrowserWindowConstructorOptions, nativeImage } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'
import * as url from 'url'
import { getPath } from '../common/get-path'

// app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

let mainWindow: BrowserWindow | null

function createWindow () {
  const browerWindowOptions: BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: true,
      // sandbox: true,
      // enableRemoteModule: false,
      // preload: join(__dirname, '../renderer/preload.js'),
      defaultFontFamily: {
        standard: 'Microsoft YaHei'
      }
    }
  }
  if (process.platform === 'linux') {
    let linuxIcon: string
    try {
      linuxIcon = getPath('res/icon/1024x1024.png')
    } catch (_) {
      linuxIcon = ''
    }
    if (linuxIcon) {
      browerWindowOptions.icon = nativeImage.createFromPath(linuxIcon)
    }
  } else {
    if (!app.isPackaged) {
      let icon: string = ''

      const iconPath = getPath(`res/icon/app.${process.platform === 'win32' ? 'ico' : 'icns'}`)
      if (existsSync(iconPath)) icon = iconPath

      if (icon) {
        browerWindowOptions.icon = nativeImage.createFromPath(icon)
      }
    }
  }
  mainWindow = new BrowserWindow(browerWindowOptions)

  mainWindow.on('ready-to-show', function () {
    if (!mainWindow) return
    mainWindow.show()
    mainWindow.focus()
    if (!app.isPackaged) mainWindow.webContents.openDevTools()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
    app.quit()
  });

  (mainWindow as any).removeMenu ? (mainWindow as any).removeMenu() : mainWindow.setMenu(null)
  const res: any = mainWindow.loadURL(url.format({
    pathname: join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (res !== undefined && typeof res.then === 'function' && typeof res.catch === 'function') {
    res.catch((err: Error) => {
      console.log(err)
    })
  }
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// tslint:disable-next-line: strict-type-predicates
typeof (app as any).whenReady === 'function' ? (app as any).whenReady().then(main) : app.on('ready', main)

function main () {
  if (!app.isPackaged) {
    let chokidar
    let t: NodeJS.Timeout
    let t2: NodeJS.Timeout
    try {
      chokidar = require('chokidar')
      chokidar.watch(join(__dirname, '../renderer')).on('all', function (name: string, p: string) {
        clearTimeout(t)
        console.log(name, p)
        t = setTimeout(() => {
          mainWindow!.webContents.executeJavaScript('window.location.reload()')
        }, 300)
      })
      chokidar.watch([join(__dirname, '../main'), join(__dirname, '../common')]).on('all', function (name: string, p: string) {
        console.log(name, p)
        if (name !== 'add' && name !== 'addDir') {
          clearTimeout(t2)
          t2 = setTimeout(() => {
            app.relaunch({
              execPath: process.execPath,
              args: process.argv.slice(1)
            })
            app.exit()
          }, 300)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  if (!mainWindow) createWindow()
}

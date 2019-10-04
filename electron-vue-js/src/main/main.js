import '@tybys/electron-ipc-handle-invoke/main.js'
import { app, BrowserWindow, nativeImage } from 'electron'
import { format } from 'url'
import { join } from 'path'
import { existsSync } from 'fs'
import init from './ipc'
import { hello } from './hello'

let mainWindow = null

function createWindow () {
  console.log(hello())
  const browerWindowOptions = {
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  }

  if (process.platform === 'linux') {
    const linuxIcon = join(__dirname, '../../icon/app.png')
    if (existsSync(linuxIcon)) {
      browerWindowOptions.icon = nativeImage.createFromPath(linuxIcon)
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      const iconPath = join(__dirname, `../../../icon/app.${process.platform === 'win32' ? 'ico' : 'icns'}`)
      if (existsSync(iconPath)) {
        browerWindowOptions.icon = nativeImage.createFromPath(iconPath)
      }
    }
  }

  mainWindow = new BrowserWindow(browerWindowOptions)

  mainWindow.on('ready-to-show', function () {
    if (!mainWindow) return
    mainWindow.show()
    mainWindow.focus()
    if (process.env.NODE_ENV !== 'production') mainWindow.webContents.openDevTools()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  if (process.env.NODE_ENV !== 'production') {
    const res = mainWindow.loadURL('http://localhost:8050/app/renderer/')

    if (res !== undefined && typeof res.then === 'function' && typeof res.catch === 'function') {
      res.catch((err) => {
        console.log(err)
      })
    }
  } else {
    mainWindow.removeMenu ? mainWindow.removeMenu() : mainWindow.setMenu(null)
    const res = mainWindow.loadURL(format({
      pathname: join(__dirname, '../renderer/index.html'),
      protocol: 'file:',
      slashes: true
    }))

    if (res !== undefined && typeof res.then === 'function' && typeof res.catch === 'function') {
      res.catch((err) => {
        console.log(err)
      })
    }
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
typeof app.whenReady === 'function' ? app.whenReady().then(main) : app.on('ready', main)

function main () {
  init()
  if (!mainWindow) createWindow()
}

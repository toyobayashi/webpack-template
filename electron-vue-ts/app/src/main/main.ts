import { app, BrowserWindow, BrowserWindowConstructorOptions, nativeImage } from 'electron'
import { format } from 'url'
import { join } from 'path'
import { existsSync } from 'fs'
import initApi from '~/api'

let mainWindow: BrowserWindow | null = null

function createWindow () {
  const browerWindowOptions: BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js')
    }
  }

  if ((process as any).isLinux) {
    let linuxIcon: string
    try {
      linuxIcon = require(`../../res/1024x1024.png`)
    } catch (_) {
      linuxIcon = ''
    }
    if (linuxIcon) {
      browerWindowOptions.icon = nativeImage.createFromPath(join(__dirname, linuxIcon))
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      let icon: string = ''

      const iconPath = join(__dirname, `../res/app.${process.platform === 'win32' ? 'ico' : 'icns'}`)
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
    if (process.env.NODE_ENV !== 'production') mainWindow.webContents.openDevTools()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  if (process.env.NODE_ENV !== 'production') {
    const config = require('../../script/config').default
    const res = mainWindow.loadURL(`http://${config.devServerHost}:${config.devServerPort}${config.publicPath}`)
    // tslint:disable-next-line: strict-type-predicates
    if (typeof res.then === 'function' && typeof res.catch === 'function') {
      res.catch(err => {
        console.log(err)
      })
    }
  } else {
    mainWindow.setMenu(null)
    const res = mainWindow.loadURL(format({
      pathname: join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    // tslint:disable-next-line: strict-type-predicates
    if (typeof res.then === 'function' && typeof res.catch === 'function') {
      res.catch(err => {
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
  initApi()
  if (!mainWindow) createWindow()
}
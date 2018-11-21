import { app, BrowserWindow } from 'electron'
import { format } from 'url'
import { join } from 'path'

let mainWindow

function createWindow () {
  const browerWindowOptions = {
    width: 800,
    height: 600,
    show: false
  }

  mainWindow = new BrowserWindow(browerWindowOptions)

  mainWindow.on('ready-to-show', function () {
    if (!mainWindow) return
    mainWindow.show()
    mainWindow.focus()
    if (process.env.NODE_ENV !== 'production') mainWindow.webContents.openDevTools()
  })

  if (process.env.NODE_ENV !== 'production') {
    const config = require('../script/config.json')
    mainWindow.loadURL(`http://${config.devServerHost}:${config.devServerPort}${config.publicPath}`)
  } else {
    mainWindow.loadURL(format({
      pathname: join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

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

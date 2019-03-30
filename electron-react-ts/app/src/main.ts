import { app, BrowserWindow } from 'electron'
import { format } from 'url'
import { join } from 'path'

let mainWindow: BrowserWindow | null

function createWindow () {
  const browerWindowOptions = {
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
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
    const config = require('../script/config').default
    mainWindow.loadURL(`http://${config.devServerHost}:${config.devServerPort}${config.publicPath}`)
  } else {
    mainWindow.setMenu(null)
    mainWindow.loadURL(format({
      pathname: join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }
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

import {app, systemPreferences} from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Constants from './utils/Constants'
import { createErrorWindow, createMainWindow } from './MainRunner'

let mainWindow
let errorWindow

app.on('ready', () => {
  if (!Constants.IS_DEV_ENV) {
    global.__static = join(dirname(fileURLToPath(import.meta.url)), '/static').replace(
      /\\/g,
      '\\\\'
    )
  }

  if (Constants.IS_MAC) {
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
  }

  mainWindow = createMainWindow(mainWindow)
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow(mainWindow)
  }
})

app.on('window-all-closed', () => {
  mainWindow = null
  errorWindow = null

  if (!Constants.IS_MAC) {
    app.quit()
  }
})

app.on('render-process-gone', (ev, webContents, details) => {
  errorWindow = createErrorWindow(errorWindow, mainWindow, details)
})

process.on('uncaughtException', () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow)
})

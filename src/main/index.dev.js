import { app } from 'electron'
import { installExtension, VUEJS_DEVTOOLS } from 'electron-extension-installer'

app.on('ready', async () => {
  await installExtension(VUEJS_DEVTOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true
    }
  })
})

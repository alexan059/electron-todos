const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const menuTemplate = [{
  label: 'File',
  submenu: [{
    label: 'New Todo',
    click: createAddWindow
  }, {
    label: 'Clear Todos',
    click: () => mainWindow.webContents.send('todo:clear')
  }, {
    label: 'Quit',
    accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click: app.quit
  }]
}];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [{ role: 'reload', accelerator: 'F5' }, {
      label: 'Toggle Developer Tools',
      accelerator: 'F12',
      click: (item, focusedWindow) => focusedWindow.toggleDevTools()
    }]
  });
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file:/${__dirname}/main.html`);

  mainWindow.on('closed', app.quit);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});
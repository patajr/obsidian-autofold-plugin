import { App, PluginSettingTab, Setting, Plugin, TFile } from 'obsidian';

interface AutoFoldSettings {
  autoFoldOnOpen: boolean;
}

const DEFAULT_SETTINGS: AutoFoldSettings = {
  autoFoldOnOpen: true,
}

export default class AutoFoldPlugin extends Plugin {
  settings: AutoFoldSettings;
  private firstFileOpened = false;
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AutoFoldSettingTab(this.app, this));
    // Fold al inicializar obsidian
    this.app.workspace.onLayoutReady(() => {
      (this.app as any).commands.executeCommandById('editor:fold-all');
      });

    // Opcion fold al abrir nota
    this.registerEvent(
      this.app.workspace.on('file-open', (file: TFile | null) => {
        if (file && this.settings.autoFoldOnOpen) {
          if(!this.firstFileOpened){
            (this.app as any).commands.executeCommandById('editor:fold-all');
            this.firstFileOpened = true;
          } else{
            setTimeout(() => {
          (this.app as any).commands.executeCommandById('editor:fold-all');
            }, 100); 
          }
            
    }
  })
);
}
  
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

// CLASE PARA LA PESTAÑA DE CONFIGURACIÓN
class AutoFoldSettingTab extends PluginSettingTab {
  plugin: AutoFoldPlugin;

  constructor(app: App, plugin: AutoFoldPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Automatically fold when a note is open')
      .setDesc('If on, every header will automatically fold whenever a note is open.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoFoldOnOpen)
        .onChange(async (value) => {
          this.plugin.settings.autoFoldOnOpen = value;
          await this.plugin.saveSettings();
        }));
  }
}
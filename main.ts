import { App, PluginSettingTab, Setting, Plugin, TFile } from 'obsidian';

// INTERFAZ DE CONFIGURACIÓN
interface AutoFoldSettings {
  autoFoldOnOpen: boolean;
}

// CONFIGURACIÓN POR DEFECTO
const DEFAULT_SETTINGS: AutoFoldSettings = {
  autoFoldOnOpen: true,
}

// CLASE PRINCIPAL DEL PLUGIN
export default class AutoFoldPlugin extends Plugin {
  settings: AutoFoldSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AutoFoldSettingTab(this.app, this));
    console.log("Plugin de Plegado Automático cargado.");

    this.registerEvent(
      this.app.workspace.on('file-open', (file: TFile | null) => {
        if (file && this.settings.autoFoldOnOpen) {
          console.log(`Plegando encabezados en: ${file.basename}`);
          setTimeout(() => {
          console.log(`Plegando encabezados en: ${file.basename}`);
          (this.app as any).commands.executeCommandById('editor:fold-all');
      }, 100); 
    }
  })
    );
  }

  onunload() {
    console.log("Plugin de Plegado Automático descargado.");
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
    containerEl.createEl('h2', { text: 'Auto Fold Settings' });

    new Setting(containerEl)
      .setName('Automatically fold when a note is open') // Foldear automáticamente cuando una nota sea abierta
      .setDesc('If on, every header will automatically fold whenever a note is open.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoFoldOnOpen)
        .onChange(async (value) => {
          this.plugin.settings.autoFoldOnOpen = value;
          await this.plugin.saveSettings();
        }));
  }
}
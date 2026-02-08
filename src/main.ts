import { Notice, Plugin, TFile } from "obsidian";
import {
	DEFAULT_SETTINGS,
	PluginSettings,
	SettingsTab,
} from "./components/settings";
import { AccessTracker } from "./components/accessTracker";
import { FileMenuHandler } from "./components/fileMenuHandler";
import { IdleTimer } from "./components/idleTimer";
import { PasswordInputModal } from "./components/passwordInputModal";
import { ProtectionChecker } from "./components/protectionChecker";

export default class PasswordPlugin extends Plugin {
	settings: PluginSettings;
	toggleFlag: boolean;

	// 檔案保護元件
	protectionChecker: ProtectionChecker;
	accessTracker: AccessTracker;
	fileMenuHandler: FileMenuHandler;
	idleTimer: IdleTimer;

	// 追蹤前一個開啟的檔案
	private previousFile: TFile | null = null;

	async onload() {
		await this.loadSettings();

		this.app.workspace.onLayoutReady(async () => {
			// 初始化元件
			this.protectionChecker = new ProtectionChecker(this.app);
			this.accessTracker = new AccessTracker();
			this.fileMenuHandler = new FileMenuHandler(this.app, this);
			this.idleTimer = new IdleTimer();

			// 註冊右鍵選單
			this.fileMenuHandler.registerFileMenu();

			// 註冊檔案開啟事件 - 檢查保護狀態並要求密碼
			this.registerEvent(
				this.app.workspace.on('file-open', async (file) => {
					// 處理前一個檔案的閒置計時器
					if (this.previousFile) {
						// 只對臨時訪問的檔案啟動計時器
						if (this.accessTracker.isTemporaryAccess(this.previousFile.path)) {
							// 關閉分頁時重置訪問，或 autoEncryptOnClose 開啟時重置
							const shouldReset = !file || this.settings.autoEncryptOnClose;

							if (shouldReset) {
								this.accessTracker.clearAccess(this.previousFile.path);
								this.idleTimer.reset(this.previousFile.path);
							} else {
								// 啟動閒置計時器
								this.startIdleTimer(this.previousFile);
							}
						}
					}

					// 更新前一個檔案
					this.previousFile = file;

					// 如果沒有檔案，返回
					if (!file) return;

					console.log('[Main] file-open event:', file.path);

					// 檢查檔案是否受保護
					const isProtected = await this.protectionChecker.isProtected(file);
					console.log('[Main] isProtected result:', isProtected);
					if (!isProtected) return;

					// 檢查是否已經驗證過密碼
					const alreadyAccessed = this.accessTracker.isAccessedThisSession(file.path);
					console.log('[Main] alreadyAccessed:', alreadyAccessed);
					if (alreadyAccessed) {
						// 已驗證，允許訪問
						return;
					}

					// 需要驗證密碼
					console.log('[Main] Requesting password for:', file.path);
					await this.requestPasswordForFile(file);
				})
			);

			// 註冊閒置事件
			this.registerDomEvent(document, 'mousemove', () => {
				if (this.previousFile) {
					this.idleTimer.reset(this.previousFile.path);
				}
			});

			this.registerDomEvent(document, 'keydown', () => {
				if (this.previousFile) {
					this.idleTimer.reset(this.previousFile.path);
				}
			});
		});

		// 添加設定頁面
		this.addSettingTab(new SettingsTab(this.app, this));
	}

	/**
	 * 要求輸入密碼以訪問受保護文件
	 */
	async requestPasswordForFile(file: TFile): Promise<void> {
		// 檢查是否已設定密碼
		if (!this.settings.password) {
			new Notice("請先在設定中設定密碼");
			// 關閉文件
			this.app.workspace.getLeaf().detach();
			return;
		}

		// 顯示密碼輸入框
		const modal = new PasswordInputModal(
			this.app,
			async (inputPassword) => {
				// 驗證密碼
				const globalPassword = this.getGlobalPassword();
				if (inputPassword === globalPassword) {
					// 密碼正確，標記為已訪問
					this.accessTracker.markAsTemporaryAccess(file.path);
					new Notice(`已驗證：${file.name}`);

					// 重新打開檔案以正確渲染
					await this.app.workspace.getLeaf().openFile(file);
				} else {
					// 密碼錯誤
					new Notice("密碼錯誤");
					// 關閉文件
					this.app.workspace.getLeaf().detach();
				}
			},
			() => {
				// 取消時關閉文件
				new Notice("已取消");
				this.app.workspace.getLeaf().detach();
			}
		);
		modal.open();
	}

	/**
	 * 啟動閒置計時器
	 */
	startIdleTimer(file: TFile) {
		const idleTimeMinutes = parseInt(this.settings.autoLock) || 5;
		const idleTimeMs = idleTimeMinutes * 60 * 1000;

		this.idleTimer.start(file.path, idleTimeMs, async () => {
			// 閒置時間到，清除訪問狀態
			this.accessTracker.clearAccess(file.path);
			new Notice(`${file.name} 已鎖定，需要重新驗證密碼`);

			// 如果當前正在查看這個文件，關閉它
			const activeFile = this.app.workspace.getActiveFile();
			if (activeFile?.path === file.path) {
				this.app.workspace.getLeaf().detach();
			}
		});
	}

	/**
	 * 取得全域密碼
	 */
	getGlobalPassword(): string {
		return this.settings.originalPassword || "";
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {
		// 清理
		if (this.idleTimer) {
			this.idleTimer.clearAll();
		}
		if (this.accessTracker) {
			this.accessTracker.clearAll();
		}
	}
}

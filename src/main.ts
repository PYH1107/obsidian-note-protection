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
import { hashPassword } from "./components/crypto";

export default class PasswordPlugin extends Plugin {
	settings: PluginSettings;

	// 檔案保護元件
	protectionChecker: ProtectionChecker;
	accessTracker: AccessTracker;
	fileMenuHandler: FileMenuHandler;
	idleTimer: IdleTimer;

	// 追蹤前一個開啟的檔案
	private previousFile: TFile | null = null;

	// 防止在允許訪問後立即清除訪問權限
	private justAllowedAccess: Set<string> = new Set();

	async onload() {
		await this.loadSettings();

		// onLayoutReady: 等待 Obsidian UI 完全就緒後才初始化（onload 時 workspace 可能還沒準備好）
		this.app.workspace.onLayoutReady(async () => {
			// 初始化元件
			this.protectionChecker = new ProtectionChecker(this.app);
			this.accessTracker = new AccessTracker(); // session
			this.fileMenuHandler = new FileMenuHandler(this.app, this);
			this.idleTimer = new IdleTimer();

			// 註冊右鍵選單
			this.fileMenuHandler.registerFileMenu();

			// 監聽檔案開啟事件：處理前一個檔案的鎖定邏輯，並對新開啟的受保護檔案要求密碼
			this.registerEvent(
				this.app.workspace.on('file-open', async (file) => {
					console.debug('[Main] ========== file-open event triggered ==========');
					console.debug('[Main] Current file:', file?.path || 'null (closing)');
					console.debug('[Main] Previous file:', this.previousFile?.path || 'null');

					this.handleLeavingPreviousFile(file);
					this.previousFile = file;

					if (!file) return;

					await this.handleOpeningProtectedFile(file);
				})
			);

			// 監聽 layout 變化，偵測分頁被關閉時清除存取權限
			// （不能併入 file-open：關閉非 active 的分頁時 file-open 不會觸發，需要 layout-change 兜底）
			this.registerEvent(
				this.app.workspace.on('layout-change', () => {
					const openPaths = new Set(
						this.app.workspace.getLeavesOfType('markdown')
							.map(leaf => {
								const view = leaf.view as { file?: TFile };
								return view.file?.path;
							})
							.filter(Boolean)
					);

					for (const filePath of this.accessTracker.getTemporaryAccess()) {
						if (!openPaths.has(filePath)) {
							console.debug('[Main] 🔒 Tab closed detected via layout-change, clearing access for:', filePath);
							this.accessTracker.clearAccess(filePath);
							this.idleTimer.stop(filePath);
						}
					}
				})
			);

			// 註冊閒置事件：用戶有操作時重新倒計時
			this.registerDomEvent(document, 'mousemove', () => {
				if (this.previousFile) {
					this.idleTimer.restart(this.previousFile.path);
				}
			});

			this.registerDomEvent(document, 'keydown', () => {
				if (this.previousFile) {
					this.idleTimer.restart(this.previousFile.path);
				}
			});
		});

		// 添加設定頁面
		this.addSettingTab(new SettingsTab(this.app, this));
	}

	/**
	 * 處理離開前一個檔案時的鎖定邏輯
	 */
	private handleLeavingPreviousFile(currentFile: TFile | null): void {
		if (!this.previousFile) return;

		const prevPath = this.previousFile.path;

		if (!this.accessTracker.isTemporaryAccess(prevPath)) {
			console.debug('[Main] Previous file is NOT temporary access, skipping');
			return;
		}

		const isSameFile = currentFile?.path === prevPath;
		const wasJustAllowed = this.justAllowedAccess.has(prevPath);
		const isTabClosing = !currentFile || !this.app.workspace
			.getLeavesOfType('markdown')
			.some(leaf => {
				const view = leaf.view as { file?: TFile };
				return view.file?.path === prevPath;
			});

		// 三種情境都要停止計時器
		this.idleTimer.stop(prevPath);

		// 判斷是否需要清除存取權限
		const shouldClearAccess =
			(isTabClosing && !isSameFile) ||
			(this.settings.autoEncryptOnClose && !isSameFile && !wasJustAllowed);

		if (shouldClearAccess) {
			this.accessTracker.clearAccess(prevPath);
			console.debug('[Main] ✅ Access cleared for:', prevPath);
		} else {
			console.debug('[Main] ⏸️ Keeping access for:', prevPath);
		}

		this.justAllowedAccess.delete(prevPath);
	}

	/**
	 * 處理開啟受保護檔案時的驗證邏輯
	 */
	private async handleOpeningProtectedFile(file: TFile): Promise<void> {
		const isProtected = await this.protectionChecker.isProtected(file);
		if (!isProtected) return;

		const alreadyAccessed = this.accessTracker.isAccessedThisSession(file.path);

		if (alreadyAccessed) {
			this.justAllowedAccess.add(file.path);
			if (this.accessTracker.isTemporaryAccess(file.path)) {
				this.startIdleTimer(file);
			}
			return;
		}

		await this.requestPasswordForFile(file);
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
		console.debug('[Main] 🔐 Opening password modal for:', file.path);
		const modal = new PasswordInputModal(
			this.app,
			async (inputPassword) => {
				// 驗證密碼：將輸入的密碼雜湊後與儲存的雜湊比對
				const inputHash = await hashPassword(inputPassword);
				const storedHash = this.settings.password;
				if (inputHash === storedHash) {
					// 密碼正確，標記為已訪問
					console.debug('[Main] ✅ Password correct, marking as temporary access:', file.path);
					this.accessTracker.markAsTemporaryAccess(file.path);
					console.debug('[Main] After marking, all accessed files:', this.accessTracker.getAccessedFiles());
					new Notice(`已驗證：${file.name}`);

					// 啟動閒置計時器
					this.startIdleTimer(file);

					// 重新打開檔案以正確渲染
					console.debug('[Main] 🔄 Re-opening file:', file.path);
					await this.app.workspace.getLeaf().openFile(file);
					console.debug('[Main] ✅ File re-opened successfully');
				} else {
					// 密碼錯誤
					console.debug('[Main] ❌ Password incorrect for:', file.path);
					new Notice("密碼錯誤");
					// 關閉文件
					this.app.workspace.getLeaf().detach();
				}
			},
			() => {
				// 取消時關閉文件
				console.debug('[Main] ❌ Password modal cancelled for:', file.path);
				new Notice("已取消");
				this.app.workspace.getLeaf().detach();
			}
		);
		console.debug('[Main] 🔓 Password modal opened');
		modal.open();
	}

	/**
	 * 啟動閒置計時器
	 */
	startIdleTimer(file: TFile) {
		const idleTimeMinutes = parseInt(this.settings.autoLock) || 5;
		const idleTimeMs = idleTimeMinutes * 60 * 1000;

		console.debug('[Main] Starting idle timer for:', file.path, 'duration:', idleTimeMs, 'ms');
		this.idleTimer.start(file.path, idleTimeMs, () => {
			// 閒置時間到，清除訪問狀態
			console.debug('[Main] ⏰ Idle timer triggered for:', file.path);
			this.accessTracker.clearAccess(file.path);
			new Notice(`${file.name} 已鎖定，需要重新驗證密碼`);

			// 如果當前正在查看這個文件，關閉它
			const activeFile = this.app.workspace.getActiveFile();
			if (activeFile?.path === file.path) {
				this.app.workspace.getLeaf().detach();
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData() as PluginSettings
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

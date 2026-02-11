import main from "../main";
import { App, TFile, Menu, Notice, MarkdownView } from "obsidian";
import { PasswordInputModal } from "./passwordInputModal";
import { hashPassword } from "./crypto";
import { t } from "../i18n";

export class FileMenuHandler {
    app: App;
    plugin: main;

    constructor(app: App, plugin: main) {
        this.app = app;
        this.plugin = plugin;
    }

    /**
     * 註冊右鍵選單
     */
    registerFileMenu(): void {
        this.plugin.registerEvent(
            this.app.workspace.on("file-menu", (menu, file) => {
                if (file instanceof TFile && file.extension === "md") {
                    this.addProtectionMenuItemsSync(menu, file);
                }
            })
        );
    }

    /**
     * 同步添加保護選單項目
     */
    private addProtectionMenuItemsSync(menu: Menu, file: TFile): void {
        menu.addSeparator();

        const isProtected = this.plugin.protectionChecker.isProtectedSync(file);

        if (isProtected) {
            menu.addItem((item) => {
                item.setTitle(t("menu_decrypt_file"))
                    .setIcon("unlock")
                    .onClick(() => {
                        this.handleRemoveProtection(file);
                    });
            });
        } else {
            menu.addItem((item) => {
                item.setTitle(t("menu_encrypt_file"))
                    .setIcon("lock")
                    .onClick(async () => {
                        await this.handleMarkProtected(file);
                    });
            });
        }
    }

    /**
     * 處理標記為受保護
     */
    private async handleMarkProtected(file: TFile): Promise<void> {
        // 檢查是否已設定密碼
        if (!this.plugin.settings.password) {
            new Notice(t("msg_set_password_first_warning"));
            return;
        }

        try {
            await this.plugin.protectionChecker.markAsProtected(file);
            new Notice(t("msg_encrypted", { name: file.name }));

            // 立即關閉檔案，防止未經驗證就查看
            const leaves = this.app.workspace.getLeavesOfType('markdown');
            for (const leaf of leaves) {
                if (leaf.view instanceof MarkdownView && leaf.view.file?.path === file.path) {
                    leaf.detach();
                    break;
                }
            }
        } catch (error) {
            console.error('[FileMenuHandler] Error in handleMarkProtected:', error);
            new Notice(t("msg_encrypt_failed", { message: (error as Error).message }));
        }
    }

    /**
     * 處理移除保護
     */
    private handleRemoveProtection(file: TFile): void {
        // 要求輸入密碼確認
        const modal = new PasswordInputModal(
            this.app,
            async (inputPassword) => {
                // 驗證密碼：將輸入的密碼雜湊後與儲存的雜湊比對
                const inputHash = await hashPassword(inputPassword);
                const storedHash = this.plugin.settings.password;
                if (inputHash === storedHash) {
                    // 密碼正確，執行永久解密
                    try {
                        await this.plugin.protectionChecker.removeProtection(file);
                        this.plugin.accessTracker.clearAccess(file.path);
                        this.plugin.idleTimer.stop(file.path);

                        new Notice(t("msg_decrypted", { name: file.name }));
                    } catch (error) {
                        console.error('[FileMenuHandler] Error in handleRemoveProtection:', error);
                        new Notice(t("msg_decrypt_failed", { message: (error as Error).message }));
                    }
                } else {
                    // 密碼錯誤
                    new Notice(t("msg_wrong_password_decrypt"));
                }
            },
            () => {
                // 取消
                new Notice(t("msg_decrypt_cancelled"));
            }
        );
        modal.open();
    }
}

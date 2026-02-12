import main from "../main";
import { App, TFile, Menu, Notice, MarkdownView } from "obsidian";
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
     * 處理移除保護（委託 plugin 統一處理）
     */
    private handleRemoveProtection(file: TFile): void {
        this.plugin.requestRemoveProtection(file);
    }
}

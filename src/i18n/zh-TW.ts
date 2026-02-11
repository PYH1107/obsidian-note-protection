export default {
	// Settings - Headings
	settings_password_heading: "密碼設定",
	settings_advanced_heading: "進階設定",
	settings_file_encryption_heading: "檔案級加密設定",

	// Settings - Password
	settings_set_password: "設定密碼",
	settings_password_set_desc: "✅ 密碼已設定。點擊按鈕可變更密碼。",
	settings_password_not_set_desc: "⚠️ 尚未設定密碼。請先設定密碼以使用加密功能。",
	settings_change_password: "變更密碼",

	// Settings - Advanced
	settings_idle_lock_name: "閒置自動鎖定時間（分鐘）",
	settings_idle_lock_desc: "閒置多少分鐘後自動重新加密已解密的檔案（設定為 0 表示停用）",

	// Settings - File-level encryption
	settings_auto_encrypt_on_close_name: "關閉檔案時自動加密",
	settings_auto_encrypt_on_close_desc: "切換到其他檔案時自動加密前一個檔案",

	// Modal - Set Password
	modal_title_change_password: "變更密碼",
	modal_title_set_password: "設定密碼",
	modal_msg_enter_old_first: "請先輸入舊密碼",
	modal_msg_enter_and_confirm: "請輸入密碼並確認",
	modal_old_password: "舊密碼",
	modal_old_password_desc: "請輸入目前的密碼",
	modal_old_password_placeholder: "輸入舊密碼",
	modal_new_password: "新密碼",
	modal_password: "密碼",
	modal_password_min_length: "長度至少 1 個字元",
	modal_password_placeholder: "輸入密碼",
	modal_confirm_password: "確認密碼",
	modal_confirm_password_desc: "再次輸入相同密碼",
	modal_confirm_password_placeholder: "確認密碼",
	modal_password_hint: "密碼提示問題（可選）",
	modal_password_hint_desc: "忘記密碼時顯示的提示",
	modal_password_hint_placeholder: "例如：我的寵物名字？",
	modal_confirm: "確認",
	modal_cancel: "取消",

	// Modal - Set Password validation messages
	msg_enter_password_and_confirm: "請輸入密碼並確認",
	msg_enter_password: "❌ 請輸入密碼",
	msg_confirm_password: "⚠️ 請確認密碼",
	msg_passwords_not_match: "❌ 兩次密碼不一致",
	msg_password_too_short: "❌ 密碼長度至少 1 個字元",
	msg_password_valid: "✅ 密碼格式正確",
	msg_enter_old_password: "❌ 請輸入舊密碼",
	msg_old_password_incorrect: "❌ 舊密碼不正確",
	msg_password_set: "✅ 密碼已設定",

	// Modal - Password Input
	modal_enter_password_title: "🔒 輸入密碼",
	modal_password_input_placeholder: "請輸入密碼",
	msg_please_enter_password: "⚠️ 請輸入密碼",

	// Main
	msg_set_password_first: "請先在設定中設定密碼",
	msg_verified: "已驗證：{name}",
	msg_wrong_password: "密碼錯誤",
	msg_cancelled: "已取消",
	msg_file_locked: "{name} 已鎖定，需要重新驗證密碼",

	// File Menu
	menu_decrypt_file: "永久解密此檔案",
	menu_encrypt_file: "加密此檔案",
	msg_set_password_first_warning: "⚠️ 請先在設定中設定密碼",
	msg_encrypted: "✅ 已加密：{name}",
	msg_encrypt_failed: "❌ 加密失敗：{message}",
	msg_decrypted: "✅ 已解密：{name}",
	msg_decrypt_failed: "❌ 解密失敗：{message}",
	msg_wrong_password_decrypt: "❌ 密碼錯誤，無法解密",
	msg_decrypt_cancelled: "已取消解密",
} as const;

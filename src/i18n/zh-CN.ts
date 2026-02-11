export default {
	// Settings - Headings
	settings_password_heading: "密码设置",
	settings_advanced_heading: "高级设置",
	settings_file_encryption_heading: "文件级加密设置",

	// Settings - Password
	settings_set_password: "设置密码",
	settings_password_set_desc: "✅ 密码已设置。点击按钮可更改密码。",
	settings_password_not_set_desc: "⚠️ 尚未设置密码。请先设置密码以使用加密功能。",
	settings_change_password: "更改密码",

	// Settings - Advanced
	settings_idle_lock_name: "空闲自动锁定时间（分钟）",
	settings_idle_lock_desc: "空闲多少分钟后自动重新加密已解密的文件（设为 0 表示禁用）",

	// Settings - File-level encryption
	settings_auto_encrypt_on_close_name: "关闭文件时自动加密",
	settings_auto_encrypt_on_close_desc: "切换到其他文件时自动加密上一个文件",

	// Modal - Set Password
	modal_title_change_password: "更改密码",
	modal_title_set_password: "设置密码",
	modal_msg_enter_old_first: "请先输入旧密码",
	modal_msg_enter_and_confirm: "请输入密码并确认",
	modal_old_password: "旧密码",
	modal_old_password_desc: "请输入当前密码",
	modal_old_password_placeholder: "输入旧密码",
	modal_new_password: "新密码",
	modal_password: "密码",
	modal_password_min_length: "长度至少 1 个字符",
	modal_password_placeholder: "输入密码",
	modal_confirm_password: "确认密码",
	modal_confirm_password_desc: "再次输入相同密码",
	modal_confirm_password_placeholder: "确认密码",
	modal_password_hint: "密码提示问题（可选）",
	modal_password_hint_desc: "忘记密码时显示的提示",
	modal_password_hint_placeholder: "例如：我的宠物名字？",
	modal_confirm: "确认",
	modal_cancel: "取消",

	// Modal - Set Password validation messages
	msg_enter_password_and_confirm: "请输入密码并确认",
	msg_enter_password: "❌ 请输入密码",
	msg_confirm_password: "⚠️ 请确认密码",
	msg_passwords_not_match: "❌ 两次密码不一致",
	msg_password_too_short: "❌ 密码长度至少 1 个字符",
	msg_password_valid: "✅ 密码格式正确",
	msg_enter_old_password: "❌ 请输入旧密码",
	msg_old_password_incorrect: "❌ 旧密码不正确",
	msg_password_set: "✅ 密码已设置",

	// Modal - Password Input
	modal_enter_password_title: "🔒 输入密码",
	modal_password_input_placeholder: "请输入密码",
	msg_please_enter_password: "⚠️ 请输入密码",

	// Main
	msg_set_password_first: "请先在设置中设置密码",
	msg_verified: "已验证：{name}",
	msg_wrong_password: "密码错误",
	msg_cancelled: "已取消",
	msg_file_locked: "{name} 已锁定，需要重新验证密码",

	// File Menu
	menu_decrypt_file: "永久解密此文件",
	menu_encrypt_file: "加密此文件",
	msg_set_password_first_warning: "⚠️ 请先在设置中设置密码",
	msg_encrypted: "✅ 已加密：{name}",
	msg_encrypt_failed: "❌ 加密失败：{message}",
	msg_decrypted: "✅ 已解密：{name}",
	msg_decrypt_failed: "❌ 解密失败：{message}",
	msg_wrong_password_decrypt: "❌ 密码错误，无法解密",
	msg_decrypt_cancelled: "已取消解密",
} as const;

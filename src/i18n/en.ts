export default {
	// Settings - Headings
	settings_password_heading: "Password",
	settings_advanced_heading: "Advanced",
	settings_file_encryption_heading: "File-level encryption",

	// Settings - Password
	settings_set_password: "Set password",
	settings_password_set_desc: "Password is set. Click the button to change it.",
	settings_password_not_set_desc: "No password set. Please set a password to use encryption.",
	settings_change_password: "Change password",

	// Settings - Advanced
	settings_idle_lock_name: "Idle auto-lock time (minutes)",
	settings_idle_lock_desc: "Re-encrypt decrypted files after being idle for this many minutes (set to 0 to disable)",

	// Settings - File-level encryption
	settings_auto_encrypt_on_close_name: "Auto-encrypt on file close",
	settings_auto_encrypt_on_close_desc: "Automatically encrypt the previous file when switching to another file",

	// Modal - Set Password
	modal_title_change_password: "Change password",
	modal_title_set_password: "Set password",
	modal_msg_enter_old_first: "Please enter your current password first",
	modal_msg_enter_and_confirm: "Enter a password and confirm",
	modal_old_password: "Old password",
	modal_old_password_desc: "Enter your current password",
	modal_old_password_placeholder: "Enter old password",
	modal_new_password: "New password",
	modal_password: "Password",
	modal_password_min_length: "At least 1 character",
	modal_password_placeholder: "Enter password",
	modal_confirm_password: "Confirm password",
	modal_confirm_password_desc: "Enter the same password again",
	modal_confirm_password_placeholder: "Confirm password",
	modal_password_hint: "Password hint (optional)",
	modal_password_hint_desc: "Displayed when you forget the password",
	modal_password_hint_placeholder: "e.g. My pet's name?",
	modal_confirm: "Confirm",
	modal_cancel: "Cancel",

	// Modal - Set Password validation messages
	msg_enter_password_and_confirm: "Enter a password and confirm",
	msg_enter_password: "Please enter a password",
	msg_confirm_password: "Please confirm the password",
	msg_passwords_not_match: "Passwords do not match",
	msg_password_too_short: "Password must be at least 1 character",
	msg_password_valid: "Password format is valid",
	msg_enter_old_password: "Please enter the old password",
	msg_old_password_incorrect: "Old password is incorrect",
	msg_password_set: "Password has been set",

	// Modal - Password Input
	modal_enter_password_title: "Enter password",
	modal_password_input_placeholder: "Enter your password",
	msg_please_enter_password: "Please enter a password",

	// Main
	msg_set_password_first: "Please set a password in settings first",
	msg_verified: "Verified: {name}",
	msg_wrong_password: "Wrong password",
	msg_cancelled: "Cancelled",
	msg_file_locked: "{name} is locked, password required",

	// File Menu
	menu_decrypt_file: "Permanently decrypt this file",
	menu_encrypt_file: "Encrypt this file",
	msg_set_password_first_warning: "Please set a password in settings first",
	msg_encrypted: "Encrypted: {name}",
	msg_encrypt_failed: "Encryption failed: {message}",
	msg_decrypted: "Decrypted: {name}",
	msg_decrypt_failed: "Decryption failed: {message}",
	msg_wrong_password_decrypt: "Wrong password, cannot decrypt",
	msg_decrypt_cancelled: "Decryption cancelled",
} as const;

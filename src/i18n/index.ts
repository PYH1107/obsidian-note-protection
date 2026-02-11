import { moment } from "obsidian";
import en from "./en";
import zhTW from "./zh-TW";
import zhCN from "./zh-CN";

type TransKey = keyof typeof en;
type Translations = Record<TransKey, string>;

const locales: Record<string, Translations> = {
	en: en,
	"zh-tw": zhTW,
	zh: zhCN,
	"zh-cn": zhCN,
};

/**
 * Get translated string by key, with optional variable interpolation.
 * Language is auto-detected from Obsidian's locale setting.
 *
 * Usage:
 *   t("msg_verified", { name: file.name })
 *   t("settings_set_password")
 */
export function t(key: TransKey, vars?: Record<string, string>): string {
	const locale = moment.locale() ?? "en";
	const baseLang = locale.split("-")[0] ?? "en";
	const lang = locales[locale] ?? locales[baseLang] ?? en;
	const raw: string = lang[key] ?? en[key] ?? key;

	if (!vars) return raw;

	return raw.replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? `{${name}}`);
}

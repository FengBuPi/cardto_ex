export type Language = "en" | "zh"

interface TranslationRecord {
  [key: string]: string | TranslationRecord
}

const translations: Record<Language, TranslationRecord> = {
  zh: {
    common: {
      settings: "设置",
      language: "语言",
      copyButton: "复制当前页面为 Markdown",
      footer: "将任何网页复制为干净的 Markdown",
    },
    options: {
      deffudle: {
        title: "使用 Deffudle",
        description: "使用 Deffudle 进行内容解析，提供替代的解析方法。",
      },
      readability: {
        title: "使用 Mozilla Readability",
        description:
          "使用 Readability 解析网页内容，生成更清晰的 Markdown 输出",
      },
      wrapInTripleBackticks: {
        title: "用三个反引号包装",
        description: "用三个反引号包装复制的 Markdown 内容",
      },
      showSuccessToast: {
        title: "显示成功提示",
        description: "内容成功复制后显示通知提示",
      },
      showConfetti: {
        title: "显示 Raycast 庆祝动画",
        description:
          "复制成功后播放庆祝动画。提示：首次使用时 Chrome 可能会询问'打开 Raycast.app？'。访问 https://raycast.com/confetti 一次并勾选'始终允许 www.raycast.com 打开此类链接'以停止看到该提示。",
      },
    },
  },
  en: {
    common: {
      settings: "Settings",
      language: "Language",
      copyButton: "Copy current page as Markdown",
      footer: "Copy any web page to clean Markdown",
    },
    options: {
      deffudle: {
        title: "Use Deffudle",
        description:
          "Parse content using Deffudle as an alternative extraction method.",
      },
      readability: {
        title: "Use Mozilla Readability",
        description:
          "Parse page content with Readability to generate clearer Markdown output.",
      },
      wrapInTripleBackticks: {
        title: "Wrap with triple backticks",
        description: "Wrap copied Markdown content in triple backticks",
      },
      showSuccessToast: {
        title: "Show success notification",
        description: "Show a notification when content is copied successfully",
      },
      showConfetti: {
        title: "Show Raycast confetti",
        description:
          "Play a celebration animation after copy. Tip: The first time you use it, Chrome may ask 'Open Raycast.app?'. Visit https://raycast.com/confetti once and check 'Always allow www.raycast.com to open this kind of link' to stop seeing the prompt.",
      },
    },
  },
}

function getByPath(
  record: TranslationRecord,
  path: string,
): string | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as TranslationRecord)[key]
    }
    return undefined
  }, record) as string | undefined
}

export function createTranslator(language: Language) {
  return function t(key: string): string {
    const value = getByPath(translations[language], key)
    if (typeof value === "string") return value
    // Fallback to Chinese if key missing, then to key itself
    const fallback = getByPath(translations.zh, key)
    return typeof fallback === "string" ? fallback : key
  }
}

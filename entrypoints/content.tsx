import { Readability } from "@mozilla/readability"
import Defuddle from "defuddle"
import { Tiktoken } from "js-tiktoken/lite"
import o200k_base from "js-tiktoken/ranks/o200k_base"
import { createRoot } from "react-dom/client"
import Turndown from "turndown"
import { browser } from "wxt/browser"
import { getRoot, Noti, showNotification } from "@/lib/showNotification"
import { getOptions } from "@/lib/storage"
import { defaultTagsToRemove } from "@/lib/tagsToRemove"

const tiktoken = new Tiktoken(o200k_base)

// Utility to copy markdown to clipboard, respond to sender and optionally show toast/confetti
const copyAndNotify = async ({
  markdown,
  wrapInTripleBackticks,
  showSuccessToast,
  showConfetti,
  sendResponse,
  successMessagePrefix,
}: {
  markdown: string
  wrapInTripleBackticks: boolean
  showSuccessToast: boolean
  showConfetti: boolean
  sendResponse: (response: { success: boolean }) => void
  successMessagePrefix: string
}) => {
  if (wrapInTripleBackticks) {
    markdown = `\`\`\`md\n${markdown}\n\`\`\``
  }

  try {
    await navigator.clipboard.writeText(markdown)
  } catch (error) {
    // Fallback for when document is not focused (e.g., DevTools is open)
    const textarea = document.createElement("textarea")
    textarea.value = markdown
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
  }

  sendResponse({ success: true })

  const tokens = tiktoken.encode(markdown)

  if (showSuccessToast) {
    showNotification(`${successMessagePrefix} (${tokens.length} tokens)`)
  }

  if (showConfetti) {
    // Send a message to the background script to open the Raycast confetti URL
    browser.runtime.sendMessage({ type: "OPEN_CONFETTI" })
  }
}

export default defineContentScript({
  matches: ["*://*/*"],
  async main() {
    createRoot(getRoot()).render(<Noti />)

    browser.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
      if (msg.type === "COPY_TEXT") {
        const options = await getOptions()

        const {
          useReadability,
          showSuccessToast,
          showConfetti,
          useDeffudle,
          wrapInTripleBackticks,
        } = options

        const html = msg.payload

        let markdown = html

        if (useReadability) {
          const doc = new DOMParser().parseFromString(html, "text/html")
          doc.getElementById("cpdown-notification")?.remove()

          const article = new Readability(doc).parse()

          if (!article?.content) {
            return sendResponse({ success: false, error: "No article found" })
          }

          markdown = new Turndown({})
            .remove(defaultTagsToRemove)
            .turndown(article.content)
        } else if (useDeffudle) {
          try {
            const doc = new DOMParser().parseFromString(html, "text/html")
            doc.getElementById("cpdown-notification")?.remove()
            const defuddle = new Defuddle(doc, {
              debug: true,
              markdown: true,
              separateMarkdown: false,
            }).parse()

            markdown = new Turndown({})
              .remove(defaultTagsToRemove)
              .turndown(defuddle.content)
          } catch (error) {
            console.error("Error processing with Defuddle:", error)
            // Fallback to basic Turndown if Defuddle fails
            markdown = new Turndown({})
              .remove(defaultTagsToRemove)
              .turndown(html)
            sendResponse({
              success: false,
              error: "Defuddle processing failed",
            })
            return // Prevent further execution in case of Defuddle error
          }
        } else {
          markdown = new Turndown({})
            //
            .remove(defaultTagsToRemove)
            .turndown(html)
        }

        await copyAndNotify({
          markdown,
          wrapInTripleBackticks,
          showSuccessToast,
          showConfetti,
          sendResponse,
          successMessagePrefix: "Copied as markdown",
        })

        return true
      }

    })
  },
})

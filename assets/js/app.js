const INSTRUCTIONS_PATH = "PROJECT_INSTRUCTIONS.txt";

const chapters = [
  {
    slug: "introduction",
    title: "Introduction",
    pdf: "chapters/introduction/Introduction.pdf",
    knowledge: "chapters/introduction/Introduction_Knowledge.txt",
    available: true
  }
  // Add future readings using the same shape:
  // { slug: "chapter-01", title: "Chapter 1", pdf: "chapters/chapter-01/Chapter_01.pdf", knowledge: "chapters/chapter-01/Chapter_01_Knowledge.txt", available: true },
  // { slug: "chapter-02", title: "Chapter 2", pdf: "chapters/chapter-02/Chapter_02.pdf", knowledge: "chapters/chapter-02/Chapter_02_Knowledge.txt", available: true }
];

const providers = [
  { name: "ChatGPT", description: "Create a Project for an ongoing, source-based study.", url: "https://chatgpt.com/" },
  { name: "Gemini", description: "Study and discuss uploaded sources in Google's assistant.", url: "https://gemini.google.com/app" },
  { name: "Grok", description: "Explore the reading through a conversational assistant.", url: "https://grok.com/" },
  { name: "Perplexity", description: "Ask source-aware questions in a research-focused assistant.", url: "https://www.perplexity.ai/" }
];

const prompts = [
  "Walk me through the Introduction and identify Troutt's core argument.",
  "Give me five questions worth discussing with the guys from the Introduction.",
  "What parts of the Introduction deserve the most scrutiny biblically?",
  "Help me apply the Introduction personally without giving me generic advice.",
  "What competing definitions of masculinity does Troutt introduce?",
  "What does the Introduction suggest about shame and masculine formation?",
  "Where does Troutt distinguish biological maleness from masculinity, and what is he trying to accomplish with that distinction?",
  "Compare Troutt's argument so far with relevant biblical passages. Separate what the text explicitly says from theological inference."
];

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
let instructionText = "";
let toastTimer;

function showToast(message, isError = false) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.toggle("toast--error", isError);
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

async function loadInstructions() {
  if (instructionText) return instructionText;
  const response = await fetch(INSTRUCTIONS_PATH);
  if (!response.ok) throw new Error("Instructions could not be loaded.");
  instructionText = await response.text();
  $("#instructions-content").textContent = instructionText;
  $("#instruction-count").textContent = `${instructionText.length.toLocaleString()} characters — designed to fit within ChatGPT Project instruction limits.`;
  return instructionText;
}

async function copyText(text, successMessage = "Copied to clipboard.") {
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;opacity:0";
      document.body.append(area);
      area.select();
      if (!document.execCommand("copy")) throw new Error("Copy failed");
      area.remove();
    }
    showToast(successMessage);
    return true;
  } catch {
    showToast("Copy failed — open the preview and copy the text manually.", true);
    return false;
  }
}

async function copyInstructions() {
  try {
    const text = await loadInstructions();
    return copyText(text, "Study instructions copied — paste them into your AI workspace.");
  } catch {
    showToast("Instructions could not be loaded. Open the text file and copy it manually.", true);
    window.open(INSTRUCTIONS_PATH, "_blank", "noopener,noreferrer");
    return false;
  }
}

function renderProviders() {
  $("#ai-grid").innerHTML = providers.map((provider) => `<article class="ai-card">
    <div class="provider-mark" aria-hidden="true">${provider.name[0]}</div><h3>${provider.name}</h3><p>${provider.description}</p>
    <div class="card-actions"><a class="button button--ghost" href="${provider.url}" target="_blank" rel="noopener noreferrer" aria-label="Launch ${provider.name} in a new tab"><span class="button__label">Launch</span><span aria-hidden="true">↗</span></a><a class="text-button js-copy-launch" href="${provider.url}" target="_blank" rel="noopener noreferrer" data-provider="${provider.name}">Copy Instructions &amp; Launch</a></div>
  </article>`).join("");
}

function renderChapters() {
  const available = chapters.filter((chapter) => chapter.available);
  $("#chapter-list").innerHTML = available.map((chapter, index) => `<article class="chapter-card" data-slug="${chapter.slug}">
    <header><p class="eyebrow">Current reading · ${String(index + 1).padStart(2, "0")}</p><h3>${chapter.title}</h3></header>
    <div class="resources"><div><span>Book text</span><strong>${chapter.pdf.split("/").pop()}</strong><a class="button button--ghost" href="${chapter.pdf}" download>Download PDF <span aria-hidden="true">↓</span></a></div><div><span>Companion knowledge</span><strong>${chapter.knowledge.split("/").pop()}</strong><a class="button button--ghost" href="${chapter.knowledge}" download>Download Knowledge File <span aria-hidden="true">↓</span></a></div></div>
    <button class="button button--primary js-download-both" type="button" data-pdf="${chapter.pdf}" data-knowledge="${chapter.knowledge}">Download Both</button>
  </article>`).join("");
}

function renderPrompts() {
  $("#prompt-grid").innerHTML = prompts.map((prompt, index) => `<article class="prompt-card"><span>${String(index + 1).padStart(2, "0")}</span><p>“${prompt}”</p><button class="text-button js-copy-prompt" type="button" data-prompt="${prompt.replaceAll('"', '&quot;')}">Copy prompt</button></article>`).join("");
}

function downloadFile(path) {
  const link = document.createElement("a");
  link.href = path;
  link.download = "";
  document.body.append(link);
  link.click();
  link.remove();
}

renderProviders();
renderChapters();
renderPrompts();
loadInstructions().catch(() => {
  $("#instruction-count").innerHTML = `Instruction length available when served via GitHub Pages. <a href="${INSTRUCTIONS_PATH}" target="_blank">Open the file</a>.`;
  $("#instructions-content").textContent = "Instructions could not be loaded in this context. Open PROJECT_INSTRUCTIONS.txt directly.";
});

$("#ai-grid").addEventListener("click", (event) => {
  const link = event.target.closest(".js-copy-launch");
  if (!link) return;
  copyInstructions();
});

$("#prompt-grid").addEventListener("click", (event) => {
  const button = event.target.closest(".js-copy-prompt");
  if (button) copyText(button.dataset.prompt, "Prompt copied — paste it into your AI workspace.");
});

$("#chapter-list").addEventListener("click", (event) => {
  const button = event.target.closest(".js-download-both");
  if (!button) return;
  downloadFile(button.dataset.pdf);
  setTimeout(() => downloadFile(button.dataset.knowledge), 450);
  showToast("Both chapter files are downloading.");
});

$$(".js-copy-instructions").forEach((button) => button.addEventListener("click", copyInstructions));
const dialog = $("#instructions-dialog");
$$("[data-open-instructions]").forEach((button) => button.addEventListener("click", () => dialog.showModal()));
$$("[data-close-instructions]").forEach((button) => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

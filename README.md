# Authentic Masculinity — Men's Group AI Study Companion

A mobile-first static study hub for a men's group reading Seth Troutt's *Authentic Masculinity*. It gives every participant the same source material and study framework while letting each man create **his own private AI workspace**.

**Expected live site:** <https://domingos-s.github.io/Authentic-Masculinity/>

> The site distributes common files; it is not a shared chat. Questions, conversations, and personal reflections belong in each participant's own AI account.

## How group members use it

1. Open the live site and choose ChatGPT, Gemini, Grok, Perplexity, or another capable assistant.
2. Copy `PROJECT_INSTRUCTIONS.txt` into the assistant's project, workspace, or custom-instruction area when available.
3. Download and upload both files for the current reading: the PDF and companion Knowledge TXT file.
4. Start a conversation in your own workspace and use the sample prompts as a starting point.

For ChatGPT, create your own Project instead of joining a shared Project if you want personal study conversations to remain private from the group. Other assistants may use different names and features.

## Source model

Every reading has a pair of files:

- **Primary source PDF:** the actual book pages. It controls whenever wording, nuance, or attribution matters.
- **Companion Knowledge TXT:** a structured aid for argument flow, themes, examples, distinctions, retrieval notes, and discussion questions.

The AI should use both. If they differ, the PDF controls.

## Repository structure

```text
.
├── index.html
├── PROJECT_INSTRUCTIONS.txt
├── README.md
├── LICENSE
├── assets/
│   ├── css/styles.css
│   └── js/app.js
├── chapters/
│   └── introduction/
│       ├── Introduction.pdf
│       └── Introduction_Knowledge.txt
└── .github/workflows/pages.yml
```

## Add a future chapter

1. Create a directory such as `chapters/chapter-01/`.
2. Add the matching files, for example `Chapter_01.pdf` and `Chapter_01_Knowledge.txt`.
3. Add one entry to the `chapters` array near the top of `assets/js/app.js`:

```js
{
  slug: "chapter-01",
  title: "Chapter 1",
  pdf: "chapters/chapter-01/Chapter_01.pdf",
  knowledge: "chapters/chapter-01/Chapter_01_Knowledge.txt",
  available: true
}
```

Commented Chapter 1 and Chapter 2 examples are already included in the file. The page renders available chapter cards automatically; do not mark a chapter available until both files exist.

## Test locally

No install or build is required. Because browsers restrict `fetch()` from `file://` pages, use a tiny local web server to test instruction preview/copy behavior:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Basic layout and direct file links still work when `index.html` is opened directly, but fetched instruction content may be blocked by browser security rules.

## GitHub Pages deployment

`.github/workflows/pages.yml` deploys the repository root whenever `main` is updated. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions** if it is not already selected. No build command is needed.

## Copyright and distribution caution

These materials are intended only for group members who already have lawful access to the book. They should not be used as a substitute for obtaining the book or redistributed beyond the group.

**Before enabling a public GitHub Pages site, confirm that distributing copyrighted book-page PDFs in a public repository is appropriate.** A public repository and Pages deployment can make those PDFs publicly accessible. If distribution is not authorized, keep the repository private, restrict the source files as appropriate, or obtain permission. Do not delete the source PDF without coordinating with the study owner.

This is an unofficial men's-group study resource. *Authentic Masculinity* and the underlying book text belong to their respective copyright holders. This project is not affiliated with or endorsed by the author or publisher.

## Maintenance and contributions

- Keep `PROJECT_INSTRUCTIONS.txt` as the single source of truth; the frontend loads it rather than duplicating it.
- Keep each PDF beside its matching Knowledge TXT file.
- Check every new path and download before merging.
- Preserve the primary-source hierarchy in companion files and UI copy.
- Prefer small, dependency-free HTML, CSS, and JavaScript changes so the site remains durable.

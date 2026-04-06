# How to build a new page (with same nav & footer)

**Quick start:** Copy **`template-page.html`** and rename it. The template already links **`css/common.css`** and includes the header/footer placeholders and script.

## 1. Create your HTML file

Create a new file, e.g. `MyNewPage.html`, in the same folder as `index.html` (e.g. `ZannWebsite_2026/`). Or duplicate **`template-page.html`** and rename it.

## 2. Use this structure

- **Header:** `<div id="site-header"></div>` — the script replaces this with the content of `includes/header.html` (same nav as home).
- **Footer:** `<div id="site-footer"></div>` — the script injects `includes/footer.html` here.
- **CSS:** `<link rel="stylesheet" href="css/common.css">` in `<head>` so the header and footer look correct.

Example:

```html
<head>
    ...
    <link rel="stylesheet" href="css/common.css">
</head>
<body>
    <div id="site-header"></div>

    <main>Your content here</main>

    <div id="site-footer"></div>

    <script src="js/nav-footer.js"></script>
</body>
```

## 3. Checklist for each new page

- [ ] File is in the same folder as `index.html` (e.g. `ZannWebsite_2026/`).
- [ ] `<link rel="stylesheet" href="css/common.css">` in `<head>`.
- [ ] `<div id="site-header"></div>` right after `<body>`.
- [ ] Your content between the header and footer placeholders.
- [ ] `<div id="site-footer"></div>` before the script.
- [ ] `<script src="js/nav-footer.js"></script>` before `</body>`.

## 4. Test the page

Open the site through **a local server** (e.g. “Live Server” in VS Code, or `npx serve .` in the project folder), not by double‑clicking the HTML file. The nav and footer load with JavaScript; they won’t load when you open the file with `file://`.

---

**To change the navigation or footer later:**  
Edit only `includes/header.html` or `includes/footer.html`. All pages that use `js/nav-footer.js` will show the update.

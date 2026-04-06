# Shared header and footer

Use the **same navigation bar and footer** on every page.

## What you need on each page

| What | Where |
|------|--------|
| **Header HTML** | Loaded by script from `includes/header.html` |
| **Footer HTML** | Loaded by script from `includes/footer.html` |
| **Header + footer CSS** | Link `css/common.css` in `<head>` |

## How to use on a new page

1. **Link the shared CSS** in `<head>`:
   ```html
   <link rel="stylesheet" href="css/common.css">
   ```

2. **Add the placeholders** in your `<body>`:
   ```html
   <body>
       <div id="site-header"></div>

       <!-- Your page content here -->

       <div id="site-footer"></div>

       <script src="js/nav-footer.js"></script>
       <!-- Your other scripts below -->
   </body>
   ```

3. **Load the script**  
   The script replaces `#site-header` with the content of `includes/header.html` (promo bar + main nav, same structure as index.html), injects `includes/footer.html` into `#site-footer`, then initializes dropdowns and the mobile menu.

## Editing the nav or footer

- **Navigation / promo bar:** edit `includes/header.html`
- **Footer:** edit `includes/footer.html`

Changes will appear on every page that uses `js/nav-footer.js`.

## Note

`fetch()` needs the site to be served over HTTP (e.g. a local server). Opening the HTML file directly with `file://` may block loading the includes. Use a simple server (e.g. Live Server in VS Code, or `npx serve .`) when testing.

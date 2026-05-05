'use strict';

var fs = require('fs');
var path = require('path');

var root = __dirname;
var styleDir = path.join(root, 'styles');

function normalizeBasePath(input) {
  var value = (input || '/').trim();
  if (!value) value = '/';
  if (value.charAt(0) !== '/') value = '/' + value;
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
  return value;
}

var siteBase = normalizeBasePath(process.env.SITE_BASE || '/betterengineer');

function withBase(urlPath) {
  if (!urlPath || urlPath.charAt(0) !== '/') return urlPath;
  if (siteBase === '/') return urlPath;
  return siteBase + urlPath;
}

function normalizeHtmlPaths(html) {
  return html
    .replace(/(src|href)=["']\.\/([^"']*)["']/g, '$1="/$2"')
    .replace(/srcset=["']\.\/([^"']*)["']/g, 'srcset="/$1"')
    .replace(/href=["']\/react\.html["']/g, 'href="/technologies/react/"')
    .replace(/href=["']\/index\.html["']/g, 'href="/"')
    .replace(/href=["']\/["']/g, 'href="/"');
}

function applyBaseToHtml(html) {
  return html
    .replace(/(src|href)=["']\/(?!\/)([^"']*)["']/g, function (_, attr, value) {
      return attr + '="' + withBase('/' + value) + '"';
    })
    .replace(/srcset=["']\/(?!\/)([^"']*)["']/g, function (_, value) {
      return 'srcset="' + withBase('/' + value) + '"';
    });
}

function applyBaseToCss(css) {
  return css.replace(/url\((["'])\/(?!\/)([^"')]+)\1\)/g, function (_, quote, value) {
    return 'url(' + quote + withBase('/' + value) + quote + ')';
  });
}

function fixUrls(css) {
  return css
    .replace(/url\("\.\/images\//g, 'url("/images/')
    .replace(/url\('\.\/images\//g, "url('/images/");
}

function readStyles() {
  var brandPath = path.join(styleDir, 'brand.css');
  var reactPath = path.join(styleDir, 'react-landing.css');
  if (!fs.existsSync(brandPath)) {
    console.error('Missing brand.css at', brandPath);
    process.exit(1);
  }
  if (!fs.existsSync(reactPath)) {
    console.error('Missing react-landing.css at', reactPath);
    process.exit(1);
  }
  return {
    brand: applyBaseToCss(fixUrls(fs.readFileSync(brandPath, 'utf8'))),
    reactExtra: applyBaseToCss(fixUrls(fs.readFileSync(reactPath, 'utf8'))),
  };
}

function readFileSafe(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function writeFileSafe(relPath, contents) {
  var absPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, contents, 'utf8');
}

var styles = readStyles();

var reactMainPath = path.join(root, 'main-react.html');
if (!fs.existsSync(reactMainPath)) {
  console.error('Missing main-react.html (React landing <main> fragment).');
  process.exit(1);
}
var reactMain = normalizeHtmlPaths(fs.readFileSync(reactMainPath, 'utf8').trim());

var mainHome = normalizeHtmlPaths(readFileSafe('main-home.html').trim());
var footer = normalizeHtmlPaths(readFileSafe('footer-full.html').trim());

var headerHome =
  '  <header class="site-header" id="header">\n' +
  '    <div class="header-inner">\n' +
  '      <a class="logo-link" href="./" aria-label="BetterEngineer home">\n' +
  '        <img src="./icons/betterengineer-logo.svg" width="183" height="33" alt="BetterEngineer">\n' +
  '      </a>\n' +
  '      <nav class="site-nav" aria-label="Primary">\n' +
  '        <ul class="nav-desktop">\n' +
  '          <li>\n' +
  '            <a href="https://www.betterengineer.com/staff-augmentation">Services <span aria-hidden="true">▾</span></a>\n' +
  '            <ul class="dropdown">\n' +
  '              <li><a href="https://www.betterengineer.com/staff-augmentation">Staff Augmentation</a></li>\n' +
  '              <li><a href="https://www.betterengineer.com/ai-readiness">AI Readiness</a></li>\n' +
  '            </ul>\n' +
  '          </li>\n' +
  '          <li><a href="./react.html">React</a></li>\n' +
  '          <li><a href="https://www.betterengineer.com/hiring-dashboard">Platform</a></li>\n' +
  '          <li>\n' +
  '            <a href="https://www.betterengineer.com/about">About <span aria-hidden="true">▾</span></a>\n' +
  '            <ul class="dropdown">\n' +
  '              <li><a href="https://www.betterengineer.com/about">Who We Are</a></li>\n' +
  '              <li><a href="https://www.betterengineer.com/latamengineer">Why Nearshore</a></li>\n' +
  '            </ul>\n' +
  '          </li>\n' +
  '          <li>\n' +
  '            <a href="https://blog.betterengineer.com/resource-center">Resources <span aria-hidden="true">▾</span></a>\n' +
  '            <ul class="dropdown">\n' +
  '              <li><a href="https://blog.betterengineer.com/resource-center">Blog</a></li>\n' +
  '              <li><a href="https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent">FAQs</a></li>\n' +
  '              <li><a href="https://www.betterengineer.com/podcast">Podcast</a></li>\n' +
  '            </ul>\n' +
  '          </li>\n' +
  '        </ul>\n' +
  '      </nav>\n' +
  '      <div class="nav-cta">\n' +
  '        <a class="btn-nav btn-nav--ghost" href="https://www.betterengineer.com/join">Join Us</a>\n' +
  '        <a class="btn-nav btn-nav--solid" href="https://www.betterengineer.com/multi-step-contact-form">Hire Engineers</a>\n' +
  '        <a class="btn-nav btn-nav--ghost" href="https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F">Login</a>\n' +
  '      </div>\n' +
  '      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="mobile-menu" id="nav-toggle" aria-label="Open menu">\n' +
  '        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>\n' +
  '      </button>\n' +
  '    </div>\n' +
  '    <div class="nav-mobile" id="mobile-menu">\n' +
  '      <a href="./" class="is-active" aria-current="page">Home</a>\n' +
  '      <a href="./react.html">React</a>\n' +
  '      <a href="https://www.betterengineer.com/staff-augmentation">Staff Augmentation</a>\n' +
  '      <a href="https://www.betterengineer.com/ai-readiness">AI Readiness</a>\n' +
  '      <a href="https://www.betterengineer.com/hiring-dashboard">Platform</a>\n' +
  '      <a href="https://www.betterengineer.com/about">Who We Are</a>\n' +
  '      <a href="https://www.betterengineer.com/latamengineer">Why Nearshore</a>\n' +
  '      <a href="https://www.betterengineer.com/multi-step-contact-form">Hire Engineers</a>\n' +
  '    </div>\n' +
  '  </header>\n';

var headerReact =
  '  <header class="site-header" id="header">\n' +
  '    <div class="header-inner">\n' +
  '      <a class="logo-link" href="./" aria-label="BetterEngineer home">\n' +
  '        <img src="./icons/betterengineer-logo.svg" width="183" height="33" alt="BetterEngineer">\n' +
  '      </a>\n' +
  '      <nav class="site-nav" aria-label="Primary">\n' +
  '        <ul class="nav-desktop">\n' +
  '          <li>\n' +
  '            <a href="https://www.betterengineer.com/staff-augmentation">Services <span aria-hidden="true">▾</span></a>\n' +
  '            <ul class="dropdown">\n' +
  '              <li><a href="https://www.betterengineer.com/staff-augmentation">Staff Augmentation</a></li>\n' +
  '              <li><a href="https://www.betterengineer.com/ai-readiness">AI Readiness</a></li>\n' +
  '            </ul>\n' +
  '          </li>\n' +
  '          <li><a href="./react.html" class="is-active" aria-current="page">React</a></li>\n' +
  '          <li><a href="https://www.betterengineer.com/hiring-dashboard">Platform</a></li>\n' +
  '          <li>\n' +
  '            <a href="https://www.betterengineer.com/about">About <span aria-hidden="true">▾</span></a>\n' +
  '            <ul class="dropdown">\n' +
  '              <li><a href="https://www.betterengineer.com/about">Who We Are</a></li>\n' +
  '              <li><a href="https://www.betterengineer.com/latamengineer">Why Nearshore</a></li>\n' +
  '            </ul>\n' +
  '          </li>\n' +
  '          <li>\n' +
  '            <a href="https://blog.betterengineer.com/resource-center">Resources <span aria-hidden="true">▾</span></a>\n' +
  '            <ul class="dropdown">\n' +
  '              <li><a href="https://blog.betterengineer.com/resource-center">Blog</a></li>\n' +
  '              <li><a href="https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent">FAQs</a></li>\n' +
  '              <li><a href="https://www.betterengineer.com/podcast">Podcast</a></li>\n' +
  '            </ul>\n' +
  '          </li>\n' +
  '        </ul>\n' +
  '      </nav>\n' +
  '      <div class="nav-cta">\n' +
  '        <a class="btn-nav btn-nav--ghost" href="https://www.betterengineer.com/join">Join Us</a>\n' +
  '        <a class="btn-nav btn-nav--solid" href="https://www.betterengineer.com/multi-step-contact-form">Hire Engineers</a>\n' +
  '        <a class="btn-nav btn-nav--ghost" href="https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F">Login</a>\n' +
  '      </div>\n' +
  '      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="mobile-menu" id="nav-toggle" aria-label="Open menu">\n' +
  '        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>\n' +
  '      </button>\n' +
  '    </div>\n' +
  '    <div class="nav-mobile" id="mobile-menu">\n' +
  '      <a href="./">Home</a>\n' +
  '      <a href="./react.html" class="is-active">React</a>\n' +
  '      <a href="https://www.betterengineer.com/staff-augmentation">Staff Augmentation</a>\n' +
  '      <a href="https://www.betterengineer.com/ai-readiness">AI Readiness</a>\n' +
  '      <a href="https://www.betterengineer.com/hiring-dashboard">Platform</a>\n' +
  '      <a href="https://www.betterengineer.com/about">Who We Are</a>\n' +
  '      <a href="https://www.betterengineer.com/latamengineer">Why Nearshore</a>\n' +
  '      <a href="https://www.betterengineer.com/multi-step-contact-form">Hire Engineers</a>\n' +
  '    </div>\n' +
  '  </header>\n';

function shell(title, description, css, header, main, scriptName) {
  var html =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="utf-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n' +
    '  <title>' +
    title +
    '</title>\n' +
    '  <meta name="description" content="' +
    description.replace(/"/g, '&quot;') +
    '">\n' +
    '  <link rel="icon" href="./icons/favicon.png" type="image/png">\n' +
    '  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">\n' +
    '  <script>window._hsq = window._hsq || [];</script>\n' +
    '  <script id="hs-script-loader" async defer src="https://js.hs-scripts.com/8679235.js"></script>\n' +
    '  <style>\n' +
    css +
    '\n  </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '  <a class="skip-link" href="#main">Skip to content</a>\n' +
    '\n' +
    header +
    '\n' +
    main +
    '\n' +
    footer +
    '\n' +
    '  <script src="./' +
    scriptName +
    '" defer></script>\n' +
    '</body>\n' +
    '</html>\n';
  return applyBaseToHtml(normalizeHtmlPaths(html));
}

var homeCss =
  styles.brand +
  '\n\n/* Safe-area + overflow (subset of React landing #main rules) */\n#main { overflow-x: clip; }\n#main .wrap {\n  padding-left: max(1.25rem, env(safe-area-inset-left, 0px));\n  padding-right: max(1.25rem, env(safe-area-inset-right, 0px));\n}\n';

var indexHtml = shell(
  'BetterEngineer | Staff Augmentation & Engineering Talent',
  'Scale your team with vetted software engineers across the Americas. Staff augmentation, Slack integration, and the BetterEngineer hiring platform.',
  homeCss,
  headerHome,
  mainHome,
  'home.js',
);

var reactCss = styles.brand + '\n\n' + styles.reactExtra;

var reactHtml = shell(
  'React Engineers | BetterEngineer',
  'Hire senior React developers in your time zone. Staff augmentation, UI modernization, and shipping support from BetterEngineer.',
  reactCss,
  headerReact,
  reactMain,
  'react-page.js',
);

writeFileSafe('index.html', indexHtml);
writeFileSafe(path.join('technologies', 'react', 'index.html'), reactHtml);
writeFileSafe('react.html', reactHtml);
writeFileSafe('.nojekyll', '');
console.log('Wrote GitHub Pages build with base path:', siteBase);

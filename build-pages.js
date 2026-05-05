'use strict';

var fs = require('fs');
var path = require('path');

var root = __dirname;
var cursorStyles = path.join(root, '..', 'betterengineer-cursor-website', 'src', 'styles');

function fixUrls(css) {
  return css
    .replace(/url\("\/images\//g, 'url("./images/')
    .replace(/url\('\/images\//g, "url('./images/");
}

function readStyles() {
  var brandPath = path.join(cursorStyles, 'brand.css');
  var reactPath = path.join(cursorStyles, 'react-landing.css');
  if (!fs.existsSync(brandPath)) {
    console.error('Missing brand.css at', brandPath);
    process.exit(1);
  }
  if (!fs.existsSync(reactPath)) {
    console.error('Missing react-landing.css at', reactPath);
    process.exit(1);
  }
  return {
    brand: fixUrls(fs.readFileSync(brandPath, 'utf8')),
    reactExtra: fs.readFileSync(reactPath, 'utf8'),
  };
}

function readFileSafe(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

var styles = readStyles();

var oldIndex = readFileSafe('index.html');
var mainMatch = oldIndex.match(/<main id="main">([\s\S]*?)<\/main>/);
if (!mainMatch) {
  console.error('Could not extract <main> from index.html');
  process.exit(1);
}
var reactMain = '<main id="main">' + mainMatch[1] + '</main>';

var mainHome = readFileSafe('main-home.html').trim();
var footer = readFileSafe('footer-full.html').trim();

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
  return (
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
    '</html>\n'
  );
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

fs.writeFileSync(path.join(root, 'index.html'), indexHtml, 'utf8');
fs.writeFileSync(path.join(root, 'react.html'), reactHtml, 'utf8');
console.log('Wrote index.html (home) and react.html with inlined CSS.');

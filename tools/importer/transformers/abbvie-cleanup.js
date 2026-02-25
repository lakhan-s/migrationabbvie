/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie site cleanup. Selectors from captured DOM of
 * https://www.abbvie.com/who-we-are/our-leaders/robert-michael.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent / OneTrust banner (from captured DOM: #onetrust-consent-sdk)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // Remove empty navy blue hero background container (visual-only, no content)
    // From captured DOM: .container.large-radius.cmp-container-full-width
    const navyHeroBg = element.querySelector('.container.large-radius.cmp-container-full-width');
    if (navyHeroBg) navyHeroBg.remove();

    // Remove skip-to-content accessibility link (handled by EDS chrome)
    const skipLink = element.querySelector('a[href="#maincontent"]');
    if (skipLink) {
      const parent = skipLink.closest('p') || skipLink;
      parent.remove();
    }

    // Remove popup/modal dialogs (warn-on-leave, disclaimer overlays)
    WebImporter.DOMUtils.remove(element, [
      '.popup-overlay',
      '.modal',
      '[class*="popup"]',
      '[class*="modal"]',
    ]);

    // Remove duplicate overlap-predecessor containers (keep only the first = leader identity card)
    const overlapContainers = element.querySelectorAll('.container.overlap-predecessor');
    for (let i = 1; i < overlapContainers.length; i++) {
      overlapContainers[i].remove();
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable content (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.breadcrumb.abbvie-breadcrumb',
      'nav.cmp-breadcrumb',
      '.separator.separator-height-96',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove scroll-to-top button
    const scrollBtn = element.querySelector('button[class*="scroll"]');
    if (scrollBtn) scrollBtn.remove();

    // Remove tracking pixels (Twitter/X, analytics)
    element.querySelectorAll('img[src*="t.co"], img[src*="analytics.twitter.com"], img[src*="bing.com/c.gif"], img[src*="pixel"], img[src*="tracking"]').forEach((img) => {
      const parent = img.closest('p') || img;
      parent.remove();
    });

    // Remove warn-on-leave modal content (rendered after blocks)
    const allParagraphs = element.querySelectorAll('p');
    allParagraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (text === 'CLOSE'
        || text === 'No, I disagree'
        || text === 'Yes, I agree'
        || text.startsWith('You are about to leave')
        || text.startsWith('The product-specific site')
        || text.startsWith('Unless otherwise specified, all product names')) {
        p.remove();
      }
    });

    // Remove headings from modal dialogs
    element.querySelectorAll('h5').forEach((h5) => {
      if (h5.textContent.includes('You are about to leave')) h5.remove();
    });

    // Remove empty block tables (blocks that matched but had no meaningful content)
    // WebImporter.Blocks.createBlock uses th or td for header row
    element.querySelectorAll('table').forEach((table) => {
      const headerCell = table.querySelector('tr:first-child th') || table.querySelector('tr:first-child td');
      if (!headerCell) return;
      const blockName = headerCell.textContent.trim().toLowerCase();
      if (blockName.includes('hero') && blockName.includes('leader')) {
        // Check if block has content beyond the header row
        const contentRows = table.querySelectorAll('tr:not(:first-child)');
        let hasContent = false;
        contentRows.forEach((row) => {
          // textContent does not include HTML comments, so field hints are not counted
          const text = row.textContent.trim();
          if (text) hasContent = true;
        });
        if (!hasContent) table.remove();
      }
    });

    // Remove tracking attributes
    element.querySelectorAll('[data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
    });
    element.querySelectorAll('[data-cmp-clickable]').forEach((el) => {
      el.removeAttribute('data-cmp-clickable');
    });
  }
}

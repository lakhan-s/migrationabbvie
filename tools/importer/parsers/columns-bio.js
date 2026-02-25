/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-bio (AbbVie leader biography page).
 * Base block: columns. Source: https://www.abbvie.com/who-we-are/our-leaders/robert-michael.html
 *
 * Columns block structure (from block library):
 * - One row with N columns (cells side by side)
 * - Each cell can contain text, images, or inline elements
 *
 * Source DOM (from captured HTML):
 * - .grid.aem-GridColumn > .grid-container > .grid-row contains:
 *   - Column 1 (.grid-row__col-with-5:first-child): leader headshot image
 *   - Column 2 (.grid-row__col-with-5:nth-child(3)): bio text paragraphs + LinkedIn CTA
 *
 * UE Model fields: column1 (richtext), column2 (richtext)
 * xwalk: Columns blocks do NOT require field hints (per hinting.md Rule 4)
 */
export default function parse(element, { document }) {
  // Column 1: Leader headshot image
  const imageEl = element.querySelector('.cmp-image__image, .cmp-image img, img[alt*="headshot"], img[alt*="Michael"]');
  const col1 = [];
  if (imageEl) {
    col1.push(imageEl);
  }

  // Column 2: Bio text paragraphs + LinkedIn CTA
  const col2 = [];

  // Find the bio text container (second .grid-row__col-with-5)
  const gridCols = element.querySelectorAll('.grid-row__col-with-5');
  const bioCol = gridCols.length > 1 ? gridCols[1] : null;

  if (bioCol) {
    // Get all bio paragraphs
    const paragraphs = bioCol.querySelectorAll('.cmp-text p, p');
    paragraphs.forEach((p) => {
      if (p.textContent.trim()) {
        col2.push(p);
      }
    });

    // Get LinkedIn CTA link
    const ctaLink = bioCol.querySelector('.cmp-button, a[href*="linkedin"]');
    if (ctaLink) {
      col2.push(ctaLink);
    }
  } else {
    // Fallback: try to find bio content directly
    const textContainer = element.querySelector('.cmp-text');
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) col2.push(p);
      });
    }
    const ctaLink = element.querySelector('.cmp-button, a[href*="linkedin"]');
    if (ctaLink) col2.push(ctaLink);
  }

  // Columns block: one row with 2 cells (columns side by side)
  // Note: Columns blocks do NOT require field hints (xwalk exception per hinting.md)
  const cells = [[col1, col2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-bio', cells });
  element.replaceWith(block);
}

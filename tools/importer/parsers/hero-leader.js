/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-leader variant (AbbVie leader bio page).
 * Base block: hero. Source: https://www.abbvie.com/who-we-are/our-leaders/robert-michael.html
 *
 * Hero block structure (from block library):
 * - Row 1: Background image (optional) - SKIPPED for this variant (no bg image)
 * - Row 2: Content (heading, subheading, CTA)
 *
 * Source DOM (from captured HTML):
 * - .container.overlap-predecessor contains:
 *   - h1.cmp-title__text = leader name
 *   - .body-unica-32-reg or .cmp-text-xx-large p = role/title subtitle
 *
 * UE Model fields: content (richtext)
 * xwalk: field hints required (except collapsed fields)
 */
export default function parse(element, { document }) {
  // Extract heading (leader name) from captured DOM selectors
  const heading = element.querySelector('h1, .cmp-title__text');

  // Extract subtitle (role/title) from captured DOM selectors
  const subtitleSpan = element.querySelector('.body-unica-32-reg');
  const subtitleText = subtitleSpan
    ? subtitleSpan.closest('p') || subtitleSpan
    : element.querySelector('.cmp-text-xx-large p, .cmp-text p');

  // Build content cell with field hint (xwalk: content field)
  const contentCell = [];
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:content '));
  if (heading) frag.appendChild(heading);
  if (subtitleText) frag.appendChild(subtitleText);
  contentCell.push(frag);

  // Hero block: single column, content row only (no bg image for this variant)
  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-leader', cells });
  element.replaceWith(block);
}

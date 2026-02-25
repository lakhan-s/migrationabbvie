/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLeaderParser from './parsers/hero-leader.js';
import columnsBioParser from './parsers/columns-bio.js';

// TRANSFORMER IMPORTS
import abbvieCleanupTransformer from './transformers/abbvie-cleanup.js';
import abbvieSectionsTransformer from './transformers/abbvie-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'leader-bio',
  description: 'Leadership biography page featuring executive hero banner, bio content, and related links',
  urls: [
    'https://www.abbvie.com/who-we-are/our-leaders/robert-michael.html',
  ],
  blocks: [
    {
      name: 'hero-leader',
      instances: [
        '.container.large-radius.cmp-container-full-width',
        '.container.overlap-predecessor',
      ],
    },
    {
      name: 'columns-bio',
      instances: [
        '.grid.aem-GridColumn',
      ],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero Banner + Leader Identity',
      selector: [
        '.container.large-radius.cmp-container-full-width',
        '.container.overlap-predecessor',
      ],
      style: 'navy-blue',
      blocks: ['hero-leader'],
      defaultContent: [],
    },
    {
      id: 'section-bio',
      name: 'Biography Content',
      selector: '.grid.aem-GridColumn',
      style: null,
      blocks: ['columns-bio'],
      defaultContent: [],
    },
    {
      id: 'section-separator',
      name: 'Separator',
      selector: '.separator.separator-height-96',
      style: null,
      blocks: [],
      defaultContent: ['.separator.separator-height-96 hr'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-leader': heroLeaderParser,
  'columns-bio': columnsBioParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  abbvieCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [abbvieSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-leader-bio.js
  var import_leader_bio_exports = {};
  __export(import_leader_bio_exports, {
    default: () => import_leader_bio_default
  });

  // tools/importer/parsers/hero-leader.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector("h1, .cmp-title__text");
    const subtitleSpan = element.querySelector(".body-unica-32-reg");
    const subtitleText = subtitleSpan ? subtitleSpan.closest("p") || subtitleSpan : element.querySelector(".cmp-text-xx-large p, .cmp-text p");
    const contentCell = [];
    const frag = document2.createDocumentFragment();
    frag.appendChild(document2.createComment(" field:content "));
    if (heading) frag.appendChild(heading);
    if (subtitleText) frag.appendChild(subtitleText);
    contentCell.push(frag);
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-leader", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-bio.js
  function parse2(element, { document: document2 }) {
    const imageEl = element.querySelector('.cmp-image__image, .cmp-image img, img[alt*="headshot"], img[alt*="Michael"]');
    const col1 = [];
    if (imageEl) {
      col1.push(imageEl);
    }
    const col2 = [];
    const gridCols = element.querySelectorAll(".grid-row__col-with-5");
    const bioCol = gridCols.length > 1 ? gridCols[1] : null;
    if (bioCol) {
      const paragraphs = bioCol.querySelectorAll(".cmp-text p, p");
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) {
          col2.push(p);
        }
      });
      const ctaLink = bioCol.querySelector('.cmp-button, a[href*="linkedin"]');
      if (ctaLink) {
        col2.push(ctaLink);
      }
    } else {
      const textContainer = element.querySelector(".cmp-text");
      if (textContainer) {
        const paragraphs = textContainer.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) col2.push(p);
        });
      }
      const ctaLink = element.querySelector('.cmp-button, a[href*="linkedin"]');
      if (ctaLink) col2.push(ctaLink);
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-bio", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/abbvie-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      const navyHeroBg = element.querySelector(".container.large-radius.cmp-container-full-width");
      if (navyHeroBg) navyHeroBg.remove();
      const skipLink = element.querySelector('a[href="#maincontent"]');
      if (skipLink) {
        const parent = skipLink.closest("p") || skipLink;
        parent.remove();
      }
      WebImporter.DOMUtils.remove(element, [
        ".popup-overlay",
        ".modal",
        '[class*="popup"]',
        '[class*="modal"]'
      ]);
      const overlapContainers = element.querySelectorAll(".container.overlap-predecessor");
      for (let i = 1; i < overlapContainers.length; i++) {
        overlapContainers[i].remove();
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".breadcrumb.abbvie-breadcrumb",
        "nav.cmp-breadcrumb",
        ".separator.separator-height-96",
        "iframe",
        "link",
        "noscript"
      ]);
      const scrollBtn = element.querySelector('button[class*="scroll"]');
      if (scrollBtn) scrollBtn.remove();
      element.querySelectorAll('img[src*="t.co"], img[src*="analytics.twitter.com"], img[src*="bing.com/c.gif"], img[src*="pixel"], img[src*="tracking"]').forEach((img) => {
        const parent = img.closest("p") || img;
        parent.remove();
      });
      const allParagraphs = element.querySelectorAll("p");
      allParagraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text === "CLOSE" || text === "No, I disagree" || text === "Yes, I agree" || text.startsWith("You are about to leave") || text.startsWith("The product-specific site") || text.startsWith("Unless otherwise specified, all product names")) {
          p.remove();
        }
      });
      element.querySelectorAll("h5").forEach((h5) => {
        if (h5.textContent.includes("You are about to leave")) h5.remove();
      });
      element.querySelectorAll("table").forEach((table) => {
        const headerCell = table.querySelector("tr:first-child th") || table.querySelector("tr:first-child td");
        if (!headerCell) return;
        const blockName = headerCell.textContent.trim().toLowerCase();
        if (blockName.includes("hero") && blockName.includes("leader")) {
          const contentRows = table.querySelectorAll("tr:not(:first-child)");
          let hasContent = false;
          contentRows.forEach((row) => {
            const text = row.textContent.trim();
            if (text) hasContent = true;
          });
          if (!hasContent) table.remove();
        }
      });
      element.querySelectorAll("[data-cmp-data-layer]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
      });
      element.querySelectorAll("[data-cmp-clickable]").forEach((el) => {
        el.removeAttribute("data-cmp-clickable");
      });
    }
  }

  // tools/importer/transformers/abbvie-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const doc = element.ownerDocument || document;
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) {
          for (const sel of selectors) {
            sectionEl = doc.querySelector(sel);
            if (sectionEl) break;
          }
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-leader-bio.js
  var PAGE_TEMPLATE = {
    name: "leader-bio",
    description: "Leadership biography page featuring executive hero banner, bio content, and related links",
    urls: [
      "https://www.abbvie.com/who-we-are/our-leaders/robert-michael.html"
    ],
    blocks: [
      {
        name: "hero-leader",
        instances: [
          ".container.large-radius.cmp-container-full-width",
          ".container.overlap-predecessor"
        ]
      },
      {
        name: "columns-bio",
        instances: [
          ".grid.aem-GridColumn"
        ]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero Banner + Leader Identity",
        selector: [
          ".container.large-radius.cmp-container-full-width",
          ".container.overlap-predecessor"
        ],
        style: "navy-blue",
        blocks: ["hero-leader"],
        defaultContent: []
      },
      {
        id: "section-bio",
        name: "Biography Content",
        selector: ".grid.aem-GridColumn",
        style: null,
        blocks: ["columns-bio"],
        defaultContent: []
      },
      {
        id: "section-separator",
        name: "Separator",
        selector: ".separator.separator-height-96",
        style: null,
        blocks: [],
        defaultContent: [".separator.separator-height-96 hr"]
      }
    ]
  };
  var parsers = {
    "hero-leader": parse,
    "columns-bio": parse2
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_leader_bio_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_leader_bio_exports);
})();

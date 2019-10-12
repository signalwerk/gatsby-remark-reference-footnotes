// var util = require("mdast-util-toc");
// const fs = require("fs");
const yaml = require("js-yaml");
const visit = require("unist-util-visit");
const hastToHTML = require(`hast-util-to-html`);

// convert "in-string" to "inString"
const strToCamel = str => {
  return str.replace(/-(.)/g, (match, chr) => chr.toUpperCase());
};

// convert "{'in-key': val}" to "{'inKey': val}"
const keysToCamel = obj => {
  if (obj) {
    const newObj = {};
    Object.keys(obj).forEach(k => {
      newObj[strToCamel(k)] = obj[k];
    });
    return newObj;
  }
  return obj;
};

// in: ":group:text text"
// out: {group: 'group', text: 'text text'}
const getTextAndGroup = str => {
  var matches = str.match(/^:([^:]+):(.*)/);
  if (matches) {
    return {
      group: matches[1],
      text: matches[2]
    };
  }
  return {
    group: "default",
    text: str
  };
};

// render the html-tag for the occurrence of the reference
const renderInline = ({ index, group, label, prefs }) => {
  let ref;
  if (group !== "default") {
    ref = `${group}-${index}`;
  } else {
    ref = `${index}`;
  }
  return `<sup class="footnote-inline" id="use-ref-${ref}">${prefs.inlineTextPrefix ? prefs.inlineTextPrefix : ""}<a href="#ref-${ref}" class="footnote-inline-link">${
    prefs.inlineLinkPrefix ? prefs.inlineLinkPrefix : ""
  }${label}${prefs.inlineLinkSuffix ? prefs.inlineLinkSuffix : ""}</a>${prefs.inlineTextSuffix ? prefs.inlineTextSuffix : ""}</sup>`;
};

// render the html-tag in the footnote
const renderRef = ({ index, group, label, prefs }) => {
  let ref;
  if (group !== "default") {
    ref = `${group}-${index}`;
  } else {
    ref = `${index}`;
  }
  return `<span class="footnote-ref" id="ref-${ref}">${
    prefs.referenceTextPrefix ? prefs.referenceTextPrefix : ""
  }<a id="use-ref-${ref}" href="#use-ref-${ref}" class="footnote-ref-link">${
    prefs.referenceLinkPrefix ? prefs.referenceLinkPrefix : ""
  }${label}${
    prefs.referenceLinkSuffix ? prefs.referenceLinkSuffix : ""
  }</a>${
    prefs.referenceTextSuffix ? prefs.referenceTextSuffix : ""
  }</span>`;
};

// replace the referencing node with the html
const replaceRefNode = ({ node, index, group, prefs }) => {
  node.type = "html";
  node.value = renderInline({
    index,
    prefs,
    group,
    label: hastToHTML({
      type: "text",
      value: `${index}`
    })
  });
  node.children = null;
};

// transform each reference code block
const transformerRef = ({ markdownAST, index, prefs }) => {
  // holds the definitios (content) of the rerference
  const footnoteDefinitions = [];

  visit(markdownAST, `footnoteDefinition`, footnoteDefinition => {
    footnoteDefinitions.push(footnoteDefinition);
  });

  // final footnotes
  const footnotes = {};

  // change the inline footnotes
  visit(markdownAST, `footnote`, node => {
    let { group, text } = getTextAndGroup(node.children[0].value);
    if (prefs.groupInclude === group) {
      let newChildren = node.children;
      newChildren[0].value = text;
      footnotes[group] = footnotes[group] || [];
      footnotes[group].push({
        type: "footnote",
        children: newChildren
      });
      let index = footnotes[group].length;

      replaceRefNode({ node, group, index, prefs });
    }
  });

  // change the footnote references
  visit(markdownAST, `footnoteReference`, node => {
    let { group, text } = getTextAndGroup(node.identifier);
    if (prefs.groupInclude === group) {
      footnotes[group] = footnotes[group] || [];
      footnotes[group].push({
        type: "footnoteReference",
        identifier: node.identifier
      });
      let index = footnotes[group].length;

      replaceRefNode({ node, group, index, prefs });
    }
  });

  // the final references in the output
  let printReferences = [];

  Object.keys(footnotes)
    .filter(item => item === prefs.groupInclude)
    .forEach(key => {
      let footnoteList = footnotes[key];

      let list = {
        type: "list",
        spread: true, // add p tag arround content
        children: []
      };

      footnoteList.forEach((footnote, footnoteIndex) => {
        let content = [];

        let renderLinkRef = renderRef({
          index: `${footnoteIndex + 1}`,
          label: `${footnoteIndex + 1}`,
          group: prefs.groupInclude,
          prefs
        });

        if (footnote.type === "footnote") {
          content.push({
            type: "paragraph",
            children: [...footnote.children]
          });
        }
        if (footnote.type === "footnoteReference") {
          let def = footnoteDefinitions.find(
            item => item.identifier === footnote.identifier
          );
          if (def) {
            content.push(...def.children);
          }
        }

        // add the back-reference
        if (content.length > 0) {
          if ((prefs.referenceLinkPosition || "").toLowerCase() === "end") {
            content[0].children.push({
              type: "html",
              value: renderLinkRef
            });
          } else {
            content[0].children = [
              {
                type: "html",
                value: renderLinkRef
              },
              ...content[0].children
            ];
          }

          // add list item
          list.children.push({
            type: "listItem",
            children: content
          });
        }
      });
      // wrapper arround the whole list -- start
      printReferences.push({
        type: "html",
        value: `<div class="ref-notes refnotes--${prefs.groupInclude}">`
      });

      printReferences.push(list);
      // wrapper arround the whole list -- end
      printReferences.push({
        type: "html",
        value: `</div>`
      });
    });

  markdownAST.children = [].concat(
    markdownAST.children.slice(0, index),
    printReferences,
    markdownAST.children.slice(index + 1)
  );
};

const transformer = (markdownAST, pluginOptions) => {
  // fs.writeFileSync("./data-before.json", JSON.stringify(markdownAST, null, 2));

  // transform backwards all refs-code blocks
  for (let i = markdownAST.children.length - 1; i >= 0; --i) {
    let node = markdownAST.children[i];
    if (node.type === "code" && node.lang === "references") {
      // set prefs
      let prefs = {
        groupInclude: "default",
        referenceLinkPrefix: "↑ ",
        referenceLinkSuffix: ".",
        referenceTextSuffix: " ",
        ...keysToCamel(pluginOptions)
      };

      try {
        let parsePrefs = yaml.safeLoad(markdownAST.children[i].value);
        prefs = { ...prefs, ...keysToCamel(parsePrefs) };
      } catch (e) {
        console.log("Can't parse refs-configuration", e);
      }

      transformerRef({ markdownAST, index: i, prefs });
    }
  }

  // fs.writeFileSync("./data-after.json", JSON.stringify(markdownAST, null, 2));
};

module.exports = ({ markdownAST }, pluginOptions) => {
  return transformer(markdownAST, pluginOptions);
};

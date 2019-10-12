var remark = require("remark");
var html = require("remark-html");
var gatsbyFootnotes = require("../");
const fs = require("fs");

let data = fs.readFileSync("./index.md");

const footnotes = () => {
  return markdownAST =>
    gatsbyFootnotes(
      { markdownAST },
      {
        skip: "Table of Contents",
        tight: false,
        fromHeading: 1,
        toHeading: 6
      }
    );
};

remark()
  .use({
    settings: { footnotes: true, commonmark: true, emphasis: "*", strong: "*" }
  })
  .use(footnotes)
  .use(html)
  .process(data, function(err, file) {
    if (err) throw err;
    // console.log(String(file));
    fs.writeFileSync("./index.html", String(file));

  });

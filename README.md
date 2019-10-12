# Footnotes in Gatsby

[![Downloads][downloads-badge]][downloads]

[Gatsby][gatsby] plugin using [remark][remark] to generate footnotes.


## Installation

```sh
npm i gatsby-remark-reference-footnotes
```

## Options
### `group-include`

`string?` — default: `default`  
If a footnote reference starts with `:groupname:` the output can be filtered by this group-name.


### `reference-link-prefix`

`string?` — default: `↑ `
*Footnote:* in link before reference number

### `reference-link-suffix`

`string?` — default: `.`
*Footnote:* in link after reference number

### `reference-text-prefix`

`string?` — default: `''`
*Footnote:* text before reference link

### `reference-text-suffix`

`string?` — default: `' '`
*Footnote:* text after reference link



### `reference-link-position`

`string?` — default: `start` – options: `start`|`end`
*Footnote-Reference:* should the reference link be at the `start` or `end`

### `inline-link-prefix`

`string?` — default: `''`
*Footnote-Reference:* in link before inline number

### `inline-link-suffix`

`string?` — default: `''`
*Footnote-Reference:* in link after inline number

### `inline-text-prefix`

`string?` — default: `''`
*Footnote-Reference:* text before inline link

### `inline-text-suffix`

`string?` — default: `''`
*Footnote-Reference:* text after inline link





## Use
Generate footnotes:

````md
```references
# This code block gets replaced with footnotes
```
````

If you like to overwrite the global settings in place (camelCase or kebab-case):

````md
```references
# This code block gets replaced with footnotes
group-include: fig

inline-link-prefix: ' Fig. '
inline-link-suffix: '.'
inline-text-prefix: ' '
inline-text-suffix: ''

reference-link-position: end

reference-link-prefix:  ' Fig. '
reference-link-suffix:  '.⇡'
reference-text-prefix:  ' '
reference-text-suffix:  ''
```
````

## Global Configuration
Global configurations can be set in `gatsby-config.js`.

```js
module.exports = ({ root }) => ({
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-reference-footnotes`,
            options: {
              groupInclude: 'default',

              inlineLinkPrefix: '',
              inlineLinkSuffix: '',
              inlineTextPrefix: '',
              inlineTextSuffix: '',

              referenceLinkPosition: 'start',

              referenceLinkPrefix:  '↑ ',
              referenceLinkSuffix:  '.',
              referenceTextPrefix:  '',
              referenceTextSuffix:  ' '
            },
          }
        ],
      },
    },
  ],
})
```

## Example

### Input

````md
Text with inline footnote[^here the reference].

![Cat](http://placekitten.com/g/200/300)
*This is a cat [^:fig:From placekitten.com]*

Text with reference footnote[^test].


<!-- refs -->

[^:fig:test]: This is the named reference


## Footnotes

```references
# gets repalced with footnotes
```

## Figures

```references
# gets repalced with footnotes
group-include: fig
inline-link-prefix: 'Fig. '
reference-link-position: end
reference-link-prefix: ' Fig. '
reference-link-suffix: ' ⇡'
reference-text-prefix: ' '
```
````

### Output
<p>Text with inline footnote<sup class="footnote-inline" id="use-ref-1"><a href="#ref-1" class="footnote-inline-link">1</a></sup>.</p>
<p><img src="http://placekitten.com/g/200/300" alt="Cat">
<em>This is a cat <sup class="footnote-inline" id="use-ref-fig-1"><a href="#ref-fig-1" class="footnote-inline-link">Fig. 1</a></sup></em></p>
<p>Text with reference footnote<sup class="footnote-inline" id="use-ref-2"><a href="#ref-2" class="footnote-inline-link">2</a></sup>.</p>
<!-- refs -->
<h2>Footnotes</h2>
<div class="ref-notes refnotes--default">
<ul>
<li>
<p><span class="footnote-ref" id="ref-1"><a id="use-ref-1" href="#use-ref-1" class="footnote-ref-link">↑ 1.</a> </span>here the reference</p>
</li>
</ul>
</div>
<h2>Figures</h2>
<div class="ref-notes refnotes--fig">
<ul>
<li>
<p>From placekitten.com<span class="footnote-ref" id="ref-fig-1"> <a id="use-ref-fig-1" href="#use-ref-fig-1" class="footnote-ref-link"> Fig. 1 ⇡</a> </span></p>
</li>
</ul>
</div>

## License

[MIT][license] – [Stefan Huber][author]

<!-- Definitions -->


[gatsby]: https://www.gatsbyjs.org/
[remark]: https://github.com/remarkjs/remark
[downloads]: https://www.npmjs.com/package/gatsby-remark-reference-footnotes
[downloads-badge]: https://img.shields.io/npm/v/gatsby-remark-reference-footnotes.svg
[license]: https://opensource.org/licenses/MIT
[author]: http://signalwerk.ch/

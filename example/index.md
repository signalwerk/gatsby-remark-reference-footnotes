<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet">
<style>
  html {
    font-family: 'Open Sans', sans-serif;
    margin: 2rem;
  }
  img {
    display: block;
  }
</style>

Text with[^test] reference footnote[^test].
Text with inline footnote[^here the inline reference].

![Cat](http://placekitten.com/g/80/120)
_This is a cat [^:fig:pic]_

![Cat](http://placekitten.com/g/80/120)
_This is a second cat [^:fig:Reference from a different group]_

And here we reuse the footnote[^test].
Also a use of a Fig refernce [^:fig:pic].

<!-- refs -->

[^test]: This is the named reference
[^:fig:pic]: Reference from a group

### Footnotes

```references
# gets repalced with footnotes
```

### Figures

```references
# gets repalced with footnotes
group-include: fig
inline-link-prefix: 'Fig. '
reference-link-position: end
reference-link-prefix: ' Fig. '
reference-link-suffix: ' ⇡'
reference-text-prefix: ' '
```

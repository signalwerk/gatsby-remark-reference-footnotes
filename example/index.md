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
*This is a cat [^:fig:Reference from a different group]*

<!-- refs -->
[^test]: This is the named reference

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

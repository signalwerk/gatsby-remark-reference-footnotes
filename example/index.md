# Text

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

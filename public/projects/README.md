# Project images

Drop real project images here and reference them from `lib/projects.ts`.

```ts
{
  slug: "nimbus-banking",
  // ...
  image: "/projects/nimbus-banking.jpg",   // path is relative to /public
  imageAlt: "Nimbus banking app home screen",
}
```

When `image` is set, it replaces the generated gradient mockup on both the work grid
card and the case-study cover. If it's omitted, the built-in SVG mockup is used, so the
site always looks complete even before you have real screenshots.

**Recommended:** landscape images around **1600×900** (16:9), optimised (JPG/WebP) and
under ~300 KB each for fast loads. The grid crops to fill, so keep the focal point centred.

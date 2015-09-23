---
layout: post
title: Responsive Height
---

It's been a while since we released an update to the Ideal Image Slider (pretty much exactly a year). However today we released
[v1.5.0](https://github.com/gilbitron/Ideal-Image-Slider/releases/tag/1.5.0) which is a big update that finally brings
**responsive height** to the Ideal Image Slider!

One of our biggest bug-bears in the past was that the width of the slider was "responsive" but the height of the slider could only be a
fixed px value (unless you implemented your own media queries using CSS). This was obviously not ideal. In v1.5.0 we've changed the
default height setting to `'auto'` which changes the height of the slider to show the whole image depending on the width of the slider.
You can also now specify an aspect ratio as a height (e.g. `'16:9'`) which means the height of the slider will maintain this ratio depending
on the width of the slider.

These two new height modes now mean that the Ideal Image Slider is truly "responsive" and it feels great. We also added two new settings
which support these new height modes, `initialHeight` and `maxHeight` (see [the docs](https://github.com/gilbitron/Ideal-Image-Slider#settings))
for more info.
# Ideal Image Slider - Captions Extension

Adds captions support to the Ideal Image Slider.

## Requirements

* [Ideal Image Slider](https://github.com/gilbitron/Ideal-Image-Slider) v1.3.0+

## Usage

Captions are taken from the `alt` attribute of the image tag or, if defined, the `data-caption`
attribute. The `data-caption` attribute will override the `alt` attribute. You can add an optional
title to your caption which is taken from the `title` attribute of the image tag.

While you can put HTML in the `alt` attribute it is better to create an external caption in a separate
div and put the selector in the `data-caption` attribute (e.g. `data-caption="#my-caption"`). Make sure
and hide the external caption container so it is not visible on the page.

```html
<div id="slider">
    <img src="img/1.jpg" title="Baloons" alt="This is the caption content">
    <img data-src="img/2.jpg" src="" title="Skateboard" alt="Captions <em>can</em> contain <strong>HTML</strong>">
    <img data-src="img/3.jpg" src="" alt="This will be overridden" data-caption="#caption-3">
    <img data-src="img/4.jpg" src="" title="A title without a caption" alt="">
</div>

<div id="caption-3" style="display:none;">
    <h3>External Caption</h3>
    <p>When using <a href="#">HTML in captions</a> it might be better to use an external caption.</p>
</div>
```

The `iis-captions.js` must be included after `ideal-image-slider.js`. The styles for the captions
extension are included in the theme CSS.

```html
<script src="ideal-image-slider.js"></script>
<script src="extensions/captions/iis-captions.js"></script>
<script>
var slider = new IdealImageSlider.Slider('#slider');
slider.addCaptions();
slider.start();
</script>
```

# Ideal Image Slider - Bullet Navigation Extension

Adds bullet navigation to the Ideal Image Slider.

## Requirements

* [Ideal Image Slider](https://github.com/gilbitron/Ideal-Image-Slider) v1.2.0+

## Usage

The `iis-bullet-nav.js` must be included after `ideal-image-slider.js`. The styles for the bullet navigation
extension are included in the theme CSS.

```html
<script src="ideal-image-slider.js"></script>
<script src="extensions/bullet-nav/iis-bullet-nav.js"></script>
<script>
var slider = new IdealImageSlider.Slider('#slider');
slider.addBulletNav();
slider.start();
</script>
```

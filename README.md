# Ideal Image Slider

The aim behind the Ideal Image Slider is to create a slider which has just the right amount of features,
with no bloat and be easy to extend so that more features can be added as "extensions". Here are the ideals
and core features I wanted to include:

* HTML5 (SEO optimised)
* CSS3 transitions (a few simple transitions like slide/fade)
* Left/Right navigation (including touch/swipe support)
* Responsive
* HiDPI (retina) support
* ARIA support
* Extremely simple to setup (no dependencies)
* Very extensible
* Uses progressive enhancement
* Open source (goes without saying)

And, as an example, here are some features that *should not* be in the core and could be optional extensions:

* Themes or skins
* More transitions
* Bullet navigation
* Thumbnail navigation
* Full screen slider
* Video/Audio support
* etc...

[Read the original blog post &rarr;](http://gilbert.pellegrom.me/the-ideal-image-slider)

## Demos

* [Standard Slider](http://idealimageslider.com/demo/standard-slider.html)
* [With Links](http://idealimageslider.com/demo/links.html)
* [Using the API](http://idealimageslider.com/demo/using-the-api.html)
* [Using Events](http://idealimageslider.com/demo/using-events.html)
* [Multiple Sliders](http://idealimageslider.com/demo/multiple-sliders.html)

## Extensions

* [Bullet Navigation](https://github.com/gilbitron/Ideal-Image-Slider/tree/master/extensions/bullet-nav)
* [Captions](https://github.com/gilbitron/Ideal-Image-Slider/tree/master/extensions/captions)
* [Third Party Extensions](https://github.com/gilbitron/Ideal-Image-Slider/wiki/Third-Party-Extensions)

## Requirements

* **None**

Ideal Image Slider is written in vanilla JS and has no dependancies.

## Getting Started

To install the slider you can either manually download this repository or you can use [Bower](http://bower.io)
and run the following command:

```
bower install ideal-image-slider --save
```

Next you need to include the CSS file in the `<head>` section of your HTML and you need to include the script
before the `</body>` tag in your HTML. Note you can optionally include a theme CSS file in the `<head>` too.

```html
<html>
<head>
	...
	<link rel="stylesheet" href="/path/to/ideal-image-slider.css">
	<link rel="stylesheet" href="/path/to/themes/default/default.css">
	...
</head>
<body>
	...
	<script src="/path/to/ideal-image-slider.js"></script>
</body>
</html>
```

Next you need to set up your slider HTML where you want it to appear in your page. It should look something
like this:

```html
<div id="slider">
	<img src="img/1.jpg" alt="Minimum required attributes">
	<img data-src="img/2.jpg" src="" alt="Use data-src for on-demand loading">
	<img data-src="img/3.jpg" data-src-2x="img/3@2x.jpg" src="" alt="Use data-src-2x for HiDPI devices">
	<a href="http://example.com"><img data-src="img/4.jpg" src="" alt="Links work too"></a>
	...
</div>
```

There a few things to note about the structure of the images in your slider:

* This is an image slider, so only images are supported. Any other content will be removed.
* You can use the `data-src` attribute to load your images "on-demand" (i.e. images are not loaded until they are required).
* The first image should not use `data-src` so it is loaded if no JS is detected.
* If you specify a `data-src-2x` image, it will be used on devices that support HiDPI (such as Apple's retina devices).

Finally you can create your slider by using the following Javascript:

```js
new IdealImageSlider.Slider('#slider');
```

If you want to tweak the settings or use the slider API it would look more like:

```js
var slider = new IdealImageSlider.Slider({
	selector: '#slider',
	height: 400, // Required but can be set by CSS
	interval: 4000
});
slider.start();
```

Note: If you don't pass a `height` to the Javascript constructor you **must** set it
in your CSS.

## Settings

|Setting|Default Value|Description|
|---|---|---|
|selector|`''`|CSS selector for the slider|
|height|`'auto'`|Height of the slider. Can be `'auto'` (height changes depending on the height of the slide), a fixed px value (e.g. `400`) or an aspect ratio (e.g. `'16:9'`)|
|initialHeight|`400`|If height is `'auto'` or an aspect ratio this is the height of the slider while the first image is loading|
|maxHeight|`null`|If height is `'auto'` or an aspect ratio this is an optional max height in px for the slider (e.g. `800`)|
|interval|`4000`|Time (in ms) to wait before changing to the next slide|
|transitionDuration|`700`|Duration (in ms) of animated transition|
|effect|`'slide'`|Transition effect (slide/fade by default)|
|disableNav|`false`|Toggle the previous/next navigation (also disables touch and keyboard navigation)|
|keyboardNav|`true`|Toggle keyboard navigation|
|previousNavSelector|`''`|Selector for custom previous nav element|
|nextNavSelector|`''`|Selector for custom next nav element|
|classes|`{...}`|List of classes to be used by slider. Probably shouldn't be changed|

## Events

Event callback functions can be passed in with the settings. For example:

```js
new IdealImageSlider.Slider({
	selector: '#slider',
	onStart: function(){
		console.log('onStart');
	}
});
```

|Event|Description|
|---|---|
|onInit|Callback that fires when slider and first image have loaded|
|onStart|Callback that fires when slider has started playing|
|onStop|Callback that fires when slider has stopped playing|
|onDestroy|Callback that fires when slider is destroyed|
|beforeChange|Callback that fires before a slide has changed|
|afterChange|Callback that fires after a slide has changed|

## API

To use the API methods you must store the slider object. For example:

```js
var slider = new IdealImageSlider.Slider('#slider');
slider.start();
```

|Method|Description|
|---|---|
|start()|Start the slider. Note the slider will automatically be stopped when navigation is used|
|stop()|Stop the slider|
|previousSlide()|Change to the previous slide|
|nextSlide()|Change to the next slide|
|gotoSlide(index)|Change to a specific slide (1 indexed)|
|destroy()|Destroy the slider|
|get(attribute)|Get an attribute value (attributes are mostly used internally)|
|set(attribute, value)|Set an attribute. Can be useful for storing custom data|

## Browsers

Ideal Image Slider has been tested on:

* Chrome
* Firefox
* Safari (Desktop + Mobile)
* Opera
* IE9+

## Contribute

So you want to help out? That's awesome. Here is how you can do it:

* [Report a bug](https://github.com/gilbitron/Ideal-Image-Slider/labels/bug)
* [Ask for a feature](https://github.com/gilbitron/Ideal-Image-Slider/labels/enhancement)
* [Submit a pull request](https://github.com/gilbitron/Ideal-Image-Slider/pulls)

If you are submitting a pull request please adhere to the existing coding standards used throughout the code
and only submit **1 feature/fix per pull request**. Pull requests containing multiple changes will be rejected.

Note that if you submit a pull request you are aware that you are contributing to both the free (open source) version
and the proprietary (commercial) version of the codebase and that your work may make money for Dev7studios.

## Credits

Ideal Image Slider was created by [Gilbert Pellegrom](http://gilbert.pellegrom.me) from
[Dev7studios](http://dev7studios.com). Released under the [GPL license](https://raw.githubusercontent.com/gilbitron/Ideal-Image-Slider/master/LICENSE).

## Other Projects

Check-out other stuff that we are working on : 

* [ThemeIsle](https://themeisle.com)
* [Codeinwp](https://codeinwp.com/blog/)
* [Revive.social](https://revive.social)
* [Mystock.photos](http://mystock.photos)

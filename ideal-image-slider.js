/*
 * Ideal Image Slider v1.5.1
 *
 * By Gilbert Pellegrom
 * http://gilbert.pellegrom.me
 *
 * Copyright (C) 2014 Dev7studios
 * https://raw.githubusercontent.com/gilbitron/Ideal-Image-Slider/master/LICENSE
 */

var IdealImageSlider = (function() {
	"use strict";

	/*
	 * requestAnimationFrame polyfill
	 */
	var _requestAnimationFrame = function(win, t) {
		return win["r" + t] || win["webkitR" + t] || win["mozR" + t] || win["msR" + t] || function(fn) {
			setTimeout(fn, 1000 / 60);
		};
	}(window, 'equestAnimationFrame');

	/**
	 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
	 * @param {function} fn The callback function
	 * @param {int} delay The delay in milliseconds
	 */
	var _requestTimeout = function(fn, delay) {
		var start = new Date().getTime(),
			handle = {};

		function loop() {
			var current = new Date().getTime(),
				delta = current - start;

			if (delta >= delay) {
				fn.call();
			} else {
				handle.value = _requestAnimationFrame(loop);
			}
		}

		handle.value = _requestAnimationFrame(loop);
		return handle;
	};

	/*
	 * Helper functions
	 */
	var _isType = function(type, obj) {
		var _class = Object.prototype.toString.call(obj).slice(8, -1);
		return obj !== undefined && obj !== null && _class === type;
	};

	var _isInteger = function(x) {
		return Math.round(x) === x;
	};

	var _deepExtend = function(out) {
		out = out || {};
		for (var i = 1; i < arguments.length; i++) {
			var obj = arguments[i];
			if (!obj)
				continue;
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (_isType('Object', obj[key]) && obj[key] !== null)
						_deepExtend(out[key], obj[key]);
					else
						out[key] = obj[key];
				}
			}
		}
		return out;
	};

	var _hasClass = function(el, className) {
		if (!className) return false;
		if (el.classList) {
			return el.classList.contains(className);
		} else {
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
	};

	var _addClass = function(el, className) {
		if (!className) return;
		if (el.classList) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	};

	var _removeClass = function(el, className) {
		if (!className) return;
		if (el.classList) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	};

	var _toArray = function(obj) {
		return Array.prototype.slice.call(obj);
	};

	var _arrayRemove = function(array, from, to) {
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		return array.push.apply(array, rest);
	};

	var _addEvent = function(object, type, callback) {
		if (object === null || typeof(object) === 'undefined') return;

		if (object.addEventListener) {
			object.addEventListener(type, callback, false);
		} else if (object.attachEvent) {
			object.attachEvent("on" + type, callback);
		} else {
			object["on" + type] = callback;
		}
	};

	var _loadImg = function(slide, callback) {
		if (!slide.style.backgroundImage) {
			var img = new Image();
			img.setAttribute('src', slide.getAttribute('data-src'));
			img.onload = function() {
				slide.style.backgroundImage = 'url(' + slide.getAttribute('data-src') + ')';
				slide.setAttribute('data-actual-width', this.naturalWidth);
				slide.setAttribute('data-actual-height', this.naturalHeight);
				if (typeof(callback) === 'function') callback(this);
			};
		}
	};

	var _isHighDPI = function() {
		var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
		if (window.devicePixelRatio > 1)
			return true;
		if (window.matchMedia && window.matchMedia(mediaQuery).matches)
			return true;
		return false;
	};

	var _translate = function(slide, dist, speed) {
		slide.style.webkitTransitionDuration =
			slide.style.MozTransitionDuration =
			slide.style.msTransitionDuration =
			slide.style.OTransitionDuration =
			slide.style.transitionDuration = speed + 'ms';

		slide.style.webkitTransform =
			slide.style.MozTransform =
			slide.style.msTransform =
			slide.style.OTransform = 'translateX(' + dist + 'px)';
	};

	var _unTranslate = function(slide) {
		slide.style.removeProperty('-webkit-transition-duration');
		slide.style.removeProperty('transition-duration');

		slide.style.removeProperty('-webkit-transform');
		slide.style.removeProperty('-ms-transform');
		slide.style.removeProperty('transform');
	};

	var _animate = function(item) {
		var duration = item.time,
			end = +new Date() + duration;

		var step = function() {
			var current = +new Date(),
				remaining = end - current;

			if (remaining < 60) {
				item.run(1); //1 = progress is at 100%
				return;
			} else {
				var progress = 1 - remaining / duration;
				item.run(progress);
			}

			_requestAnimationFrame(step);
		};
		step();
	};

	var _setContainerHeight = function(slider, shouldAnimate) {
		if (typeof shouldAnimate === 'undefined') {
			shouldAnimate = true;
		}

		// If it's a fixed height then don't change the height
		if (_isInteger(slider.settings.height)) {
			return;
		}

		var currentHeight = Math.round(slider._attributes.container.offsetHeight),
			newHeight = currentHeight;

		if (slider._attributes.aspectWidth && slider._attributes.aspectHeight) {
			// Aspect ratio
			newHeight = (slider._attributes.aspectHeight / slider._attributes.aspectWidth) * slider._attributes.container.offsetWidth;
		} else {
			// Auto
			var width = slider._attributes.currentSlide.getAttribute('data-actual-width');
			var height = slider._attributes.currentSlide.getAttribute('data-actual-height');

			if (width && height) {
				newHeight = (height / width) * slider._attributes.container.offsetWidth;
			}
		}

		var maxHeight = parseInt(slider.settings.maxHeight, 10);
		if (maxHeight && newHeight > maxHeight) {
			newHeight = maxHeight;
		}

		newHeight = Math.round(newHeight);
		if (newHeight === currentHeight) {
			return;
		}

		if (shouldAnimate) {
			_animate({
				time: slider.settings.transitionDuration,
				run: function(progress) {
					slider._attributes.container.style.height = Math.round(progress * (newHeight - currentHeight) + currentHeight) + 'px';
				}
			});
		} else {
			slider._attributes.container.style.height = newHeight + 'px';
		}
	};

	var _touch = {

		vars: {
			start: {},
			delta: {},
			isScrolling: undefined,
			direction: null
		},

		start: function(event) {
			if (_hasClass(this._attributes.container, this.settings.classes.animating)) return;

			var touches = event.touches[0];
			_touch.vars.start = {
				x: touches.pageX,
				y: touches.pageY,
				time: +new Date()
			};
			_touch.vars.delta = {};
			_touch.vars.isScrolling = undefined;
			_touch.vars.direction = null;

			this.stop(); // Stop slider

			this.settings.beforeChange.apply(this);
			_addClass(this._attributes.container, this.settings.classes.touching);
		},

		move: function(event) {
			if (_hasClass(this._attributes.container, this.settings.classes.animating)) return;
			// Ensure swiping with one touch and not pinching
			if (event.touches.length > 1 || event.scale && event.scale !== 1) return;

			var touches = event.touches[0];
			_touch.vars.delta = {
				x: touches.pageX - _touch.vars.start.x,
				y: touches.pageY - _touch.vars.start.y
			};

			if (typeof _touch.vars.isScrolling == 'undefined') {
				_touch.vars.isScrolling = !!(_touch.vars.isScrolling || Math.abs(_touch.vars.delta.x) < Math.abs(_touch.vars.delta.y));
			}

			// If user is not trying to scroll vertically
			if (!_touch.vars.isScrolling) {
				event.preventDefault(); // Prevent native scrolling

				_translate(this._attributes.previousSlide, _touch.vars.delta.x - this._attributes.previousSlide.offsetWidth, 0);
				_translate(this._attributes.currentSlide, _touch.vars.delta.x, 0);
				_translate(this._attributes.nextSlide, _touch.vars.delta.x + this._attributes.currentSlide.offsetWidth, 0);
			}
		},

		end: function(event) {
			if (_hasClass(this._attributes.container, this.settings.classes.animating)) return;

			var duration = +new Date() - _touch.vars.start.time;

			// Determine if slide attempt triggers next/prev slide
			var isChangeSlide = Number(duration) < 250 && Math.abs(_touch.vars.delta.x) > 20 || Math.abs(_touch.vars.delta.x) > this._attributes.currentSlide.offsetWidth / 2;

			var direction = _touch.vars.delta.x < 0 ? 'next' : 'previous';
			var speed = this.settings.transitionDuration ? this.settings.transitionDuration / 2 : 0;

			// If not scrolling vertically
			if (!_touch.vars.isScrolling) {
				if (isChangeSlide) {
					_touch.vars.direction = direction;

					if (_touch.vars.direction == 'next') {
						_translate(this._attributes.currentSlide, -this._attributes.currentSlide.offsetWidth, speed);
						_translate(this._attributes.nextSlide, 0, speed);
					} else {
						_translate(this._attributes.previousSlide, 0, speed);
						_translate(this._attributes.currentSlide, this._attributes.currentSlide.offsetWidth, speed);
					}

					_requestTimeout(_touch.transitionEnd.bind(this), speed);
				} else {
					// Slides return to original position
					if (direction == 'next') {
						_translate(this._attributes.currentSlide, 0, speed);
						_translate(this._attributes.nextSlide, this._attributes.currentSlide.offsetWidth, speed);
					} else {
						_translate(this._attributes.previousSlide, -this._attributes.previousSlide.offsetWidth, speed);
						_translate(this._attributes.currentSlide, 0, speed);
					}
				}

				if (speed) {
					_addClass(this._attributes.container, this.settings.classes.animating);
					_requestTimeout(function() {
						_removeClass(this._attributes.container, this.settings.classes.animating);
					}.bind(this), speed);
				}
			}
		},

		transitionEnd: function(event) {
			if (_touch.vars.direction) {
				_unTranslate(this._attributes.previousSlide);
				_unTranslate(this._attributes.currentSlide);
				_unTranslate(this._attributes.nextSlide);
				_removeClass(this._attributes.container, this.settings.classes.touching);

				_removeClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
				_removeClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
				_removeClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
				this._attributes.currentSlide.setAttribute('aria-hidden', 'true');

				var slides = this._attributes.slides,
					index = slides.indexOf(this._attributes.currentSlide);

				if (_touch.vars.direction == 'next') {
					this._attributes.previousSlide = this._attributes.currentSlide;
					this._attributes.currentSlide = slides[index + 1];
					this._attributes.nextSlide = slides[index + 2];
					if (typeof this._attributes.currentSlide === 'undefined' &&
						typeof this._attributes.nextSlide === 'undefined') {
						this._attributes.currentSlide = slides[0];
						this._attributes.nextSlide = slides[1];
					} else {
						if (typeof this._attributes.nextSlide === 'undefined') {
							this._attributes.nextSlide = slides[0];
						}
					}

					_loadImg(this._attributes.nextSlide);
				} else {
					this._attributes.nextSlide = this._attributes.currentSlide;
					this._attributes.previousSlide = slides[index - 2];
					this._attributes.currentSlide = slides[index - 1];
					if (typeof this._attributes.currentSlide === 'undefined' &&
						typeof this._attributes.previousSlide === 'undefined') {
						this._attributes.currentSlide = slides[slides.length - 1];
						this._attributes.previousSlide = slides[slides.length - 2];
					} else {
						if (typeof this._attributes.previousSlide === 'undefined') {
							this._attributes.previousSlide = slides[slides.length - 1];
						}
					}

					_loadImg(this._attributes.previousSlide);
				}

				_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
				_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
				_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
				this._attributes.currentSlide.setAttribute('aria-hidden', 'false');

				_setContainerHeight(this);
				this.settings.afterChange.apply(this);
			}
		}

	};

	/*
	 * Slider class
	 */
	var Slider = function(args) {
		// Defaults
		this.settings = {
			selector: '',
			height: 'auto', // "auto" | px value (e.g. 400) | aspect ratio (e.g. "16:9")
			initialHeight: 400, // for "auto" and aspect ratio
			maxHeight: null, // for "auto" and aspect ratio
			interval: 4000,
			transitionDuration: 700,
			effect: 'slide',
			disableNav: false,
			keyboardNav: true,
			previousNavSelector: '',
			nextNavSelector: '',
			classes: {
				container: 'ideal-image-slider',
				slide: 'iis-slide',
				previousSlide: 'iis-previous-slide',
				currentSlide: 'iis-current-slide',
				nextSlide: 'iis-next-slide',
				previousNav: 'iis-previous-nav',
				nextNav: 'iis-next-nav',
				animating: 'iis-is-animating',
				touchEnabled: 'iis-touch-enabled',
				touching: 'iis-is-touching',
				directionPrevious: 'iis-direction-previous',
				directionNext: 'iis-direction-next'
			},
			onInit: function() {},
			onStart: function() {},
			onStop: function() {},
			onDestroy: function() {},
			beforeChange: function() {},
			afterChange: function() {}
		};
		this.length = 0;

		// Parse args
		if (typeof args === 'string') {
			this.settings.selector = args;
		} else if (typeof args === 'object') {
			_deepExtend(this.settings, args);
		}

		// Slider (container) element
		var sliderEl = false,
			rquickExpr =  /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
			selectionType = rquickExpr.exec( this.settings.selector ),
			s, elem;
		
		// Handle ID, Name, and Class selection
		if ((s = selectionType[1])) {
			// getElementById can match elements by name instead of ID
			if ((elem = document.getElementById( s )) && elem.id === s)
				sliderEl = elem;
		} else if (selectionType[2]) {
			if ((elem = document.getElementsByTagName( this.settings.selector )))
				sliderEl = elem[0];
		} else if ((s = selectionType[1])) {
			if ((elem = document.getElementsByClassName( s )))
				sliderEl = elem[0];
		} else {
			sliderEl = document.querySelector(this.settings.selector);
		}

		if (!sliderEl) {
			return null;
		}

		//Add loading class
		_addClass(sliderEl, 'iis-loading');

		// Slides
		var origChildren = _toArray(sliderEl.cloneNode(true).children), //ensure slideEl is a static nodeList
			validSlides = [];
		sliderEl.innerHTML = '';
		Array.prototype.forEach.call(origChildren, function(slide, i) {
			if (slide instanceof HTMLImageElement || slide instanceof HTMLAnchorElement) {
				var slideEl = document.createElement('a'),
					href = '',
					target = '';

				if (slide instanceof HTMLAnchorElement) {
					href = slide.getAttribute('href');
					target = slide.getAttribute('target');

					var img = slide.querySelector('img');
					if (img !== null) {
						slide = img;
					} else {
						return;
					}
				}

				if (typeof slide.dataset !== 'undefined') {
					_deepExtend(slideEl.dataset, slide.dataset);
					if (slide.dataset.src) {
						// Use data-src for on-demand loading
						slideEl.dataset.src = slide.dataset.src;
					} else {
						slideEl.dataset.src = slide.src;
					}

					// HiDPI support
					if (_isHighDPI() && slide.dataset['src-2x']) {
						slideEl.dataset.src = slide.dataset['src-2x'];
					}
				} else {
					// IE
					if (slide.getAttribute('data-src')) {
						slideEl.setAttribute('data-src', slide.getAttribute('data-src'));
					} else {
						slideEl.setAttribute('data-src', slide.getAttribute('src'));
					}
				}

				if (href) slideEl.setAttribute('href', href);
				if (target) slideEl.setAttribute('target', target);
				if (slide.getAttribute('className')) _addClass(slideEl, slide.getAttribute('className'));
				if (slide.getAttribute('id')) slideEl.setAttribute('id', slide.getAttribute('id'));
				if (slide.getAttribute('title')) slideEl.setAttribute('title', slide.getAttribute('title'));
				if (slide.getAttribute('alt')) slideEl.innerHTML = slide.getAttribute('alt');
				slideEl.setAttribute('role', 'tabpanel');
				slideEl.setAttribute('aria-hidden', 'true');

				slideEl.style.cssText += '-webkit-transition-duration:' + this.settings.transitionDuration + 'ms;-moz-transition-duration:' + this.settings.transitionDuration + 'ms;-o-transition-duration:' + this.settings.transitionDuration + 'ms;transition-duration:' + this.settings.transitionDuration + 'ms;';

				sliderEl.appendChild(slideEl);
				validSlides.push(slideEl);
			}
		}.bind(this));

		var slides = validSlides;
		if (slides.length <= 1) {
			sliderEl.innerHTML = '';
			Array.prototype.forEach.call(origChildren, function(child, i) {
				sliderEl.appendChild(child);
			});
			return null;
		}

		// Set length
		this.length = 1;

		// Create navigation
		if (!this.settings.disableNav) {
			var previousNav, nextNav;
			if (this.settings.previousNavSelector) {
				previousNav = document.querySelector(this.settings.previousNavSelector);
			} else {
				previousNav = document.createElement('a');
				sliderEl.appendChild(previousNav);
			}
			if (this.settings.nextNavSelector) {
				nextNav = document.querySelector(this.settings.nextNavSelector);
			} else {
				nextNav = document.createElement('a');
				sliderEl.appendChild(nextNav);
			}

			_addClass(previousNav, this.settings.classes.previousNav);
			_addClass(nextNav, this.settings.classes.nextNav);
			_addEvent(previousNav, 'click', function() {
				if (_hasClass(this._attributes.container, this.settings.classes.animating)) return false;
				this.stop();
				this.previousSlide();
			}.bind(this));
			_addEvent(nextNav, 'click', function() {
				if (_hasClass(this._attributes.container, this.settings.classes.animating)) return false;
				this.stop();
				this.nextSlide();
			}.bind(this));

			// Touch Navigation
			if ( (typeof jQuery !== 'undefined' && typeof(jQuery.supportsTrueHover)) == 'function' ?
				!jQuery.supportsTrueHover() :
				!!('ontouchstart' in window) 
				|| !!('ontouchstart' in document.documentElement) 
				|| !!window.ontouchstart 
				|| (!!window.Touch && !!window.Touch.length) 
				|| !!window.onmsgesturechange || (window.DocumentTouch && window.document instanceof window.DocumentTouch)) {
				this.settings.effect = 'slide';
				previousNav.style.display = 'none';
				nextNav.style.display = 'none';
				_addClass(sliderEl, this.settings.classes.touchEnabled);

				_addEvent(sliderEl, 'touchstart', _touch.start.bind(this), false);
				_addEvent(sliderEl, 'touchmove', _touch.move.bind(this), false);
				_addEvent(sliderEl, 'touchend', _touch.end.bind(this), false);
			}

			// Keyboard Navigation
			if (this.settings.keyboardNav) {
				_addEvent(document, 'keyup', function(e) {
					e = e || window.event;
					var button = (typeof e.which == 'number') ? e.which : e.keyCode;
					if (button == 37) {
						if (_hasClass(this._attributes.container, this.settings.classes.animating)) return false;
						this.stop();
						this.previousSlide();
					} else if (button == 39) {
						if (_hasClass(this._attributes.container, this.settings.classes.animating)) return false;
						this.stop();
						this.nextSlide();
					}
				}.bind(this));
			}
		}

		// Create internal attributes
		this._attributes = {
			container: sliderEl,
			slides: slides,
			previousSlide: typeof slides[slides.length - 1] !== 'undefined' ? slides[slides.length - 1] : slides[0],
			currentSlide: slides[0],
			nextSlide: typeof slides[1] !== 'undefined' ? slides[1] : slides[0],
			timerId: 0,
			origChildren: origChildren, // Used in destroy()
			aspectWidth: 0,
			aspectHeight: 0
		};

		// Set height
		if (_isInteger(this.settings.height)) {
			this._attributes.container.style.height = this.settings.height + 'px';
		} else {
			if (_isInteger(this.settings.initialHeight)) {
				this._attributes.container.style.height = this.settings.initialHeight + 'px';
			}

			// If aspect ratio parse and store
			if (this.settings.height.indexOf(':') > -1) {
				var aspectRatioParts = this.settings.height.split(':');
				if (aspectRatioParts.length == 2 && _isInteger(parseInt(aspectRatioParts[0], 10)) && _isInteger(parseInt(aspectRatioParts[1], 10))) {
					this._attributes.aspectWidth = parseInt(aspectRatioParts[0], 10);
					this._attributes.aspectHeight = parseInt(aspectRatioParts[1], 10);
				}
			}

			_addEvent(window, 'resize', function() {
				_setContainerHeight(this, false);
			}.bind(this));
		}

		// Add classes
		_addClass(sliderEl, this.settings.classes.container);
		_addClass(sliderEl, 'iis-effect-' + this.settings.effect);
		Array.prototype.forEach.call(this._attributes.slides, function(slide, i) {
			_addClass(slide, this.settings.classes.slide);
		}.bind(this));
		_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);

		// ARIA
		this._attributes.currentSlide.setAttribute('aria-hidden', 'false');

		// Load first image
		_loadImg(this._attributes.currentSlide, (function() {
			this.settings.onInit.apply(this);
			_setContainerHeight(this, false);
		}).bind(this));
		// Preload next images
		_loadImg(this._attributes.previousSlide);
		_loadImg(this._attributes.nextSlide);

		//Remove loading class
		_removeClass(sliderEl, 'iis-loading');
		_addClass(sliderEl, 'iis-loaded');
	};

	Slider.prototype.get = function(attribute) {
		if (!this._attributes) return null;
		if (this._attributes.hasOwnProperty(attribute)) {
			return this._attributes[attribute];
		}
	};

	Slider.prototype.set = function(attribute, value) {
		if (!this._attributes) return null;
		return (this._attributes[attribute] = value);
	};

	Slider.prototype.start = function() {
		if (!this._attributes) return;
		this._attributes.timerId = setInterval(this.nextSlide.bind(this), this.settings.interval);
		this.settings.onStart.apply(this);

		// Stop if window blur
		window.onblur = function() {
			this.stop();
		}.bind(this);
	};

	Slider.prototype.stop = function() {
		if (!this._attributes) return;
		clearInterval(this._attributes.timerId);
		this._attributes.timerId = 0;
		this.settings.onStop.apply(this);
	};

	Slider.prototype.previousSlide = function() {
		this.settings.beforeChange.apply(this);
		_removeClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		_removeClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_removeClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		this._attributes.currentSlide.setAttribute('aria-hidden', 'true');

		var slides = this._attributes.slides,
			index = slides.indexOf(this._attributes.currentSlide);
		this._attributes.nextSlide = this._attributes.currentSlide;
		this._attributes.previousSlide = slides[index - 2];
		this._attributes.currentSlide = slides[index - 1];
		if (typeof this._attributes.currentSlide === 'undefined' &&
			typeof this._attributes.previousSlide === 'undefined') {
			this._attributes.currentSlide = slides[slides.length - 1];
			this._attributes.previousSlide = slides[slides.length - 2];
		} else {
			if (typeof this._attributes.previousSlide === 'undefined') {
				this._attributes.previousSlide = slides[slides.length - 1];
			}
		}

		// Preload next image
		_loadImg(this._attributes.previousSlide);

		_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		this._attributes.currentSlide.setAttribute('aria-hidden', 'false');

		_addClass(this._attributes.container, this.settings.classes.directionPrevious);
		_requestTimeout(function() {
			_removeClass(this._attributes.container, this.settings.classes.directionPrevious);
		}.bind(this), this.settings.transitionDuration);

		if (this.settings.transitionDuration) {
			_addClass(this._attributes.container, this.settings.classes.animating);
			_requestTimeout(function() {
				_removeClass(this._attributes.container, this.settings.classes.animating);
			}.bind(this), this.settings.transitionDuration);
		}

		_setContainerHeight(this);
		this.settings.afterChange.apply(this);
	};

	Slider.prototype.nextSlide = function() {
		this.settings.beforeChange.apply(this);
		_removeClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		_removeClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_removeClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		this._attributes.currentSlide.setAttribute('aria-hidden', 'true');

		var slides = this._attributes.slides,
			index = slides.indexOf(this._attributes.currentSlide);
		this._attributes.previousSlide = this._attributes.currentSlide;
		this._attributes.currentSlide = slides[index + 1];
		this._attributes.nextSlide = slides[index + 2];
		if (typeof this._attributes.currentSlide === 'undefined' &&
			typeof this._attributes.nextSlide === 'undefined') {
			this._attributes.currentSlide = slides[0];
			this._attributes.nextSlide = slides[1];
		} else {
			if (typeof this._attributes.nextSlide === 'undefined') {
				this._attributes.nextSlide = slides[0];
			}
		}

		// Preload next image
		_loadImg(this._attributes.nextSlide);

		_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		this._attributes.currentSlide.setAttribute('aria-hidden', 'false');

		_addClass(this._attributes.container, this.settings.classes.directionNext);
		_requestTimeout(function() {
			_removeClass(this._attributes.container, this.settings.classes.directionNext);
		}.bind(this), this.settings.transitionDuration);

		if (this.settings.transitionDuration) {
			_addClass(this._attributes.container, this.settings.classes.animating);
			_requestTimeout(function() {
				_removeClass(this._attributes.container, this.settings.classes.animating);
			}.bind(this), this.settings.transitionDuration);
		}

		_setContainerHeight(this);
		this.settings.afterChange.apply(this);
	};

	Slider.prototype.gotoSlide = function(index) {
		this.settings.beforeChange.apply(this);
		this.stop();

		_removeClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		_removeClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_removeClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		this._attributes.currentSlide.setAttribute('aria-hidden', 'true');

		index--; // Index should be 1-indexed
		var slides = this._attributes.slides,
			oldIndex = slides.indexOf(this._attributes.currentSlide);
		this._attributes.previousSlide = slides[index - 1];
		this._attributes.currentSlide = slides[index];
		this._attributes.nextSlide = slides[index + 1];
		if (typeof this._attributes.previousSlide === 'undefined') {
			this._attributes.previousSlide = slides[slides.length - 1];
		}
		if (typeof this._attributes.nextSlide === 'undefined') {
			this._attributes.nextSlide = slides[0];
		}

		// Load images
		_loadImg(this._attributes.previousSlide);
		_loadImg(this._attributes.currentSlide);
		_loadImg(this._attributes.nextSlide);

		_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		this._attributes.currentSlide.setAttribute('aria-hidden', 'false');

		if (index < oldIndex) {
			_addClass(this._attributes.container, this.settings.classes.directionPrevious);
			_requestTimeout(function() {
				_removeClass(this._attributes.container, this.settings.classes.directionPrevious);
			}.bind(this), this.settings.transitionDuration);
		} else {
			_addClass(this._attributes.container, this.settings.classes.directionNext);
			_requestTimeout(function() {
				_removeClass(this._attributes.container, this.settings.classes.directionNext);
			}.bind(this), this.settings.transitionDuration);
		}

		if (this.settings.transitionDuration) {
			_addClass(this._attributes.container, this.settings.classes.animating);
			_requestTimeout(function() {
				_removeClass(this._attributes.container, this.settings.classes.animating);
			}.bind(this), this.settings.transitionDuration);
		}

		_setContainerHeight(this);
		this.settings.afterChange.apply(this);
	};

	Slider.prototype.destroy = function() {
		clearInterval(this._attributes.timerId);
		this._attributes.timerId = 0;

		this._attributes.container.innerHTML = '';
		Array.prototype.forEach.call(this._attributes.origChildren, function(child, i) {
			this._attributes.container.appendChild(child);
		}.bind(this));

		_removeClass(this._attributes.container, this.settings.classes.container);
		_removeClass(this._attributes.container, 'iis-effect-' + this.settings.effect);
		this._attributes.container.style.height = '';

		this.settings.onDestroy.apply(this);
	};

	return {
		_hasClass: _hasClass,
		_addClass: _addClass,
		_removeClass: _removeClass,
		Slider: Slider
	};

})();

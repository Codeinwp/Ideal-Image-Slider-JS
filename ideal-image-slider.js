var IdealImageSlider = (function() {
	"use strict";

	/*
	 * Helper functions
	 */
	var _deepExtend = function(out) {
		out = out || {};
		for(var i = 1; i < arguments.length; i++){
			var obj = arguments[i];
			if(!obj)
				continue;
			for(var key in obj){
				if(obj.hasOwnProperty(key)){
					if(typeof obj[key] === 'object')
						deepExtend(out[key], obj[key]);
					else
						out[key] = obj[key];
				}
			}
		}
		return out;
	};

	var _addClass = function(el, className) {
		if(el.classList){
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	};

	var _removeClass = function(el, className) {
		if(el.classList){
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	};

	var _toArray = function(obj) {
		return Array.prototype.slice.call(obj);
	}

	/*
	 * Slider class
	 */
	var Slider = function(args) {
		// Defaults
		this.settings = {
			selector: '',
			interval: 4000,
			effect: 'slide',
			height: null, // Override auto height
			disableNav: false,
			previousNavSelector: '',
			nextNavSelector: '',
			classes: {
				container: 'ideal-image-slider',
				slide: 'iis-slide',
				previousSlide: 'iis-previous-slide',
				currentSlide: 'iis-current-slide',
				nextSlide: 'iis-next-slide',
				previousNav: 'iis-previous-nav',
				nextNav: 'iis-next-nav'
			},
			onInit: function(){},
			onStart: function(){},
			onStop: function(){},
			beforeChange: function(){},
			afterChange: function(){}
		}

		// Parse args
		if(typeof args === 'string'){
			this.settings.selector = args;
		}
		else if(typeof args === 'object'){
			_deepExtend(this.settings, args);
		}

		var sliderEl = document.querySelector(this.settings.selector);
		if(!sliderEl) return null;
		var slides = _toArray(sliderEl.children);
		if(slides.length <= 1) return null;

		// Create navigation
		if(!this.settings.disableNav){
			var previousNav, nextNav;
			if(this.settings.previousNavSelector){
				previousNav = document.querySelector(this.settings.previousNavSelector);
			} else {
				previousNav = document.createElement('a');
				sliderEl.appendChild(previousNav);
			}
			if(this.settings.nextNavSelector){
				nextNav = document.querySelector(this.settings.nextNavSelector);
			} else {
				nextNav = document.createElement('a');
				sliderEl.appendChild(nextNav);
			}

			_addClass(previousNav, this.settings.classes.previousNav);
			_addClass(nextNav, this.settings.classes.nextNav);
			previousNav.addEventListener('click', (function(){
				this.stop();
				this.previousSlide();
			}).bind(this));
			nextNav.addEventListener('click', (function(){
				this.stop();
				this.nextSlide();
			}).bind(this));
		}

		// Create internal attributes
		this._attributes = {
			container: sliderEl,
			slides: slides,
			previousSlide: typeof slides[slides.length-1] !== 'undefined' ? slides[slides.length-1] : slides[0],
			currentSlide: slides[0],
			nextSlide: typeof slides[1] !== 'undefined' ? slides[1] : slides[0],
			timerId: 0
		};

		// Add classes
		_addClass(sliderEl, this.settings.classes.container);
		_addClass(sliderEl, 'iis-effect-'+ this.settings.effect);
		Array.prototype.forEach.call(this._attributes.slides, function(slide, i){
			_addClass(slide, this.settings.classes.slide);
		}.bind(this));
		_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);

		// Set height
		var height = this.settings.height ? this.settings.height : this._attributes.currentSlide.height;
		this._attributes.container.style.height = height +'px';

		this.settings.onInit.apply(this);
	};

	Slider.prototype.refreshHeight = function() {
		var height = this.settings.height ? this.settings.height : this._attributes.currentSlide.height;
		this._attributes.container.style.height = height +'px';
	};

	Slider.prototype.get = function(attribute) {
		if(this._attributes.hasOwnProperty(attribute)){
			return this._attributes[attribute];
		}
	};

	Slider.prototype.set = function(attribute, value) {
		return (this._attributes[attribute] = value);
	};

	Slider.prototype.start = function() {
		this._attributes.timerId = setInterval(this.nextSlide.bind(this), this.settings.interval);
		this.settings.onStart.apply(this);
	};

	Slider.prototype.stop = function() {
		clearInterval(this._attributes.timerId);
		this._attributes.timerId = 0;
		this.settings.onStop.apply(this);
	};

	Slider.prototype.previousSlide = function() {
		this.settings.beforeChange.apply(this);
		_removeClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_removeClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		_removeClass(this._attributes.previousSlide, this.settings.classes.previousSlide);

		var slides = this._attributes.slides,
			index = slides.indexOf(this._attributes.currentSlide);
		this._attributes.nextSlide = this._attributes.currentSlide;
		this._attributes.previousSlide = slides[index-2];
		this._attributes.currentSlide = slides[index-1];
		if(typeof this._attributes.currentSlide === 'undefined' &&
		typeof this._attributes.previousSlide === 'undefined'){
			this._attributes.currentSlide = slides[slides.length-1];
			this._attributes.previousSlide = slides[slides.length-2];
		} else {
			if(typeof this._attributes.previousSlide === 'undefined'){
				this._attributes.previousSlide = slides[slides.length-1];
			}
		}

		_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);

		this.refreshHeight();
		this.settings.afterChange.apply(this);
	};

	Slider.prototype.nextSlide = function() {
		this.settings.beforeChange.apply(this);
		_removeClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_removeClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		_removeClass(this._attributes.previousSlide, this.settings.classes.previousSlide);

		var slides = this._attributes.slides,
			index = slides.indexOf(this._attributes.currentSlide);
		this._attributes.previousSlide = this._attributes.currentSlide;
		this._attributes.currentSlide = slides[index+1];
		this._attributes.nextSlide = slides[index+2];
		if(typeof this._attributes.currentSlide === 'undefined' &&
		   typeof this._attributes.nextSlide === 'undefined'){
			this._attributes.currentSlide = slides[0];
			this._attributes.nextSlide = slides[1];
		} else {
			if(typeof this._attributes.nextSlide === 'undefined'){
				this._attributes.nextSlide = slides[0];
			}
		}

		_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);

		this.refreshHeight();
		this.settings.afterChange.apply(this);
	};

	Slider.prototype.gotoSlide = function(index) {
		this.settings.beforeChange.apply(this);
		_removeClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_removeClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		_removeClass(this._attributes.previousSlide, this.settings.classes.previousSlide);

		index--; // Index should be 1-indexed
		var slides = this._attributes.slides;
		this._attributes.previousSlide = slides[index-1];
		this._attributes.currentSlide = slides[index];
		this._attributes.nextSlide = slides[index+1];
		if(typeof this._attributes.previousSlide === 'undefined'){
			this._attributes.previousSlide = slides[slides.length-1];
		}
		if(typeof this._attributes.nextSlide === 'undefined'){
			this._attributes.nextSlide = slides[0];
		}

		_addClass(this._attributes.currentSlide, this.settings.classes.currentSlide);
		_addClass(this._attributes.nextSlide, this.settings.classes.nextSlide);
		_addClass(this._attributes.previousSlide, this.settings.classes.previousSlide);
		this.settings.afterChange.apply(this);
	};

	return {
		Slider: Slider
	};

})();

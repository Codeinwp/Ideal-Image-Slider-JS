QUnit.test('Slider.get', function(assert){
	var slider = new IdealImageSlider.Slider('.slider-default');
	assert.ok(slider.get('currentSlide'), 'Get existing value');
	assert.equal(slider.get('nonExistingValue'), null, 'Get non-existing value');
});

QUnit.test('Slider.set', function(assert){
	var slider = new IdealImageSlider.Slider('.slider-default');
	slider.set('someValue', '123');
	assert.equal(slider.get('someValue'), '123', 'Set value');
});

QUnit.test('Slider.previousSlide', function(assert){
	var slider = new IdealImageSlider.Slider('.slider-default');
	slider.previousSlide();
	assert.equal(slider.get('previousSlide').dataset.index, 3, 'Previous slide URL index is 3');
	assert.equal(slider.get('currentSlide').dataset.index, 4, 'Current slide URL index is 4');
	assert.equal(slider.get('nextSlide').dataset.index, 1, 'Next slide URL index is 1');
	slider.previousSlide();
	slider.previousSlide();
	assert.equal(slider.get('previousSlide').dataset.index, 1, 'Previous slide URL index is 1');
	assert.equal(slider.get('currentSlide').dataset.index, 2, 'Current slide URL index is 2');
	assert.equal(slider.get('nextSlide').dataset.index, 3, 'Next slide URL index is 3');
	slider.previousSlide();
	assert.equal(slider.get('previousSlide').dataset.index, 4, 'Previous slide URL index is 4');
	assert.equal(slider.get('currentSlide').dataset.index, 1, 'Current slide URL index is 1');
	assert.equal(slider.get('nextSlide').dataset.index, 2, 'Next slide URL index is 2');
});

QUnit.test('Slider.nextSlide', function(assert){
	var slider = new IdealImageSlider.Slider('.slider-default');
	slider.nextSlide();
	assert.equal(slider.get('previousSlide').dataset.index, 1, 'Previous slide URL index is 1');
	assert.equal(slider.get('currentSlide').dataset.index, 2, 'Current slide URL index is 2');
	assert.equal(slider.get('nextSlide').dataset.index, 3, 'Next slide URL index is 3');
	slider.nextSlide();
	slider.nextSlide();
	assert.equal(slider.get('previousSlide').dataset.index, 3, 'Previous slide URL index is 3');
	assert.equal(slider.get('currentSlide').dataset.index, 4, 'Current slide URL index is 4');
	assert.equal(slider.get('nextSlide').dataset.index, 1, 'Next slide URL index is 1');
	slider.nextSlide();
	assert.equal(slider.get('previousSlide').dataset.index, 4, 'Previous slide URL index is 4');
	assert.equal(slider.get('currentSlide').dataset.index, 1, 'Current slide URL index is 1');
	assert.equal(slider.get('nextSlide').dataset.index, 2, 'Next slide URL index is 2');
});

QUnit.test('Slider.gotoSlide', function(assert){
	var slider = new IdealImageSlider.Slider('.slider-default');
	slider.gotoSlide(2);
	assert.equal(slider.get('previousSlide').dataset.index, 1, 'Previous slide URL index is 1');
	assert.equal(slider.get('currentSlide').dataset.index, 2, 'Current slide URL index is 2');
	assert.equal(slider.get('nextSlide').dataset.index, 3, 'Next slide URL index is 3');
	slider.gotoSlide(1);
	assert.equal(slider.get('previousSlide').dataset.index, 4, 'Previous slide URL index is 4');
	assert.equal(slider.get('currentSlide').dataset.index, 1, 'Current slide URL index is 1');
	assert.equal(slider.get('nextSlide').dataset.index, 2, 'Next slide URL index is 2');
	slider.gotoSlide(4);
	assert.equal(slider.get('previousSlide').dataset.index, 3, 'Previous slide URL index is 3');
	assert.equal(slider.get('currentSlide').dataset.index, 4, 'Current slide URL index is 4');
	assert.equal(slider.get('nextSlide').dataset.index, 1, 'Next slide URL index is 1');
});

QUnit.test('Slider.destroy', function(assert){
	var slider = new IdealImageSlider.Slider('.slider-default');
	slider.destroy();
	assert.ok((slider.get('container').className.indexOf('slider-default') > -1), 'Slider is destroyed');
});

QUnit.asyncTest('Slider.start', function(assert){
	var slider = new IdealImageSlider.Slider({
		selector: '.slider-default',
		interval: 600
	});
	slider.start();

	setTimeout(function() {
		assert.equal(slider.get('currentSlide').dataset.index, 2, 'Current slide is correct');
		QUnit.start();
	}, 1000);
});

QUnit.asyncTest('Slider.stop', function(assert){
	var slider = new IdealImageSlider.Slider({
		selector: '.slider-default',
		interval: 600
	});
	slider.start();

	setTimeout(function() {
		slider.stop();
		assert.equal(slider.get('currentSlide').dataset.index, 2, 'Current slide is correct');
		QUnit.start();
	}, 1000);
});

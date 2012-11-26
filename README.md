Carbon Made jQuery Swiper Plugin
================================

Usage
-----

JavaScript:
```js
$('.swiper').swiper({ debug: false, resize: true, infinite: true });
```

HTML:
```html
<div class="swiper">
	<div class="swiper-controls">
	  <a href="#" class="prev">Previous</a>
	  <a href="#" class="next">Next</a>
	</div>
	<div class="container">
	  <ul>
	    <li class="element">Slide 1</li>
	    <li class="element">Slide 2</li>
	    <li class="element">Slide 3</li>
	  </ul>
	</div>
	<div class="bullets">
	  <a class="bullet">1</a>
	  <a class="bullet">2</a>
	  <a class="bullet">3</a>
	</div>
</div>
```

CSS:
```css
/* SWIPER ELEMENT */
.swiper   					{ width: 100%; overflow: hidden; }
.swiper .container,
.swiper .element 			{ float: left; width: 100%; max-width: 900px; height: auto; overflow: hidden; margin: 0 auto; padding: 0; position: relative; } /* Define the size of the slide in the max-width */
.swiper .element img		{ max-width: 100%; height: auto; display: block; }
.swiper .container > ul		{ margin: 0; padding: 0; list-style: none; }

/* BULLETS */
.swiper .bullets 		{ text-align: center; }
.swiper .bullet 		{ display: inline-block; width: 20px; margin: 0 5px 0 0; text-align: center; }
.swiper .bullet:hover 	{ cursor: pointer; }
.swiper .bullet.on		{ cursor: default; } /* Active bullet styles */

/* CONTROLLERS */
.swiper-controls a	 	{  }
.swiper-controls .prev	{  }
.swiper-controls .next	{  }
```
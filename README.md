Carbon Made jQuery Swiper Plugin
================================

Usage
-----

JavaScript:
```js
$('.swiper').swiper({ debug: false, resize: true, infinite: true });
```

Options:

debug: Boolean
auto: Boolean
resize: Boolean
touch: Boolean
touchSim: Boolean
infinite: Boolean
speed: Integer
delay: Integer
hideOverflow: Boolean
bullets: Boolean
transformSupport: Boolean

HTML:
```html
<div class="swiper">
  <div class="swiper-controls">
    <a href="#" class="prev">Previous</a>
    <a href="#" class="next">Next</a>
  </div>
  <div class="container">
    <ul>
      <li class="element element-1">Slide 1</li>
      <li class="element element-2">Slide 2</li>
      <li class="element element-3">Slide 3</li>
    </ul>
  </div>
  <div class="bullets">
    <a class="bullet bullet-1">1</a>
    <a class="bullet bullet-2">2</a>
    <a class="bullet bullet-3">3</a>
  </div>
</div>
```

CSS:
```css
/* SWIPER ELEMENT */
.swiper   					        { width: 100%; overflow: hidden; }
.swiper .container,
.swiper .element 				    { width: 960px; height: 580px; overflow: hidden; margin: 0 auto; } /* Define the size of the slide */
.swiper .container > ul			{ margin: 0; padding: 0; list-style: none; }
.swiper .element				    { float: left; margin: 0; padding: 0; }

/* BULLETS */
.swiper .bullets 				    { text-align: center; }
.swiper .bullet 				    { display: inline-block; width: 20px; margin: 0 5px 0 0; text-align: center; }
.swiper .bullet:hover 			{ cursor: pointer; }
.swiper .bullet.on			  	{ cursor: default; text-decoration: underline; } /* Active bullet styles */

/* CONTROLLERS */
.swiper-controls a	 		  	{  }
.swiper-controls .prev			{  }
.swiper-controls .next			{  }
```
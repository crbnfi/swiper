/*!
 * Carbon Made jQuery Swiper Plugin
 * http://carbon.fi/
 *
 * Copyright 2012, Carbon Software Oy, Juri Saltbacka <juri@carbon.fi>
 */

if (typeof $.pluginMaker != 'function') {
  $.pluginMaker = function(plugin) {
    $.fn[plugin.prototype.name] = function(options) { // add the plugin function as a jQuery plugin
      var args = $.makeArray(arguments), // get the arguments 
          after = args.slice(1);
      return this.each(function() {
        var instance = $.data(this, plugin.prototype.name); // see if we have an instance
        if (instance) {
          if (typeof options == "string") { 
            instance[options].apply(instance, after); // call a method on the instance
          } else if (instance.update) {
            instance.update.apply(instance, args); // call update on the instance
          }
        } else {
          new plugin(this, options); // create the plugin
        }
      });
    };
  };
};

if(typeof Carbon == 'undefined') var Carbon = {};

Carbon.Swiper = function(el, options) {
  if(el) this.init(el, options);
}

$.extend(Carbon.Swiper.prototype, {

  name: 'swiper',

  log: function() { if(!!this.options.debug && typeof console != 'undefined') console.log( Array.prototype.slice.call(arguments) ); },

  init: function(el, options)
  {
    this.element = $(el);
    this.options = $.extend({
      debug:            false,
      auto:             false,
      resize:           false,
      touch:            true,
      touchSim:         true,
      infinite:         false,
      speed:            300,
      delay:            4000,
      hideOverflow:     true,
      bullets:          true,
      manualWidth:      false,
      startSlide:       0,
      transformSupport: (typeof Modernizr != 'undefined' ? (Modernizr.csstransforms && Modernizr.csstransitions) : false)
    }, options);

    this.events = $.extend({
      change:  function(el) { return false; },
      changed: function(el) { return false; }
    }, this.options.events);

    // Windows Chrome bug
    if(/win/.test(navigator.userAgent.toLowerCase()) && /chrome/.test(navigator.userAgent.toLowerCase())) {
      this.options.transformSupport = false;
    }

    this.element.bind('destroyed', $.proxy(this.destroy, this));

    $.data(el, this.name, this); // Store instance to element data for great justice

    this.log('init', options, (this.options.transformSupport ? 'using transform' : 'using margin-left'));

    this.setup();

    var self = this;
    function resizeTimer(){
      clearInterval(self.timer);
      self.reset();
      self.setup();
    };

    if(this.options.resize) $(window).on('resize', function(){
      if(self.timer) clearInterval(self.timer);
      self.timer = setInterval(resizeTimer, 250);
    });

    this.initEvents();
  },

  reset: function()
  {
    this.log('reset')
    $('.container', this.element).attr('style', '');
    this.container.attr('style', '');
    this.elements.attr('style', '');
  },

  setup: function()
  {
    this.log('setting up', this.element.is(':hidden'), this.element.parent().width(), this.options.manualWidth)

    if(this.element.is(':hidden') && !this.options.manualWidth) {
      //this.element.width(this.element.parent().width());
      $('.container', this.element).width(this.element.parent().width());
      $('.element', this.element).width(this.element.parent().width());
    }
    else if (this.options.manualWidth != false) {
      //this.element.width(this.options.manualWidth);
      $('.container', this.element).width(this.options.manualWidth);
      $('.element', this.element).width(this.options.manualWidth);
      this.options.manualWidth = false;
    }

    this.container = $('.container ul', this.element);
    this.width     = $('.container', this.element).width();
    this.elements  = $('.element',   this.element);
    this.perPage   = Math.ceil(this.width / this.elements.width());
    this.current   = this.current || this.options.startSlide;
    this.currentEl = $('.element').eq(this.current);
    this.elWidth   = this.elements.width();
    this.bullets   = $('.bullets', this.element);

    this.log('setup', this.width, this.perPage, this.elWidth);

    $('.element', this.container).width( this.elWidth ).css('-webkit-backface-visibility', 'hidden');

    this.container.css({
      width: 100 + this.elements.length * this.elements.width() + 'px',
      overflow: (this.options.hideOverflow ? 'hidden' : 'visible')
    });

    // Prevent clicks on swiping
    if(this.options.touchSim) {
      var self = this;
      $(this.element).on('click', 'a', function(e){
        if($(self.element).hasClass('noclick')) {
          e.preventDefault();
        }
      });
    }

    if(this.options.bullets) {
      $('.bullet:eq(0)').addClass('on');
    }

    // Automation
    if(this.options.auto) {
      this.begin();
    }
    if(this.options.resize) {
      this.slideTo(this.current, 0);
    }
  },

  initEvents: function()
  {
    this.log('initEvents');
    var self = this;

    // Controls
    $('.next', this.element).on('click', function(e){
      e.preventDefault();
      self.next();
    });

    $('.prev', this.element).on('click', function(e){
      e.preventDefault();
      self.previous();
    });

    // Touch
    if(this.options.touch && 'addEventListener' in window) {
      var cont = this.container.get(0);
      cont.addEventListener('touchstart', function(e){ self.touchStart(e); }, false);
      cont.addEventListener('touchmove',  function(e){ self.touchMove(e); },  false);
      cont.addEventListener('touchend',   function(e){ self.touchEnd(e); },   false);
    }

    if(this.options.touchSim) {
      $(this.container).on('mousedown', function(e){ self.mouseDown(e); });
    }

    if(this.options.transformSupport) {
      $(this.container).on('webkitTransitionEnd msTransitionEnd oTransitionEnd transitionEnd', function(e){
        self.transitionEnd();
      });
    }

    // Bullets
    if(this.options.bullets) {
      $(this.bullets).on('click', '.bullet', function(e){
        e.preventDefault();
        self.slideTo($(this).index());
      });
    }
  },

  begin: function()
  {
    // ?
  },

  slideTo: function(i, speed)
  {
    speed = typeof speed != 'undefined' ? speed : this.options.speed;
    //i = (i % this.elements.length) * this.perPage
    i = (i % this.elements.length)

    this.log('slideTo', i, speed);
    this.events.change(this.currentEl);

    //if(i >= this.elements.length || i < 0) return;

    this.currentEl = this.elements.eq(i);
    this.current   = this.currentEl.index();
    var to = -(this.current * this.elWidth);

    // Animation
    if(this.options.transformSupport) {
      var style = this.container.get(0).style;
      style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
      style.webkitTransform = 'translate3d(' + to + 'px, 0, 0)';
      style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + to + 'px)';
      if(!speed) this.transitionEnd();
    }
    else {
      var self = this;
      this.container.animate({
        'margin-left': to + 'px'
      }, speed, function(){
        self.transitionEnd();
      });
    }

    // Controls
    $('.next .prev', this.element).removeClass('off');

    if(this.current == 0) {
      $('.prev', this.element).addClass('off');
    }
    else if(this.current == this.elements.length - 1) {
      $('.next', this.element).addClass('off');
    }

    if(this.options.bullets) {
      $('.on', this.bullets).removeClass('on');
      $('.bullet:eq(' + this.current + ')', this.bullets).addClass('on');
    }
  },

  next: function()
  {
    this.log('next', this.current);
    if(this.options.infinite || this.current + this.perPage < this.elements.length) {
      this.slideTo(this.current + this.perPage);
    }
    else {
      this.slideTo(this.current);
    }
  },

  previous: function()
  {
    this.log('previous', this.current);
    if(this.options.infinite || this.current > 0) {
      this.slideTo(this.current - this.perPage);
    }
    else {
      this.slideTo(this.current);
    }
  },

  // Events
  // ======

  destroy: function()
  {
    this.log('destroy');
  },

  touchStart: function(e)
  {
    this.touch = {
      startX:      e.touches[0].pageX,
      startY:      e.touches[0].pageY,
      time:        Number( new Date() ),
      deltaX:      0,
      isScrolling: null
    };

    var style = this.container.get(0).style;
    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = 0;
  },

  touchMove: function(e)
  {
    if(e.touches.length > 1 || e.scale && e.scale !== 1) return;
    this.touch.deltaX = e.touches[0].pageX - this.touch.startX;

    if(this.touch.isScrolling == null) {
      var scrollDelta = e.touches[0].pageY - this.touch.startY;
      this.touch.isScrolling = !!(this.touch.isScrolling || Math.abs(this.touch.deltaX) <= Math.abs(scrollDelta));
    }

    if(!this.touch.isScrolling) {
      e.preventDefault(); // Prevent native scrolling

      if((this.current == 0 && this.touch.deltaX > 0) || (this.current == this.elements.length - 1 && this.touch.deltaX < 0)) {
        // User is scrolling past the boundaries
        this.touch.deltaX = this.touch.deltaX / (Math.abs(this.touch.deltaX) / this.width + 1);
      }

      var style = this.container.get(0).style;
      style.webkitTransform = 'translate3d(' + (this.touch.deltaX - (this.current / this.perPage) * this.width) + 'px, 0, 0)';
      style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + (this.touch.deltaX - (this.current / this.perPage) * this.width) + 'px)';
    }
  },

  touchEnd: function(e)
  {
    // determine if slide attempt triggers next/prev slide
    var isValidSlide =
      (Number(new Date()) - this.touch.time < 400      // if slide duration is less than 250ms
      && Math.abs(this.touch.deltaX) > 120)             // and if slide amt is greater than 40px
      || Math.abs(this.touch.deltaX) > this.width/2,   // or if slide amt is greater than half the width

    // determine if slide attempt is past start and end
    isPastBounds =
      (!this.current && this.touch.deltaX > 0)                                  // if first slide and slide amt is greater than 0
      || (this.current === this.elements.length - 1 && this.touch.deltaX < 0);  // or if last slide and slide amt is less than 0

    // if not scrolling vertically
    if (!this.isScrolling) {
      // call slide function with slide end value based on isValidSlide and isPastBounds tests
      if(isValidSlide && !isPastBounds) {
        if(this.touch.deltaX < 0) {
          this.next();
        }
        else {
          this.previous();
        }
      }
      else {
        this.slideTo(this.current);
      }
    }
  },

  mouseDown: function(e)
  {
    this.log('mouseDown', e);
    e.preventDefault();

    var self = this;
    $(document).on('mousemove.swiper', function(ev){ self.mouseMove(ev, e); });
    $(document).on('mouseup.swiper',   function(ev){ self.mouseUp(ev, e); });

    this.mouse = {
      startX:      e.pageX,
      startY:      e.pageY,
      time:        Number( new Date() ),
      deltaX:      0
    };

    var style = this.container.get(0).style;
    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = 0;
  },

  mouseMove: function(e)
  {
    //this.log('mouseMove', e);
    e.preventDefault();

    this.mouse.deltaX = e.pageX - this.mouse.startX;

    if(Math.abs(this.mouse.deltaX) > 5) {
      $(this.element).addClass('noclick');
    }

    if((this.current == 0 && this.mouse.deltaX > 0) || (this.current == this.elements.length - 1 && this.mouse.deltaX < 0)) {
      // User is scrolling past the boundaries
      this.mouse.deltaX = this.mouse.deltaX / (Math.abs(this.mouse.deltaX) / this.width + 1);
    }

    var to = (this.mouse.deltaX - (this.current / this.perPage) * this.width);

    if(this.options.transformSupport) {
      var style = this.container.get(0).style;
      style.webkitTransform = 'translate3d(' + to + 'px, 0, 0)';
      style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + to + 'px)';
    }
    else {
      this.container.css({
        'margin-left': to + 'px'
      });
    }
  },

  mouseUp: function(e)
  {
    this.log('mouseUp', e);
    e.preventDefault();

    $(document).off('mousemove.swiper');
    $(document).off('mouseup.swiper');

    // determine if slide attempt triggers next/prev slide
    var isValidSlide =
    (Number(new Date()) - this.mouse.time < 400      // if slide duration is less than 250ms
    && Math.abs(this.mouse.deltaX) > 120)                   // and if slide amt is greater than 20px
    || Math.abs(this.mouse.deltaX) > this.width/2,        // or if slide amt is greater than half the width

    // determine if slide attempt is past start and end
    isPastBounds =
    (!this.current && this.mouse.deltaX > 0)                          // if first slide and slide amt is greater than 0
    || (this.current === this.elements.length - 1 && this.mouse.deltaX < 0);    // or if last slide and slide amt is less than 0

    // if not scrolling vertically
    if (!this.isScrolling) {
      if(isValidSlide && !isPastBounds && (this.current > 0 || this.current + this.perPage < this.elements.length)) {
        if(this.mouse.deltaX < 0) {
          this.next();
        }
        else {
          this.previous();
        }
      }
      else {
        this.slideTo(this.current);
      }
    }
  },

  transitionEnd: function()
  {
    this.events.changed(this.currentEl);
    $(this.element).removeClass('noclick');
  }

});

$.pluginMaker(Carbon.Swiper);

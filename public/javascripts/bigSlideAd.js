/*! bigSlide - v0.2.1 - 2013-11-13
* http://ascott1.github.io/bigSlide.js/
* Copyright (c) 2013 Adam D. Scott; Licensed MIT */
(function($) {
  'use strict';

  $.fn.bigSlide = function(options) {

    var settings = $.extend({
      'menuAd': ('#menuAd'),
      'push': ('.push'),
      'menuAdWidth': '15.625em',
      'speed': '300'
    }, options);

    var menuAdLink = this,
        menuAd = $(settings.menuAd),
        push = $(settings.push),
        width = settings.menuAdWidth;

    var positionOffScreen = {
      'position': 'fixed',
      'top': '0',
      'bottom': '0',
      'left': '-' + settings.menuAdWidth,
      'width': settings.menuAdWidth,
      'height': '100%'
    };

    var animateSlide = {
      '-webkit-transition': 'left ' + settings.speed + 'ms ease',
      '-moz-transition': 'left ' + settings.speed + 'ms ease',
      '-ms-transition': 'left ' + settings.speed + 'ms ease',
      '-o-transition': 'left ' + settings.speed + 'ms ease',
      'transition': 'left ' + settings.speed + 'ms ease'
    };

    menuAd.css(positionOffScreen);
    menuAd.css(animateSlide);
    push.css(animateSlide);

    menuAd.state = 'closed';

    menuAd.open = function() {
      menuAd.state = 'open';
      menuAd.css('left', '0');
      push.css('left', width);
    };

    menuAd.close = function() {
      menuAd.state = 'closed';
      menuAd.css('left', '-' + width);
      push.css('left', '0');
    };

    menuAdLink.on('click.bigSlide', function(e) {
      e.preventDefault();
      if (menuAd.state === 'closed') {
        menuAd.open();
      } else {
        menuAd.close();
      }
    });

    return menuAd;

  };

}(jQuery));

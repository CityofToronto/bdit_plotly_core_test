/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

/*
Using modal dialogs is a common design pattern with core apps. This helper does most of the work for you, including AODA compliance.

If includeModal is set to true in your project's package.json coreConfig, then this file will be included.
The method below is a static method of the cot_app (if your app is standalone) or CotApp (if your app is embedded) class.
Use it like this:

CotApp.showModal({title:'My Title', body: 'My Body'}); //embedded apps

cot_app.showModal({title:'My Title', body: 'My Body'}); //standalone apps

 */

$(function () {
  (window['cot_app'] || window['CotApp']).showModal = function (o) {
    /*
    If you have any apps that load content into a modal popup dynamically, read this comment:
    In a previous app, the content of the modal was inserted dynamically in the modal shown.bs.modal javascript event.
    It turns out that on iOS 9 or later, this prevents the user from being able to scroll down the screen.
    See this bug: https://github.com/twbs/bootstrap/issues/17695
    A solution looks something like this:
    $('#myModal').on('shown.bs.modal', function(){
      $('#myModal').css('overflow-y','hidden');
      //...
      //do some code to retrieve and insert dynamic content into .modal-body
      //...
      //after modal content is all there:
      $('#myModal').css('overflow-y','​auto');
    })
    This fixed the bug.
     */
    var options = $.extend({
      title: '', //An HTML string. The title of the modal
      body: '', //An HTML string. The body of the modal
      footerButtonsHtml: '<button class="btn btn-default" type="button" data-dismiss="modal">Close</button>', //Optional, if unset the modal will have a single Close button. To use, specify an HTML string to render one or more buttons
      modalSize: '', //Optional, set to modal-lg or modal-sm to use modal size classes
      originatingElement: null, //Optional, an element (DOM or $-selected) to set focus to after the modal is closed, use for accessibility
      className: '', //Optional, a CSS class to put on the root div.modal element
      onShow: o['onShow'] || function () {
      }, //Optional, hook into boostrap modal events
      onShown: o['onShown'] || function () {
      },
      onHide: o['onHide'] || function () {
      },
      onHidden: o['onHidden'] || function () {
      }
    }, o);
    var id = 'modal_' + Math.random().toString().split('.')[1];
    var html = '<div class="modal fade ' + options.className + '" id="' + id + '" tabindex="-1" role="dialog" aria-labelledby="' + id + '_title" aria-hidden="true">' +
      '    <div class="modal-dialog ' + options.modalSize + '" role="document">' +
      '      <div class="modal-content">' +
      '        <div class="modal-header">' +
      '          <button type="button" aria-label="Close" class="close" type="button" data-dismiss="modal">' +
      '            <span aria-hidden="true">&times;</span>' +
      '          </button>' +
      '          <div role="heading" id="' + id + '_title" class="modal-title">' + options.title + '</div>' +
      '        </div>' +
      '        <div id="' + id + '_body" class="modal-body">' + options.body + '</div>' +
      '        <div class="modal-footer">' +
      options.footerButtonsHtml +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>';
    $('body').append(html);
    var modalElement = $("#" + id);
    var headerCloseButton = modalElement.find('.modal-header button').first();
    var footerCloseButton = modalElement.find('.modal-footer button').last();
    modalElement.modal({show: false})
      .on('show.bs.modal', function () {
        options.onShow();
      })
      .on('shown.bs.modal', function () {
        headerCloseButton.focus();
        options.onShown();
      })
      .on('hide.bs.modal', function () {
        options.onHide();
      })
      .on('hidden.bs.modal', function () {
        options.onHidden();
        if (options.originatingElement) {
          options.originatingElement.focus();
        }
        modalElement.remove();
      })
      .modal('show')
      .attr('aria-hidden', false);
    headerCloseButton.on('keydown', function (e) {
      if ((e.which || e.keyCode) === 9 && e.shiftKey) {
        footerCloseButton.focus();
        return false;
      }
    });
    footerCloseButton.on('keydown', function (e) {
      if ((e.which || e.keyCode) === 9 && !e.shiftKey) {
        headerCloseButton.focus();
        return false;
      }
    });
    return modalElement;
  }
});

var CotApp = function () {
  this.appContentKeySuffix = '/';
};

CotApp.prototype.loadAppContent = function (o) {
  var data = {},
    options = $.extend({
      keys: [], //an array of titles of API Content Snippets from WP
      tag: '', //a future option, where you can get multiple snippets with a single tag
      onComplete: function (data) { //called after all API calls are completed
        //data - a key/value hash with each key name and the associated fetched data value
      },
      onProgress: function (keyName, errXhr, errMsgOne, errMsgTwo) { //called after a single key is loaded successfully or not successfully
        //keyName - the key that was just finished
        //errXhr, errMsgOne, errMsgTwo - error information if the API call failed
      }
    }, o),
    this1 = this;

  if (options.tag) {
    //TODO: grab all content for a given tag
  } else {
    var count = 0;
    options.keys.forEach(function (key) {
      $.ajax({
        url: '/app_content/' + key + this1.appContentKeySuffix,
        success: function (result) {
          data[key] = result;
          options.onProgress(key);
        },
        error: function (a, b, c) {
          options.onProgress(key, a, b, c);
        },
        complete: function () {
          count++;
          if (count >= options.keys.length) {
            options.onComplete(data);
          }
        }
      });
    });
    if (options.keys.length === 0) {
      options.onComplete(data);
    }
  }

};

"use strict";

var data = [{
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 7.5
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 13.2
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 13.9
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8.4
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8.1
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 9.8
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 11.4
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 5.1
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 6.9
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8.7
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 10.3
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 13.1
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 11.2
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 7.7
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 12
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8.5
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 9
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8.5
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 13.1
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 9.3
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 13.9
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 6.8
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8.6
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 6.3
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 13.8
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 10.5
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 11.4
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8.1
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 9.2
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 13.9
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 12.4
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 11.7
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 12
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 11.3
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 5.1
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 5.1
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 6.1
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "AM",
  "travel_time": 11.5
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "AM",
  "travel_time": 5.2
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 5.3
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 10.5
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 6.1
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 11.5
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 13.2
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 13.1
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 5
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 7.2
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 6.6
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 13.1
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 11.5
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 5.5
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 14.9
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 5.1
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 6.8
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 13.7
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 10.6
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 13.3
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 6.8
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 14.8
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 12.1
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 14.2
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 11.5
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 9.1
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 10.5
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 11.7
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 9.2
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 11.6
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 8.2
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 9.4
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 14.6
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 8.5
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 15
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 5.6
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 15
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 13.2
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 13.7
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-10-01 00:00:00",
  "time_period": "PM",
  "travel_time": 15
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-11-01 00:00:00",
  "time_period": "PM",
  "travel_time": 5.4
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-12-01 00:00:00",
  "time_period": "PM",
  "travel_time": 5.4
}];
"use strict";

var bl = [{
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 3.5
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 5.1
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 5.9
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 8.2
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 6
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 12.9
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 10.8
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 7.2
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 10
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "AM",
  "travel_time": 5.1
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 7.3
}, {
  "corridor_id": 1,
  "corridor": "Dundas",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 12.2
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 5.6
}, {
  "corridor_id": 2,
  "corridor": "Queen",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 12.9
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 8.6
}, {
  "corridor_id": 3,
  "corridor": "Front",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 10.1
}, {
  "corridor_id": 4,
  "corridor": "Adelaide",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 8.5
}, {
  "corridor_id": 5,
  "corridor": "Richmond",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 7.2
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "EB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 12
}, {
  "corridor_id": 6,
  "corridor": "Wellington",
  "dir": "WB",
  "mon": "2017-09-01 00:00:00",
  "time_period": "PM",
  "travel_time": 11.7
}];
'use strict';

var carStr = JSON.stringify(data);
var dataobj = JSON.parse(carStr);
var blStr = JSON.stringify(bl);
var blobj = JSON.parse(blStr);

var ylist = [];
for (j = 0; j < dataobj.length; j++) {
  ylist.push(dataobj[j].travel_time);
};
var ymax = Math.max.apply(Math, ylist);

var divlst = ['mydiv1', 'mydiv2', 'mydiv3', 'mydiv4', 'mydiv5', 'mydiv6'];
var polist = ['Dundas', 'Richmond', 'Wellington', 'Queen', 'Adelaide', 'Front'];

function avg(column) {
  var total = 0;
  for (var i = 0; i < column.length; i++) {
    total += column[i];
  }
  aver = total / column.length;
  return aver.toFixed(1);
};

function beforeAttr(position, time) {
  var bvalue = [0, 0];
  for (var i = 0; i < blobj.length; i++) {
    if (blobj[i].corridor == position && blobj[i].time_period == time) {
      if (blobj[i].dir == "EB") {
        bvalue[0] = blobj[i].travel_time;
      } else if (blobj[i].dir == "WB") {
        bvalue[1] = blobj[i].travel_time;
      }
    }
  }
  return bvalue;
};

function afterAttr(position, time, mon) {
  var avalue = [0, 0];
  var EBtemp = [];
  var WBtemp = [];
  for (var i = 0; i < dataobj.length; i++) {
    var month = new Date(dataobj[i].mon);
    var nmonth = month.getMonth();
    if (dataobj[i].corridor == position && dataobj[i].time_period == time) {
      if (mon == "all") {
        if (dataobj[i].dir == "EB") {
          EBtemp.push(dataobj[i].travel_time);
        } else if (dataobj[i].dir == "WB") {
          WBtemp.push(dataobj[i].travel_time);
        }
      } else {
        var nmon = parseInt(mon);
        if (nmon == nmonth + 1) {
          if (dataobj[i].dir == "EB") {
            EBtemp.push(dataobj[i].travel_time);
          } else if (dataobj[i].dir == "WB") {
            WBtemp.push(dataobj[i].travel_time);
          }
        }
      }
    }
  }
  if (EBtemp.length == 0) {
    EBtemp.push(0);
  }
  if (WBtemp.length == 0) {
    WBtemp.push(0);
  }
  EBtemp = parseFloat(avg(EBtemp));
  WBtemp = parseFloat(avg(WBtemp));
  avalue[0] = EBtemp;
  avalue[1] = WBtemp;
  return avalue;
};

var AMPMIDs = ["AM", "PM"];
var monthIDs = ["all", "9", "10", "11", "12"];
var current_period = document.getElementById("AM").value;
var current_month = document.getElementById("9").value;

function selectChecker() {
  AMPMIDs.forEach(function (selectID) {
    current_period = document.getElementById("AMPM").value;
  });
  monthIDs.forEach(function (selectID) {
    current_month = document.getElementById("month").value;
  });
  console.log([current_period, current_month]);
};

function diff(bvalue, avalue) {
  diffvalE = parseInt(bvalue[0] - avalue[0]);
  diffvalW = parseInt(bvalue[1] - avalue[1]);
  if (bvalue[0] - avalue[0] == 0) {
    diffvalE = "-";
  } else if (diffvalE > 0) {
    diffvalE = diffvalE.toString();
    diffvalE = '+' + diffvalE + 'min';
  } else if (diffvalE < 0) {
    diffvalE = diffvalE.toString();
    diffvalE = diffvalE + 'min';
  }
  if (bvalue[1] - avalue[1] == 0) {
    diffvalW = "-";
  } else if (diffvalW > 0) {
    diffvalW = diffvalW.toString();
    diffvalW = '+' + diffvalW + 'min';
  } else if (diffvalW < 0) {
    diffvalW = diffvalW.toString();
    diffvalW = diffvalW + 'min';
  }
  return [diffvalE, diffvalW];
}

function graphdata() {
  selectChecker();
  var i;
  for (i = 0; i < polist.length; i++) {
    var bvalue = beforeAttr(polist[i], current_period);
    var avalue = afterAttr(polist[i], current_period, current_month);
    //console.log([bvalue, avalue]);
    var before = {
      x: ['EASTBOUND', 'WESTBOUND'],
      y: bvalue,
      text: bvalue,
      textposition: 'auto',
      insidetextfont: {
        size: 11,
        color: 'rgb(255, 255, 255)'
      },
      hoverinfo: 'y+name',
      name: 'before',
      type: 'bar',
      marker: {
        color: 'rgb(255, 197, 91)',
        width: .3
      }
    };
    var after = {
      x: ['EASTBOUND', 'WESTBOUND'],
      y: avalue,
      text: avalue,
      textposition: 'auto',
      insidetextfont: {
        size: 11,
        color: 'rgb(255, 255, 255)'
      },
      hoverinfo: 'y+name',
      name: 'after',
      type: 'bar',
      marker: {
        color: 'rgb(137, 186, 249)',
        width: .3
      }
    };
    var data = [before, after];
    diff(bvalue, avalue);
    var layout = {
      title: polist[i],
      font: {
        size: 10
      },
      xaxis: {
        title: "DIRECTION",
        titlefont: {
          size: 11
        } },
      yaxis: {
        title: 'TRAVEL TIME',
        titlefont: {
          size: 11
        } },
      autosize: true,
      showlegend: false,
      annotations: [{
        x: 'EASTBOUND',
        y: ymax + 2,
        text: diffvalE,
        xref: 'centre',
        yanchor: 'top',
        showarrow: false,
        font: {
          color: "black",
          size: 13
        }
      }, {
        x: 'WESTBOUND',
        y: ymax + 2,
        text: diffvalW,
        xref: 'centre',
        yanchor: 'top',
        showarrow: false,
        font: {
          color: "black",
          size: 13
        }
      }]
    };
    Plotly.newPlot(divlst[i], data, layout, { displayModeBar: false });
  }
};

graphdata();
"use strict";

var totalgra = document.getElementById("totalgra");
var totaltab = document.getElementById("totaltab");
var wtable = document.getElementById("wholetab");
var period = document.getElementById("AMPM");
var month = document.getElementById("month");
var togbutton = document.getElementById("tog");
var filter = document.getElementById("filter");

function toggle() {
  if (totalgra.style.display == "none") {
    totalgra.style.display = "inline-block";
    period.style.display = "inline-block";
    month.style.display = "inline-block";
    wtable.style.display = "none";
    totaltab.style.display = "none";
    filter.style.display = "none";
    togbutton.value = "Table";
  } else {
    totalgra.style.display = "none";
    period.style.display = "none";
    filter.style.display = "inline-block";
    month.style.display = "none";
    wtable.style.display = "block";
    togbutton.value = "Graphs";
    tabledata();
  }
};

function toggleTAB() {
  if (wtable.style.display == "none") {
    wtable.style.display = "block";
    totaltab.style.display = "none";
    filter.value = "Filtered Tables";
  } else {
    wtable.style.display = "none";
    totaltab.style.display = "block";
    filter.value = "Whole table";
    filterTAB();
  }
};

var corr_id = [];
var corr = [];
var dirlst = [];
var datelst = [];
var periodlst = [];

function tabledata() {
  for (j = 0; j < dataobj.length; j++) {
    corr_id.push(dataobj[j].corridor_id);
    corr.push(dataobj[j].corridor);
    dirlst.push(dataobj[j].dir);
    datelst.push(dataobj[j].mon);
    periodlst.push(dataobj[j].time_period);
  };
  var alldata = [corr_id, corr, dirlst, datelst, periodlst, ylist];
  var tdata = [{
    type: 'table',
    header: {
      values: [["corridor_id"], ["corridor"], ["dir"], ["mon"], ["time_period"], ['travel_time']],
      align: "center",
      line: { width: 1, color: 'black' },
      fill: { color: "rgb(27, 83, 155)" },
      font: { family: "Arial", size: 12, color: "white" }
    },
    cells: {
      values: alldata,
      align: "center",
      line: { color: "black", width: 1 },
      font: { family: "Arial", size: 11, color: ["black"] }
    }
  }];
  var tlayout = {
    title: "All data"
  };
  Plotly.plot("wholetab", tdata, tlayout, { displayModeBar: false });
};

function filterdata(corridor) {
  var fcorr_id = [];
  var fcorr = [];
  var fdirlst = [];
  var fdatelst = [];
  var fperiodlst = [];
  var fttlst = [];
  for (j = 0; j < dataobj.length; j++) {
    if (dataobj[j].corridor == corridor) {
      fcorr_id.push(dataobj[j].corridor_id);
      fcorr.push(dataobj[j].corridor);
      fdirlst.push(dataobj[j].dir);
      fdatelst.push(dataobj[j].mon);
      fperiodlst.push(dataobj[j].time_period);
      fttlst.push(dataobj[j].travel_time);
    }
  };
  return [fcorr_id, fcorr, fdirlst, fdatelst, fperiodlst, fttlst];
}

var tablelst = ['mytab1', 'mytab2', 'mytab3', 'mytab4', 'mytab5', 'mytab6'];

function filterTAB() {
  var fdata = [];
  for (i = 0; i < polist.length; i++) {
    fdata = filterdata(polist[i]);
    var fdata = [{
      type: 'table',
      header: {
        values: [["corridor_id"], ["corridor"], ["dir"], ["mon"], ["time_period"], ['travel_time']],
        align: "center",
        line: { width: 1, color: 'black' },
        fill: { color: "rgb(27, 83, 155)" },
        font: { family: "Arial", size: 12, color: "white" }
      },
      cells: {
        values: fdata,
        align: "center",
        line: { color: "black", width: 1 },
        font: { family: "Arial", size: 11, color: ["black"] }
      }
    }];
    var flayout = {
      title: polist[i]
    };
    Plotly.plot(tablelst[i], fdata, flayout, { displayModeBar: false });
  }
};
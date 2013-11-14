/*!
 * jQuery-Reticence Plugin v0.3.0
 * https://github.com/kawamanza/jquery-reticence/
 *
 * Copyright 2011-2013, Marcelo Manzan
 * Licensed under the MIT License.
 * http://en.wikipedia.org/wiki/MIT_License
 *
 * Date: Fri Nov 14 09:58:17 2013 -0200
 */
(function($) {
  var TAG_NAME, applyReticence, bindRedraw, checkCapture, dataNamespace, findContainer, main, redraw, reticentClass, tagName;
  dataNamespace = "reticence";
  reticentClass = "reticent";
  TAG_NAME = /^\s*<\/?([^\s>]+).*$/m;
  findContainer = function(element) {
    var ancestor, children, data;
    data = {
      ancestor: element
    };
    element.parents().each(function() {
      var attr, node;
      node = $(this);
      attr = node.css("overflow") === "hidden" ? "container" : "ancestor";
      data[attr] = node;
      return attr === "ancestor";
    });
    if (data.container) {
      children = data.container.children();
      ancestor = data.ancestor;
      if (children.length !== 1 || ancestor === element) {
        ancestor = $('<div style="height: auto;">');
        children.appendTo(ancestor);
        ancestor.appendTo(data.container);
        data.ancestor = ancestor;
      }
    } else {
      throw "Could not find container with 'overflow: hidden' style";
    }
    return data;
  };
  tagName = function(str) {
    return str && str.replace(TAG_NAME, "$1");
  };
  checkCapture = function(element, o, html) {
    var capture, captures, isCapturedTag, scan;
    scan = o.scan;
    captures = o.captures;
    while (true) {
      capture = scan[o.last--];
      isCapturedTag = capture.indexOf("<") + 1;
      if (isCapturedTag) {
        if (capture.charAt(1) !== "/" && captures.length && captures[0].indexOf("</") !== -1 && tagName(capture) === tagName(captures[0])) {
          captures.shift();
        } else {
          captures.unshift(capture);
        }
      }
      o.len = o.len - capture.length;
      html = html.substr(0, o.len);
      if (o.last === -1 || !isCapturedTag) {
        break;
      }
    }
    element.html(html + "..." + captures.join(""));
    if (!o.reticent) {
      o.reticent = true;
      o.container.addClass(reticentClass);
    }
  };
  redraw = function(element) {
    var aHeight, ancestor, cHeight, data, html, o;
    data = element.data(dataNamespace);
    ancestor = data.ancestor;
    o = {
      scan: data.scan,
      container: data.container,
      last: data.scan.length - 1,
      captures: []
    };
    while (true) {
      if (html) {
        checkCapture(element, o, html);
      } else {
        html = o.scan.join("");
        o.len = html.length;
        o.reticent = false;
        o.container.removeClass(reticentClass);
        element.html(html);
        cHeight = o.container.height();
      }
      aHeight = ancestor.height();
      if (aHeight <= cHeight || o.last === -1) {
        break;
      }
    }
  };
  bindRedraw = function(element) {
    var f, r;
    r = null;
    f = function() {
      redraw(element);
      r = null;
    };
    element.data(dataNamespace).container.resize(function() {
      if (r) {
        clearTimeout(r);
      }
      r = setTimeout(f, 30);
    });
  };
  applyReticence = function(element, options) {
    var data, regex;
    element = $(element);
    data = element.data(dataNamespace);
    if (data) {
      return redraw(element);
    }
    data = findContainer(element);
    regex = main.matchers[options.reduceMode || "char"];
    data.text = element.html();
    data.scan = data.text.match(regex);
    element.data(dataNamespace, data);
    redraw(element);
    if (options.resizable) {
      bindRedraw(element);
    }
  };
  main = function(options) {
    options = $.extend({}, options);
    return this.each(function() {
      applyReticence(this, options);
    });
  };
  main.matchers = {
    char: /\s*(?:<.*?>|[^\s<])/gm,
    word: /\s*(?:<.*?>|[^\s<]+)/gm
  };
  $.fn.reticence = main;
})(jQuery);

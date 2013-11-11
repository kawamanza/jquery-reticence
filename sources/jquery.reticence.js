/*!
 * jQuery-Reticence Plugin v0.3.0
 * https://github.com/kawamanza/jquery-reticence/
 *
 * Copyright 2011-2013, Marcelo Manzan
 * Licensed under the MIT License.
 * http://en.wikipedia.org/wiki/MIT_License
 *
 * Date: Fri Nov 08 09:21:17 2013 -0200
 */
(function($) {
  var TAG_NAME, applyReticence, bindRedraw, dataNamespace, findContainer, main, redraw, reticentClass, tagName;
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
  redraw = function(element) {
    var aHeight, ancestor, cHeight, capture, captures, container, data, html, isCapturedTag, last, len, reticent, scan;
    data = element.data(dataNamespace);
    scan = data.scan;
    ancestor = data.ancestor;
    container = data.container;
    last = scan.length - 1;
    captures = [];
    while (true) {
      if (html) {
        while (true) {
          capture = scan[last--];
          isCapturedTag = capture.indexOf("<") + 1;
          if (isCapturedTag) {
            if (capture.charAt(1) !== "/" && captures.length && captures[0].indexOf("</") !== -1 && tagName(capture) === tagName(captures[0])) {
              captures.shift();
            } else {
              captures.unshift(capture);
            }
          }
          len = len - capture.length;
          html = html.substr(0, len);
          if (last === -1 || !isCapturedTag) {
            break;
          }
        }
        element.html(html + "..." + captures.join(""));
        if (!reticent) {
          reticent = true;
          container.addClass(reticentClass);
        }
      } else {
        html = scan.join("");
        len = html.length;
        reticent = false;
        container.removeClass(reticentClass);
        element.html(html);
        cHeight = container.height();
      }
      aHeight = ancestor.height();
      if (aHeight <= cHeight || last === -1) {
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

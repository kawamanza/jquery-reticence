/*!
 * jQuery-Reticence JavaScript Plugin v0.2.0
 * http://plugins.jquery.com/project/Reticence
 *
 * Copyright 2011, Marcelo Manzan
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * http://en.wikipedia.org/wiki/MIT_License
 * http://en.wikipedia.org/wiki/GNU_General_Public_License
 *
 * Date: Thu Jul 28 11:46:10 2011 -0300
 */
(function ($) {
    var SCAN_WORDS = /\s*(?:<.*?>|[^\s<]+)/gm,
        SCAN_CHARS = /\s*(?:<.*?>|[^\s<])/gm,
        TAG_NAME = /^\s*<\/?([^\s>]+).*$/m,
        closingTag = "</",
        dataName = "reticence",
        reticentClass = "reticent";
    function tagName(str) {
        return str && str.replace(TAG_NAME, "$1");
    }
    function redraw($el) {
        var rdata = $el.data(dataName),
            container = rdata.container,
            containerHeight = container.height(),
            ancestor = rdata.ancestor, scan = rdata.scan,
            p = scan.length - 1, c, captures = [], html,
            i, h, l, reticent = false;
        container.removeClass(reticentClass);
        do {
            if (html) {
                do {
                    c = scan[p--];
                    if ((i = c.indexOf("<") + 1) != 0) {
                        if (c.charAt(i) != "/" && captures.length
                                && captures[0].indexOf(closingTag) != -1
                                && tagName(c) == tagName(captures[0])) {
                            captures.shift();
                        } else {
                            captures.unshift(c);
                        }
                    }
                    l = l - c.length;
                    html = html.substr(0, l);
                } while (i != 0 && p != -1);
                $el.html(html + "..." + captures.join(""));
                if (! reticent) {
                  reticent = true;
                  container.addClass(reticentClass);
                }
            } else {
                html = scan.join("");
                l = html.length;
                $el.html(html);
            }
            h = ancestor.height();
        } while (h > containerHeight && p != -1);
    }
    function bindRedraw($el) {
        var r = null, f = function () {redraw($el); r = null;};
        $el.data(dataName).container.resize(function () {
            if (r) clearTimeout(r);
            r = setTimeout(f, 30);
        });
    }
    function applyReticence(elem, options) {
        var $el = $(elem), re, html,
            rdata = $el.data(dataName),
            container = null,
            ancestor = $el;
        if (rdata) {redraw($el); return;}
        $el.parents().each(function () {
            var $n = $(this), css = $n.css("overflow");
            if (css == "hidden") {container = $n;} else {ancestor = $n;}
            return container == null;
        });
        if (container == null) return;
        re = options.reduceMode == "char" ? SCAN_CHARS : SCAN_WORDS;
        $el.data(dataName,
            {scan: $el.html().match(re), container: container, ancestor: ancestor});
        redraw($el);
        if (options.resizable) {
            bindRedraw($el);
        }
    }
    $.fn.reticence = function (options) {
        if (! options) options = {};
        return this.each(function () {
          applyReticence(this, options);
        });
    };
})(jQuery);

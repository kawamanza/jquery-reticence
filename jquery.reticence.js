(function ($) {
    var SCAN_WORDS = /\s*(?:<.*?>|[^\s<]+)/gm,
        SCAN_CHARS = /\s*(?:<.*?>|[^\s<])/gm,
        TAG_NAME = /^\s*<\/?([^\s>]+).*$/m,
        closingTag = "</",
        dataName = "reticence";
    function tagName(str) {
        return str && str.replace(TAG_NAME, "$1");
    }
    function redraw($el) {
        var rdata = $el.data(dataName),
            containerHeight = rdata.container.height(),
            ancestor = rdata.ancestor, scan = rdata.scan,
            p = scan.length - 1, i, c, captures = [], html, h, l;
        do {
            if (html) {
                do {
                    c = scan[p--];
                    if ((i = c.indexOf("<") + 1) != 0) {
                        if (c.charAt(i) != "/" && captures.length && captures[0].indexOf(closingTag) != -1 && tagName(c) == tagName(captures[0])) {
                          captures.shift();
                        } else {
                          captures.unshift(c);
                        }
                    }
                    l = l - c.length;
                    html = html.substr(0, l);
                } while (i != 0 && p != -1);
                $el.html(html + "..." + captures.join(""));
            } else {
                html = scan.join("");
                l = html.length;
                $el.html(html);
            }
            h = ancestor.height();
        } while (h > containerHeight && p != -1);
    }
    function bindRedraw($el) {
        var r = null, f = function () {redraw($el);};
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
        $el.data(dataName, {scan: $el.html().match(re), container: container, ancestor: ancestor});
        redraw($el);
        if (options.resizable !== false && ! rdata) {
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

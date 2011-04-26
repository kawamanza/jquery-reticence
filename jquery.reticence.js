(function($) {
    var reExtraSpace = /[\s\r\n][\s\r\n]+/g,
        reTagAtEnd = /\s*(<[^>]+>)$/,
        reTagName = /^<\/?([^\s>]+).*$/,
        reDotsAtEnd = /[\s\.]+$/,
        reReticenceAtEnd = /[\.\s]*<[^\/][^>]*>\s*\.\.\.\s*<\/[^>]*>(\s*<\/[^>]*>)*$/,
        reLastWord = /\s*[^>\s]+\s*$/,
        reLastChar = /[\s\.]*[^\s][\s\.]*$/;
    $.fn.reticence = function(options) {
        if (! options) options = {};
        return this.each(function() {
            var $this = $(this),
                reticence = $this.data("reticence"),
                prepared = reticence, initialContent, maxTimes,
                elementWithHiddenOverflow = null;
            $this.parents().each(function() {
                var $node = $(this);
                if ($node.css("overflow") == "hidden") elementWithHiddenOverflow = $node;
                return elementWithHiddenOverflow == null;
            })
            if (elementWithHiddenOverflow == null) return;
            if ( ! prepared ) {
                reticence = {};
                $this.data("reticence", reticence);
                reticence.initialContent = $this.html().replace(reExtraSpace, ' ');
                reticence.maxTimes = $this.text().replace(reExtraSpace, ' ').length * 2 + 100;
            }
            initialContent = reticence.initialContent;
            maxTimes = reticence.maxTimes;
            function redrawText() {
                var content, h, v = 0, v2, captures, c,
                    parentHeight = elementWithHiddenOverflow.height(),
                    reReduceMode = options.reduceMode == "char" ? reLastChar : reLastWord;
                do {
                    if ( content ) {
                        captures = null;
                        v2 = 0;
                        do {
                            if ( captures === null) {
                                captures = [];
                            } else {
                                c = RegExp.$1;
                                if ( c.charAt(1) != '/' && captures.length && captures[0].charAt(1) == '/' && getTagName(c) == getTagName(captures[0]) ) {
                                    captures.shift();
                                } else {
                                    captures.unshift(c);
                                }
                                content = content.replace(reTagAtEnd, '')
                            }
                            content = content.replace(reDotsAtEnd, '');
                        } while (v2++ < maxTimes && reTagAtEnd.test(content));
                        content = content.replace(reReduceMode, "...");
                        if (captures && captures.length) {
                            content += captures.join("");
                        }
                        content = content.replace(reReticenceAtEnd, '...$1');
                    } else {
                        content = initialContent;
                    }
                    $this.html(content);
                    h = $this.height();
                } while (h > parentHeight && v++ < maxTimes);
            }
            function getTagName(str) {
                return str && str.replace(reTagName, "$1");
            }
            redrawText();
            if ( options.resizable !== false && ! prepared ) {
                var redrawing = null;
                elementWithHiddenOverflow.resize(function() {
                    if (redrawing) clearTimeout(redrawing);
                    redrawing = setTimeout(redrawText, 30);
                });
            }
        });
    }
})(jQuery);
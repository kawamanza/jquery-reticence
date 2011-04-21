(function($) {
    $.fn.reticence = function(options) {
        if (! options) options = {};
        var reExtraSpace = /[\s\r\n][\s\r\n]+/g;
        return this.each(function() {
            var $this = $(this),
                initialContent = $this.html().replace(reExtraSpace, ' '),
                initialText = $this.text().replace(reExtraSpace, ' '),
                maxTimes = initialText.length * 2 + 100,
                elementWithHiddenOverflow = null;
            $this.parents().each(function() {
                var $node = $(this);
                if ($node.css("overflow") == "hidden") elementWithHiddenOverflow = $node;
                return elementWithHiddenOverflow == null;
            })
            if (elementWithHiddenOverflow == null) return;
            function redrawText() {
                var content, h, v = 0, v2, captures, c,
                    reTagAtEnd = /\s*(<[^>]+>)$/,
                    reDotsAtEnd = /[\s\.]+$/,
                    reLastWord = /\s*[^>\s]+\s*$/,
                    reLastChar = /[\s\.]*[^\s][\s\.]*$/,
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
                        content = content.replace(/<[^>]*>\s*\.\.\.\s*<\/[^>]*>\s*$/, '...');
                    } else {
                        content = initialContent;
                    }
                    $this.html(content);
                    h = $this.height();
                } while (h > parentHeight && v++ < maxTimes);
            }
            function getTagName(str) {
                return str && str.replace(/^<\/?([^\s>]+).*$/, "$1");
            }
            redrawText();
            var redrawing = null;
            if ( options.resizable !== false ) elementWithHiddenOverflow.resize(function() {
              if (redrawing) clearTimeout(redrawing);
              redrawing = setTimeout(redrawText, 25);
            });
        });
    }
})(jQuery);
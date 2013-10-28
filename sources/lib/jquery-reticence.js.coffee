do ($ = jQuery) ->
  dataNamespace = "reticence"
  reticentClass = "reticent"
  TAG_NAME = /^\s*<\/?([^\s>]+).*$/m

  findContainer = (element) ->
    data = ancestor: element
    element.parents().each ->
      node = $ @
      attr = if node.css("overflow") is "hidden" then "container" else "ancestor"
      data[attr] = node
      attr is "container"
    if data.container
      children = data.container.children()
      ancestor = data.ancestor
      if children.length isnt 1 or ancestor is element
        ancestor = $ '<div style="height: auto;">'
        children.appendTo ancestor
        ancestor.appendTo data.container
        data.ancestor = ancestor
    else
      throw "Could not find container with 'overflow: hidden' style"
    data

  tagName = (str) -> str and str.replace TAG_NAME, "$1"

  redraw = (element) ->
    data = element.data dataNamespace
    scan = data.scan
    ancestor = data.ancestor
    container = data.container
    last = scan.length - 1
    captures = []
    loop
      if html
        loop
          capture = scan[last--]
          isCapturedTag = c.indexOf("<") + 1
          if isCapturedTag
            if capture.charAt(1) isnt "/" and captures.length and captures[0].indexOf("</") isnt -1 and tagName(capture) is tagName(captures[0])
              captures.shift()
            else
              captures.unshift capture
          len = len - capture.length
          html = html.substr 0, len
          break if last is -1 or not isCapturedTag
        element.html html + "..." + captures.join("")
        unless reticent
          reticent = true
          container.addClass reticentClass
      else
        html = scan.join ""
        len = html.length
        reticent = false
        container.removeClass reticentClass
        element.html html
        cHeight = container.height()
      aHeight = ancestor.height()
      break if aHeight <= cHeight or last is -1
    return

  bindRedraw = (element) ->
    r = null
    f = ->
      redraw element
      r = null
      return
    element.data(dataNamespace).container.resize ->
      clearTimeout r if r
      r = setTimeout f, 30
      return
    return

  applyReticence = (element, options) ->
    element = $ element
    data = element.data dataNamespace
    return redraw element if data
    data = findContainer element
    regex = main.matchers[options.reduceMode or "char"]
    data.scan = data.text.match regex
    element.data dataNamespace, data
    redraw element
    bindRedraw element if options.resizable
    return

  main = (options) ->
    options = $.extend {}, options
    @each ->
      applyReticence @, options
      return

  main.matchers =
    char: /\s*(?:<.*?>|[^\s<])/gm
    word: /\s*(?:<.*?>|[^\s<]+)/gm

  $.fn.reticence = main

  return

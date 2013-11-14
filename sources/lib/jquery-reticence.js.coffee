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
      attr is "ancestor"
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

  checkCapture = (element, o, html) ->
    scan = o.scan
    captures = o.captures
    loop
      capture = scan[o.last--]
      isCapturedTag = capture.indexOf("<") + 1
      if isCapturedTag
        if capture.charAt(1) isnt "/" and captures.length and captures[0].indexOf("</") isnt -1 and tagName(capture) is tagName(captures[0])
          captures.shift()
        else
          captures.unshift capture
      o.len = o.len - capture.length
      html = html.substr 0, o.len
      break if o.last is -1 or not isCapturedTag
    element.html html + "..." + captures.join("")
    unless o.reticent
      o.reticent = true
      o.container.addClass reticentClass
    return

  redraw = (element) ->
    data = element.data dataNamespace
    ancestor = data.ancestor
    o =
      scan: data.scan
      container: data.container
      last: data.scan.length - 1
      captures: []
    loop
      if html
        checkCapture element, o, html
      else
        html = o.scan.join ""
        o.len = html.length
        o.reticent = false
        o.container.removeClass reticentClass
        element.html html
        cHeight = o.container.height()
      aHeight = ancestor.height()
      break if aHeight <= cHeight or o.last is -1
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
    data.text = element.html()
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

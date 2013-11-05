do (window = @) ->
  $ = window.jQuery

  given "lorem", -> '<span id="content">Lorem ipsum <strong>dolor sit amet, <a href="#test">consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in</a> reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa</strong> qui officia deserunt mollit anim id est laborum.</span>'
  given "inner_struct", -> given.lorem
  given "style", -> "width: 250px; height: 200px"
  given "struct", ->
    defaultStyle = "overflow: hidden; border: 1px solid Red"
    """
    <div id="container" style="#{defaultStyle}; #{given.style}">
      #{given.inner_struct}
    </div>
    """
  given "container", ->
    $("#container").remove()
    $(given.struct).appendTo("body")
  given "content", -> given.container.find("#content")

  describe "API", ->
    it "should respond to 'reticence'", ->
      expect($).not.toBeUndefined('$')
      expect($.fn).not.toBeUndefined('$.fn')
      expect($.fn.reticence).not.toBeUndefined('$.fn.reticence')
      return
    return

  describe "DOM", ->
    it "should wrap content into a DIV", ->
      expect(given.container.css("overflow")).toBe("hidden")
      expect(given.container.children().length).toBe(1)
      expect(given.container.children()[0].nodeName).toEqual("SPAN")
      given.content.reticence()
      expect(given.container.children().length).toBe(1)
      expect(given.container.children()[0].nodeName).toEqual("DIV")
      return
    it "should add 'reticent' class to container and change the content", ->
      expect(given.container.hasClass('reticent')).toBeFalsy()
      expect(given.content.parent().html().trim()).toEqual(given.lorem)
      given.content.reticence()
      expect(given.container.hasClass('reticent')).toBe(true, "isn't reticent")
      expect(given.content.parent().html().trim()).not.toEqual(given.lorem)
      expect(given.content.parent().html().trim()).toMatch(/\.\.\.(?:<\/[^>]+>)+$/)
      return
    describe "when no width or height specified", ->
      given "style", -> "width: auto; height: auto"
      it "should not add 'reticent' class to container and don't change the content", ->
        expect(given.container.hasClass('reticent')).toBeFalsy()
        expect(given.content.parent().html().trim()).toEqual(given.lorem)
        given.content.reticence()
        expect(given.container.hasClass('reticent')).toBe(false, "is reticent")
        expect(given.content.parent().html().trim()).toEqual(given.lorem)
        return
      return
    return

  return

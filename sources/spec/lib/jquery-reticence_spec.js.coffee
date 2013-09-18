do (window = @) ->
  $ = window.jQuery
  describe "API", ->
    it "should respond to 'reticence'", ->
      expect($).not.toBeUndefined('$')
      expect($.fn).not.toBeUndefined('$.fn')
      expect($.fn.reticence).not.toBeUndefined('$.fn.reticence')
      return
    return
  return

do (window = @) ->

  LazyProperties = ->

  describe = window.describe

  suites = []
  ctx = {}
  values = {}
  window.describe = (description, specDefinitions) ->
    describe.call @, description, ->
      suite = jasmine.getEnv().currentSuite
      suites.unshift suite
      try
        unless suite.LazyProperties
          LP = if suites.length is 1 then LazyProperties else suites[1].LazyProperties
          suite.LazyProperties = ->
          suite.LazyProperties:: = new LP()
          beforeEach ->
            ctx = new suite.LazyProperties()
            return
        specDefinitions.call @
      finally
        suites.shift()
      return
    return

  given = (name, block) ->
    throw "block required" unless block?
    LP = if suites.length then suites[0].LazyProperties else LazyProperties
    LP::.__defineGetter__ name, ->
      unless values.hasOwnProperty name
        values[name] = block()
      values[name]
    unless given.__lookupGetter__ name
      given.__defineGetter__ name, ->
        unless values.hasOwnProperty name
          values[name] = ctx[name]
        values[name]
    return

  window.given = given
  window.lazy = given

  afterEach ->
    values = {}
    ctx = {}
    window.given = given
    window.lazy = given
    return

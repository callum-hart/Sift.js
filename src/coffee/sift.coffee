###
The MIT License (MIT)

Copyright (c) 2016 Callum Hart

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
###

noop = ->

###
************************************************************
 Sift is the public interface used by the outside world.
************************************************************
###

class Sift
  defaultOptions:
    onFilterApplied: noop # External hook
    onFilterCleared: noop # External hook

  version: "0.1.1"

  constructor: (selector, options) ->
    options = Utils.extend {}, @defaultOptions, options

    switch options.type
      when "checkbox" then new ListFilter selector, options
      when "radio" then new ListFilter selector, options
      when "calendar" then new CalendarFilter selector, options
      when "multi_calendar" then new CalendarFilter selector, options

###
************************************************************
End of Sift
************************************************************
###

###
************************************************************
CommonFilter implements shared things for all filters
************************************************************
###

class CommonFilter
  filtersShowing: no

  constructor: ->
    @elm = @handleElm()

    unless @elm
      console.warn "Slab couldn't initialize #{@selector} as it's not in the DOM"

  # You can initialize Sift with a class/id selector or with an actual DOM element.
  handleElm: ->
    if typeof @selector is "string"
      elm = document.querySelector @selector
    else if typeof @selector is "object"
      # Check that object is an actual dom element.
      if @selector.nodeName
        elm = @selector
    elm

  # ************************************************************
  # Events
  # ************************************************************

  # Persistent events are ones that need to be listened to all the time.
  bindCommonPersistentEvents: ->
    @filterButton.addEventListener "click", @openFilters

  # Events are ones that need to be listened to when the filter is open.
  bindEvents: ->
    document.addEventListener "click", @closeFilters

  # Stop listening to events (i.e when the filter is closed)
  unbindEvents: ->
    document.removeEventListener "click", @closeFilters

  # ************************************************************
  # Actions
  # ************************************************************

  openFilters: (e) =>
    e.preventDefault()
    @bindEvents()
    @showFilters()

  closeFilters: (e) =>
    if $(e.target).parents(".sift-container").length < 1
      @hideFilters()
      @unbindEvents()

  clearFilter: ->
    @hideFilters()
    @options.onFilterCleared()

  # ************************************************************
  # Templating
  # ************************************************************

  render: (elm, template) ->
    elm.innerHTML = template

  handleTemplate: ->
    # Handle common template needs of all filters.
    @template = """
                <a href="" class="sift-link">
                  <span class="sift-filter-name">#{@options.displayName}</span>
                  <span class="sift-active-filter-text"></span>
                </a>
                <div class="sift-dropdown">
                  <a href="" class="sift-clear">Clear filter</a>
                  <div class="sift-dropdown-inner"></div>
                </div>
                """

  handleInitialRender: ->
    @render @elm, @template
    # Now that sift is rendered we can do DOM related things.
    @filterButton = @elm.querySelector ".sift-link"
    @filterName = @elm.querySelector ".sift-filter-name"
    @activeFilterText = @elm.querySelector ".sift-active-filter-text"
    @dropdown = @elm.querySelector ".sift-dropdown"
    @clear = @elm.querySelector ".sift-clear"
    @dropdownInner = @elm.querySelector ".sift-dropdown-inner"
    Utils.addClass "sift-container", @elm
    @bindCommonPersistentEvents()

  showFilters: ->
    @filtersShowing = yes
    Utils.addClass "filters-showing", @elm

  hideFilters: ->
    @filtersShowing = no
    Utils.removeClass "filters-showing", @elm

###
************************************************************
End of CommonFilter
************************************************************
###

###
************************************************************
ListFilter used by radio & checkbox filters
************************************************************
###

class ListFilter extends CommonFilter
  constructor: (@selector, @options) ->
    super

    if @elm
      @filters = @options.filters
      @activeFilters = []
      @handleTemplate()
      @handleFilters()
      @handleActiveFilterText()

  # ************************************************************
  # Events
  # ************************************************************

  bindEvents: ->
    super
    @dropdownInner.addEventListener "click", @dropdownClicked
    @clear.addEventListener "click", @clearFilter

  unbindEvents: ->
    super
    @dropdownInner.removeEventListener "click", @dropdownClicked
    @clear.addEventListener "click", @clearFilter

  # ************************************************************
  # Actions
  # ************************************************************

  dropdownClicked: (e) =>
    if e.target.tagName is "INPUT"
      @activeFilters = []

      for input, index in @inputElms
        if input.checked
          filter = input.value
          if Utils.isNumber filter then filter = parseInt filter

          @activeFilters.push filter

      @handleActiveFilterText()
      if @activeFilters.length isnt 0
        if @options.type is "radio"
          @hideFilters()
          @activeFilters = @activeFilters[0]

        @options.onFilterApplied @activeFilters
      else
        @options.onFilterCleared()

  clearFilter: (e) =>
    e.preventDefault()
    @activeFilters = []
    @handleActiveFilterText()
    for input, index in @inputElms
      input.checked = no
    super

  # ************************************************************
  # Templating
  # ************************************************************

  handleTemplate: ->
    super
    # Handle specific template needs of ListFilters.
    @filterSnippet = """
                     <label class="sift-label">
                      <input type="#{@options.type}" name="{{name}}" value="{{value}}" {{checked}}>
                      <span>{{displayName}}</span>
                     </label>
                     """
    @handleInitialRender()

  handleFilters: ->
    filtersSnippet = ""

    for filter, index in @filters
      checked = ""

      if @options.activeFilter
        multipleActiveFilters = typeof @options.activeFilter is "object"

        if multipleActiveFilters
          unless @options.type is "radio"
            filterActive = Utils.where null, filter.value, @options.activeFilter
            if filterActive
              checked = "checked"
              @activeFilters.push filter.value
          else
            console.warn "Can't have multiple active filters for radio buttons"
        else
          if Utils.isNumber @options.activeFilter then @options.activeFilter = parseInt @options.activeFilter
          if @options.activeFilter is filter.value
            checked = "checked"
            @activeFilters.push filter.value

      filtersSnippet += @filterSnippet.replace("{{displayName}}", filter.displayName)
                                      .replace("{{name}}", @options.displayName)
                                      .replace("{{value}}", filter.value)
                                      .replace("{{checked}}", checked)

    @render @dropdownInner, filtersSnippet
    @inputElms = @dropdownInner.getElementsByTagName "input"

  handleActiveFilterText: ->
    if @activeFilters.length isnt 0
      activeFilterText = ""
      @render @filterName, "#{@options.displayName}:"

      for filter, index in @activeFilters
        if index isnt 0 then activeFilterText += ", "
        if Utils.isNumber filter then filter = parseInt filter
        activeFilterText += Utils.where("value", filter, @filters)[0].displayName

      @render @activeFilterText, activeFilterText
      Utils.addClass "with-active-filter", @elm
    else
      @render @filterName, "#{@options.displayName}"
      @render @activeFilterText, ""
      Utils.removeClass "with-active-filter", @elm

###
************************************************************
End of ListFilter
************************************************************
###

###
************************************************************
CalendarFilter used by date & date range filters
************************************************************
###

class CalendarFilter extends CommonFilter
  constructor: (@selector, @options) ->
    super

    if @elm
      @activeDate = @options.calendarOptions?.existingDate
      @activeDateRange = @options.calendarOptions?.existingDateRange
      @handleTemplate()
      @handleFilters()
      @handleActiveFilterText()

  # ************************************************************
  # Events
  # ************************************************************

  bindEvents: ->
    super
    @clear.addEventListener "click", @clearFilter

  unbindEvents: ->
    super
    @clear.addEventListener "click", @clearFilter

  # ************************************************************
  # Hooks
  #   Subscribe to DateJust or DateRange hooks
  # ************************************************************

  handleDateJustHooks: ->
    @dateJust.options.onDateSelected = (date) =>
      @activeDate = date
      @activeDateRange = null
      @handleActiveFilterText()
      @options.onFilterApplied date

    @dateJust.options.onDateRangeSelected = (startDate, endDate) =>
      @activeDate = null
      @activeDateRange = [startDate, endDate]
      @handleActiveFilterText()
      @options.onFilterApplied startDate, endDate

  handleDateRangeHooks: ->
    @dateRange.options.onDateRangeSelected = (startDate, endDate) =>
      @activeDateRange = [startDate, endDate]
      @handleActiveFilterText()
      @options.onFilterApplied startDate, endDate

  # ************************************************************
  # Actions
  # ************************************************************

  clearFilter: (e) =>
    e.preventDefault()

    if @options.type is "calendar"
      @dateJust.reset()
    else if @options.type is "multi_calendar"
      @dateRange.reset()

    @activeDate = null
    @activeDateRange = null
    @handleActiveFilterText()
    super

  # ************************************************************
  # Templating
  # ************************************************************

  handleTemplate: ->
    super
    @handleInitialRender()

  handleFilters: ->
    @render @dropdownInner, """<div class="sift-calendar-wrap"></div>"""
    @calendarWrap = @dropdownInner.querySelector ".sift-calendar-wrap"
    Utils.addClass "without-scroll", @elm

    if @options.type is "calendar"
      @dateJust = new DateJust @calendarWrap, @options.calendarOptions
      @handleDateJustHooks()
    else if @options.type is "multi_calendar"
      @dateRange = new DateRange @calendarWrap, @options.calendarOptions
      Utils.addClass "with-multi-calendar", @elm
      @handleDateRangeHooks()

  handleActiveFilterText: ->
    if @activeDate or @activeDateRange
      @render @filterName, "#{@options.displayName}:"
      Utils.addClass "with-active-filter", @elm

      if @activeDate
        @render @activeFilterText, @activeDate.toDateString() # TODO: date format might need to be an option?
      else if @activeDateRange
        @render @activeFilterText, "#{@activeDateRange[0].toDateString()} - #{@activeDateRange[1].toDateString()}"
    else
      @render @filterName, "#{@options.displayName}"
      Utils.removeClass "with-active-filter", @elm
      @render @activeFilterText, ""

###
************************************************************
 End of CalendarFilter
************************************************************
###

window.Sift = Sift

Utils =
  extend: (target, objects...) ->
    for object in objects
      target[key] = val for key, val of object

    target

  where: (key, value, array) ->
    results = []

    array.filter (object) ->
      if typeof object is "object"
        results.push object if object[key] == value
      else
        results.push object if object == value

    if results.length > 0
      results

  addClass: (className, elm) ->
    elm.classList.add className

  removeClass: (className, elm) ->
    elm.classList.remove className

  isNumber: (thing) ->
    !isNaN(parseInt(thing))
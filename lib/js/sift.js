
/*
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
 */

(function() {
  var CalendarFilter, CommonFilter, ListFilter, Sift, Utils, noop,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  noop = function() {};


  /*
  ************************************************************
   Sift is the public interface used by the outside world.
  ************************************************************
   */

  Sift = (function() {
    Sift.prototype.defaultOptions = {
      onFilterApplied: noop,
      onFilterCleared: noop
    };

    Sift.prototype.version = "0.1.1";

    function Sift(selector, options) {
      options = Utils.extend({}, this.defaultOptions, options);
      switch (options.type) {
        case "checkbox":
          new ListFilter(selector, options);
          break;
        case "radio":
          new ListFilter(selector, options);
          break;
        case "calendar":
          new CalendarFilter(selector, options);
          break;
        case "multi_calendar":
          new CalendarFilter(selector, options);
      }
    }

    return Sift;

  })();


  /*
  ************************************************************
  End of Sift
  ************************************************************
   */


  /*
  ************************************************************
  CommonFilter implements shared things for all filters
  ************************************************************
   */

  CommonFilter = (function() {
    CommonFilter.prototype.filtersShowing = false;

    function CommonFilter() {
      this.closeFilters = bind(this.closeFilters, this);
      this.openFilters = bind(this.openFilters, this);
      this.elm = this.handleElm();
      if (!this.elm) {
        console.warn("Slab couldn't initialize " + this.selector + " as it's not in the DOM");
      }
    }

    CommonFilter.prototype.handleElm = function() {
      var elm;
      if (typeof this.selector === "string") {
        elm = document.querySelector(this.selector);
      } else if (typeof this.selector === "object") {
        if (this.selector.nodeName) {
          elm = this.selector;
        }
      }
      return elm;
    };

    CommonFilter.prototype.bindCommonPersistentEvents = function() {
      return this.filterButton.addEventListener("click", this.openFilters);
    };

    CommonFilter.prototype.bindEvents = function() {
      return document.addEventListener("click", this.closeFilters);
    };

    CommonFilter.prototype.unbindEvents = function() {
      return document.removeEventListener("click", this.closeFilters);
    };

    CommonFilter.prototype.openFilters = function(e) {
      e.preventDefault();
      this.bindEvents();
      return this.showFilters();
    };

    CommonFilter.prototype.closeFilters = function(e) {
      if ($(e.target).parents(".sift-container").length < 1) {
        this.hideFilters();
        return this.unbindEvents();
      }
    };

    CommonFilter.prototype.clearFilter = function() {
      this.hideFilters();
      return this.options.onFilterCleared();
    };

    CommonFilter.prototype.render = function(elm, template) {
      return elm.innerHTML = template;
    };

    CommonFilter.prototype.handleTemplate = function() {
      return this.template = "<a href=\"\" class=\"sift-link\">\n  <span class=\"sift-filter-name\">" + this.options.displayName + "</span>\n  <span class=\"sift-active-filter-text\"></span>\n</a>\n<div class=\"sift-dropdown\">\n  <a href=\"\" class=\"sift-clear\">Clear filter</a>\n  <div class=\"sift-dropdown-inner\"></div>\n</div>";
    };

    CommonFilter.prototype.handleInitialRender = function() {
      this.render(this.elm, this.template);
      this.filterButton = this.elm.querySelector(".sift-link");
      this.filterName = this.elm.querySelector(".sift-filter-name");
      this.activeFilterText = this.elm.querySelector(".sift-active-filter-text");
      this.dropdown = this.elm.querySelector(".sift-dropdown");
      this.clear = this.elm.querySelector(".sift-clear");
      this.dropdownInner = this.elm.querySelector(".sift-dropdown-inner");
      Utils.addClass("sift-container", this.elm);
      return this.bindCommonPersistentEvents();
    };

    CommonFilter.prototype.showFilters = function() {
      this.filtersShowing = true;
      return Utils.addClass("filters-showing", this.elm);
    };

    CommonFilter.prototype.hideFilters = function() {
      this.filtersShowing = false;
      return Utils.removeClass("filters-showing", this.elm);
    };

    return CommonFilter;

  })();


  /*
  ************************************************************
  End of CommonFilter
  ************************************************************
   */


  /*
  ************************************************************
  ListFilter used by radio & checkbox filters
  ************************************************************
   */

  ListFilter = (function(superClass) {
    extend(ListFilter, superClass);

    function ListFilter(selector1, options1) {
      this.selector = selector1;
      this.options = options1;
      this.clearFilter = bind(this.clearFilter, this);
      this.dropdownClicked = bind(this.dropdownClicked, this);
      ListFilter.__super__.constructor.apply(this, arguments);
      if (this.elm) {
        this.filters = this.options.filters;
        this.activeFilters = [];
        this.handleTemplate();
        this.handleFilters();
        this.handleActiveFilterText();
      }
    }

    ListFilter.prototype.bindEvents = function() {
      ListFilter.__super__.bindEvents.apply(this, arguments);
      this.dropdownInner.addEventListener("click", this.dropdownClicked);
      return this.clear.addEventListener("click", this.clearFilter);
    };

    ListFilter.prototype.unbindEvents = function() {
      ListFilter.__super__.unbindEvents.apply(this, arguments);
      this.dropdownInner.removeEventListener("click", this.dropdownClicked);
      return this.clear.addEventListener("click", this.clearFilter);
    };

    ListFilter.prototype.dropdownClicked = function(e) {
      var filter, i, index, input, len, ref;
      if (e.target.tagName === "INPUT") {
        this.activeFilters = [];
        ref = this.inputElms;
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          input = ref[index];
          if (input.checked) {
            filter = input.value;
            if (Utils.isNumber(filter)) {
              filter = parseInt(filter);
            }
            this.activeFilters.push(filter);
          }
        }
        this.handleActiveFilterText();
        if (this.activeFilters.length !== 0) {
          if (this.options.type === "radio") {
            this.hideFilters();
            this.activeFilters = this.activeFilters[0];
          }
          return this.options.onFilterApplied(this.activeFilters);
        } else {
          return this.options.onFilterCleared();
        }
      }
    };

    ListFilter.prototype.clearFilter = function(e) {
      var i, index, input, len, ref;
      e.preventDefault();
      this.activeFilters = [];
      this.handleActiveFilterText();
      ref = this.inputElms;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        input = ref[index];
        input.checked = false;
      }
      return ListFilter.__super__.clearFilter.apply(this, arguments);
    };

    ListFilter.prototype.handleTemplate = function() {
      ListFilter.__super__.handleTemplate.apply(this, arguments);
      this.filterSnippet = "<label class=\"sift-label\">\n <input type=\"" + this.options.type + "\" name=\"{{name}}\" value=\"{{value}}\" {{checked}}>\n <span>{{displayName}}</span>\n</label>";
      return this.handleInitialRender();
    };

    ListFilter.prototype.handleFilters = function() {
      var checked, filter, filterActive, filtersSnippet, i, index, len, multipleActiveFilters, ref;
      filtersSnippet = "";
      ref = this.filters;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        filter = ref[index];
        checked = "";
        if (this.options.activeFilter) {
          multipleActiveFilters = typeof this.options.activeFilter === "object";
          if (multipleActiveFilters) {
            if (this.options.type !== "radio") {
              filterActive = Utils.where(null, filter.value, this.options.activeFilter);
              if (filterActive) {
                checked = "checked";
                this.activeFilters.push(filter.value);
              }
            } else {
              console.warn("Can't have multiple active filters for radio buttons");
            }
          } else {
            if (Utils.isNumber(this.options.activeFilter)) {
              this.options.activeFilter = parseInt(this.options.activeFilter);
            }
            if (this.options.activeFilter === filter.value) {
              checked = "checked";
              this.activeFilters.push(filter.value);
            }
          }
        }
        filtersSnippet += this.filterSnippet.replace("{{displayName}}", filter.displayName).replace("{{name}}", this.options.displayName).replace("{{value}}", filter.value).replace("{{checked}}", checked);
      }
      this.render(this.dropdownInner, filtersSnippet);
      return this.inputElms = this.dropdownInner.getElementsByTagName("input");
    };

    ListFilter.prototype.handleActiveFilterText = function() {
      var activeFilterText, filter, i, index, len, ref;
      if (this.activeFilters.length !== 0) {
        activeFilterText = "";
        this.render(this.filterName, this.options.displayName + ":");
        ref = this.activeFilters;
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          filter = ref[index];
          if (index !== 0) {
            activeFilterText += ", ";
          }
          if (Utils.isNumber(filter)) {
            filter = parseInt(filter);
          }
          activeFilterText += Utils.where("value", filter, this.filters)[0].displayName;
        }
        this.render(this.activeFilterText, activeFilterText);
        return Utils.addClass("with-active-filter", this.elm);
      } else {
        this.render(this.filterName, "" + this.options.displayName);
        this.render(this.activeFilterText, "");
        return Utils.removeClass("with-active-filter", this.elm);
      }
    };

    return ListFilter;

  })(CommonFilter);


  /*
  ************************************************************
  End of ListFilter
  ************************************************************
   */


  /*
  ************************************************************
  CalendarFilter used by date & date range filters
  ************************************************************
   */

  CalendarFilter = (function(superClass) {
    extend(CalendarFilter, superClass);

    function CalendarFilter(selector1, options1) {
      var ref, ref1;
      this.selector = selector1;
      this.options = options1;
      this.clearFilter = bind(this.clearFilter, this);
      CalendarFilter.__super__.constructor.apply(this, arguments);
      if (this.elm) {
        this.activeDate = (ref = this.options.calendarOptions) != null ? ref.existingDate : void 0;
        this.activeDateRange = (ref1 = this.options.calendarOptions) != null ? ref1.existingDateRange : void 0;
        this.handleTemplate();
        this.handleFilters();
        this.handleActiveFilterText();
      }
    }

    CalendarFilter.prototype.bindEvents = function() {
      CalendarFilter.__super__.bindEvents.apply(this, arguments);
      return this.clear.addEventListener("click", this.clearFilter);
    };

    CalendarFilter.prototype.unbindEvents = function() {
      CalendarFilter.__super__.unbindEvents.apply(this, arguments);
      return this.clear.addEventListener("click", this.clearFilter);
    };

    CalendarFilter.prototype.handleDateJustHooks = function() {
      this.dateJust.options.onDateSelected = (function(_this) {
        return function(date) {
          _this.activeDate = date;
          _this.activeDateRange = null;
          _this.handleActiveFilterText();
          return _this.options.onFilterApplied(date);
        };
      })(this);
      return this.dateJust.options.onDateRangeSelected = (function(_this) {
        return function(startDate, endDate) {
          _this.activeDate = null;
          _this.activeDateRange = [startDate, endDate];
          _this.handleActiveFilterText();
          return _this.options.onFilterApplied(startDate, endDate);
        };
      })(this);
    };

    CalendarFilter.prototype.handleDateRangeHooks = function() {
      return this.dateRange.options.onDateRangeSelected = (function(_this) {
        return function(startDate, endDate) {
          _this.activeDateRange = [startDate, endDate];
          _this.handleActiveFilterText();
          return _this.options.onFilterApplied(startDate, endDate);
        };
      })(this);
    };

    CalendarFilter.prototype.clearFilter = function(e) {
      e.preventDefault();
      if (this.options.type === "calendar") {
        this.dateJust.reset();
      } else if (this.options.type === "multi_calendar") {
        this.dateRange.reset();
      }
      this.activeDate = null;
      this.activeDateRange = null;
      this.handleActiveFilterText();
      return CalendarFilter.__super__.clearFilter.apply(this, arguments);
    };

    CalendarFilter.prototype.handleTemplate = function() {
      CalendarFilter.__super__.handleTemplate.apply(this, arguments);
      return this.handleInitialRender();
    };

    CalendarFilter.prototype.handleFilters = function() {
      this.render(this.dropdownInner, "<div class=\"sift-calendar-wrap\"></div>");
      this.calendarWrap = this.dropdownInner.querySelector(".sift-calendar-wrap");
      Utils.addClass("without-scroll", this.elm);
      if (this.options.type === "calendar") {
        this.dateJust = new DateJust(this.calendarWrap, this.options.calendarOptions);
        return this.handleDateJustHooks();
      } else if (this.options.type === "multi_calendar") {
        this.dateRange = new DateRange(this.calendarWrap, this.options.calendarOptions);
        Utils.addClass("with-multi-calendar", this.elm);
        return this.handleDateRangeHooks();
      }
    };

    CalendarFilter.prototype.handleActiveFilterText = function() {
      if (this.activeDate || this.activeDateRange) {
        this.render(this.filterName, this.options.displayName + ":");
        Utils.addClass("with-active-filter", this.elm);
        if (this.activeDate) {
          return this.render(this.activeFilterText, this.activeDate.toDateString());
        } else if (this.activeDateRange) {
          return this.render(this.activeFilterText, (this.activeDateRange[0].toDateString()) + " - " + (this.activeDateRange[1].toDateString()));
        }
      } else {
        this.render(this.filterName, "" + this.options.displayName);
        Utils.removeClass("with-active-filter", this.elm);
        return this.render(this.activeFilterText, "");
      }
    };

    return CalendarFilter;

  })(CommonFilter);


  /*
  ************************************************************
   End of CalendarFilter
  ************************************************************
   */

  window.Sift = Sift;

  Utils = {
    extend: function() {
      var i, key, len, object, objects, target, val;
      target = arguments[0], objects = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      for (i = 0, len = objects.length; i < len; i++) {
        object = objects[i];
        for (key in object) {
          val = object[key];
          target[key] = val;
        }
      }
      return target;
    },
    where: function(key, value, array) {
      var results;
      results = [];
      array.filter(function(object) {
        if (typeof object === "object") {
          if (object[key] === value) {
            return results.push(object);
          }
        } else {
          if (object === value) {
            return results.push(object);
          }
        }
      });
      if (results.length > 0) {
        return results;
      }
    },
    addClass: function(className, elm) {
      return elm.classList.add(className);
    },
    removeClass: function(className, elm) {
      return elm.classList.remove(className);
    },
    isNumber: function(thing) {
      return !isNaN(parseInt(thing));
    }
  };

}).call(this);

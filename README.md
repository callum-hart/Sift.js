# Sift.js

## Configuration

### type

- **Details** Type of filter. Available options are: `checkbox`, `radio`, `calendar`, `multi_calender`.
- **Required** Yes
- **Type** `<String>`
- **Usage** `type: "checkbox"`

### displayName
*TODO: rename displayName to labelName. The term `displayName` is also used in List filters which is a bit confusing.*

- **Details** Name of filter (shown to user).
- **Required** Yes
- **Type** `<String>`
- **Usage** `displayName: "Department"`

## List Configuration
*Additional configuration options when [type]() is either "checkbox" or "radio"*

### filters

- **Details** Filter models to render.
- **Type** `Array <Object>`
- **Required** Yes
- **Usage:**
  ```
  filters: [
    {
      "value": 1,
      "displayName": "Name"
    },
    {
      "value": 2,
      "displayName": "Email"
    }
  ]

  /*
    value is what can be passed to server.
    displayName is what the user sees.
  */
  ```

### activeFilter

- **Details** Select an existing filter by value.
- **Required** No
- **Type** Has to match type of value attribute.
- **Usage** `activeFilter: "Name"<String>` or `activeFilter: 1<Number>`

## Calendar Configuration
*Additional configuration options when [type]() is either "calendar" or "multi_calendar"*

### calendarOptions

- **Details** Configuration options for calendar.
- **Required** No
- **Type** `<Object>`
- **Usage:**

  When [type]() is "calendar" calendarOptions supports all of the configuration options [DateJust.js]() has:

  ```
  calendarOptions: {
    existingDate: new Date(2015, 2, 25)
  }
  ```

  When [type]() is "multi_calendar" calendarOptions supports all of the configuration options [DateRange.js]() has:

  ```
  calendarOptions: {
    minDate: new Date(2015, 0, 1),
    maxDate: new Date(2015, 11, 31),
    existingDateRange: [new Date(2015, 10, 5), new Date(2015, 11, 22)]
  }
  ```

## Callbacks

### onFilterApplied
`onFilterApplied: (...args) {}`

- **Details** When a filter is applied.
- **Arguments:**

  When [type]() is "checkbox" or "radio" ...args is: `(activeFilter)`.

  When [type]() is "calendar" ...args can be: `(singleDate)` or `(startDate, endDate)`.

  When [type]() is "multi_calendar" ...args is: `(startDate, endDate)`.

  In cases where ...args has multiple arguments the callback is only called when both arguments exist.

### onFilterCleared
`onFilterCleared: () {}`

- **Details** When a filter is cleared.

### Markup

The HTML generated by Sift depends on option [type]().

*When type is "checkbox" HTML is:*

```html
<div class="sift-container">
  <a href="" class="sift-link">
    <span class="sift-filter-name">{{displayName}}</span>
    <span class="sift-active-filter-text">{{activeFilter}}</span>
  </a>
  <div class="sift-dropdown">
    <a href="" class="sift-clear">Clear filter</a>
    <div class="sift-dropdown-inner">
      <label class="sift-label">
        <input type="checkbox" name="{{displayName}}" value="{{filters[].value}}">
        <span>{{filters[].displayName}}</span>
      </label>
    </div>
  </div>
</div>
```

*When type is "radio" HTML is:*

```html
<div class="sift-container">
  <a href="" class="sift-link">
    <span class="sift-filter-name">{{displayName}}</span>
    <span class="sift-active-filter-text">{{activeFilter}}</span>
  </a>
  <div class="sift-dropdown">
    <a href="" class="sift-clear">Clear filter</a>
    <div class="sift-dropdown-inner">
      <label class="sift-label">
        <input type="radio" name="{{displayName}}" value="{{filters[].value}}">
        <span>{{filters[].displayName}}</span>
      </label>
    </div>
  </div>
</div>
```

*When type is "calendar" HTML is:*

```html
<div class="sift-container without-scroll">
  <a href="" class="sift-link">
    <span class="sift-filter-name">{{displayName}}</span>
    <span class="sift-active-filter-text">{{activeFilter}}</span>
  </a>
  <div class="sift-dropdown">
    <a href="" class="sift-clear">Clear filter</a>
    <div class="sift-dropdown-inner">
      <div class="sift-calendar-wrap dj-container">
        {{DateJust.js rendered here}}
      </div>
    </div>
  </div>
</div>
```

*When type is "multi_calendar" HTML is:*

```html
<div class="sift-container without-scroll with-multi-calendar">
  <a href="" class="sift-link">
    <span class="sift-filter-name">{{displayName}}</span>
    <span class="sift-active-filter-text">{{activeFilter}}</span>
  </a>
  <div class="sift-dropdown">
    <a href="" class="sift-clear">Clear filter</a>
    <div class="sift-dropdown-inner">
      <div class="sift-calendar-wrap dr-container">
        {{DateRange.js rendered here}}
      </div>
    </div>
  </div>
</div>
```

### Conditional CSS Classes

Classes that are applied when a certain condition is true.

#### filters-showing
`.filters-showing`

- **Condition** Applied when filter dropdown is visible.
- **Element** `.sift-container`

#### with-active-filter
`.with-active-filter`

- **Condition** Applied when a filter is selected/exists.
- **Element** `.sift-container`

#### without-scroll
`.without-scroll`

- **Condition** Applied when option type is "calendar" or "multi_calendar".
- **Element** `.sift-container`

#### with-multi-calendar
`.with-multi-calendar`

- **Condition** Applied when option type is "multi_calendar".
- **Element** `.sift-container`

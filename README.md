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

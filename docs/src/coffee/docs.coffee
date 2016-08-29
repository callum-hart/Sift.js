cars = [
  {
    "value": "asto",
    "displayName": "Aston Martin"
  }
  {
    "value": "lamb",
    "displayName": "Lamborghini"
  }
  {
    "value": "pors",
    "displayName": "Porsche"
  }
  {
    "value": "mcla",
    "displayName": "McLaren"
  }
  {
    "value": "ferr",
    "displayName": "Ferrari"
  }
  {
    "value": "bron",
    "displayName": "Bugatti Veyron"
  }
  {
    "value": "koen",
    "displayName": "Koenigsegg"
  }
]

# Example One

exampleOne = new Sift "#example-one",
  displayName: "Car manufacturers"
  type: "checkbox"
  filters: cars
  activeFilter: ["asto", "pors"]
  onFilterApplied: (activeFilter) ->
    console.log "Car manufacturers: #{activeFilter}"

# Example Two

exampleTwo = new Sift "#example-two",
  displayName: "Car manufacturer"
  type: "radio"
  filters: cars
  activeFilter: "asto"
  onFilterApplied: (activeFilter) ->
    console.log "Car manufacturer: #{activeFilter}"

# Example Three

exampleThree = new Sift "#example-three",
  type: "calendar"
  displayName: "Made on"
  calendarOptions:
    minDate: new Date(2015, 7, 20)
    maxDate: new Date(2017, 7, 20)
    existingDate: new Date(2016, 7, 20)
    dragSelection: no
  onFilterApplied: (singleDate) ->
    console.log "Made on: #{singleDate}"

# Example Four

exampleFour = new Sift "#example-four",
  type: "calendar"
  displayName: "Made"
  calendarOptions:
    existingDateRange: [new Date(2015, 0, 1), new Date(2015, 0, 10)]
  onFilterApplied: (startDate, endDate) ->
    if endDate
      console.log "Made between: #{startDate} – #{endDate}"
    else
      console.log "Made on: #{startDate}"

# Example Five

exampleFive = new Sift "#example-five",
  type: "multi_calendar"
  displayName: "Made between"
  calendarOptions:
    existingDateRange: [new Date(2015, 0, 1), new Date(2015, 11, 25)]
  onFilterApplied: (startDate, endDate) ->
    console.log "Made between: #{startDate} – #{endDate}"

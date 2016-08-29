(function() {
  var cars, exampleFive, exampleFour, exampleOne, exampleThree, exampleTwo;

  cars = [
    {
      "value": "asto",
      "displayName": "Aston Martin"
    }, {
      "value": "lamb",
      "displayName": "Lamborghini"
    }, {
      "value": "pors",
      "displayName": "Porsche"
    }
  ];

  exampleOne = new Sift("#example-one", {
    displayName: "Car manufacturers",
    type: "checkbox",
    filters: cars,
    activeFilter: ["asto", "pors"],
    onFilterApplied: function(activeFilter) {
      return console.log("Car manufacturers: " + activeFilter);
    }
  });

  exampleTwo = new Sift("#example-two", {
    displayName: "Car manufacturer",
    type: "radio",
    filters: cars,
    activeFilter: "asto",
    onFilterApplied: function(activeFilter) {
      return console.log("Car manufacturer: " + activeFilter);
    }
  });

  exampleThree = new Sift("#example-three", {
    type: "calendar",
    displayName: "Made on",
    calendarOptions: {
      minDate: new Date(2015, 7, 20),
      maxDate: new Date(2017, 7, 20),
      existingDate: new Date(2016, 7, 20),
      dragSelection: false
    },
    onFilterApplied: function(singleDate) {
      return console.log("Made on: " + singleDate);
    }
  });

  exampleFour = new Sift("#example-four", {
    type: "calendar",
    displayName: "Made",
    calendarOptions: {
      existingDateRange: [new Date(2015, 0, 1), new Date(2015, 0, 10)]
    },
    onFilterApplied: function(startDate, endDate) {
      if (endDate) {
        return console.log("Made between: " + startDate + " – " + endDate);
      } else {
        return console.log("Made on: " + startDate);
      }
    }
  });

  exampleFive = new Sift("#example-five", {
    type: "multi_calendar",
    displayName: "Made between",
    calendarOptions: {
      existingDateRange: [new Date(2015, 0, 1), new Date(2015, 11, 25)]
    },
    onFilterApplied: function(startDate, endDate) {
      return console.log("Made between: " + startDate + " – " + endDate);
    }
  });

}).call(this);

$(document).ready(function() {
  var alphas = {
    'A': 4.00,
    'A-': 3.67,
    'B+': 3.33,
    'B': 3.00,
    'B-': 2.67,
    'C+': 2.33,
    'C': 2.00,
    'C-': 1.67,
    'D+': 1.33,
    'D': 1.00,
    'F': 0.00
  }
  var ranges = [];
  var currentRows = 0;
  var spinner = $("#spinner").spinner({
    max: 40,
    min: 1,
    stop: function(event, ui) {
      var newSize = spinner.spinner("value");
      if (spinner.spinner("isValid")) {
        updateTable(newSize);
        alert("Here");
      }
    }
  });

  setRanges();

  setupTable();

  $("#form-main-table").submit(function(event) {
    var grades = [];
    var credits = [];
    data = $(this).serializeArray();
    console.log("Data length: " + data.length);

    for (i=0; i < data.length; i++) {
      if (data[i].name == ("grade")) {
        if (data[i].value != "") {
          grades.push(data[i].value);
        }
      }
      if (data[i].name == ("credit")) {
        if (data[i].value != "") {
          credits.push(data[i].value);
        }
      }
    }
    console.log("Grades length: " + grades.length);
    console.log("Credits length: " + credits.length);

    grades = convertToProperGrades(grades);
    var gpa = calculateGPA(grades, credits);

    console.log("GPA: " + gpa);
    $("#gpa").text("GPA: " + gpa);
    $("#gpa").attr("hidden", false);

    event.preventDefault(); //Prevents page from reloading.
  });

  function Range(min, weight) {
    this.min = min;
    this.weight = weight;
  }

  function setRanges() {
    var A = new Range(96, 4.00);
    var Aminus = new Range(92, 3.67);
    var Bplus = new Range(88, 3.33);
    var B = new Range(84, 3.00);
    var Bminus = new Range(80, 2.67);
    var Cplus = new Range(76, 2.33);
    var C = new Range(72, 2.00);
    var Cminus = new Range(68, 1.67);
    var Dplus = new Range(64, 1.33);
    var D = new Range(60, 1.00);
    var F = new Range(0, 0.00);
    ranges = [A, Aminus, Bplus, B, Bminus, Cplus, C, Cminus, Dplus, D, F];
  }

  function setupTable() {
    var table = $("#main-tbody");
    var firstRow = $("<tr></tr>").appendTo(table);
    $("<th></th>").appendTo(firstRow);
    $("<th>Grade</th>").appendTo(firstRow);
    $("<th>Credits</th>").appendTo(firstRow);

    addRows(4);
    currentRows = 4;
    spinner.spinner("value", currentRows); //Setting the initial value of the spinner when the table is first created.
  }

  function addRows(newSize) {
    var table = $("#main-tbody");
    var firstRow = $("<tr></tr>").appendTo(table);
    for (i=(currentRows+1); i <= newSize; i++) {
      var row = $("<tr></tr>").appendTo(table);
      var classBox = $("<td>" + "Class " + i + "</td>").appendTo(row).addClass("td-padding");

      var gradeBox = $("<td></td>").appendTo(row);
      var gradeInputBox = $("<input>").appendTo(gradeBox);
      $(gradeInputBox).attr("name", "grade");

      var creditBox = $("<td></td>").appendTo(row);
      var creditInputBox = $("<input>").appendTo(creditBox);
      $(creditInputBox).attr("name", "credit");
    }
  }

  function updateTable(newSize) {
    if (newSize > currentRows) {
      addRows(newSize);
      currentRows = newSize;
    }
    else if (newSize < currentRows) {
      var table = $("#main-tbody");
      var rowsToDelete = currentRows - newSize;
      for (i=(currentRows); i > newSize; i--) {
        $(table).children("tr").filter(":last").remove();
        currentRows--;
        alert("currentRows: " + currentRows);
      }
    }
  }

  function convertToProperGrades(grades) {
    var errorMessage = "Please enter valid grade letters (A, A, B+, B, B-, C+, C, C-, D+, D, F) or valid numerics (0-100)."

    var conversionMessage;

    for (i=0; i<grades.length; i++) {
      if (isNaN(grades[i])) {
        if (alphas.hasOwnProperty(grades[i])) {
          var value = alphas[grades[i]];
          grades[i] = value;
        }
        else {
          alert (errorMessage);
        }
      }
      else {
        for (var j=0; j < ranges.length; j++) {
          if (grades[i] >= ranges[j].min) {
            conversionMessage = "<p>"
            grades[i] = ranges[j].weight;
            break; //Breaks from this current loop.
          }
        }
      }
    }
    return grades;
  }

  function calculateGPA(grades, credits) {
    var dividend = 0;
    var divisor = 0;
    for (i=0; i < grades.length; i++) {
      var result = grades[i]*credits[i];
      dividend = dividend + result;
      divisor = divisor + parseInt(credits[i]);

      var dataLine = "<p>" + (i+1) + ". Grade: " + grades[i] + ", credits: " + credits[i] + "</p>";
      $(dataLine).appendTo("body");
      var algorithmLine = "<p>   " + "Weighted Grade: " + grades[i] + " * " + credits[i] + " = " + result + " </p>";
      $(algorithmLine).appendTo("body");
    }
    var gpa = dividend / divisor;
    gpa = gpa.toFixed(2);

    return gpa;
  }

});

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

    grades = convertToNumerics(grades);
    var gpa = calculateGPA(grades, credits)

    console.log("GPA: " + gpa);
    $("#gpa").text("GPA: " + gpa);
    $("#gpa").attr("hidden", false);

    event.preventDefault(); //Prevents page from reloading.
  });

  function setupTable() {
    var table = $("#main-tbody");
    var firstRow = $("<tr></tr>").appendTo(table);
    $("<th></th>").appendTo(firstRow);
    $("<th>Grade</th>").appendTo(firstRow);
    $("<th>Credits</th>").appendTo(firstRow);

    var numRows = 11;
    for (i=1; i < numRows; i++) {
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

  function convertToNumerics(grades) {
    for (i=0; i<grades.length; i++) {
      if (isNaN(grades[i])) {
        for (var key in grades) {
          if (alphas.hasOwnProperty(grades[i])) {
            value = alphas[grades[i]];
            console.log("Grade: " + grades[i] + " converted to: " + value);
            grades[i] = value;
          }
        }
      }
      else {
        alert ("Please enter valid grade letters (A, A, B+, B, B-, C+, C, C-, D+, D, F)");
      }
    }
    return grades;
  }

  function calculateGPA(grades, credits) {
    var dividend = 0;
    var divisor = 0;
    for (i=0; i < grades.length; i++) {
      var result = grades[i]*credits[i];
      console.log("Result: " + result);
      dividend = dividend + result;
      console.log("Dividend: " + dividend);
      divisor = divisor + parseInt(credits[i]);
      console.log("Divisor: " + divisor);
    }
    var gpa = dividend / divisor;
    gpa = gpa.toFixed(2);
    return gpa;
  }
});

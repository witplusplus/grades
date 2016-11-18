$(document).ready(function() {

  //Non-calculator related code

  $("#home").on("click", function() {
    $("#content").empty();
    $("#content").load("calculator.html");
  });

  //Calculator related code.

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
  var currentRows = 4;
  var recentlySubmited = false;
  var spinner = $("#spinner").spinner({
    max: 40,
    min: 1,
    stop: function(event, ui) {
      var newSize = spinner.spinner("value");
      if (spinner.spinner("isValid")) {
        updateTable(newSize);
      }
    }
  });

  setRanges();

  setupTable();

  $("#form-main-table").submit(function(event) {
    var grades = [];
    var credits = [];
    var previousCredits;
    var previousGPA;
    data = $(this).serializeArray();
    console.log("Data length: " + data.length);

    for (i=0; i < data.length; i++) {
      if (data[i].name == ("grade")) {
        if (data[i].value != "") {
          grades.push(data[i].value);
        }
      }
      else if (data[i].name == ("credit")) {
        if (data[i].value != "") {
          credits.push(data[i].value);
        }
      }
      else if ((data[i]).name == ("previous-gpa")) {
        if (data[i].value != "") {
          previousGPA = data[i].value;
        }
      }
      else if ((data[i]).name == ("previous-credits")) {
        if (data[i].value != "") {
          previousCredits = data[i].value;
        }
      }
    }

    console.log("Grades length: " + grades.length);
    console.log("Credits length: " + credits.length);

    var properGrades = convertToProperGrades(grades);
    var gpa = calculateGPA(properGrades, credits, previousGPA, previousCredits);

    //Clears the results of the previous algorithm steps.
    if (recentlySubmited) {
      var steps = $("#algorithm-steps").children("ul");
      steps.each(function() {
        steps.empty();
      });
    }

    showProof(grades, properGrades, credits, previousGPA, previousCredits);
    recentlySubmited = true;

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

    var numRows = currentRows;
    for (i=1; i <= numRows; i++) {
      var row = $("<tr></tr>").appendTo(table);
      var classBox = $("<td>" + "Class " + i + "</td>").appendTo(row).addClass("td-padding");

      var gradeBox = $("<td></td>").appendTo(row);
      var gradeInputBox = $("<input>").appendTo(gradeBox);
      $(gradeInputBox).attr("name", "grade");

      var creditBox = $("<td></td>").appendTo(row);
      var creditInputBox = $("<input>").appendTo(creditBox);
      $(creditInputBox).attr("name", "credit");
    }
    spinner.spinner("value", currentRows); //Setting the initial value of the spinner when the table is first created.
  }

  function updateTable(newSize) {
    if (newSize > currentRows) {
      var table = $("#main-tbody");
      for (i=(currentRows+1); i <= newSize; i++) {
        var row = $("<tr></tr>").appendTo(table);
        var classBox = $("<td>" + "Class " + i + "</td>").appendTo(row).addClass("td-padding");

        var gradeBox = $("<td></td>").appendTo(row);
        var gradeInputBox = $("<input>").appendTo(gradeBox);
        $(gradeInputBox).attr("name", "grade");

        var creditBox = $("<td></td>").appendTo(row);
        var creditInputBox = $("<input>").appendTo(creditBox);
        $(creditInputBox).attr("name", "credit");

        currentRows++;
      }
    }
    else if (newSize < currentRows) {
      var table = $("#main-tbody");
      for (i=(currentRows); i > newSize; i--) {
        $(table).children("tr").filter(":last").remove();
        currentRows--;
      }
    }
  }

  function convertToProperGrades(grades) {
    var errorMessage = "Please enter valid grade letters (A, A, B+, B, B-, C+, C, C-, D+, D, F) or valid numerics (0-100)."
    var properGrades = [];

    for (i=0; i<grades.length; i++) {
      if (isNaN(grades[i])) {
        if (alphas.hasOwnProperty(grades[i])) {
          var value = alphas[grades[i]];
          properGrades.push(value);
        }
        else {
          alert (errorMessage);
          break;
        }
      }
      else {
        for (var j=0; j < ranges.length; j++) {
          if (grades[i] >= ranges[j].min) {
            var value = ranges[j].weight;
            properGrades.push(value);
            break; //Breaks from this current loop.
          }
        }
      }
    }
    return properGrades;
  }

  function calculateGPA(properGrades, credits, previousGpa, previousCredits) {
    var dividend = 0;
    var divisor = 0;
    for (i=0; i < properGrades.length; i++) {
      var result = properGrades[i]*credits[i];
      dividend = dividend + result;
      divisor = divisor + parseInt(credits[i]);
    }
    console.log("Previous GPA: " + previousGpa + ", " + "Previous Credits:" + previousCredits);
    if (previousGpa != null && previousCredits != null) {
      var result = previousGpa * previousCredits;
      dividend = dividend + result;
      divisor = divisor + parseInt(previousCredits);
    }
    console.log("Dividend: " + dividend + ", " + "Divisor: " + divisor);
    if (divisor == 0) {
      var gpa = 0;
    }
    else {
      var gpa = dividend / divisor;
    }
    gpa = gpa.toFixed(3);

    return gpa;
  }

  function showProof(grades, properGrades, credits, previousGpa, previousCredits) {
    var step1 = $("#step-1");
    for (var i=0; i < properGrades.length; i++) {
      $("<li><p>" + "Original grade: " + grades[i] + ", converted grade: " + properGrades[i] + "</p></li>").appendTo(step1);
    }

    var step2 = $("#step-2");
    var weightedGrades = [];
    for (var i=0; i < properGrades.length; i++) {
      var weightedGrade = properGrades[i] * credits[i];
      weightedGrades.push(weightedGrade);
      $("<li><p>" + weightedGrade + " = " + properGrades[i] + " * " + credits[i] + "</p></li>").appendTo(step2);
    }
    var weightedGPA = previousGpa * previousCredits;
    $("<li><p>" + weightedGPA + " = " + previousGpa + " * " + previousCredits + "</p></li>").appendTo(step2);

    var step3Line = "";
    var step3 = $("#step-3");
    var sum = 0;
    for (var i=0; i < weightedGrades.length; i++) {
      if ((i+1) == weightedGrades.length) {
        step3Line = step3Line + weightedGrades[i];
        step3Line = step3Line + " + " + weightedGPA;
        sum = sum + weightedGrades[i];
        sum = sum + weightedGPA;
        sum = sum.toFixed(3);
        step3Line = "<li><p>" + sum + " = " + step3Line + "</p></li>";
      }
      else {
        step3Line = step3Line + weightedGrades[i] + " + ";
        sum = sum + weightedGrades[i];
      }
    }
    $(step3Line).appendTo(step3);

    var step4Line = "";
    var step4 = $("#step-4");
    var sum2 = 0;
    for (var i=0; i < credits.length; i++) {
      if ((i+1) == credits.length) {
        step4Line = step4Line + credits[i];
        step4Line = step4Line + " + " + previousCredits;
        sum2 = sum2 + parseInt(credits[i]);
        sum2 = sum2 + parseInt(previousCredits);
        sum2 = sum2.toFixed(3);
        step4Line = "<li><p>" + sum2 + " = " + step4Line + "</p></li>";
      }
      else {
        step4Line = step4Line + credits[i] + " + ";
        sum2 = sum2 + parseInt(credits[i]);
      }
    }
    $(step4Line).appendTo(step4);

    var step5 = $("#step-5");

    if (sum2 == 0) {
      var gpa = 0;
    }
    else {
      var gpa = (sum / sum2).toFixed(3);
    }

    var step5Line = "<li><p>" + gpa + " = " + sum + " / " + sum2 + "</p></li>";
    $(step5Line).appendTo(step5);

    $("#algorithm-steps").children("ul").children("li").children("p").addClass("highlight");
  }
});

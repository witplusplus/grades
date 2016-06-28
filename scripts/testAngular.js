var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $timeout, $http) {
    $scope.firstName = "Artur";
    $scope.lastName = "Janowiec";
    $scope.changingMessage = "Starting processes...";
    $scope.greetingMessage = function() {
        return "Greetings " + $scope.firstName + " " + $scope.lastName;
    };
    
    $scope.names = [
        "Artur",
        "Bob",
        "Earl",
        "Pearl",
        "Amethyst",
        "Garnet",
        "Lelouch",
        "Suzaku",
        "Rick",
        "Morty",
        "Steven",
        "Shirley",
        "Euphy",
        "Rivals",
        "Milly",
        "Lloyd",
        "Ceceil",
        "Sayako",
        "Jeremiah",
        "Ash",
        "Red"
    ];
    
    $timeout(function() {
        $scope.changingMessage = "What is your color?";
    }, 2000);
    
    $http.get("people.txt").then(function(response) {
        $scope.myData = response.data.records;
    });
});
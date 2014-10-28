'use strict';

/**
 * @ngdoc function
 * @name gcbCreatorApp.controller:InstructionsCtrl
 * @description
 * # InstructionsCtrl
 * Controller of the gcbCreatorApp
 */
angular.module('gcbCreatorApp').controller('InstructionsCtrl', ['$scope','$location','$anchorScroll', function ($scope, $location, $anchorScroll) {
     
    $scope.scrollTo= function (id){ 
        $location.hash(id);
        $anchorScroll();
    };
    
}]);

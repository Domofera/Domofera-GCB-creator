'use strict';

/**
 * @ngdoc function
 * @name gcbCreatorApp.controller:AssesmentCtrl
 * @description
 * # AssesmentCtrl
 * Controller of the gcbCreatorApp
 */
angular.module('gcbCreatorApp').controller('AssesmentCtrl',['$scope', function ($scope) {
    $scope.preguntasEx = {
          preamble: '<b>This assessment addresses content in units 1-6. You can try it as many times as you like. When you click "Check Answers," we will give you your score and give you a list of lessons to review. Please note that some of the assessment questions address functionality that does not work well on tablet computers.</b>',
        
        checkAnswers: true,

        questionsList: [
            {questionHTML: 'Where will the Summer Olympics of 2016 be held?',
             choices: ['Chicago', 'Tokyo', 'correct("Rio de Janeiro")', 'Madrid', 'I don\'t know'],
             lesson: '1.4'},

            {questionHTML: 'You decide to attend the Summer Olympics and find yourself surrounded by Portuguese speakers. How would you say, "Is there a cheap restaurant around here?" in Portuguese?"<br/>[this version of the question uses a case-insensitive string match]',
             correctAnswerString: 'existe um rest?',
             lesson: '4.5'},

            {questionHTML: 'This is an example of a numeric freetext question. What is 3.2 + 4.7?',
             correctAnswerNumeric: 7.9,
             lesson: '99.99'},
          ]
     };
  }]);

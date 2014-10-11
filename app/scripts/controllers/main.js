/*global $:false */
'use strict';

/**
 * @ngdoc function
 * @name pppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pppApp
 */
angular.module('gcb-creatorApp')
  .controller('MainCtrl', function ($scope) {
    $scope.preguntas = [
        { questionType: 'freetext',
         prevHTML:'<span style="color:green">Letra verde</span> que introduce la pregunta',
         questionHTML: '<p>What color is the snow?</p>',
         correctAnswerString: 'white',
         correctAnswerOutput: 'Correct!',
         incorrectAnswerOutput: 'Try again.',
         showAnswerOutput: 'Our search expert says: white!'
        },

        { questionType:'multiple choice',
          prevHTML:'Esta letra es <b>negrita</b>',
          questionHTML:'<b>Tienes mucho feeling?</b>',
          choices: [
             ['A', false, '"A" is wrong, try again.'],
             ['B', true, '"B" is correct!'],
             ['C', false, '"C" is wrong, try again.'],
             ['D', false, '"D" is wrong, try again.']
          ]
        },

        { questionType: 'multiple choice group',
         prevHTML:'Esta letra es <b>negrita</b>',
         questionGroupHTML: '<p>This section will test you on colors and numbers.</p>',
         questionsList: [
             {questionHTML: 'Pick all <i>odd</i> numbers:',
              choices: ['1', '2', '3', '4', '5'], correctIndex: [0, 2, 4]},
             {questionHTML: 'Pick one <i>even</i> number:',
              choices: ['1', '2', '3', '4', '5'], correctIndex: [1, 3],
              multiSelect: false},
             {questionHTML: 'What color is the sky?',
              choices: ['#00FF00', '#00FF00', '#0000FF'], correctIndex: 2}
         ],
         allCorrectMinCount: 2,
         allCorrectOutput: 'Great job! You know the material well.',
         someIncorrectOutput: 'You must answer at least two questions correctly.'
        },
    ];










    $(function () {
        $('#gcbc-toolbar .btn').tooltip({container: 'body'});
    });

  });


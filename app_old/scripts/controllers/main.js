/*global $:false, prompt:true */
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

  //******** MODELOS

    $scope.preguntas = [
        { questionType: 'freetext',
         questionHTML: '<p>What color is the snow?</p>',
         correctAnswerString: 'white',
         correctAnswerOutput: 'Correct!',
         incorrectAnswerOutput: 'Try again.',
         showAnswerOutput: 'Our search expert says: white!'
        },

        {
         prevHTML:'<b>Letra <i>negrita</i></b> que introduce la pregunta'
        },

        { questionType:'multiple choice',
          questionHTML:'<b>Tienes mucho feeling?</b>',
          choices: [
             ['Puede', false, '"A" is wrong, try again.'],
             ['Algo pero no mucho', true, '"B" is correct!'],
             ['Depende como lo veas', false, '"C" is wrong, try again.'],
             ['Por supuesto!', false, '"D" is wrong, try again.']
          ]
        },

        { questionType: 'multiple choice group',
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





   //***** Funciones auxiliares
    $scope.LimpiarScope = function(){
        $scope.preguntas = [];
    };




   //***** Factories

    $scope.CrearFreetext = function(){
        $scope.preguntas.push({
                    questionType: 'freetext',
                    prevHTML:'',
                    questionHTML: '',
                    correctAnswerString: '',
                    correctAnswerOutput: '',
                    incorrectAnswerOutput: '',
                    showAnswerOutput: ''
                });
    };

    $scope.CrearMultiplechoice = function(){
        $scope.preguntas.push({
                    questionType:'multiple choice',
                    prevHTML:'',
                    questionHTML:'',
                    choices: [
                        ['', false, '']
                    ]
                });
    };

  });


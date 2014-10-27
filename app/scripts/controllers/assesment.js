'use strict';

/**
 * @ngdoc function
 * @name gcbCreatorApp.controller:AssesmentCtrl
 * @description
 * # AssesmentCtrl
 * Controller of the gcbCreatorApp
 */
angular.module('gcbCreatorApp').controller('AssesmentCtrl',['$scope', '$http', function ($scope,$http) { 
    
    $scope.isActivity = false;
    
    $scope.titulo = {
        text: '',
        error: false,
        success: false
    };
    
    $scope.preguntas = {
          preamble: '<b>This assessment addresses content in units 1-6. You can try it as many times as you like. When you click "Check Answers," we will give you your score and give you a list of lessons to review. Please note that some of the assessment questions address functionality that does not work well on tablet computers.</b>',
        
        checkAnswers: true,

        questionsList: [
            {questionHTML: 'Where will the Summer Olympics of 2016 be held?',
             choices: ['Chicago', 'Tokyo', 'Rio de Janeiro', 'Madrid', 'I don\'t know'],
             correct: 2,
             lesson: '1.4',
             colapsado: false
            },

            {questionHTML: 'You decide to attend the Summer Olympics and find yourself surrounded by Portuguese speakers. How would you say, "Is there a cheap restaurant around here?" in Portuguese?"<br/>[this version of the question uses a case-insensitive string match]',
             correctAnswerString: 'existe um rest?',
             lesson: '4.5',
             colapsado: false
            },

            {questionHTML: 'This is an example of a numeric freetext question. What is 3.2 + 4.7?',
             correctAnswerNumeric: 7.9,
             lesson: '99.99',
             colapsado: false
            }
          ]
     };
            
    
//****** MARCAR
    $scope.MarcarCheckAnswers = function(){
        $scope.preguntas.checkAnswers = !$scope.preguntas.checkAnswers;
    };
    
    $scope.MarcarCorrecta = function(pI, i){
        $scope.preguntas.questionsList[pI].correct = i;
    };      
            
    
//****** ADDERS & REMOVERS
    $scope.AddChoice = function(i){
        $scope.preguntas.questionsList[i].choices.push(['']);
    };
    
    $scope.CloseChoice = function(pI, i){
        $scope.preguntas.questionsList[pI].choices.splice(i,1);
        
        if(i < $scope.preguntas.questionsList[pI].correct)
            $scope.preguntas.questionsList[pI].correct--;
        else if(i == $scope.preguntas.questionsList[pI].correct)
            delete $scope.preguntas.questionsList[pI].correct;
    };
    
    $scope.Close = function(i){
        $scope.preguntas.questionsList.splice(i,1);
    };
    
    $scope.CloseAll = function(){
        $scope.preguntas.questionsList = [];
    };
            

//******* FACTORIES
    $scope.CrearNumerica = function(i){ 
        var obj = {
              questionHTML: '',
              correctAnswerNumeric: 0,
              lesson: '',
              colapsado: false
        };
        
        (i < 0 ? $scope.preguntas.questionsList.push(obj) : $scope.preguntas.questionsList.splice(i,0,obj));
    };
    
    $scope.CrearFreetext = function(i){ 
        var obj = {
              questionHTML: '',
              correctAnswerString: '',
              lesson: '',
              colapsado: false
        };
        
        (i < 0 ? $scope.preguntas.questionsList.push(obj) : $scope.preguntas.questionsList.splice(i,0,obj));
    };
    
    $scope.CrearMultiplechoice = function(i){ 
        var obj = {
              questionHTML: '',
              choices: [],
              lesson: '',
              colapsado: false
        };
        
        (i < 0 ? $scope.preguntas.questionsList.push(obj) : $scope.preguntas.questionsList.splice(i,0,obj));
    };

    
//******** ENVIAR / RECIBIR DATOS  
    $scope.ComprobarTitulo = function(){
        var patt = new RegExp('^assessment\-[a-zA-Z0-9]+$');
        var ret = false;                
        
        // Si todavía no se ha enviado un submit, no comprobamos
        if($scope.titulo.error == false && $scope.titulo.success == false){
            return false;
        }
                        
        if(patt.test($scope.titulo.text)){
            $scope.titulo.error = false;
            $scope.titulo.success = true;
            ret = true;
        }
        else{
            $scope.titulo.error = true;
            $scope.titulo.success = false;           
        }
        
        return ret;
    };
    
    $scope.HacerPeticion = function(){ 
        
        $scope.titulo.error = true; //Obligamos a que error sea true, así comprobara el título
        if(!$scope.ComprobarTitulo())
            return;
        
        // QUITAR TODOS LOS COLAPSADOS Y APLICAR PARSEFLOAT A correctAnswerNumeric
        var jsonAux = angular.copy($scope.preguntas);
        
        for (var i in jsonAux.questionsList){
            delete jsonAux.questionsList[i].colapsado;
            
            if(jsonAux.questionsList[i].correctAnswerNumeric !== undefined){ 
                if(typeof jsonAux.questionsList[i].correctAnswerNumeric == 'string')
                    jsonAux.questionsList[i].correctAnswerNumeric = parseFloat(jsonAux.questionsList[i].correctAnswerNumeric.replace(',' , '.'));
            }
        }
        
        jsonAux.titulo = $scope.titulo.text;
        console.log(jsonAux);
        
        $http.post('#/crear_assessment', jsonAux)
		.success(function(data, status, headers, config) {
			console.log('La peticion ha ido bien. ' + status);
		}).error(function(data, status, headers, config) {
			console.log('La peticion ha fallado ' + status);
		});
        
    };
            
}]);

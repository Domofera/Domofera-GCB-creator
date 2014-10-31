'use strict';

/**
 * @ngdoc function
 * @name gcbCreatorApp.controller:AssesmentCtrl
 * @description
 * # AssesmentCtrl
 * Controller of the gcbCreatorApp
 */
angular.module('gcbCreatorApp').controller('AssesmentCtrl',['$scope', '$http','localStorageService', function ($scope,$http, localStorageService) { 
    
    $scope.CrearAssessment = function(){
        $scope.preguntas = { 
            preamble: '',
            questionsList: [],
            checkAnswers: false
        };
    };
    
    $scope.isActivity = false;
    
    $scope.titulo = {
        text: '',
        error: false,
        success: false
    };
    
//********* LOCAL STORAGE
    var pregArr = localStorageService.get('preguntasAss');

    if(pregArr !== null && pregArr !== undefined && (pregArr.preamble !== '' || pregArr.checkAnswers !== false || pregArr.questionsList.length > 0)){
        bootbox.confirm('Se ha encontrado una sesión abierta, ¿Deseas recuperarla?', function(result) {
            if(result)
                $scope.$apply(function(){ $scope.preguntas = pregArr; });
            else
                $scope.$apply(function(){ $scope.CrearAssessment(); });
        }); 
    }
    else
        $scope.CrearAssessment();

    // Seteamos el watch para estar pendiente de cambios
    $scope.$watch('preguntas', function () {
        localStorageService.add('preguntasAss', $scope.preguntas);
    }, true);
            
    
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
        bootbox.confirm('<b>Se borrará todo, ¿Estás seguro?</b>', function(result) {
            if(result)
                $scope.$apply( function(){ $scope.preguntas.questionsList = []; });
        });
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
        
        $http.post('/download/activity/'+jsonAux.titulo+'/'+jsonAux, jsonAux)
		.success(function(data, status, headers, config) {
			console.log('La peticion ha ido bien. ' + status);
		}).error(function(data, status, headers, config) {
			console.log('La peticion ha fallado ' + status);
		});
        
    };
            
}]);

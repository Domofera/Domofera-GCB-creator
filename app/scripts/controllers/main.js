/*global $:false*/
'use strict';

/**
 * @ngdoc function
 * @name gcbCreatorApp.controller:MainCtrl
 * @description
 * # Este controlador se encarga de llevar las tareas relacionadas con el $scope y AngularJS en sí
 */

angular.module('gcbCreatorApp')
.controller('MainCtrl',['$scope', '$compile', '$http',  function ($scope, $compile, $http) {
    
    $scope.isActivity = true;
    
    //******** MODELOS
    $scope.titulo = {
        text: '',
        error: false,
        success: false
    };
    
    $scope.config = {
        isActivity: true,
    }
    
    $scope.preguntas = [
        { questionType: 'freetext',
         questionHTML: '<p style="color:red;">What or is the snow?</p>',
         correctAnswerString: 'white',
         correctAnswerOutput: 'Correct!',
         incorrectAnswerOutput: 'Try again.',
         showAnswerOutput: 'Our search expert says: white!',
         colapsado: false
        },

        {
            prevHTML:'<b>Letra <i>negrita</i></b> que introduce la pregunta',
            colapsado: false
        },

        { questionType:'multiple choice',
         questionHTML:'<b>Tienes mucho feeling?</b>',
         choices: [
             ['Puede', false, '"A" is wrong, try again.'],
             ['Algo pero no mucho', true, '"B" is correct!'],
             ['Depende como lo veas', false, '"C" is wrong, try again.'],
             ['Por supuesto!', false, '"D" is wrong, try again.']
         ],
         colapsado: false
        },

        { questionType: 'multiple choice group',
         questionGroupHTML: '<p>This section will test you on colors and numbers.</p>',
         questionsList: [
             {questionHTML: 'Pick all <i>odd</i> numbers:',
              choices: ['1', '5'], 
              correctIndex: [0, 1], 
              multiSelect: true,
              colapsado: false
             },
             {questionHTML: 'Pick one <i>even</i> number:',
              choices: ['1', '2', '3'], correctIndex: [1, 2], multiSelect: false, colapsado: false},
             {questionHTML: 'What color is the sky?',
              choices: ['#00FF00', '#00FF00', '#0000FF'], correctIndex: 2, colapsado: false}
         ],
         allCorrectMinCount: 2,
         allCorrectOutput: 'Great job! You know the material well.',
         someIncorrectOutput: 'You must answer at least two questions correctly.',
         colapsado: false
        }
    ];

    //***** Funciones auxiliares                    
    $scope.IsInArray = function($iGrandparent, $iParent, $i){ 
        if($.isArray($scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex))
            return $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex.indexOf($i) >= 0;
        else
            return $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex == $i;
    };


  //****** CLOSES
    $scope.Close = function($pIndex, $index){
        $scope.preguntas.splice($index,1);
    };
    
    $scope.CloseAll = function(){ 
        bootbox.confirm("Se borrará todo, ¿Estás seguro?", function(result) {
            if(result)
                $scope.$apply( function(){ $scope.preguntas = []; });
            
            console.log($scope.preguntas.length);
        }); 
    };

    $scope.GroupClose = function($pIndex, $index){
        $scope.preguntas[$pIndex].questionsList.splice($index,1);
    };

    $scope.CloseChoice = function($pIndex, $index){
        $scope.preguntas[$pIndex].choices.splice($index,1);
    };

    $scope.InnerCloseChoice = function($iGrandparent, $iParent, $i){
        $scope.preguntas[$iGrandparent].questionsList[$iParent].choices.splice($i,1);

        // Comprobamos si $i estaba marcada, si lo estaba, quitarlo del indice
        if($.isArray($scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex))
        {
            if($scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex.indexOf($i) >= 0){
                var pos = $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex.indexOf($i);
                $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex.splice(pos,1);
            }
        }
        else // Si era un numero, comprobar si era ese numero. Si es, borrarlo, sino, convertirlo a array
        {
            var n = $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex;

            if($scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex == $i)
                $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex = [];
            else
                $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex = [n];
        }
        

        // A todos los numeros mayores que el elemento borrado, restarles 1
        for (var i = 0; i < $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex.length; i++) {
            if($scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex[i] > $i){
                $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex[i]--;
            }
        }
    };

    
//*** MARCAR CHECKBOXES
    
    // Añade/Quita del scope el indice marcado. Otra funcion de jQuery se encarga de Marcarlo/Desmarcarlo
    $scope.Marcar = function($iGrandparent, $iParent, $i){

        var correctas = $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex;

        if($scope.IsInArray($iGrandparent, $iParent, $i)){ // Si está, lo quitamos
            if($.isArray(correctas)){
                var pos = correctas.indexOf($i);
                $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex.splice(pos,1);
            }else{
                $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex = [];
            }
        }
        else{ // Sino lo añadimos
            if($.isArray(correctas)){
                $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex.push($i);
            }else{
                $scope.preguntas[$iGrandparent].questionsList[$iParent].correctIndex = [correctas, $i];
            }
        }
    };

    $scope.MarcarSingle = function($iParent, $i){
        $scope.preguntas[$iParent].choices[$i][1] = !$scope.preguntas[$iParent].choices[$i][1];
    };

    $scope.MarcarMultiselect = function($iParent, $i){
        $scope.preguntas[$iParent].questionsList[$i].multiSelect = !$scope.preguntas[$iParent].questionsList[$i].multiSelect;
    };
    
    $scope.CheckNumber = function($i){ 
        var num = Math.floor(parseFloat($scope.preguntas[$i].allCorrectMinCount));
        $scope.preguntas[$i].allCorrectMinCount = (!isNaN(num) ? num : 1);
    };


//***** Factories

    $scope.AddChoice = function($index){ 
        var arr = ['', false, ''];
        $scope.preguntas[$index].choices.push(arr);
    };

    $scope.InnerAddChoice = function($iGrandparent, $iParent){
        var arr = [''];
        $scope.preguntas[$iGrandparent].questionsList[$iParent].choices.push(arr);
    };

    $scope.InnerAddQuestion = function($index){
        $scope.preguntas[$index].questionsList.push({ 
            questionHTML: '', choices: [], correctIndex: [], colapsado: false
        });
    };


    $scope.CrearHTML = function(i){ 
        var obj = {
            prevHTML:'',
            colapsado: false
        };
        
        (i < 0 ? $scope.preguntas.push(obj) : $scope.preguntas.splice(i,0,obj));
        
    };

    $scope.CrearFreetext = function(i){
        var obj = {
            questionType: 'freetext',
            questionHTML: '',
            correctAnswerString: '',
            correctAnswerOutput: '',
            incorrectAnswerOutput: '',
            showAnswerOutput: '',
            colapsado: false
        };
        
        (i < 0 ? $scope.preguntas.push(obj) : $scope.preguntas.splice(i,0,obj));
    };

    $scope.CrearMultiplechoice = function(i){
        var obj = {
            questionType:'multiple choice',
            questionHTML:'',
            choices: [
                ['', false, '']
            ],
            colapsado: false
        };
        
        (i < 0 ? $scope.preguntas.push(obj) : $scope.preguntas.splice(i,0,obj));
    };

    $scope.CrearMultiplechoiceGroup = function(i){
        var obj = {
            questionType:'multiple choice group',
            questionGroupHTML:'',
            allCorrectMinCount: 1,
            allCorrectOutput: '',
            someIncorrectOutput: '',
            questionsList: [],
            colapsado: false
        };
        
        (i < 0 ? $scope.preguntas.push(obj) : $scope.preguntas.splice(i,0,obj));
    };

    $scope.ParsearPreguntas = function(){
        var parsedScope = [];
        $scope.preguntas.forEach(function(obj) {
            if (Object.keys(obj)[0] === 'prevHTML') parsedScope.push(obj.prevHTML);
            else parsedScope.push(JSON.stringify(obj));
        });
        return parsedScope;
    }





                            
                        
//************* ENVIAR / RECIBIR DATOS  
    $scope.ComprobarTitulo = function(str){
        var patt = new RegExp('^activity\-[0-9]+\.[0-9]+$');
        var ret = false;                
        
        // Si todavía no se ha enviado un submit, no comprobamos
        if($scope.titulo.error == false && $scope.titulo.success == false){
            return;
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
        
        // QUITAR TODOS LOS COLAPSADOS, DE AMBOS NIVELES
        var jsonAux = angular.copy($scope.preguntas);
        
        for (var i in jsonAux){
            delete jsonAux[i].colapsado;
            
            if(jsonAux[i].questionType === 'multiple choice group')
                for(var j in jsonAux[i].questionsList)
                    delete jsonAux[i].questionsList[j].colapsado;
            
        }
        
        jsonAux.titulo = $scope.titulo.text;
        console.log(jsonAux);
        
        $http.post('/crear_activity', jsonAux)
		.success(function(data, status, headers, config) {
			console.log('La peticion ha ido bien. ' + status);
            console.log('Datos: ' + data);
		}).error(function(data, status, headers, config) {
			console.log('La peticion ha fallado ' + status);
		});
    };
                        
}]);




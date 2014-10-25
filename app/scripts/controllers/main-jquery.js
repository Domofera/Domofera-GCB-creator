/*global $:false, prompt:true*/
'use strict';

/**
 * @ngdoc function
 * @name gcbCreatorApp.controller:Main2Ctrl
 * @description
 * # Este controlador se encarga de realizar las cosas auxiliares, como jQuery, u otras funciones no propias de AngularJS
 */

angular.module('gcbCreatorApp').controller('Main2Ctrl',['$scope', '$compile', function ($scope, $compile) {

    var lastFocused;
    var isHover = false;
    var isFixed = false;
    var isInnerMoving = false;
    var animColDur = 700;
    var inAnimation = false;

    function boldIt(){
        var edit = $('span[contenteditable=true]:focus');
        document.execCommand('bold', false, '');
        edit.focus();
    }

    function italicIt(){
        var edit = $('span[contenteditable=true]:focus');
        document.execCommand('italic', false, '');
        edit.focus();
    }

    function linkIt(url){
        var edit = $('span[contenteditable=true]:focus');
        document.execCommand('Createlink', false, url);
        edit.focus();
    }
    
    function ColapsarInner(objeto, h, pIndex, index){
        if(objeto.hasClass('colapsado')){ 
            var h = objeto.find('.questions-inside-right').outerHeight(true) + objeto.height(); 
            
            objeto.css('height', h);
            $scope.preguntas[pIndex].questionsList[index].colapsado = false;
            objeto.animate({ height: h-10 }, animColDur, function(){ objeto.css('height', 'auto'); });
            
            objeto.find('.question-collapse').children().eq(0).removeClass('fa-chevron-down').addClass('fa-chevron-up');
       }
       else{ 
            objeto.animate({ height: h }, animColDur, function(){ 
                $scope.$apply( function(){ $scope.preguntas[pIndex].questionsList[index].colapsado = true; });
                objeto.css('height', 'auto'); 
            });
           
            objeto.find('.question-collapse').children().eq(0).removeClass('fa-chevron-up').addClass('fa-chevron-down');
       }
    }
    
    function Colapsar(objeto, h, index){
        if(objeto.hasClass('colapsado')){ 
            var h = objeto.find('.questions-inside-right').outerHeight(true) + objeto.height(); 
            
            objeto.css('height', h);
            $scope.preguntas[index].colapsado = false;
            objeto.animate({ height: h-10 }, animColDur, function(){ objeto.css('height', 'auto'); });
            
            objeto.find('.question-collapse').children().eq(0).removeClass('fa-chevron-down').addClass('fa-chevron-up');
       }
       else{ 
            objeto.animate({ height: h }, animColDur, function(){ 
                $scope.$apply( function(){ $scope.preguntas[index].colapsado = true; });
                objeto.css('height', 'auto'); 
            });
           
            objeto.find('.question-collapse').children().eq(0).removeClass('fa-chevron-up').addClass('fa-chevron-down');
       }
    }
    
    

//***** jQuery

    $(document).ready(function () {

        
    // Cambiamos el valor de isFixed, para que ponga el toolbar fijo
        $(window).scroll(function(){
            if ($(this).scrollTop() > 105 && !isFixed) {
                $('#gcbc-toolbar').hide().fadeIn(300).addClass('fixed');
                $('#gcbc-toolbar .btn').tooltip('destroy');
                isFixed = !isFixed;
            } else if ($(this).scrollTop() <= 105 && isFixed){
                $('#gcbc-toolbar').hide().fadeIn(300).removeClass('fixed');
                $('#gcbc-toolbar .btn').tooltip({container: 'body'});
                isFixed = !isFixed;
            }
        });
        
    //****************** SORTABLE
        $('#questions-container').sortable({placeholder: 'sortable-placeholder'});
        setTimeout(function(){ 
            if($('#questions-container').length){
                $('#questions-container').sortable('disable'); 
            }
        }, 400); //Esperamos para que cargue
        
        $('#questions-container').on('sortbeforestop', function( event, ui ) { 
            if(isInnerMoving){
                ui.item.removeClass('inner-selected');
                ui.helper.removeClass('inner-selected');
            }else{
                ui.item.removeClass('selected');
                ui.helper.removeClass('selected');
            }
            ui.helper.css('opacity', 1);
            ui.item.css('opacity', 1);
        });
        
        $('#questions-container').on('sortstart', function( event, ui ) { 
            ui.helper.css('opacity', 0.6);
            ui.placeholder.height(ui.helper.outerHeight());
        });
        
        // Codigo para que no interfiera el UI-Sortable con el ContentEditable
        $('body').on('mouseenter mousedown','.questions-inside-left', function(){
            $('#questions-container').sortable('enable');
            $('.inner-sortable').sortable('disable');
        });
        $('body').on('mouseleave','.questions-inside-left', function(){
            $('#questions-container').sortable('disable');
        });
        
        // Seleccionar el bloque de la pregunta
        $('body').on('click','.questions-inside-left', function(){
            $(this).parent().addClass('selected');
        });
        
        
    // INNER SORTABLE
        $('.inner-sortable').sortable({placeholder: 'sortable-placeholder'});
        setTimeout(function(){ 
            if($('.inner-sortable').length){
                $('.inner-sortable').sortable('disable'); 
            }
        }, 400); //Esperamos para que cargue
        
        $('body').on('mouseenter mousedown','.inner-questions-inside-left', function(){ 
            isInnerMoving = true;
            $('#questions-container').sortable('disable');
            $('.inner-sortable').sortable('enable');
        });
        $('body').on('mouseleave','.inner-questions-inside-left', function(){ 
            isInnerMoving = false;
            $('.inner-sortable').sortable('disable');
        });
        
        $('body').on('click','.inner-questions-inside-left', function(){
            $(this).parent().addClass('inner-selected');
        });
        
        
    // AMBOS SORTABLES
        // Quitar seleccionado
        $('body').on('mousedown', function(e){
            var container = $('#questions-container>div');
            container.removeClass('selected');
            
            var innerContainer = $('.inner-sortable>div');
            innerContainer.removeClass('inner-selected');
        });
        
        
    // Si se tiene el foco en un contenteditable, desactivar sortables
        $('body').on('mousedown','span[contenteditable=true]', function(){ 
            if(!$(this).is(':focus')){
                $('#questions-container').sortable('disable');
                $('.inner-sortable').sortable('disable');
                $(this).focus();
            }
        });

        
        
    //******* ACORDEON
        $scope.colapsados = false;
        
        
      // Colapsar TODOS
        $('#boton-colapsado').on('click', function(e){ 
            if(!inAnimation){ 
                // Cambios en la vista
                $('#questions-container>div').each(function(index){ 
                    // Si están colapsados, los expandimos
                   if($scope.colapsados){ 
                        var h = $(this).find('.questions-inside-right').outerHeight(true) + $(this).height(); 
                       
                       // Definimos altura de inicio, actualizamos modelo, y ponemos la altura en su valor
                        $(this).css('height', 36);
                        $scope.$apply(function(){ $scope.preguntas[index].colapsado = false; });
                        $(this).animate({ height: h-10 }, animColDur, function(){ $(this).css('height', 'auto'); });
                       
                        $(this).find('.question-collapse').children().eq(0).removeClass('fa-chevron-down').addClass('fa-chevron-up');
                   }
                   else{ 
                        $(this).animate({ height: 36 }, animColDur, function(){ 
                            $scope.$apply(function(){ $scope.preguntas[index].colapsado = true; });
                            $(this).css('height', 'auto'); 
                        });
                       
                        $(this).find('.question-collapse').children().eq(0).removeClass('fa-chevron-up').addClass('fa-chevron-down');
                   }
                });

                $scope.$apply(function(){
                    $scope.colapsados = !$scope.colapsados;
                });
                inAnimation = true;
                setTimeout(function(){ inAnimation=false; }, animColDur);
            }
        });
        
        // A los de Grupo, hay que recalcular el del padre
        $scope.GroupCollapseAll = function($index){ 
            if(!inAnimation){ 
                var padre = $('#questions-container>div').eq($index);
                var lista = padre.find('.question-wrapper');
                var boton = padre.find('.inner-questions-header span');

                // Colapsamos / Expandimos los bloques de preguntas
                lista.each(function(index){
                   if(boton.hasClass('fa-angle-double-down') && $(this).hasClass('colapsado')){ // Expandimos
                        var h = $(this).find('.questions-inside-right').outerHeight(true) + $(this).height();
                       
                       // Definimos altura de inicio, actualizamos modelo, y ponemos la altura en su valor
                        $(this).css('height', 45);
                         $scope.preguntas[$index].questionsList[index].colapsado = false;
                        $(this).animate({ height: h-10 }, animColDur, function(){ $(this).css('height', 'auto'); });
                       
                        $(this).find('.question-collapse').children().eq(0).removeClass('fa-chevron-down').addClass('fa-chevron-up');
                   }
                   else if (boton.hasClass('fa-angle-double-up') && !$(this).hasClass('colapsado')){ // Colapsamos
                        $(this).animate({ height: 45 }, animColDur, function(){ 
                            $scope.$apply(function(){ $scope.preguntas[$index].questionsList[index].colapsado = true; });
                            $(this).css('height', 'auto'); 
                        });
                       
                        $(this).find('.question-collapse').children().eq(0).removeClass('fa-chevron-up').addClass('fa-chevron-down');
                   }
                });

                // Cambiamos el botón de dirección
                boton.toggleClass('fa-angle-double-down').toggleClass('fa-angle-double-up');
            
                // Reseteamos la animación
                inAnimation = true;
                setTimeout(function(){ inAnimation=false; }, animColDur);
            }
        };
        
        
      // Colapsar UNO
        $scope.Collapse = function($index){ 
            if(!inAnimation){
                var objeto = $('#questions-container>div').eq($index);
                Colapsar(objeto, 36, $index);                
                inAnimation = true;
                setTimeout(function(){ inAnimation=false; }, animColDur);
            }
        };
        
        $scope.GroupCollapse = function($pIndex, $index){ 
            if(!inAnimation){
                var objeto = $('#questions-container>div').eq($pIndex).find('.question-wrapper').eq($index);
                ColapsarInner(objeto, 45, $pIndex, $index);
                
                inAnimation = true;
                setTimeout(function(){ inAnimation=false; }, animColDur);
            }
        };
        
        
        

        //************* EDITOR DE TEXTO

        $('body').on('mouseenter','#editor-buttons>a, span[contenteditable=true]', function(){
            isHover = true;
        });

        $('body').on('mouseleave','#editor-buttons>a, span[contenteditable=true]', function(){
            isHover = false;
        });

        $('body').on('click', function(){
            if(isHover){
                $('#editor-buttons>a').removeClass('disabled');
                $('#editor-buttons').addClass('editor-glow');
            }else{
                $('#editor-buttons>a').addClass('disabled');
                $('#editor-buttons').removeClass('editor-glow');
            }
        });
        
        // Controlar los disabled de los botones
        $('body').on('focus','span[contenteditable=true]', function(){
            lastFocused = $(this);
        });


        // Funciones bold, italic y link
        $('a[data-edit="bold"]').click(function(){
            boldIt();
            if(lastFocused){
                lastFocused.focus();
            }
        });
        $('a[data-edit="italic"]').click(function(){
            italicIt();
            if(lastFocused){
                lastFocused.focus();
            }
        });
        $('a[data-edit="link"]').click(function(){
            var urlp = prompt('Introduce el link:','http://');
            linkIt(urlp);
            if(lastFocused){
                lastFocused.focus();
            }
        });
    });
}]);


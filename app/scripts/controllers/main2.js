/*global $:false, prompt:true*/
'use strict';

/**
 * @ngdoc function
 * @name gcbCreatorApp.controller:Main2Ctrl
 * @description
 * # Este controlador se encarga de realizar las cosas auxiliares, como jQuery, u otras funciones no propias de AngularJS
 */

angular.module('gcbCreatorApp').controller('Main2Ctrl', function ($scope) {
    

    var lastFocused;
    var isHover = false;
    var isFixed = false;


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


    //***** jQuery

    $(document).ready(function () {

        $('#gcbc-toolbar .btn').tooltip({container: 'body'}); // Seteamos el tooltip

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
        
        $('#questions-container').on('sortbeforestop', function( event, ui ) {
            ui.item.removeClass('selected');
            ui.helper.removeClass('selected');
        });
        
        $('#questions-container').on('sortstart', function( event, ui ) {
            ui.helper.addClass('selected');
            ui.placeholder.height(ui.helper.outerHeight());
        });
        
        setTimeout(function(){ $('#questions-container').sortable('disable'); }, 100); //Esperamos 0.1s para que no de error
        
        
        
        
    

        // Codigo para que no interfiera el UI-Sortable con el ContentEditable
        $('body').on('mouseenter mousedown','.questions-inside-left', function(){
            $('#questions-container').sortable('enable');
        });
        $('body').on('mouseleave','.questions-inside-left', function(){
            $('#questions-container').sortable('disable');
        });
        
        // Controlar los disabled de los botones
        $('body').on('focus','span[contenteditable=true]', function(){
            lastFocused = $(this);
        });
        $('body').on('mousedown','span[contenteditable=true]', function(){ 
            if(!$(this).is(':focus')){
                $('#questions-container').sortable('disable');
                $(this).focus();
            }
        });
        $('body').on('blur','span[contenteditable=true]', function(){
            //$('#questions-container').sortable('enable');
        });


        //************* EDITOR DE TEXTO


        $('body').on('mouseenter','#editor-buttons>button, span[contenteditable=true]', function(){
            isHover = true;
        });

        $('body').on('mouseleave','#editor-buttons>button, span[contenteditable=true]', function(){
            isHover = false;
        });

        $('body').on('click', function(){
            if(isHover){
                $('#editor-buttons>button').removeClass('disabled');
                $('#editor-buttons').addClass('editor-glow');
            }else{
                $('#editor-buttons>button').addClass('disabled');
                $('#editor-buttons').removeClass('editor-glow');
            }
        });


        // Funciones bold, italic y link
        $('button[data-edit="bold"]').click(function(){
            boldIt();
            if(lastFocused){
                lastFocused.focus();
            }
        });
        $('button[data-edit="italic"]').click(function(){
            italicIt();
            if(lastFocused){
                lastFocused.focus();
            }
        });
        $('button[data-edit="link"]').click(function(){
            var urlp = prompt('Introduce el link:','http://');
            linkIt(urlp);
            if(lastFocused){
                lastFocused.focus();
            }
        });

    });
});


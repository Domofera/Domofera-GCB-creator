
<?php
    $PARAMS = (count($_GET)<1)? $_POST:$_GET;
    
    //$str = 'var activity = ' . $_POST['preguntas'] . ';';
    
    $json = json_decode($_POST['preguntas']);
    $titulo = $json[count($json)-1]->titulo.'.js';
    
    array_pop($json);
    
    $str = 'var activity= [';
    
    // Recorremos el array para quitar el prevHTML
    for($i=0 ; $i < count($json); $i++)
    {
    	if(isset($json[$i]->prevHTML))
    		$str .= json_encode($json[$i]->prevHTML) . ',';
    	else
    		$str .= json_encode($json[$i]) . ',';
    }
    
    $str .= '];';
    
    $myfile = fopen($titulo, 'w') or die('Unable to open file!');
	fwrite($myfile, $str);
	fclose($myfile);
    
    echo $titulo;

?>



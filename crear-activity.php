
<?php
    $json = json_decode($_POST['preguntas']);
    $titulo = $json[count($json)-1]->titulo.'.js';
    
    array_pop($json);
    
    $str = 'var activity= [';
    
    // Recorremos el array para quitar el prevHTML
    for($i=0 ; $i < count($json); $i++)
    {
    	// JSON PRETTY PRINT requiere php >= 5.4
    	if(isset($json[$i]->prevHTML))
    		$str .= json_encode($json[$i]->prevHTML, JSON_PRETTY_PRINT) . ',';
    	else
    		$str .= json_encode($json[$i], JSON_PRETTY_PRINT) . ',';
    }
    
    $str .= '];';
    
    $myfile = fopen($titulo, 'w') or die('Unable to open file!');
	fwrite($myfile, $str);
	fclose($myfile);
    
    echo $titulo;

?>



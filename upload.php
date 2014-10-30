<?php
	$target_dir = '';
	$target_dir = $target_dir . basename( $_FILES['fichero']['name']);
	$uploadOk=1;
	
	$fichero = basename($_FILES['fichero']['name']);

	if (move_uploaded_file($_FILES['fichero']['tmp_name'], $target_dir)) {
		$myfile = fopen($fichero, 'r') or die('Unable to open file!');
		echo fread($myfile,filesize($fichero));
		fclose($myfile);
	} else {
		echo 'fail';
	}
?>


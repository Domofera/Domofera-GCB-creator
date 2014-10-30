<?php
function json_minify($json) {
	$tokenizer = "/\"|(\/\*)|(\*\/)|(\/\/)|\n|\r/";
	$in_string = false;
	$in_multiline_comment = false;
	$in_singleline_comment = false;
	$tmp; $tmp2; $new_str = array(); $ns = 0; $from = 0; $lc; $rc; $lastIndex = 0;
		
	while (preg_match($tokenizer,$json,$tmp,PREG_OFFSET_CAPTURE,$lastIndex)) {
		$tmp = $tmp[0];
		$lastIndex = $tmp[1] + strlen($tmp[0]);
		$lc = substr($json,0,$lastIndex - strlen($tmp[0]));
		$rc = substr($json,$lastIndex);
		if (!$in_multiline_comment && !$in_singleline_comment) {
			$tmp2 = substr($lc,$from);
			if (!$in_string) {
				$tmp2 = preg_replace("/(\n|\r)*/","",$tmp2);
				$tmp2 = preg_replace("/(\s)+/"," ",$tmp2);
			}
			$new_str[] = $tmp2;
		}
		$from = $lastIndex;
			
		if ($tmp[0] == "\"" && !$in_multiline_comment && !$in_singleline_comment) {
			preg_match("/(\\\\)*$/",$lc,$tmp2);
			if (!$in_string || !$tmp2 || (strlen($tmp2[0]) % 2) == 0) {	// start of string with ", or unescaped " character found to end string
				$in_string = !$in_string;
			}
			$from--; // include " character in next catch
			$rc = substr($json,$from);
		}
		else if ($tmp[0] == "/*" && !$in_string && !$in_multiline_comment && !$in_singleline_comment) {
			$in_multiline_comment = true;
		}
		else if ($tmp[0] == "*/" && !$in_string && $in_multiline_comment && !$in_singleline_comment) {
			$in_multiline_comment = false;
		}
		else if ($tmp[0] == "//" && !$in_string && !$in_multiline_comment && !$in_singleline_comment) {
			$in_singleline_comment = true;
		}
		else if (($tmp[0] == "\n" || $tmp[0] == "\r") && !$in_string && !$in_multiline_comment && $in_singleline_comment) {
			$in_singleline_comment = false;
		}
		else if (!$in_multiline_comment && !$in_singleline_comment && !(preg_match("/\n|\r/",$tmp[0]))) {
			$new_str[] = $tmp[0];
		}
	}
	$new_str[] = $rc;
	return implode("",$new_str);
}







	$target_dir = '';
	$target_dir = $target_dir . basename( $_FILES['file']['name']);
	
	$fichero = basename($_FILES['file']['name']);

	if (move_uploaded_file($_FILES['file']['tmp_name'], $target_dir)) {
		$myfile = fopen($fichero, 'r') or die('Unable to open file!');
		echo json_minify(fread($myfile,filesize($fichero)));
		fclose($myfile);
	} else {
		echo 'fail';
	}
?>


<?php 
	$json = "{\"images\" :[";
	
	for($i=0;$i<1351;$i++){
		$comma = $i == 1350 ? "" : ",";
		$json .= "{\"thumbName\":\"1 (".$i.").jpg\",\"imageName\":\"1 (".$i.").jpg\",\"alt\":\"Imagem 1\",\"width\":\"90px\",\"height\":\"90px\"}".$comma;
	}
	$json.="]}";
	echo $json;
?>
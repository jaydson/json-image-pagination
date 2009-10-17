<% 
	json = "{""images"" :["
	Dim i
	Dim comma
	For i=0 to 32
		if i = 32 then comma = "" else comma = ", "
		json = json & "{""name"":""1 ("&i&").jpg"",""alt"":""Imagem 1"",""width"":""90px"",""height"":""90px""}" & comma
	Next
	
	json = json & "]}"
	response.write json
%>
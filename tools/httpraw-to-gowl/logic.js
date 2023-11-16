
function httpRawToGowl(code) {
	if (!code.trim())
		return;
	return parseInput(code);

	// parseInput
	function parseInput(plainCode) {

		var rawLines = String(plainCode).split("\n")
		var cookieAdded = false
		var endHeaders = false

		var method = "method"
		var host = "host"
		var path = "/path"
		var headers = ""
		var order = ""
		var body = ""
		var go = ""

		rawLines.forEach(function(line){

			if (line.length == 0) {
				endHeaders = true								
			} else if (endHeaders) {
				body = line
			} else {
				if (line.charAt(0) == `:`) {
					line = line.substring(1)
				}

				var part = line.split(/:(.*)/s)
				if (part.length == 1) {
					var p = line.split(" ")
					method = p[0]
					path = p[1]
					return
				}

				switch (part[0].toLocaleLowerCase()) {
					case `method`:
						method = part[1].trimStart()
						break;					
					case `scheme`:{
						break
					}	
					case `authority`:
					case `host`:
						host = part[1].trimStart()
						break;
					case `path`:
						path = part[1].trimStart()
						break;
					case `content-length`:
						order += `\t\t"` + part[0] + `",\n`
						break;
					case `user-agent`:
						headers += `\t\t"` + part[0] + `": {t.bot.UserAgent},\n`
						order += `\t\t"` + part[0] + `",\n`
						break;
					case `sec-ch-ua`:
						headers += `\t\t"` + part[0] + `": {t.bot.SecUa},\n`
						order += `\t\t"` + part[0] + `",\n`
						break;
					case `cookie`:
						if (!cookieAdded) {
							headers += `\t\t"` + part[0] + `": {t.bot.CookieHeader.CreateHeader()},\n`
							order += `\t\t"` + part[0] + `",\n`
							cookieAdded = true
						}
						break;
					default:
						headers += `\t\t"` + part[0] + `":` + "{`" + part[1].trimStart() + "`},\n"
						order += `\t\t"` + part[0] + `",\n`
						break;
				}
			}
		});

		if (body.length > 0) {
			go += "postData := `" + body + "`\n\n"
		}

		go += `req, err := support.MakeReq(\n`
		go += `\t"` + method + `",\n`
		go += "\t`https://" + host + path + "`,\n"
		go += `\tmap[string][]string{\n`
		go += headers
		go += `\t},\n`
		go += `\t[]string{\n`
		go += order.toLocaleLowerCase()
		go += `\t},\n`
		go += `\t[]string{},\n`

		if (body.length > 0) {
			go += `\t[]byte(postData),\n`
		}

		go += `)\n`
		go +=`if err != nil {\n\treturn logger.ErrReqSetup\n}\nres, err := t.bot.Client.Do(req)\nif err != nil {\n\treturn logger.ErrReq\n}\ndefer res.Body.Close()\nt.bot.CookieHeader.LoadResponse(res.Cookies())\n`

		return go;
	}

	function formatUrlForm(urlForm){

		var output = ""
		var url = String(urlForm).split(/\?(.*)/s)

		if(url.length > 1){
			output = ""
		}
	}
}
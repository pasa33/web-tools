
function httpRawToGowlv2(code) {
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
		var urlParams = ""
		var headers = ""
		var body = ""
		var ua = ""
		var go = ""

		rawLines.forEach(function (line) {

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
					case `scheme`: {
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
						headers += `\t\t{\`${part[0]}\`, bot.AutoHeader},\n`
						break;
					case `user-agent`:
						ua = part[1].trimStart()
						headers += `\t\t{\`${part[0]}\`, t.task.UserAgent},\n`
						break;
					case `sec-ch-ua`:
						headers += `\t\t{\`${part[0]}\`, t.task.SecUa},\n`
						break;
					case `cookie`:
						if (!cookieAdded) {
							headers += `\t\t{\`${part[0]}\`, t.task.Bot.CookieHeader.CreateHeader()},\n`
							cookieAdded = true
						}
						break;
					default:
						headers += `\t\t{\`${part[0]}\`, \`${part[1].trimStart()}\`},\n`
				}				
			}
		});

		if (body.length > 0) {
			go += "postData := `" + body + "`\n\n"
		}

		if (path.includes("?")) {
			arrStrings = path.split("?")
			path = arrStrings[0];
			params = "?" + arrStrings.slice(1).join("?");

			urlParams = "`+\n\t`" + params.replace(new RegExp("&", 'g'), "`+\n\t`&")
		}

		go += `res, err := t.task.Bot.MakeRequest(\n`
		go += `\t\`${method}\`,\n`
		go += "\t`https://" + host + path + urlParams + "`,\n"
		go += `\t[]bot.Header{\n`
		go += headers
		go += `\t},\n`

		if (body.length > 0) {
			go += `\t[]byte(postData),\n`
		}

		go += `)\n`
		go += `if err != nil {\n\treturn cerr.ErrReq\n}\ndefer res.Body.Close()\nt.task.Bot.CookieHeader.LoadResponse(res.Cookies())\n`

		return [ua, go];
	}

	// function formatUrlForm(urlForm) {

	// 	var output = ""
	// 	var url = String(urlForm).split(/\?(.*)/s)

	// 	if (url.length > 1) {
	// 		output = ""
	// 	}
	// }
}
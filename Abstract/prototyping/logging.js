var VisualLogger = function(consoleDiv) {

	function addLogLine(fullMessage, cssClass) {
		var logLine = $('<div>');
		logLine.text(fullMessage);
		if( cssClass ) {
			logLine.addClass(cssClass);
		}
		consoleDiv.prepend(logLine);
	}

	function fullMessage(message, origin) {
		return( ( ( origin === undefined ) ? '' : ( origin + ' - ' ) ) + message );
	}

	this.info = function(message, origin) {
		addLogLine(fullMessage(message, origin));
	};

	this.error = function(message, origin) {
		addLogLine(fullMessage(message, origin), 'error');
	};

	this.debug = function(message, origin) {
		addLogLine(fullMessage(message, origin), 'debug');
	};

};


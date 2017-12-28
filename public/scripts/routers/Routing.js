//Routing
module.exports = {
	EDITABLE_EXTENSIONS: ['txt','csv', 'json', 'js','xml','sql','md','py','ipynb'],
	modified: function(event) {
	    if (event.metaKey || event.ctrlKey || event.shiftKey) {
        	return true;

    	} else {
    		event.preventDefault();
    		return false;
    	}
	},
	slugify: function(text) {
		
		// https://gist.github.com/mathewbyrne/1280286
		  return text.toString().toLowerCase()
			.replace(/\s+/g, '-')           // Replace spaces with -
			.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
			.replace(/\-\-+/g, '-')         // Replace multiple - with single -
			.replace(/^-+/, '')             // Trim - from start of text
			.replace(/-+$/, '');            // Trim - from end of text
	},
	/**
	 * Parse query string.
	 * ?a=b&c=d to {a: b, c: d}
	 * @param {String} (option) queryString
	 * @return {Object} query params
	 */
	getQueryParams: function(queryString) {
	  var query = (queryString || window.location.search).substring(1); // delete ?
	  if (!query) {
	    return false;
	  }
	  return _
	  .chain(query.split('&'))
	  .map(function(params) {
	    var p = params.split('=');
	    return [p[0], decodeURIComponent(p[1])];
	  })
	  .object()
	  .value();
	},
	getLastRoute: function() {
		var lastRoute = '';

		var route = app.history[app.history.length - 1];
		if (route) {
			lastRoute = route.fragment;
		}

		return lastRoute;
	},
	launchEditor: function(event) {
		var anchor = $(event.currentTarget);

		var href = anchor.attr('href'); 
		var extension = href.split('.').pop();

		var that = this;
		if(_.contains(this.EDITABLE_EXTENSIONS, extension)) {
			if (that.modified(event)) {return;}

			var id = anchor.data('id');
			var name = anchor.html();

			app.router.navigate(app.routes.editor(id, name), true);
		}

		log.info('launchEditor');
	},
	isEditableFile: function(fileUrl) {
		var extension = fileUrl.split('.').pop();

		var editable = false;
		if(_.contains(this.EDITABLE_EXTENSIONS, extension)) {
			editable = true;
		}

		return editable;
	},
	getFileURL: function(id, fileName) {
		var url = '';
		if (this.isEditableFile(fileName)) {
			url = '/' + app.routes.editor(id, fileName);

		} else {
			url = app.widgets.file.getUrl(id, fileName);
		}

		return url;
	}
};
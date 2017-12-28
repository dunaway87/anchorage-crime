var tmpl = require('SidebarLayout.tmpl');



module.exports = Backbone.Marionette.LayoutView.extend({
	template: tmpl,
	className: 'sidebar',
	region:{
		yearFilter:".year-select",
		crimeFilter:".crime-select",
		polygonTool:".polygon-wrapper"
	},
	events:{
		"change .year-select":"reloadHeatmap",
		"change .crime-filter":"reloadHeatmap",
		"click .polygon-wrapper":"drawPolygon"
	},
	reloadHeatmap:function(){
		this.trigger('reloadHeatmap')

	},
	drawPolygon:function(){

		this.trigger('drawPolygon')

	},
	onShow: function(options){
		$('.filter-select').select2();
		this.reloadHeatmap();
		
	},
		initialize: function(options){
			this.options = options;
			this.model = new Backbone.Model(options);

			console.log(this.model)

		},


	}); 


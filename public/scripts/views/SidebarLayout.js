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
		"click .polygon-button":"drawPolygon",
		"click #delete-polygon":"removePolygon"
	},
	reloadHeatmap:function(){
		this.trigger('reloadHeatmap')

	},
	drawPolygon:function(){
		this.trigger('removePolygon')
		this.trigger('drawPolygon')
	},
	removePolygon:function(){
		this.trigger('removePolygon')
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


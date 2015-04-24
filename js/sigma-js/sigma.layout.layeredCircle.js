sigma.classes.graph.addIndex('layerCount',{
	constructor: function(){ this.layerCount = []; },
	addNode: function(n){
		if (!this.layerCount[n.layer])
			this.layerCount[n.layer] = 0;
		this.layerCount[n.layer]++;
	},
	dropNode: function(nid){
		this.layerCount[this.nodeIndex[nid].layer]--;
	}
});

// Recompute all coordinates
// per naive layered layout
// (x,y) converted from polar (radius, angle)
sigma.classes.graph.addMethod('refreshCoordinates', function(){
	var _g = this;
	_g.nodesArray.forEach(function (_n) {
		_n.x = radius[_n.layer] * Math.sin(
			_n.layerIndex*2*Math.PI/_g.layerCount[_n.layer]
		);
		_n.y = radius[_n.layer] * Math.cos(
			_n.layerIndex*2*Math.PI/_g.layerCount[_n.layer]
		);
	});
});

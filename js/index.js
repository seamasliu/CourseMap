// Radius of layers according to course level
var radius = new Array,
		ln,
		li = [];

for (var i = 0; i < 10; i++) {
	radius[i] = 15 + 10 * i;
	li[i] = 0;
}

sigma.classes.graph.addIndex('layerCount',{
	constructor: function(){ this.layerCount = []; },
	addNode: function(n){
		if (!this.layerCount[n.layer])
			this.layerCount[n.layer] = 0;
		this.layerCount[n.layer]++;
		console.log(this.layerCount);
	},
	dropNode: function(nid){
		this.layerCount[this.nodeIndex[nid].layer]--;
	}
});

sigma.classes.graph.attach('addNode', 'refreshCoordinates', function(){
	var _self = this;
	_self.nodesArray.forEach(function(n,i,a){
		n.x = radius[n.layer] * Math.sin(
			n.layerIndex*2*Math.PI/_self.layerCount[n.layer]
		);
		n.y = radius[n.layer] * Math.cos(
			n.layerIndex*2*Math.PI/_self.layerCount[n.layer]
		);
	});
});

var s = new sigma('container');

oboe('../data/csci_spring_2015.json')
  .node({
		// Process each course as it arrives
		'result[*]': function(course){
			ln = Math.floor(course.number / 1000) - 1;
			console.log('CSCI-' + course.number + ' ' + ln);
			// Add the current node
			s.graph.addNode({
				id: 'n'+course.id,
				x: Math.random(),
				y: Math.random(),
				size: 2,
				color: '#666',
				label: 'CSCI-'+course.number,
				layer: ln,
				layerIndex: li[ln]++
			});
			// Refresh the graph
			s.refresh();
		}
	});

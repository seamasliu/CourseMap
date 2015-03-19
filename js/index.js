// Radius of layers according to course level
var radius = [],
		ln,
		li = [],
		i,
		s,
		coursemap = {
			nodes:[],
			edges:[]
		};

for (i = 0; i < 10; i++) {
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

// Recompute all coordinates
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


oboe('./data/csci_spring_2015.json')
  .node({
		// Process each course as it arrives
		'result[*]': function(course){
			ln = Math.floor(course.number / 1000) - 1;
			console.log('CSCI-' + course.number + ' ' + ln);
			if (ln < 0) {
				ln = Math.floor(course.number / 10) - 1;
			}
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
		},
		// After all courses processed, refresh the graph
		'result': function(){
			s = new sigma({
				graph: coursemap,
				renderer: {
					container: document.getElementById('container'),
					type: 'canvas'
				},
				settings: {
					labelSize: 'proportional',
					labelThreshold: 999
				}
			});
			s.graph.refreshCoordinates();
			s.refresh();
		}
	});

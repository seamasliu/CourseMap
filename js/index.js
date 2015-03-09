var s = new sigma('container');

// Radius of layers according to course level
var radius = new Array;
radius[0] = 30;
radius[1] = 40;
radius[2] = 50;
radius[3] = 60;
radius[4] = 70;
radius[5] = 80;
radius[6] = 90;
radius[7] = 100;
radius[8] = 110;
radius[9] = 120;

oboe('/data/csci_spring_2015.json')
  .node({
		// Process each course as it arrives
		'result[*]': function(course){
			var layer = Math.floor(course.number / 1000) - 1;
			console.log('CSCI-' + course.number + ' ' + layer);
			// Add the current node
			s.graph.addNode({
				id: 'n'+course.id,
				x: Math.random(),
				y: Math.random(),
				size: Math.random(),
				color: '#666',
				label: 'CSCI-'+course.number
			});
			// Refresh the graph
			s.refresh();
		}
	})
	.done(function(courses){
		console.log(courses);
	});

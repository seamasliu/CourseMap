// Radius of layers according to course level
var radius = [];
var ln;
var li = [];
var s;
var coursemap = {
			nodes:[],
			edges:[]
		};

for (var i = 0; i < 9; i++) {
	radius[i] = 15 + 10 * i;
	li[i] = 0;
}

var departmentCodes = {};
oboe('http://yacs.me/api/4/departments/')
	.node({
		'result[*]': function(department){
			departmentCodes[department.id] = department.code;
		}
	});

oboe('http://yacs.me/api/4/courses/?semester_id=85363')
  .node({
		// Process each course as it arrives
		'result[*]': function(course){
			ln = Math.floor(course.number / 1000) - 1;
			if (ln < 0) {
				ln = Math.floor(course.number / 10) - 1;
			}
			// Add the current node
			coursemap.nodes.push({
				type: 'course',
				id: 'n'+course.id,
				x: ln,
				y: li[ln],
				layer: ln,
				layerIndex: li[ln]++,
				size: 1,
				strokeColor: '#222',
				color: '#ddd',
				label: course.name,
				department: departmentCodes[course.department_id],
				number: course.number
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
	})
	.done(function(jdata){
		console.log(jdata.result.length);
	});

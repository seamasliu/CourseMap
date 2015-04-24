// Custom node renderer
sigma.canvas.nodes.course = function(node, context, settings) {
	context.strokeStyle = node.strokeColor || settings('defaultNodeColor');
	context.fillStyle = node.color || settings('defaultNodeColor');

	context.beginPath();

	var prefix = settings('prefix') || '';
	// extract x,y,size will use multiple times
	var nodeX = node[prefix + 'x'];
	var nodeY = node[prefix + 'y'];
	var size = node[prefix + 'size'];

	// draw the circle
	context.arc(nodeX, nodeY, size, 0, Math.PI * 2, true);
	context.fill();

	// draw the division line
	context.lineTo(nodeX-size,nodeY);
	context.stroke();

	// draw DEPT-0000
	context.save();
	// let the font scale with graph
	var fontSize;
	fontSize = 0.7 * size;
	context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
		fontSize + 'px ' + settings('font');
	context.fillStyle = (settings('labelColor') === 'node') ?
		(node.color || settings('defaultNodeColor')) :
		settings('defaultLabelColor');
	context.textAlign = 'center';
	// DEPT above
	context.textBaseline = 'bottom';
	context.fillText(node.department,nodeX,nodeY);
	// 0000 below
	context.textBaseline = 'top';
	context.fillText(node.number,nodeX,nodeY);
	context.restore();
};

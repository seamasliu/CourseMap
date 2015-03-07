var Insights = require('ignacioola/insights');

var nodes = [
    {
        id: 1,
        text: "apple",
        size: 9,
        cluster: 5
    },
    {
        id: 2,
        text: "google",
        size: 7,
        cluster: 2
    },
    {
        id: 3,
        text: "microsoft",
        size: 5,
        cluster: 1
    }
];

var links = [
    [ 1, 2 ], // [ source.id, target.id ]
    [ 2, 3 ],
    [ 1, 3 ]
];

var el = document.getElementById("course-catalog-graph");
var graph = new Insights(el, nodes, links).render();

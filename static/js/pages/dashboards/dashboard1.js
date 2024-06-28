$(function () {
    "use strict";
    new Chartist.Line('#ct-visits', {
        labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'],
        series: [
            [2, 5, 2, 6, 2, 5, 2, 4,2,3,4,4]
        ]
    }, {
        top: 0,
        low: 1,
        showPoint: true,
        fullWidth: true,
        plugins: [
            Chartist.plugins.tooltip()
        ],
        axisY: {
            labelInterpolationFnc: function (value) {
                return (value / 1) + 'M';
            }
        },
        showArea: true
    });
});


window.onload = function() {

var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title: {
		text: "Loyihalar holati bo'yicha hisobot",
        margin: 30,
         fontFamily: "Arial",
	},
	data: [{
		type: "pie",
		startAngle: 240,
		indexLabel: "{label} {y}",
        yValueFormatString: "##### \"ta\"",
		dataPoints: [
           { y: 1, label: "Yangi", color: "#2196F3" },
                { y: 2, label: "Jarayondagi", color: "#FFC107" },
                { y: 1, label: "Tugatilgan", color: "#4CAF50" }
		]
	}]
});
chart.render();
 var titleElement = document.getElementById("chartContainer");
    if (titleElement) {
        console.log(titleElement)
    }

}

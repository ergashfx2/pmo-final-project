$(function () {
    "use strict";
    new Chartist.Line('#ct-visits', {
        labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'],
        series: [
            [2, 5, 2, 6, 2, 5, 2, 4,2,3,4,9]
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



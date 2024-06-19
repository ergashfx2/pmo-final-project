$(function () {
    'use strict'

    var ticksStyle = {
        fontColor: '#495057',
        fontStyle: 'bold'
    }

    var mode = 'index'
    var intersect = true
    var $visitorsChart = $('#visitors-chart')
    var inital = [0];
    var visitorsChart = new Chart($visitorsChart, {
        type: 'bar',
        data: {
  labels: inital.concat(Object.keys(lists)),
  datasets: [{
    label: 'Departamentlar',
    data: inital.concat(Object.values(lists)),
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderWidth: 1
  }]
}
    })

    function generate_color(len) {
        var colors = [];
        for (let i = 0; i < len; i++) {
            const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
            colors.push(randomColor);
        }
        return colors
    }


    var $projectsChart = $('#projects-chart')
    var projectsChart = new Chart($projectsChart, {
        type: 'doughnut',
        data: {
            labels: Object.keys(lists),
            datasets: [{
                label: 'My First Dataset',
                data: Object.values(lists),
                backgroundColor: generate_color(Object.keys(lists).length),
                hoverOffset: 4
            }]
        }


    })
})


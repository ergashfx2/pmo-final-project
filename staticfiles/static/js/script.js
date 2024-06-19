document.addEventListener('DOMContentLoaded',function (){
    document.getElementById('close').addEventListener('click',function (){
        let container = document.getElementById('warn');
        container.style.display = 'none'
    })
})

document.addEventListener('DOMContentLoaded',function (){
  var xvalues = ['Yangi loyihalar','Jarayondagi loyihalar','Tugallangan loyihalar'];
var yvalues = [42,24,49];
var barColors = [  "#b91d47", "#00aba9", "#2b5797",]


new Chart ('myChart',{
    type : 'pie',
    data : {
        labels : xvalues,
        datasets : [{
            backgroundColor : barColors,
            data : yvalues,
        }]
    },
    options : {
        title : {
            display: true,
            text : 'Loyihalar haqida diagramma'
        }
    }
});
})

document.addEventListener('DOMContentLoaded',function (){
  var xvalues = ['Yangi loyihalar','Jarayondagi loyihalar','Tugallangan loyihalar'];
var yvalues = [42,24,49];
var barColors = [  "#F5F5F5", "#ffc107", "#228B22",]


new Chart ('myChart2',{
    type : 'pie',
    data : {
        labels : xvalues,
        datasets : [{
            backgroundColor : barColors,
            data : yvalues,
        }]
    },
    options : {
        title : {
            display: true,
            text : 'Loyihalar haqida diagramma'
        }
    }
});
})

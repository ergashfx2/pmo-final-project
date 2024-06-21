document.addEventListener('DOMContentLoaded',function (){

    google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var array = [
      ['', '',{ role: 'style' }],
  ]

  for(key in lists){
    array.push([key,lists[key],'#e8bddd'])
  }

const data = google.visualization.arrayToDataTable(array);

const options = {
  title:'Bloklardagi departamentlar soni',
    bar: {groupWidth: "80%"},
    colors: ['#ffffff'],
    height:700,
    width:900
};

const chart = new google.visualization.BarChart(document.getElementById('myChart'));
chart.draw(data, options);

}

})

document.addEventListener('DOMContentLoaded',function (){
        google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Yangi',     31 ],
          ['Jarayonda',      22],
          ['Tugatilgan',  21],
        ]);

        var options = {
          title: 'Loyihalar holati',
          pieHole: 0.4,

          colors: ['#4b85d3','#da7006','#54af2f'],
            height: 600,
            width:800
        };

        var chart = new google.visualization.PieChart(document.getElementById('myChart2'));
        chart.draw(data, options);
      }
})
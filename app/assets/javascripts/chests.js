var lineChartData = {
  labels: ["1", "4", "7", "10", "13", "16", "19", "22", "24", "26", "29", "31"],
  datasets: [{
    label: "Exploring",
    borderColor: 'rgba(195, 223, 161, 1)',
    backgroundColor: 'rgba(225, 239, 211, 0.3)',
    data: [100, 70, 20, 100, 120, 50, 70, 50, 50, 100, 50, 90]
  }, {
    label: "Guiding",
    borderColor: 'rgba(82, 124, 255, 1)',
    backgroundColor: 'rgba(237, 240, 255, 1)',
    data: [28, 48, 40, 19, 86, 27, 20, 90, 50, 20, 90, 20]
  }]
};

setTimeout(function(){
   var canvas = document.querySelector(".graphContainer");
   console.log(canvas);
   if (canvas){
      var chart = new Chart('myChart', {
      type: 'line',
      data: lineChartData
      });
   }   
},5000);

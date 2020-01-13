$(document).on('turbolinks:load', function() {
  var testChestProfile = document.getElementById("checkChestProfile")
  if (testChestProfile) {    
    var ctx = document.getElementById('myChart').getContext("2d");

    var gradientFill = ctx.createLinearGradient(0, 0, 0, 450);
    gradientFill.addColorStop(0, "rgba(226,240,211, 0.9)");
    gradientFill.addColorStop(1, "rgba(255,255,255, 0.3)");

    var gradientFill2 = ctx.createLinearGradient(0, 0, 0, 450);
    gradientFill2.addColorStop(0, "rgba(232,237,246, 0.9)");
    gradientFill2.addColorStop(1, "rgba(250,251,255, 0.3)");

    var lineChartData = {

      labels: ["1", "4", "7", "10", "13", "16", "19", "22", "24", "26", "29", "31"],
      datasets: [{
        label: "Exploring",    
        fill: true,
        borderColor: 'rgba(195, 223, 161, 1)',
        backgroundColor: gradientFill,
        data: [100, 70, 20, 100, 120, 50, 70, 50, 50, 100, 50, 90]
      }, {
        label: "Guiding",
        borderColor: 'rgba(82, 124, 255, 1)',
        backgroundColor: gradientFill2,
        data: [28, 48, 40, 19, 86, 27, 20, 90, 50, 20, 90, 20]
      }]
    };

   var canvas = document.querySelector(".graphContainer");
   console.log(canvas);
   if (canvas){
      var chart = new Chart('myChart', {
      type: 'line',
      data: lineChartData      
      });
   }   
  }    
})
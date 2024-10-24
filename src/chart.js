//created by David at 12am 4/24/2024
const chartData = []
const chart = new Chart(document.getElementById('chart'),
{ 
  type: 'doughnut',
  data: {
    labels: ['Danceability', 'Energy', 'Speechiness', 'Acousticness',  'Instrumentalness', 'Liveness', 'Valence'],
    datasets: [{
      data: chartData,
      hoverOffset: 4,
      backgroundColor: ['#DFC7E7', '#D6B0E4', '#C78CDC', '#B45AD3', '#842FA1', '#642A77', '#4A135D']
    }],
  },
  options: {
    aspectRatio:1,
    responsive: false,
    plugins: {
      legend: {
        display: false
      },
    }
  }
});


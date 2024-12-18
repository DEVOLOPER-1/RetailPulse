
function fetchCompetitorsMapData() {
    fetch('http://localhost:63342/api/locations')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            createCompetitorsMapChart(data);
        })
        .catch(error => console.error('Error: ', error));
}

function fetchCompetitorsFinancesData() {
    fetch('/api/finances')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createCompetitorsFinancesChart(data);
        })
        .catch(error => console.error('Error: ',error));
}





// Create root container
var root1 = am5.Root.new("competitors_map_chartdiv");
// var root2 = am5.Root.new("competitors_finances_chartdiv");

root1.setThemes([am5themes_Animated.new(root1)]);
// root2.setThemes([am5themes_Animated.new(root)]);

function createCompetitorsMapChart(data){
    am5.ready(function() {
        var chart = root1.container.children.push(new am5.MapChart());
        chart.setMap("worldLow");

        var polygonSeries = chart.series.push(new am5.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        polygonSeries.exclude = ["AQ"];
        polygonSeries.data = data;

        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.fill = am5.color("#68d051");

        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am5.color("#367B25");
    }
    );
}

document.addEventListener('DOMContentLoaded', function() {
    fetchCompetitorsMapData();
    // fetchCompetitorsFinancesData();
});
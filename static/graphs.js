

function parse_locations_and_get_correct_input(data){
    const rows = [];

// Iterate over the indexes of the data (assuming all data arrays have the same length)
    for (let i = 0; i < Object.keys(data.ID).length; i++) {
        // console.log("test" , Object.keys(data))
        const row = {
            ID: data.ID[i],
            company: data.company[i],
            delivery: data.delivery[i],
            lat: data.lat[i],
            lon: data.lon[i],
            title: data.title[i]
        };

        // Push the row to the rows array
        rows.push(row);
    }
    console.log(rows);

    return rows

}






function fetchCompetitorsMapData() {
    console.log("called locations")
    fetch('/api/locations')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data Received ===> ' , data);
            createCompetitorsMapChart(parse_locations_and_get_correct_input(data));
            console.log("Map Chart Was Called");
        })
        .catch(error => console.error('Error: ', error));
    
}


// function fetchCompetitorsFinancesData() {
//     fetch('/api/finances')
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             createCompetitorsFinancesChart(data);
//         })
//         .catch(error => console.error('Error: ',error));
// }





// Create root container
// var root = am5.Root.new("competitors_map_chartdiv");
// var root2 = am5.Root.new("competitors_finances_chartdiv");

// root1.setThemes([am5themes_Animated.new(root)]);
// root2.setThemes([am5themes_Animated.new(root)]);

function createCompetitorsMapChart(data){
    am5.ready(function() {

        /**
         * ---------------------------------------
         * This demo was created using amCharts 5.
         *
         * For more information visit:
         * https://www.amcharts.com/
         *
         * Documentation is available at:
         * https://www.amcharts.com/docs/v5/
         * ---------------------------------------
         */

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("competitors_map_chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([am5themes_Animated.new(root)]);

// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
        var chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "rotateX",
                panY: "translateY",
                projection: am5map.geoMercator()
            })
        );

        var cont = chart.children.push(
            am5.Container.new(root, {
                layout: root.horizontalLayout,
                x: 20,
                y: 40
            })
        );

// Add labels and controls
        cont.children.push(
            am5.Label.new(root, {
                centerY: am5.p50,
                text: "Map"
            })
        );

        var switchButton = cont.children.push(
            am5.Button.new(root, {
                themeTags: ["switch"],
                centerY: am5.p50,
                icon: am5.Circle.new(root, {
                    themeTags: ["icon"]
                })
            })
        );

        switchButton.on("active", function() {
            if (!switchButton.get("active")) {
                chart.set("projection", am5map.geoMercator());
                chart.set("panY", "translateY");
                chart.set("rotationY", 0);
                backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
            } else {
                chart.set("projection", am5map.geoOrthographic());
                chart.set("panY", "rotateY");

                backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
            }
        });

        cont.children.push(
            am5.Label.new(root, {
                centerY: am5.p50,
                text: "Globe"
            })
        );

// Create series for background fill
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
        backgroundSeries.mapPolygons.template.setAll({
            fill: root.interfaceColors.get("alternativeBackground"),
            fillOpacity: 0,
            strokeOpacity: 0
        });

// Add background polygon
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        var polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow
            })
        );

// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
        var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
        lineSeries.mapLines.template.setAll({
            stroke: root.interfaceColors.get("alternativeBackground"),
            strokeOpacity: 0.3
        });

// Create point series for markers
// https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
        var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
        var colorset = am5.ColorSet.new(root, {});

        pointSeries.bullets.push(function() {
            var container = am5.Container.new(root, {
                tooltipText: "{title}",
                cursorOverStyle: "pointer"
            });

            container.events.on("click", (e) => {
                window.location.href = e.target.dataItem.dataContext.url;
            });



            var circle = container.children.push(
                am5.Circle.new(root, {
                    radius: 4,
                    tooltipY: 0,
                    fill: colorset.next(),
                    strokeOpacity: 0
                })
            );


            var circle2 = container.children.push(
                am5.Circle.new(root, {
                    radius: 4,
                    tooltipY: 0,
                    fill: colorset.next(),
                    strokeOpacity: 0,
                    tooltipText: "{title}"
                })
            );

            circle.animate({
                key: "scale",
                from: 1,
                to: 5,
                duration: 600,
                easing: am5.ease.out(am5.ease.cubic),
                loops: Infinity
            });
            circle.animate({
                key: "opacity",
                from: 1,
                to: 0.1,
                duration: 600,
                easing: am5.ease.out(am5.ease.cubic),
                loops: Infinity
            });

            return am5.Bullet.new(root, {
                sprite: container
            });
        });
//
// Assuming `data` is the object that contains your arrays
        for (const item of data) {
    const { ID, company, delivery, lat, lon, title } = item;

    console.log(`Processing item:`, {
        id: ID,
        company: company,
        delivery: delivery,
        lat: lat,
        lon: lon,
        title: title
    });

    // Example of adding marker (assuming you have a function to handle this)
    AddMarket(lon, lat, title, company);
}

// Function to add a market (assuming pointSeries is defined elsewhere)
function AddMarket(longitude, latitude, title, company) {
    pointSeries.data.push({
        url: `https://www.google.com/search?q=${company}`,
        geometry: { type: "Point", coordinates: [longitude, latitude] },
        title: title
    });
}
// Make stuff animate on load
        chart.appear(1000, 100);


    }); // end am5.ready()
}

document.addEventListener('DOMContentLoaded', function() {
    fetchCompetitorsMapData();
    // fetchCompetitorsFinancesData();
});
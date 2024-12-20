

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

function parse_finances_and_get_correct_input(data){
    const rows = [];
    let color = "#2ec700";
    for (let i = 0; i < Object.keys(data.stock).length; i++) {

        if (data.stock_price_movement_status[i] === "down") {
            color = "#D91E32";
        }
        else{color = "#2ec700";}
        const row = {
            stock: data.stock[i],
            revenue: data.revenue[i],
            profit: data.profit[i],
            market_cap: data.market_cap[i],
            employees: data.employees[i],
            net_income: data.net_income[i],
            stock_price_movement: data.stock_price_movement[i],
            stock_price_movement_status: data.stock_price_movement_status[i],
            corp_title: data.corp_title[i],
            exchange: data.exchange[i],
            currency: data.currency[i],
            color: color
        };

        rows.push(row);
    }
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


function fetchCompetitorsStockData() {
    console.log("called finances")
    fetch('/api/finances')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data Received ===> ' , data);
            parse_finances_and_get_correct_input(data);
        })
        .catch(error => console.error('Error: ', error));

}







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

// Function to add a market with its own bullet configuration
        var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

// Keep track of existing locations to prevent duplicates
        const existingLocations = new Set();

// Define ONE bullet template for ALL points
        pointSeries.bullets.push(function(root, series, dataItem) {  // Add parameters here
            var container = am5.Container.new(root, {
                tooltipText: "{title}",  // Use template binding
                cursorOverStyle: "pointer"
            });

            // Get data from the dataItem
            const data = dataItem.dataContext;
            console.log("correct context called->", data)
            container.events.on("click", () => {
                window.location.href = `https://www.google.com/search?q=${data.company}`;
            });

            var main_circle = container.children.push(
                am5.Circle.new(root, {
                    radius: 4,
                    fill: data.color,  // Use color from data
                    strokeOpacity: 0
                })
            );

            // Check animated property from data
            if (data.animated === true) {
                var animated_circle = container.children.push(
                    am5.Circle.new(root, {
                        radius: 6,
                        fill: data.color,
                        strokeOpacity: 2
                    })
                );

                animated_circle.animate({
                    key: "scale",
                    from: 1,
                    to: 2,
                    duration: 2000,
                    easing: am5.ease.out(am5.ease.cubic),
                    loops: Infinity
                });

                animated_circle.animate({
                    key: "opacity",
                    from: 1,
                    to: 0.1,
                    duration: 2000,
                    easing: am5.ease.out(am5.ease.cubic),
                    loops: Infinity
                });
            }

            return am5.Bullet.new(root, {
                sprite: container
            });
        });

        function AddMarket(longitude, latitude, title, company, color, animated) {
            // Create unique location key
            const locationKey = `${longitude},${latitude}`;

            // Check if this location already exists
            if (existingLocations.has(locationKey)) {
                console.log(`Skipping duplicate location: ${locationKey}`);
                return;
            }

            existingLocations.add(locationKey);

            console.log(`Adding marker:`, {
                longitude, latitude, title, company, color, animated
            });

            // Add the data point with ALL necessary properties
            pointSeries.data.push({
                geometry: { type: "Point", coordinates: [longitude, latitude] },
                title: title,
                company: company,
                color: color,
                animated: animated
            });
        }

// Clear existing data
        pointSeries.data.clear();

// Process data once
        for (const item of data) {
            const { ID, company, delivery, lat, lon, title } = item;
            let color = "#004F9F";
            let animated = false;

            // Simplified color and animation logic
            // if (title.toLowerCase().startsWith("c")) {
            //     color = "#004F9F";  // Carrefour blue
            // }
            if (title.toLowerCase().startsWith("w")) {
                color = "#FFBB01";  // Walmart yellow
            } else if (title.toLowerCase().startsWith("t")) {
                color = "#D91E32";  // Target red
                animated = true;
            }

            console.log(`Processing: ${title}`, {
                color: color,
                animated: animated
            });

            AddMarket(lon, lat, title, company, color, animated);
        }

// Ensure the series appears
        pointSeries.appear(1000, 100);


// Make stuff animate on load
        chart.appear(1000, 100);


    }); // end am5.ready()
}

document.addEventListener('DOMContentLoaded', function() {
    fetchCompetitorsMapData();
    fetchCompetitorsStockData();
});
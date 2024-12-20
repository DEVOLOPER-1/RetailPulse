function fetchImage(image_name, imageId) {
    try {
        const imgElement = document.getElementById(imageId);
        if (!imgElement) {
            console.error('Image element not found:', imageId);
            return;
        }

        // Set image source with error handling
        imgElement.onerror = function() {
            console.error('Failed to load image:', image_name);
            imgElement.src = '/static/media/placeholder.png';
        };

        imgElement.src = `/static/media/${image_name}.png`;
    } catch (error) {
        console.error('Error in fetchImage:', error);
    }
}


function updateContainerValues(row) {
    // Helper functions remain the same
    function formatNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        }
        return num.toFixed(2);
    }

    function formatPercentage(num) {
        var percentage = num/row.stock_price * 100;
        return row.stock_price_movement_status==="up"  ? `+${percentage.toFixed(2)}%` : `-${percentage.toFixed(2)}%`;
    }

    try {
        // Get company prefix for IDs based on stock symbol
        const companyPrefix = row.stock.toLowerCase();

        // Update stock price
        const stockPrice = document.getElementById(`${companyPrefix}-stock-price-value`);
        if (stockPrice) {
            stockPrice.textContent = `$${row.stock_price}`;
            stockPrice.classList.remove('movement-up', 'movement-down');
            stockPrice.classList.add(`movement-${row.stock_price_movement_status}`);
        }
        const stocksymbol = document.getElementById(`${companyPrefix}-stock-symbol`);
        if (stocksymbol) {
            stocksymbol.textContent = row.stock;
        }
        // Update stock movement
        const stockMovement = document.getElementById(`${companyPrefix}-stock-movement`);
        if (stockMovement) {
            stockMovement.textContent = formatPercentage(row.stock_price_movement);
            stockMovement.classList.remove('movement-up', 'movement-down');
            stockMovement.classList.add(`movement-${row.stock_price_movement_status}`);
        }

        // Update market cap
        const marketCap = document.getElementById(`${companyPrefix}-market-cap`);
        if (marketCap) {
            marketCap.textContent = formatNumber(row.market_cap);
        }

        // Update net income
        const netIncome = document.getElementById(`${companyPrefix}-net-income`);
        if (netIncome) {
            netIncome.textContent = formatNumber(row.net_income);
        }

        // Update revenue
        const revenue = document.getElementById(`${companyPrefix}-revenue`);
        if (revenue) {
            revenue.textContent = formatNumber(row.revenue);
        }

        console.log(`Updated container values for ${row.corp_title}`);
    } catch (error) {
        console.error('Error updating container values:', error);
    }
}



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
        } else {
            color = "#2ec700";
        }
        const row = {
            stock: data.stock[i],
            revenue: data.revenue[i],
            market_cap: data.market_cap_value[i],
            net_income: data.net_income[i],
            stock_price: data.stock_price[i],
            stock_price_movement: data.stock_price_movement[i],
            stock_price_movement_status: data.stock_price_movement_status[i],
            corp_title: data.corp_title[i],
            exchange: data.exchange[i],
            currency: data.currency[i],
            color: color
        };
        updateContainerValues(row);
        console.log("finance row ->", row);
        rows.push(row);
    }
    return rows;
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
            console.log('Finance Data Received ===> ' , data);
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
                panY: "rotateY",
                projection: am5map.geoOrthographic(),
                rotationX: 90,
                rotationY: -20,
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
                }) ,
                active:true
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
            fillOpacity: 0.1,
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
            // console.log("correct context called->", data)
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

            // console.log(`Adding marker:`, {
            //     longitude, latitude, title, company, color, animated
            // });

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

            // console.log(`Processing: ${title}`, {
            //     color: color,
            //     animated: animated
            // });

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
    fetchImage("carrefour", "carrefour-logo")
    fetchImage("target", "target-logo")
    fetchImage("walmart", "walmart-logo")

    
});






// Deprecated Codes

// async function fetchImage(image_name, imageId) {
//     try {
//         const response = await fetch(`/api/get_readable_image/${image_name}`);  // Use image_name instead of company
//         const data = await response.json();
//         console.log("loaded image data ->", data);
//         if (data.success) {
//             const imgElement = document.getElementById(imageId);
//             imgElement.src = data.image;
//         } else {
//             console.error(`Failed to load ${image_name} logo:`, data.error);  // Use image_name here too
//             // Set a fallback image
//             const imgElement = document.getElementById(imageId);
//             imgElement.src = '/static/media/placeholder.png';
//         }
//     } catch (error) {
//         console.error(`Error fetching ${image_name} logo:`, error);  // And here
//         // Set a fallback image
//         const imgElement = document.getElementById(imageId);
//         imgElement.src = '/static/media/carrefour.png';
//     }
// }
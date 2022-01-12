// Making Timeline
function makeTimelineViz(divID) {
    var width = document.getElementById(divID).clientWidth;
    var height = width / 1.6;

    var padding = 50;

    var xScale = d3.scaleTime()
        .range([padding, width - padding])

    var yScale = d3.scaleLinear()
        .domain([-0.1,1.1])
        .range([height - padding, padding])

    var INNER_WIDTH = width - 2 * padding;
    var INNER_HEIGHT = height - 2 * padding;

    var svg = d3.select('#' + divID).append('svg')
        .attr("width", width)
        .attr("height", height);



    d3.csv('/data/timeline_data.csv', function(error, data) {
        if (error) {throw error};
        var yvals = [];
        for (i = 0; i < data.length; i++) {
            yvals.push(Math.random());
        }

        var zoomBeh = d3.zoom()
            .extent([[padding, padding], [padding + INNER_WIDTH, padding + INNER_HEIGHT]])
            .scaleExtent([1, 500])
            .translateExtent([[padding, padding], [padding + INNER_WIDTH, padding + INNER_HEIGHT]])
            .on("zoom", zoom);

        svg.call(zoomBeh);

        console.log(data);

        xScale.domain(d3.extent(data, function(d){
            return new Date(d.Date);
        }))

        var xAxis = d3.axisBottom()
            .ticks(20)
            .scale(xScale)
        
        var gX = svg.append('g')
            .attr('transform', 'translate(0,' + (height - padding) + ')')
            .attr('class', 'axis')
            .call(xAxis)

        var symbol = d3.symbol();

        var dots = svg.selectAll('.dots')
            .data(data)
            .enter()
            .append("path")
            .attr('class', 'deviceSpecialty')
            .attr("d", symbol.type(function(d) {
                if (d.Specialty == 'Radiology') {return d3.symbolSquare}
                else if (d.Specialty == 'Cardiovascular') {return d3.symbolTriangle}
                else if (d.Specialty == 'Other') {return d3.symbolStar}
            }))
            .attr('transform', function(d, i) {
                var x = xScale(new Date(d.Date));
                var y = yScale(yvals[i]);
                return "translate(" + x + ',' + y + ')' 
            })
            .attr('fill', function(d) {
                if (d.path == '510K') {return "rgb(56, 112, 158)"}
                else if (d.path == 'DEN') {return "rgb(187, 64, 64)"}
                else if (d.path == 'PMA') {return "rgb(68, 187, 64)"}
            })
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseout", onMouseOut)

        function zoom() {
                console.log('zoom')
                xScale.range([padding, padding + INNER_WIDTH].map(d => d3.event.transform.applyX(d)));
                gX.call(xAxis.scale(xScale))

                dots.attr('transform', function(d, i) {
                    // console.log(d)
                    var x = xScale(new Date(d.Date));
                    var y = yScale(yvals[i]);
                    return "translate(" + x + ',' + y + ')' 
                })
            }
        
        var legend = svg.append('g')
            .attr('id', 'timelineLegend')
            .attr('width', (width / 2) + 'px')
            .attr('height', '30px');

        legend.append("path")
            .attr("d", symbol.type(d3.symbolSquare))
            .attr('transform', 'translate(30,' + (2 * padding) / 3 + ')')
            .style('fill', "rgb(146, 150, 153)")
        legend.append("path")
            .attr("d", symbol.type(d3.symbolTriangle))
            .attr('transform', 'translate(30,' + 2* (2 * padding) / 3 + ')')
            .style('fill', "rgb(146, 150, 153)")
        legend.append("path")
            .attr("d", symbol.type(d3.symbolStar))
            .attr('transform', 'translate(30,' + (2 * padding) + ')')
            .style('fill', "rgb(146, 150, 153)")

        legend.append('text')
            .attr('transform', 'translate(45,' + ((2 * padding) / 3 + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'left')
            .attr('class', 'label')
            .attr('fill', '#aaa')
            .text('Radiology');
    
        legend.append('text')
            .attr('transform', 'translate(45,' + (2* (2 * padding) / 3 + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'left')
            .attr('class', 'label')
            .attr('fill', '#aaa')
            .text('Cardiovascular');
    
        legend.append('text')
            .attr('transform', 'translate(45,' + ((2 * padding) + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'left')
            .attr('class', 'label')
            .attr('fill', '#aaa')
            .text('Other');
    
    })

}

// Making Timeline for Binning
function makeTimelineBinViz(divID, bintype, maxHeight) {
    var width = document.getElementById(divID).clientWidth;
    var height = width / 1.6;

    var padding = 50;

    var xScale = d3.scaleTime()
        .range([padding, width - padding])

    var yScale = d3.scaleLinear()
        .domain([-0.5, maxHeight + 0.5])
        .range([height - padding, padding])

    var INNER_WIDTH = width - 2 * padding;
    var INNER_HEIGHT = height - 2 * padding;

    var svg = d3.select('#' + divID).append('svg')
        .attr("width", width)
        .attr("height", height);



    d3.csv('https://raw.githubusercontent.com/jamesjisu/Medical-AI/data/timeline_' + bintype + '_data.csv', function(error, data) {
        if (error) {throw error};
        var yvals = [];
        for (i = 0; i < data.length; i++) {
            yvals.push(Math.random());
        }

        var zoomBeh = d3.zoom()
            .extent([[padding, padding], [padding + INNER_WIDTH, padding + INNER_HEIGHT]])
            .scaleExtent([1, 500])
            .translateExtent([[padding, padding], [padding + INNER_WIDTH, padding + INNER_HEIGHT]])
            .on("zoom", zoom);

        svg.call(zoomBeh);

        console.log(data);

        xScale.domain(d3.extent(data, function(d){
            return new Date(d.Date);
        }))

        var xAxis = d3.axisBottom()
            .ticks(20)
            .scale(xScale)
        
        var gX = svg.append('g')
            .attr('transform', 'translate(0,' + (height - padding) + ')')
            .attr('class', 'axis')
            .call(xAxis)

        var symbol = d3.symbol().size("90");

        var dots = svg.selectAll('.dots')
            .data(data)
            .enter()
            .append("path")
            .attr('class', 'deviceSpecialty')
            .attr("d", symbol.type(function(d) {
                if (d.Specialty == 'Radiology') {return d3.symbolSquare}
                else if (d.Specialty == 'Cardiovascular') {return d3.symbolTriangle}
                else if (d.Specialty == 'Other') {return d3.symbolStar}
            }))
            .attr('transform', function(d, i) {
                var x = xScale(new Date(d.Date));
                var y = yScale(d.height);
                return "translate(" + x + ',' + y + ')' 
            })
            .attr('fill', function(d) {
                if (d.path == '510K') {return "rgb(56, 112, 158)"}
                else if (d.path == 'DEN') {return "rgb(187, 64, 64)"}
                else if (d.path == 'PMA') {return "rgb(68, 187, 64)"}
            })
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseout", onMouseOut)

        function zoom() {
                console.log('zoom')
                xScale.range([padding, padding + INNER_WIDTH].map(d => d3.event.transform.applyX(d)));
                gX.call(xAxis.ticks(20).scale(xScale))

                dots.attr('transform', function(d, i) {
                    // console.log(d)
                    var x = xScale(new Date(d.Date));
                    var y = yScale(d.height);
                    return "translate(" + x + ',' + y + ')' 
                })
            }
        
        var legend = svg.append('g')
            .attr('id', 'timelineLegend')
            .attr('width', (width / 2) + 'px')
            .attr('height', '30px');

        legend.append("path")
            .attr("d", symbol.type(d3.symbolSquare))
            .attr('transform', 'translate(30,' + (2 * padding) / 3 + ')')
            .style('fill', "rgb(146, 150, 153)")
        legend.append("path")
            .attr("d", symbol.type(d3.symbolTriangle))
            .attr('transform', 'translate(30,' + 2* (2 * padding) / 3 + ')')
            .style('fill', "rgb(146, 150, 153)")
        legend.append("path")
            .attr("d", symbol.type(d3.symbolStar))
            .attr('transform', 'translate(30,' + (2 * padding) + ')')
            .style('fill', "rgb(146, 150, 153)")


        // legend.append("path")
        //     .attr("d", symbol.type(d3.symbolSquare))
        //     .attr('transform', 'translate(30,' + (2 * padding) / 3 + ')')
        //     .style('fill', "rgb(0,0,0)")
        // legend.append("path")
        //     .attr("d", symbol.type(d3.symbolTriangle))
        //     .attr('transform', 'translate(30,' + 2* (2 * padding) / 3 + ')')
        //     .style('fill', "rgb(0,0,0)")
        // legend.append("path")
        //     .attr("d", symbol.type(d3.symbolStar))
        //     .attr('transform', 'translate(30,' + (2 * padding) + ')')
        //     .style('fill', "rgb(0,0,0)")


        legend.append('text')
            .attr('transform', 'translate(45,' + ((2 * padding) / 3 + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'left')
            .attr('class', 'label')
            .attr('fill', '#aaa')
            .text('Radiology');
    
        legend.append('text')
            .attr('transform', 'translate(45,' + (2* (2 * padding) / 3 + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'left')
            .attr('class', 'label')
            .attr('fill', '#aaa')
            .text('Cardiovascular');
    
        legend.append('text')
            .attr('transform', 'translate(45,' + ((2 * padding) + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'left')
            .attr('class', 'label')
            .attr('fill', '#aaa')
            .text('Other');

        legend.append('text')
            .attr('transform', 'translate(45,' + (4*(2 * padding) / 3 + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'left')
            .attr('class', 'collesslabel')
            .attr('fill', 'rgb(56, 112, 158)')
            .text('510K');
    
        legend.append('text')
            .attr('transform', 'translate(45,' + (5* (2 * padding) / 3 + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'left')
            .attr('class', 'collesslabel')
            .attr('fill', 'rgb(187, 64, 64)')
            .text('De Novo');
    
        legend.append('text')
            .attr('transform', 'translate(45,' + (6*(2 * padding)/3 + 0.3*padding/3) + ')')
            .attr('alignment-baseline', 'middle')
            .attr('class', 'collesslabel')
            .attr('text-anchor', 'left')
            .attr('fill', 'rgb(68, 187, 64)')
            .text('PMA');

    })

}

// Making Timeline Bar
function makeTimelineBarViz(divID) {
    //for(var i = 0; i < )
}

// Making the World Map
function makeWorldMapViz(divID) {
    var mapWidth = document.getElementById(divID).clientWidth;
    var mapHeight = mapWidth * 0.65;
    const mapSVG = d3.select("#" + divID).append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight);


    var mapScale = d3.scaleLinear()
        .domain([])

    var projection = d3.geoNaturalEarth()
        .translate([mapWidth / 2, mapHeight / 2]) // translate to center of screen
        .scale(mapWidth / 1.5 / Math.PI) // scale things down so see entire US            
        .rotate([0, 0]) 
        .center([0, 25]) 
        .translate([mapWidth / 2, mapHeight / 3]);
    
    const path = d3.geoPath().projection(projection);

    var totalScale = d3.scaleLinear().domain([0,Math.log10(113)]).range(['rgb(97, 96, 96)', 'rgb(56, 112, 158)']);
    
    d3.json("https://raw.githubusercontent.com/jamesjisu/Medical-AI/data/map_dat_INTL.json", function(error, uWorld) {
    if (error) throw error;
        mapSVG.selectAll('path')
            .data(uWorld.features)
            .enter()
            .append('path')
            .attr("d", path)
            .attr('class', 'country')
            .style("fill", function(d) {
                if(d.properties.hasOwnProperty("devices")) {
                    return totalScale(Math.log10(d["properties"]["devices"][9]+1));
                }
                else {
                    return totalScale(0); 
                }
            })
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseout", onMouseOut)
    });

}

// Making US Map
function makeUSMap(divID) {
    var mapWidth = document.getElementById(divID).clientWidth;
    var mapHeight = mapWidth * 0.65;
    var svg = d3.select("#" + divID).append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight);

    var projection = d3.geoAlbersUsa()
        .translate([mapWidth / 2, mapHeight / 2]) // translate to center of screen
        .scale([1000]); // scale things down so see entire US

    var path = d3.geoPath().projection(projection);

    var totalScale = d3.scaleLinear().domain([0,Math.log10(29)]).range(['rgb(97, 96, 96)', 'rgb(56, 112, 158)']);
 
    d3.json('https://raw.githubusercontent.com/jamesjisu/Medical-AI/data/map_dat_US.json', function(error, uState) {
        if (error) throw error;
            svg.selectAll('path')
                .data(uState.features)
                .enter()
                .append('path')
                .attr("d", path)
                .attr('class', 'state')
                .style("fill", function(d) {
                    if(d.properties.hasOwnProperty("devices")) {
                        return totalScale(Math.log10(d["properties"]["devices"]+1));
                    }
                    else {
                        return totalScale(0); 
                    }
                })
                .on("mouseover", onMouseOver)
                .on("mousemove", onMouseMove)
                .on("mouseout", onMouseOut)
        });


        
}

// Make Specialties Bar Chart
function makeBarChart(divID) {
    var width = document.getElementById(divID).clientWidth;
    var height = width / 1.6;

    var padding = 50;

    var xScale = d3.scaleBand()
        .range([padding, width - padding])
        .padding(0.2)

    var yScale = d3.scaleLinear().range([height - 3 * padding, padding])
    

    var svg = d3.select('#' + divID).append('svg')
        .attr("width", width)
        .attr("height", height);

    d3.json('https://raw.githubusercontent.com/jamesjisu/Medical-AI/master/data/specialties_jiang.json', function(error, data) {
        if (error) {throw error;}

        console.log(data)
        xScale.domain(data.map(function(d) {return d.specialty}))
        yScale.domain([0,d3.max(data, function(d) {return d.number})])

        svg.append('g')
            .attr("transform", "translate(0," + (height - 3 * padding) + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(xScale).tickSizeOuter(0))
            .selectAll("text")
                .attr("y", 10)
                .attr("x", -5)
                .attr("dy", ".35em")
                .attr("transform", "rotate(-30)")
                .style("text-anchor", "end");

        
        svg.append('g')
            .attr("transform", "translate(" + padding + ",0)")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale).tickSizeOuter(0))

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.specialty)})
            .attr("y", function(d) { return yScale(d.number)})
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - 3 * padding - yScale(d.number)})
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseout", onMouseOut)
    })


}

// Make Pie Chart
function makePieChart(divID) {
    var pie = d3.pie()
        .value(function (d) { return d.tf_idf; })
    var colorVec = ["#F94144", "#F3722C", "#F8961E",
        "#F9C74F", "#90BE6D", "#43AA8B", "#3a34ed"];
    var color = d3.scaleOrdinal()
        .domain(dataSlice1.map(function (d) { return d.keyword }))
        .range(colorVec.slice(0, dataSlice1.length))



    var importanceTotal = dataSlice1.reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b.tf_idf);
    }, 0);
    console.log(importanceTotal)


    dataSlice1.sort(function (a, b) { return b.tf_idf - a.tf_idf });

    dataSlice = dataSlice1.slice(0, nCutofftoShow);
    console.log(dataSlice)

    var keywordImpTotals = 0;
    var propData = [];
    for (var i = 0; i < dataSlice.length; i++) {
        keywordImpTotals += dataSlice[i].tf_idf / importanceTotal;
        propData.push({ keyword: dataSlice[i].keyword, tf_idf: dataSlice[i].tf_idf / importanceTotal });
    }
    /* propData.push({ keyword: '기타', frequency: 1 - keywordImpTotals }); */

    var pieChart = document.getElementById(divID);
    pieChart.innerHTML = "";
    console.log(propData)

    var svg = d3.select("#" + divID).append("svg")
        .attr('class', function () { if (divID == 'enlargedChart') { return 'largeSVG' } else { return 'visSVG' } })
        .attr("width", "100%")
        .attr("height", "100%");

    if (divID == "enlargedChart") {
        var divHeight = 550;
        var divWidth = 1250;
    }
    else {
        var divHeight = pieChart.offsetHeight;
        var divWidth = pieChart.offsetWidth;
    }
    var innerRadius = divHeight / 5;
    var outerRadius = divHeight / 3;
    /* Draw the actual pie chart */


    svg.append('g')
        .attr("transform", "translate(" + divHeight / 2 + ',' + divHeight / 2 + ")")
        .selectAll('.svgArc')
        .data(pie(propData))
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
        )
        .attr('class', function (d) {
            if (divID == 'enlargedChart') {
                return 'svgArcEnlarged';
            }
            else {
                return 'svgArc';
            }
        })

        .attr('fill', function (d) {
            return (color(d.data.keyword))
        })
        .on("mouseover", onMouseOver)
        .on("mousemove", onMouseMove)
        .on("mouseout", onMouseOut);


    var legend = svg.append('g')
        .attr('transform', 'translate(' + 2 * divWidth / 3 +
            ',' + divHeight / 6 + ')');

    legend.selectAll("legendDots")
        .data(propData)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', 0)
        .attr('cy', function (d, i) { return i * 0.05 * divHeight })
        .style('fill', function (d, i) { return color(d.keyword) });

    legend.selectAll('labels')
        .data(propData)
        .enter()
        .append('text')
        .attr('x', 10)
        .attr('y', function (d, i) { return i * 0.05 * divHeight; })
        .style('font-size', 1 / 30 * divHeight + 'px')
        .style("fill", function (d, i) { return color(d.keyword) })
        .text(function (d) { return d.keyword })
        .style('alignment-baseline', 'middle');

    svg.append('text')
        .attr('transform', 'translate(' + divHeight / 2 + ',' + divHeight / 2 + ")")
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .style('font-size', 1 / 10 * divHeight + 'px')
        .attr('id', 'keywordPercent' + divID)
        .text('중요도')
        .style('font-style', 'italic');

    if (divID == 'enlargedChart') {
        window.SVG = svg;
    }
}

// Make Heat Map
function makeHeatMap(divID) {
    var width = document.getElementById("keytermHeatMap").clientWidth;
    var height = width / 1.6;
    var margin = 150;

    var svg = d3.select("#" + divID).append("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
    
        var terms = ["Artificial Intelligence","Machine Learning","Neural Network","Neural Networks","Deep Learning","Reinforcement Learning","Natural Language Processing","Decision Tree","xgboost","Gradient Boosted","Gradient Boosting","Ensemble","Big Data","DNN","CNN","RNN","NLP"]
        var groups = ["FDA", "Jiang et al", "510K", "DEN", "PMA", "No Clinical Study", "Clinical Study", "Total"]

        var xScale = d3.scaleBand()
            .range([margin, width - margin])
            .domain(terms)
            .padding(0.01);
        svg.append('g')
            .attr("transform", "translate(0," + (margin) + ")")
            .call(d3.axisTop(xScale))
            .attr('class', 'axis')

        var yScale = d3.scaleBand()
            .range([margin, height - margin])
            .domain(groups)
            .padding(0.01);
        svg.append('g')
            .attr("transform", "translate(" + (margin) + ",0)")
            .call(d3.axisLeft(yScale))
            .attr('class', 'axis')

    var colorScale = d3.scaleLinear()
        .domain([0,209])
        .range(['black', 'blue']);

    d3.csv('https://raw.githubusercontent.com/jamesjisu/Medical-AI/data/temp.csv', function(data) {
        svg.selectAll()
            .data(data, function(d) { return d.group + ': ' + d.variable;})
            .enter()
            .append('rect')
            .attr("x", function(d) { console.log(xScale(d.group)); return xScale(d.variable) })
            .attr("y", function(d) { return yScale(d.group) })
            .attr("width", xScale.bandwidth() )
            .attr("height", yScale.bandwidth() )
            .style("fill", function(d) { return colorScale(d.value)})
    })

    
        
}



function onMouseOver(d, i) {
    var elementClass = this.getAttribute('class');
    console.log(elementClass);
    console.log(d)
    tooltip.style('visibility', 'visible');

    if (elementClass == "country") {
        if(d.properties.hasOwnProperty("devices")) {
            deviceVec = d["properties"]["devices"];
            tooltip.html(d["properties"]["name"] + "<br />" + 
                "FDA: " + d["properties"]["devices"][0] + "<br />" + 
                "Jiang et al: " + d["properties"]["devices"][1])
        }
        else{
            tooltip.html(d["properties"]["name"] + "<br />None" )
        }
        d3.select(this).style('opacity', '80%')
    } 
    else if (elementClass == "state") {
        if(d.properties.hasOwnProperty("devices")) {
            tooltip.html(d["properties"]["name"] + "<br />" + 
                "Devices: " + d["properties"]["devices"])
        }
        else{
            console.log('no data')
        }
        d3.select(this).style('opacity', '80%')
    } 
    else if (elementClass == "bar") {
        tooltip.html(d.specialty + ": " + d.number)
    }
    else if (elementClass == 'deviceSpecialty') {
        tooltip.html(d.Name)
    }
}

function onMouseMove(d, i) {
    var elementClass = this.getAttribute('class');
    return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
}

function onMouseOut(d, i) {
    tooltip.style('visibility', 'hidden');
    d3.select(this).style('opacity', '100%')
}
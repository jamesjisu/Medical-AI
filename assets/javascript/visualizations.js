// Making the Map
function makeMapViz(divID) {
    var mapWidth = document.getElementById("map").clientWidth;
    var mapHeight = mapWidth * 0.65;
    const mapSVG = d3.select("#" + divID).append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight);


    var mapScale = d3.scaleLinear()
        .domain([])

    const projection = d3.geoNaturalEarth()
        .translate([mapWidth / 2, mapHeight / 2]) // translate to center of screen
        .scale(mapWidth / 1.5 / Math.PI) // scale things down so see entire US            
        .rotate([0, 0]) 
        .center([0, 25]) 
        .translate([mapWidth / 2, mapHeight / 3]);
    
    const path = d3.geoPath().projection(projection);

    var totalScale = d3.scaleLinear().domain([0,Math.log10(113)]).range(['rgb(97, 96, 96)', 'rgb(56, 112, 158)']);
    
    d3.json("/data/maps.json", function(error, uWorld) {
    if (error) throw error;
        mapSVG.selectAll('path')
            .data(uWorld.features)
            .enter()
            .append('path')
            .attr("d", path)
            .attr('class', 'state')
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

// Make Specialties Bar Chart
function makeBarChart(divID) {
    var width = document.getElementById("map").clientWidth;
    var height = width / 1.6;

    var padding = 50;

    var xScale = d3.scaleBand()
        .range([padding, width - padding])
        .padding(0.2)

    var yScale = d3.scaleLinear().range([height - padding, padding])
    

    var svg = d3.select('#' + divID).append('svg')
        .attr("width", width)
        .attr("height", height);

    d3.json('/data/specialties_jiang.json', function(error, data) {
        if (error) {throw error;}

        console.log(data)
        xScale.domain(data.map(function(d) {return d.specialty}))
        yScale.domain([0,d3.max(data, function(d) {return d.number})])

        svg.append('g')
            .attr("transform", "translate(0," + (height - padding) + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(xScale))

        
        svg.append('g')
            .attr("transform", "translate(" + padding + ",0)")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale))

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.specialty)})
            .attr("y", function(d) { return yScale(d.number)})
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - padding - yScale(d.number)})
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
    var width = document.getElementById("map").clientWidth;
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

    d3.csv('/data/temp.csv', function(data) {
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

    if (elementClass == "state") {
        if(d.properties.hasOwnProperty("devices")) {
            deviceVec = d["properties"]["devices"];
            tooltip.html(d["properties"]["name"] + "<br />" + 
                "FDA: " + d["properties"]["devices"][0] + "<br />" + 
                "Jiang et al: " + d["properties"]["devices"][1])
        }
        else{
            console.log('no data')
        }
        d3.select(this).style('opacity', '80%')
    }
    else if (elementClass == "bar") {
        tooltip.html(d.specialty + ": " + d.number)
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
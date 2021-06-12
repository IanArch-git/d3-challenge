var svgWidth = 960;
var svgHeight = 660;
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("./D3_data_journalism/data/data.csv").then(function (povdata) {
    console.log(povdata);
    povdata.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        console.log(data.state, data.poverty, data.healthcare, data.abbr)
    });

    var xScale = d3.scaleLinear()
        .domain(d3.extent(povdata, d => d.poverty))
        .range([0, svgWidth]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(povdata, d => d.healthcare)])
        .range([svgHeight, 0]);
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    var circlesGroup = chartGroup.selectAll("cirlce")
        .data(povdata)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("opacity", ".7")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

    chartGroup.selectAll("text.text-circles")
        .data(povdata)
        .enter()
        .append("text")
        .classed("text-circles", true)
        .text(d => d.abbr)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")

    chartGroup.append("text")
        .attr("x", 350)
        .attr("y", 630)
        .classed("axis-text", true)
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -5 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");
});
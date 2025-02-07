// I. Select elements using D3.js
d3.select("body").append("p")
  // initial <p> by differenciate from the others.
  .attr("class", "initial-text")
  .text("Hello, D3.js");

/* II. Bind data to elements:
  III. Enter, Update, and Exit Patterns:
    - Enter pattern */
const data = [10, 20, 30, 40, 50];
d3.select("body").selectAll("p.data-bound") // select specific <p> class called "data-bound".
  .data(data)
  .enter()
  .append("p")
  // To solve the problem of missing 10
  .attr("class", "data-bound") 
  .text(d => d);

// - Update pattern
d3.select("body").selectAll("p")
  .data(data)
  .text(d => d);

// - Exit pattern
d3.select("body").selectAll("p")
  .data(data)
  .exit()
  .remove();

// IV. Working with SVGs
// - Create an SVG element
const svg = d3.select("body").append("svg")
  .attr("width", 500)
  .attr("height", 500);

// - Create a rectangle
svg.append("rect")
  .attr("x", 50)
  .attr("y", 50)
  .attr("width", 100)
  .attr("height", 50)
  .attr("fill", "blue");

// - Create a circle
svg.append("circle")
  .attr("cx", 200)
  .attr("cy", 200)
  .attr("r", 50)
  .attr("fill", "red");

// - Create a Line
svg.append("line")
  .attr("x1", 300)
  .attr("y1", 300)
  .attr("x2", 400)
  .attr("y2", 400)
  .attr("stroke", "black")
  .attr("stroke-width", 2);

// V. Creating Simple Charts
// - Create a bar chart
const dataChart = [30, 86, 168, 281, 303, 365];
const svgBar = d3.select("body").append("svg")
  .attr("width", 500)
  .attr("height", 300);

svgBar.selectAll("rect")
  .data(dataChart)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 70)
  .attr("y", d => 300 - d)
  .attr("width", 65)
  .attr("height", d => d)
  .attr("fill", "teal");

// - Create a line chart
const svgLine = d3.select("body").append("svg")
  .attr("width", 500)
  .attr("height", 300);

const line = d3.line()
  .x((d, i) => i * 70)
  .y(d => 300 - d);

svgLine.append("path")
  .datum(dataChart)
  .attr("fill", "none")
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("d", line);

// VI. Creating Scatter Plots
// - Create a scatter plot
const dataScatter = [
  {x: 30, y: 20}, {x: 50, y: 90}, {x: 70, y: 50},
  {x: 90, y: 120}, {x: 110, y: 80}, {x: 130, y: 150}
];

const svgScatter = d3.select("body").append("svg")
  .attr("width", 500)
  .attr("height", 300);

svgScatter.selectAll("circle")
  .data(dataScatter)
  .enter()
  .append("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => 300 - d.y)
  .attr("r", 5)
  .attr("fill", "red");

  // VII. Scales and Axes
  // - Introductin to scales ans axes in D3.js
  const dataCircle = [
    {x: 30, y: 20}, {x: 50, y: 90}, {x: 70, y: 50},
    {x: 90, y: 120}, {x: 110, y: 80}, {x: 130, y: 150}
  ];
  
  const svgCircle = d3.select("body").append("svg")
    .attr("width", 500)
    .attr("height", 300);
  
  svgCircle.selectAll("circle")
    .data(dataCircle)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => 300 - d.y)
    .attr("r", 5)
    .attr("fill", "teal");

// VIII. Scales and Axes
/* *** Solution if a data element exceed the hight of SVG
   by using D3's scaling function to map data value to
   a suitable range. */

// - Correct Bar chart
// Define the dimensions of the SVG canvas
// const dataChart = [30, 86, 168, 281, 303, 365];
const width = 500;
const height = 300;

// Create a linear scale for the y-axis
const yScale = d3.scaleLinear()
  .domain([0, d3.max(dataChart)]) // Input domain (data range)
  .range([height, 0])

// Create the SVG canvas
const svgBarEdit = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

// Bind data and create bars
svgBarEdit.selectAll("rect")
  .data(dataChart)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 70)
  .attr("y", d => yScale(d))
  .attr("width", 65)
  .attr("height", d => height - yScale(d))
  .attr("fill", "yellow");

// IX. LET’S CORRECT OUR PREVIOUS LINE CHART
/* Modify the line chart scale to suitable for SVG area */
// 1. Create linearscale for x-axis
const xScaleLine = d3.scaleLinear()
  .domain([0, dataChart.length - 1])
  .range([0, width]);

// 2. Create linearscale for y-axis
const yScaleLine = d3.scaleLinear()
  .domain([0, d3.max(dataChart)])
  .range([height, 0]);

// 3. Create the SVG canvas
const svgLineEdit = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

// 4. Create Line chart starting point
const lineEdit = d3.line()
  .x((d, i) => xScaleLine(i))
  .y(d => yScaleLine(d));

// 5. Draw a line chart
svgLineEdit.append("path")
  .datum(dataChart)
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 3)
  .attr("d", lineEdit);

// X. Complex Charts - Pie and Donut Charts
// - Create a pie chart
const dataPie = [10, 20, 30, 40];

const pie = d3.pie()(dataPie);

const arc = d3.arc()
  .innerRadius(0)
  .outerRadius(100);

const svgPie = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

svgPie.selectAll("path")
  .data(pie)
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", (d, i) => d3.schemeCategory10[i]);

// - Create a area chart
const svgArea = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

const xScaleArea = d3.scaleLinear()
  .domain([0, dataChart.length - 1])
  .range([0, width])

const yScaleArea = d3.scaleLinear()
  .domain([0, d3.max(dataChart)])
  .range([height, 0])

const area = d3.area()
.x((d, i) => xScaleArea(i))
.y0(height)
.y1(d => yScaleArea(d));

svgArea.append("path")
  .datum(dataChart)
  .attr("fill", "lightblue")
  .attr("d", area);

// - Create a stacked bar chart
const dataStacked = [
  {category: "A", values: [30, 20, 10]},
  {category: "B", values: [40, 30, 20]},
  {category: "C", values: [50, 40, 30]}
];

const stack = d3.stack()
  .keys([0, 1, 2])
  (dataStacked.map(d => d.values));

const svgStacked = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

svgStacked.selectAll("g")
  .data(stack)
  .enter()
  .append("g")
  .attr("fill", (d, i) => d3.schemeCategory10[i])
  .selectAll("rect")
  .data(d => d)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 70)
  .attr("y", d => 300 - d[1])
  .attr("height", d => d[1] - d[0])
  .attr("width", 65);

// XI. Adding Interactivity - Handling Events
// - Handling click and hover events
svgBarEdit.selectAll("rect")
  .on("click", function(event, d) {
    d3.select(this).attr("fill", "orange");
  })
  .on("mouseover", function(event, d) {
    d3.select(this).attr("fill", "lightblue");
  })
  .on("mouseout", function(event, d) {
    d3.select(this).attr("fill", "teal");
  });

// - Adding tooltips
const tooltip = d3.select("body").append("div")
  .style("position", "absolute")
  .style("background", "#f9f9f9")
  .style("padding", "5px")
  .style("border", "1px solid #d3d3d3")
  .style("border-radius", "5px")
  .style("visibility", "hidden");

svgBarEdit.selectAll("rect")
  .on("mouseover", function(event, d) {
    tooltip.style("visibility", "visible")
      .text("Value: " + d);
  })
  .on("mousemove", function(event) {
    tooltip.style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  })
  .on("mouseout", function() {
    tooltip.style("visibility", "hidden");
  });

// XII. Animating Visualizations - Transitions and Animations
// - Adding transitions
const dataTransition = [10, 20, 30, 40, 50];
const widthAnimate = 500;
const heightAnimate = 300;

const svgBarTransition = d3.select("body").append("svg")
  .attr("width", widthAnimate)
  .attr("height", heightAnimate);

const xScaleTransition = d3.scaleBand()
  .domain(dataTransition.map((d, i) => i))
  .range([0, widthAnimate])
  .padding(0.1);

const yScaleTransition = d3.scaleLinear()
  .domain([0, d3.max(dataTransition) * 2])
  .range([heightAnimate, 0]);

svgBarTransition.selectAll("rect")
  .data(dataTransition)
  .enter()
  .append("rect")
  .attr("x", (d, i) => xScaleTransition(i))
  .attr("y", d => yScaleTransition(d))
  .attr("width", xScaleTransition.bandwidth())
  .attr("height", d => heightAnimate - yScaleTransition(d))
  .attr("fill", "tan");

// Transition to double the height of each bar
svgBarTransition.selectAll("rect")
  .transition()
  .duration(1000)
  .attr("height", d => yScaleTransition(0) - yScaleTransition(d * 2))
  .attr("y", d => yScaleTransition(d * 2));

// - Using D3's Animation Functions
const dataCircles = [
  { x: 30, y: 30 },
  { x: 70, y: 70 },
  { x: 110, y: 110 }
];

const svgCircleAnimate = d3.select("body").append("svg")
  .attr("width", widthAnimate)
  .attr("height", heightAnimate);

svgCircleAnimate.selectAll("circle")
  .data(dataCircles)
  .enter()
  .append("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => heightAnimate - d.y)
  .attr("r", 25)
  .attr("fill", "teal");

// Apply transition to move circles
svgCircleAnimate.selectAll("circle")
  .transition()
  .duration(1000)
  .attr("cx", d => d.x + 50)
  .attr("cy", d => heightAnimate - (d.y + 50));
  
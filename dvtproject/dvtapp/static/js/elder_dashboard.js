let barChart, pieChart, lineChart;
let csvData = []; // Store CSV data globally
const csvFilePath = "static/dataset/elder-happiness-region.csv";

document.addEventListener("DOMContentLoaded", function() {
  initializeDashboard(csvFilePath); // Ensure it runs on page load
});

function initializeDashboard(csvFile) {
    console.log("Dashboard Loaded, Now Initializing Charts from: ", csvFile);

    d3.csv(csvFile).then(data => {
        console.log("Data Loaded: ", data);

        // Convert strings to numbers
        data.forEach(d => {
            d.year = d.year.trim(); // Ensure year is a string for filtering
            d["Strongly Disagree"] = +d["Strongly Disagree"];
            d["Disagree"] = +d["Disagree"];
            d["Neutral"] = +d["Neutral"];
            d["Agree"] = +d["Agree"];
            d["Strongly Agree"] = +d["Strongly Agree"];
        });

        csvData = data; // Store globally
        populateDropdowns(); // Populate the dropdowns
        updateCharts(); // Render initial charts
    }).catch(error => console.error("Error reading CSV: ", error));
}

function populateDropdowns() {
    // console.log("csvData: ", csvData);
    const years = [...new Set(csvData.map(d => d.year))].sort();
    const regions = [...new Set(csvData.map(d => d.region))];

    const yearSelect = document.getElementById("yearSelect");
    const regionSelect = document.getElementById("regionSelect");

    yearSelect.innerHTML = years.map(year => `<option value="${year}">${year}</option>`).join("");
    regionSelect.innerHTML = regions.map(region => `<option value="${region}">${region}</option>`).join("");

    // Add event listeners
    yearSelect.addEventListener("change", updateCharts);
    regionSelect.addEventListener("change", updateCharts);
}

function updateCharts() {
    console.log("Updating Charts...");

    const selectedYear = document.getElementById("yearSelect").value;
    const selectedRegion = document.getElementById("regionSelect").value;

    const filteredData = csvData.filter(d => d.year === selectedYear);

    // Bar Chart Data
    const labels = filteredData.map(d => d.region);
    const datasets = [
        { label: "Strongly Agree", data: filteredData.map(d => d["Strongly Agree"]), backgroundColor: "#FFD700" },
        { label: "Agree", data: filteredData.map(d => d["Agree"]), backgroundColor: "#90EE90" },
        { label: "Neutral", data: filteredData.map(d => d["Neutral"]), backgroundColor: "#ADD8E6" },
        { label: "Disagree", data: filteredData.map(d => d["Disagree"]), backgroundColor: "#FFA07A" },
        { label: "Strongly Disagree", data: filteredData.map(d => d["Strongly Disagree"]), backgroundColor: "#D3D3D3" }
    ];

    // Render Bar Chart
    const ctxBar = document.getElementById("barChart").getContext("2d");
    if (barChart) barChart.destroy();
    barChart = new Chart(ctxBar, {
        type: "bar",
        data: { labels, datasets },
        options: { responsive: true, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }
    });

    // Pie Chart for Selected Region
    const regionData = csvData.find(d => d.year === selectedYear && d.region === selectedRegion);
    if (regionData) {
        const pieLabels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
        const pieValues = [regionData["Strongly Disagree"], regionData["Disagree"], regionData["Neutral"], regionData["Agree"], regionData["Strongly Agree"]];

        const ctxPie = document.getElementById("pieChart").getContext("2d");
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(ctxPie, {
            type: "pie",
            data: { labels: pieLabels, datasets: [{ data: pieValues, backgroundColor: ["#D3D3D3", "#FFA07A", "#ADD8E6", "#90EE90", "#FFD700"] }] }
        });
    }

    updateLineChart();
}

function updateLineChart() {
    const years = [...new Set(csvData.map(d => d.year))];
    const happinessLevels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

    const datasets = happinessLevels.map(level => ({
        label: level,
        data: years.map(year => d3.sum(csvData.filter(d => d.year === year), d => d[level])),
        borderColor: level === "Strongly Agree" ? "#FFD700" :
                     level === "Agree" ? "#90EE90" :
                     level === "Neutral" ? "#ADD8E6" :
                     level === "Disagree" ? "#FFA07A" : "#D3D3D3",
        fill: false
    }));

    const ctxLine = document.getElementById("lineChart").getContext("2d");
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(ctxLine, { type: "line", data: { labels: years, datasets } });
}

function exportToCSV() {
    const csvContent = "data:text/csv;charset=utf-8," +
        ["year,region,Strongly Disagree,Disagree,Neutral,Agree,Strongly Agree"]
        .concat(csvData.map(d => `${d.year},${d.region},${d["Strongly Disagree"]},${d["Disagree"]},${d["Neutral"]},${d["Agree"]},${d["Strongly Agree"]}`))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "elder_happiness_region.csv");
    document.body.appendChild(link);
    link.click();
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Elder Dashboard loaded, fetching CSV...");

    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            console.log("CSV Loaded:", csvData);
            processCSV(csvData);
        })
        .catch(error => console.error("Error loading CSV:", error));
});

function processCSV(csvData) {
    console.log("Processing CSV data...");
    // Add logic to parse and visualize CSV
    // initializeDashboard(csvData)
}

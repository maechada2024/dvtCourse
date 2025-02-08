// Function to load external components dynamically
async function loadComponent(id, file) {
    try {
        const response = await fetch(`includes/${file}`);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const content = await response.text();
        document.getElementById(id).innerHTML = content;
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

// Load components
/* loadComponent('header', 'header.html');
loadComponent('left-sidebar', 'left-sidebar.html');
loadComponent('footer', 'footer.html'); */

// ================== Chart.js Bar Chart ==================
document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales ($)',
                data: [12000, 15000, 11000, 18000, 17000, 22000],
                backgroundColor: ['#FF5733', '#33A1FF', '#33FF57', '#FFC300', '#8E44AD', '#E74C3C']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } }
        }
    });
});

// ================== D3.js Pie Chart ==================
document.addEventListener("DOMContentLoaded", function() {
    const width = 250, height = 250, radius = Math.min(width, height) / 2;
    const svg = d3.select("#pieChart").append("g")
                  .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const data = { "Product A": 30, "Product B": 50, "Product C": 20 };
    const color = d3.scaleOrdinal(["#FF5733", "#33A1FF", "#33FF57"]);
    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll("path")
        .data(pie(Object.entries(data)))
        .enter().append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data[0]))
        .attr("stroke", "#fff")
        .style("stroke-width", "2px");
});

function loadGraph(csvFile) {
  d3.select("#chart").html(""); // Clear old graph

  d3.csv(csvFile).then(data => {
      const width = 600, height = 400;
      const svg = d3.select("#chart")
                    .attr("width", width)
                    .attr("height", height);
      
      const xScale = d3.scaleBand()
                       .domain(data.map(d => d.Category))
                       .range([50, width - 20])
                       .padding(0.3);
      
      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(data, d => +d.Value)])
                       .range([height - 50, 20]);

      svg.append("g")
         .attr("transform", `translate(0, ${height - 50})`)
         .call(d3.axisBottom(xScale));

      svg.append("g")
         .attr("transform", "translate(50,0)")
         .call(d3.axisLeft(yScale));

      svg.selectAll("rect")
         .data(data)
         .enter()
         .append("rect")
         .attr("x", d => xScale(d.Category))
         .attr("y", d => yScale(+d.Value))
         .attr("width", xScale.bandwidth())
         .attr("height", d => height - 50 - yScale(+d.Value))
         .attr("fill", "#33A1FF")
         .on("mouseover", function () { d3.select(this).attr("fill", "#FF5733"); })
         .on("mouseout", function () { d3.select(this).attr("fill", "#33A1FF"); });
  }).catch(error => {
      console.error("Error loading CSV:", error);
  });
}

(function() {
    const script = document.createElement("script");
    script.src = "static/js/elder_dashboard.js";
    script.type = "text/javascript";
    script.async = false; // Ensures proper execution order

    // Insert the script at the top of the document, before <body>
    document.documentElement.insertBefore(script, document.documentElement.firstChild);
})();

function loadPageElderly(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            // Extract and load scripts separately
            let scripts = tempDiv.querySelectorAll("script");
            tempDiv.querySelectorAll("script").forEach(script => script.remove());

            // console.log("CSV: ", csvData);
            document.getElementById("content").innerHTML = tempDiv.innerHTML;
            initializeDashboard("static/dataset/elder-happiness-region.csv");

            // Execute scripts manually after loading content
            scripts.forEach(oldScript => {
                let newScript = document.createElement("script");
                newScript.src = oldScript.src;
                newScript.type = "text/javascript";
                document.body.appendChild(newScript);
            });

        })
        .catch(error => console.error("Error loading page:", error));
}

function loadPage(page) {
    fetch(page)
    .then(response => response.text())
    .then(html => {
        let contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = html; // Replace content properly
            executeScripts(contentDiv); // Ensure scripts run after loading
        } else {
            console.error("Error: #content div not found!");
        }
    })
    .catch(error => console.error('Error loading page:', error));
}

function executeScripts(element) {
    const scripts = element.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
        const newScript = document.createElement("script");
        if (scripts[i].src) {
            newScript.src = scripts[i].src;
            newScript.async = false; // Ensure order is preserved
        } else {
            newScript.text = scripts[i].text;
        }
        document.body.appendChild(newScript);
    }
}

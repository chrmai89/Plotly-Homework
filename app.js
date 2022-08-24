

// Build function for metadata in Dropdown box and Demographic info panel
function infoChart(patientID){

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((data) => {
    var samples = data.samples
    var metadata = data.metadata
    var filteredData = samples.filter(bacteria => bacteria.id === patientID)
    var filteredMeta = metadata.filter(bacteria => bacteria.id == patientID)
    var result= filteredMeta[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

    // Output metadata and filtered data, on id, in console
    console.log(metadata)
    console.log(filteredData)
    console.log(filteredMeta)
});
}
  
infoChart()

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    infoChart(firstSample);
    buildCharts(firstSample);
  });
  }
  
  function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  infoChart(newSample);
  buildCharts(newSample);
  }
  
  
  // Initialize the dashboard
  init();


// Build function for bubble chart and bar chart
function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]
  
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

    // Output OTU ID's, OTu lables and sample values in console
    console.log(ids)
    console.log(labels)
    console.log(values)
  

 //  Build a BAR Chart
  // Obtaining the top 10 bacteria found in each candidate
 var bar_data =[
  {
    y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
    x:values.slice(0,10).reverse(),
    text:labels.slice(0,10).reverse(),
    type:"bar",
    orientation:"h"

  }
];

var barLayout = {
  title: "Top 10 Bacteria Found",
  margin: { t: 30, l: 150 }
};

Plotly.newPlot("bar", bar_data, barLayout);


  // Build a BUBBLE Chart
  // Marker size based on y values
    var LayoutBubble = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };
  
      var DataBubble = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];
  
    Plotly.newPlot("bubble", DataBubble, LayoutBubble);
  
});
  }
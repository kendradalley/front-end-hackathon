    // height and width of the svg
    var height = 800,
         width = 500;

    var padding = 50;

    var viz = d3.select("#viz-wrapper")
                    .append('svg')
                    .attr('id', 'viz')
                    .attr('height', height)
                    .attr('width', width);

    var yScale = d3.scale.linear()
                          .range([height, 0]);

    //.time.scale: map
    var xScale = d3.time.scale()
                          .range([0, width]);
                          
    //convert JSON into date objects
    // "19730801" => %Y%m%d
    var parseTime = d3.time.format("%Y%m%d");

    d3.csv('climate_data.csv', function(data) {

       yDomain = d3.extent(data, function(element){
         return parseInt(element.TMAX)
       });

      //set the x axis 
      xDomain = d3.extent(data, function(element) {
        return parseTime.parse(element.DATE)
      });
    //data domain that will map to visual range
      yScale.domain(yDomain);
      xScale.domain(xDomain);


      dots = viz.selectAll('circle')
                   .data(data)
                   .enter()
                  .append('circle');

      dots.attr('r', 5)
          .attr('cx', function(d) {
            return Math.max(0 + padding, Math.random() * width - padding) })
          .attr('cy', function(d) {
            return yScale(d.TMAX) })
          .style('stroke', '#00ffd2')
          .style('fill', '#006bff');

    });
      // height and width of the svg
    var height = 700,
         width = 900;

    var padding = 50;

//create the visualization space
    var viz = d3.select("#viz-wrapper")
                    .append('svg')
                    .attr('height', height + padding * 2 )
                    .attr('width', width + padding * 2)
                    .append('g')
                    .attr('id', 'viz')
                    .attr('transform', 
                      'translate(' + padding + ',' + padding + ')');
  //set the linear y scale
    var yScale = d3.scale.linear()
                          .range([height, 0]);
  // set the time x scale 
    var xScale = d3.time.scale()
                          .range([0, width]);

    // Set up the x axis
    var xAxis = d3.svg.axis().scale(xScale)
                              .orient("bottom") //orient to bottom
                              .ticks(20); // limit to 30 ticks
    // Set up the y axis 
    var yAxis = d3.svg.axis().scale(yScale)
                              .orient("left") 
                              .ticks(20);
    //convert JSON into date objects
    // "19730801" => %Y%m%d
    var parseTime = d3.time.format("%Y%m%d");

    d3.csv('climate_data.csv', function(data) {
      yDomain = d3.extent(data, function(element){
        return parseInt(element.TMAX) * 1.1
      });

      xMin = d3.min(data, function(element) {
        time = parseTime.parse(element.DATE);
        time.setMonth(time.getMonth() - 1);
        return time
      });

      xMax = d3.max(data, function(element) {
        time = parseTime.parse(element.DATE);
        time.setMonth(time.getMonth() + 1);
        return time
      });
      
      yScale.domain(yDomain);
      xScale.domain([xMin, xMax]);

      // Add the X Axis
      viz.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('text')
        .attr("transform", function() {
                return "rotate(-65)"
                })
        .style("text-anchor", "end")
        .style('font-size', '10px')
        .attr("dx", "-10px")
        .attr("dy", "10px");

      viz.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      dots = viz.selectAll('g.dots')
                   .data(data)
                   .enter()
                  .append('g')
                  .attr('class', 'dots');

      dots.attr('transform', function(d) {
            // get the x position
            date = parseTime.parse(d.DATE);
            x = xScale(date)
            // get the y position
            y = yScale(d.TMAX)
            return 'translate(' + x + ',' + y + ')'
          })
          .style('stroke', '#00ffd2')
          .style('fill', '#006bff');

      dots.append('circle')
          .attr('r', 5);
      //set up text labels and set to start display:none
      dots.append('text')
          .text(function(d) {
            return d.TMAX
            })
          .style('display', 'none');
      // on(mouseenter , event listener) turn on text display
      dots.on("mouseenter", function(d, i) {
        dot = d3.select(this);
        dot.select('text')
           .style('display', 'block');
      });
      //when mouse away, change the display of text to none
      dots.on("mouseleave", function(d, i) {
        d3.select(this)
          .select('text')
          .style('display', 'none');
      })
    });
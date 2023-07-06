document.addEventListener('DOMContentLoaded', () => {

let m = 30,
    w = 860,
    h = 540,
    barWidth = (w-(m*2)) / 275;


d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then((data)=>{
        console.log(data.data)
        
        const svg = d3.select('.chart')
                      .append('svg')
                      .attr('height',h)
                      .attr('width',w)
                      
        const minDate = new Date(data.data[0][0]+' 00:00');
       
        const maxDate = new Date(data.data[274][0]+' 00:00');
       
        const xScale = d3.scaleTime()
                         .domain([minDate,maxDate])
                         .range([m,w-m])

        const yScale = d3.scaleLinear()
                         .domain([0, d3.max(data.data,(d) => d[1])])   
                         .range([h-m,0])         
         
        const GDPScale = d3.scaleLinear()
                           .domain([0, d3.max(data.data,(d) => d[1])])   
                           .range([0,h-m]) 
                                         
        let tooltip = d3.select('.chartHolder')
                        .append('div')
                        .attr('id','tooltip')
                        .style('visibility','hidden')
                        .style('width','180px')
                        .style('height','32px')
                        .style('margin-left','10px')
        
        const mouseOver = (e,d) => {
            const marginLeft = e.pageX-200 > 60 ? (e.pageX-180 < 710? e.pageX-180 : 710) : 10

            tooltip.transition()
                   .style('visibility','visible')
                   .style("margin-top", 0+"px")
                   .style("margin-left",`${marginLeft}px`)
            tooltip.text(`${d[0]}, $${d[1]} Billion`)
                   .attr('data-date',d[0])
        }

        const mouseOut = (e,d) => {
            tooltip.transition()
                   .style('visibility','hidden');   
        }


        svg.selectAll('rect')
           .data(data.data)
           .enter() 
           .append('rect')
           .attr('x',(d,i) => 45+(i*barWidth))
           .attr('y',(d) => (h-20) - GDPScale(d[1]))
           .attr('height',(d) => GDPScale(d[1]))      
           .attr('width', barWidth)
           .attr('class','bar')
           .attr('data-date',(d) => d[0])
           .attr('data-gdp',(d) => d[1])
           .on('mouseover',mouseOver)
           .on('mouseout',mouseOut)  

        const xAxis = d3.axisBottom(xScale)

        const yAxis = d3.axisLeft(yScale)
      
        svg.append('g')
           .call(xAxis)
           .attr('id','x-axis')
           .attr('transform',`translate(15 ,${h-20})`)

        svg.append('g')
           .call(yAxis)
           .attr('id','y-axis')
           .attr('transform',`translate(45,10)`)

    })
    .catch((e) => console.log(e));
})
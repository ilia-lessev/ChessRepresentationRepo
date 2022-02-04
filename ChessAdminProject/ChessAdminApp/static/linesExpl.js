import define1 from "./scrubber.js";




export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["rankingHistory.csv",new URL("/getRankingHistory",import.meta.url)]]);              //   /getRankingHistory       //     /static/PaxHeader.csv
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));



 
main.variable(observer()).define(["md"], function(md){return(
md`Get the data from the Web Service.`
)});

main.variable(observer()).define(["md"], function(md){return(
md`Put the data in structures and transform it to correct format fot the chart.`
)});




main.variable(observer()).define("dataImported", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("rankingHistory.csv").csv({typed: true})
)});

main.variable(observer()).define("allKeys", ["dataImported"], function(dataImported){return(
    new Set(dataImported.map(d => d.name))
)});

main.variable(observer()).define("allDates", ["dataframesByPoints","formatDate"], function(dataframesByPoints,formatDate){return(
    new Set(dataframesByPoints.map(d => formatDate(d.date)))
    


    
)});



/*
main.variable(observer("sortedData")).define("sortedData", ["d3","dataImported"], function(d3,dataImported){
    //var mapDateGroups = d3.group(dataImported, d => d.date); 

    const sortedArray = dataImported.slice().sort((a, b) => d3.ascending(+a.date, +b.date))
    return sortedArray;
    
    //return arrayDateGroups
 });                                                                                                                                x
 */
 
 
 
 
 
 main.variable(observer("datepoints")).define("datepoints", ["d3","dataImported"], function(d3,dataImported){
    var mapDateGroups = d3.group(dataImported, d => d.date); 

    var arrayDateGroups = Array.from(mapDateGroups).sort(([a], [b]) => d3.ascending(a, b));
    arrayDateGroups.forEach(function(oa){
        oa[1].sort(function(a,b){
            return d3.descending(a.points, b.points)
        });
    });
    arrayDateGroups.forEach(function(oa){
        let map = new Map();
        oa[1].forEach(function(ea) {
            map.set(ea.name, ea);
        });
    oa[1] = map;
    });
    return arrayDateGroups
 });
 
 
 
  
main.variable(observer("dataframesByPoints")).define("dataframesByPoints", ["d3","datepoints","n"], function(d3,datepoints,n)
{
    const data_frames = [];
    var i = 0
    datepoints.forEach((d_el) => {
    
        var ar = Array.from(d_el[1].values()).slice(0, n);
        ar.forEach((o_el) => {
            data_frames.push(o_el);
        
        })
        
        
        
        i++;    
    });
    
    return data_frames;
}
);

main.variable(observer("dataframesByPointsSingle")).define("dataframesByPointsSingle", ["d3","datepoints","n"], function(d3,datepoints,n)
{
    const data_frames = [];
    var i = 0
    datepoints.forEach((d_el) => {
    
        var ar = Array.from(d_el[1].values()).slice(0, n);
        ar.forEach((o_el) => {
            if(o_el.name=='Ilia Lessev')
            {
                 data_frames.push(o_el);
            }
           
        
        })
        
        
        
        i++;    
    });
    
    return data_frames;
}
);

main.variable(observer("dfByPointsFiltered")).define("dfByPointsFiltered", ["d3","dataframesByPoints","n","t3","formatDate"], function(d3,dataframesByPoints,n,t3,formatDate)
{
    const data_frames = [];
    //var i = 0
    dataframesByPoints.forEach((d_el) => {
    
       // var ar = Array.from(d_el[1].values()).slice(0, n);
        //ar.forEach((o_el) => {
            if(formatDate(d_el.date)<=t3)
            {
                data_frames.push(d_el);
            }
        
        });
        
        
        
        //i++;    
    //});
    
    return data_frames;
}
);



/*
main.variable(observer("dataframesByPointsInter")).define("dataframesByPointsInter", ["d3","k","datepoints","n"], function(d3,k,datepoints,n)
{

  const data_frames = [];
  let ka, a, kb, b;
  
  for ([[ka, a], [kb, b]] of d3.pairs(datepoints)) {
    for (let i = 0; i < k; ++i) {
      const t = i / k;
      
      data_frames.push([
        new Date(ka * (1 - t) + kb * t),
        //rankWithPoints(name => (a.get(name) ? a.get(name).value : 0) * (1 - t) + (b.get(name) ? b.get(name).value : 0) * t, name2 => (a.get(name2) ? a.get(name2).rank : 999))      //            //(a.get(name) ? a.get(name).value : 0) * (1 - t) + (b.get(name) ? b.get(name).value : 0) * t, name2 => (a.get(name2) ? a.get(name2).rank : 999))
        //rankWithPoints(name => (a.get(name))) 
        rankByPoints(name => (a.get(name) ? a.get(name).points : 0) * (1 - t) + (b.get(name) ? b.get(name).points : 0) * t, a)        
        //            
        //(a.get(name) ? a.get(name).value : 0) * (1 - t) + (b.get(name) ? b.get(name).value : 0) * t, name2 => (a.get(name2) ? a.get(name2).rank : 999))
      ]);
    }
  }                                                                                         
  data_frames.push([new Date(kb), rankByPoints(name => b.get(name) ? b.get(name).points : 0,  b)]);

  
  return data_frames;
}
*/






main.variable(observer("viewof n")).define("viewof n", ["Inputs"], function(Inputs){return(
Inputs.number({label: "n:"})
)});
main.variable(observer("n")).define("n", ["Generators", "viewof n"], (G, _) => G.input(_));

main.variable(observer()).define(["md"], function(md){return(
md`# Simple Chart with no data interpolation.`
)});



main.variable(observer("chart")).define("chart", ["LineChart","width","allKeys","dataframesByPoints"], function(LineChart,width,allKeys,dataframesByPoints){return(

LineChart(dataframesByPoints , {
  x: d => d.date,
  y: d => d.points,
  z: d => d.name,
  yLabel: "Points",
  width,
  height: 500,
  color: "steelblue"
})
)});



main.variable(observer()).define(["md"], function(md){return(
md`# Chart single player tracking.`
)});

  


main.variable(observer("chartSingle")).define("chartSingle", ["LineChart","width","allKeys","dataframesByPointsSingle"], function(LineChart,width,allKeys,dataframesByPointsSingle){return(

LineChart(dataframesByPointsSingle , {
  x: d => d.date,
  y: d => d.points,
  z: d => d.name,
  yLabel: "Points",
  width,
  height: 500,
  color: "steelblue"
})
)});
  



main.variable(observer()).define(["md"], function(md){return(
md`# Chart single player tracking with animation.`
)});

  


main.variable(observer("chartSingleAnimated")).define("chartSingleAnimated", ["LineChartAnimated","width","allKeys","dataframesByPointsSingle"], function(LineChartAnimated,width,allKeys,dataframesByPointsSingle){return(

LineChartAnimated(dataframesByPointsSingle , {
  x: d => d.date,
  y: d => d.points,
  z: d => d.name,
  yLabel: "Points",
  width,
  height: 500,
  color: "steelblue"
})
)});
  



main.variable(observer("viewof t")).define("viewof t", ["Scrubber","d3"], function(Scrubber,d3){return(
Scrubber(d3.ticks(0, 1, 8000), {
  autoplay: false,
  loop: false,
  initial: 1,
  format: x => `t = ${x.toFixed(6)}`
})
)});
  main.variable(observer("t")).define("t", ["Generators", "viewof t"], (G, _) => G.input(_));
  
 
 
   



main.variable(observer()).define(["md"], function(md){return(
md`# Chart multiple players tracking with animation.`
)});

  


main.variable(observer("chartMultiAnimated")).define("chartMultiAnimated", ["LineChartAnimatedMulti","width","allKeys","dataframesByPoints"], function(LineChartAnimatedMulti,width,allKeys,dataframesByPoints){return(

LineChartAnimatedMulti(dataframesByPoints , {
  x: d => d.date,
  y: d => d.points,
  z: d => d.name,
  yLabel: "Points",
  width,
  height: 500,
  color: "steelblue"
})
)});
  
main.variable(observer("viewof t2")).define("viewof t2", ["Scrubber","d3"], function(Scrubber,d3){return(
Scrubber(d3.ticks(0, 1, 8000), {
  autoplay: false,
  loop: false,
  initial: 1,
  format: x => `t2 = ${x.toFixed(6)}`
})
)});
main.variable(observer("t2")).define("t2", ["Generators", "viewof t2"], (G, _) => G.input(_));

     
main.variable(observer()).define(["md"], function(md){return(
md`# Debugging through Z dimention.`
)});

main.variable(observer("chartDebugZ")).define("chartDebugZ", ["LineChart","width","allKeys","dataframesByPoints"], function(LineChart,width,allKeys,dataframesByPoints){return(

LineChart(dataframesByPoints , {
  x: d => d.date,
  y: d => d.points,
  z: d => d.date,
  yLabel: "Points",
  width,
  height: 500,
  color: "steelblue"
})
)});
  








main.variable(observer()).define(["md"], function(md){return(
md`# Chart multiple players tracking with better animation.`
)});
                                             
  


main.variable(observer("chartMultiAnimatedBetter")).define("chartMultiAnimatedBetter", ["LineChart","width","allKeys","dfByPointsFiltered"], function(LineChart,width,allKeys,dfByPointsFiltered){return(

LineChart(dfByPointsFiltered, {
  x: d => d.date,
  y: d => d.points,
  z: d => d.name,
  yLabel: "Points",
  width,
  height: 500,
  color: "steelblue"
})
)});


main.variable(observer("viewof t3")).define("viewof t3", ["Scrubber","allDates","formatDate"], function(Scrubber,allDates,formatDate){return(
Scrubber(allDates, {
  format: (x) => x,
  delay: 900,
  loop: false,
  autoplay: false,
})
)});

main.variable(observer("t3")).define("t3", ["Generators", "viewof t3"], (G, _) => G.input(_));


main.variable(observer("LineChart")).define("LineChart", ["d3","allKeys",], function(d3,allKeys){
  
  
  return(
 
  function LineChart(data, {

  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 800, // outer height, in pixels
  xType = d3.scaleTime, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  xFormat =  d3.timeFormat("%Y %B"),
  //color = function(selector) { 
  //                              
  //                              return "#f0f"
  //                            }, //"currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity, // stroke opacity of line
  mixBlendMode = "multiply" // blend mode of lines
  } = {}) 
  
{
  // Compute values.
  const colorScheme = d3.scaleOrdinal().domain(allKeys).range(d3.schemePaired);  //(d3.schemePaired);   //d3.scaleOrdinal().domain(name).range(colorbrewer.Set2[6]);         (d3.schemePaired)

  const X = d3.map(data, x);
  //alert (X);
  const Y = d3.map(data, y);
  //alert (Y);
  const Z = d3.map(data, z);
  //alert (Z);
  const O = d3.map(data, d => d);
  //alert(O);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat);       //.tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  
  function yAxisGrid() {
     return d3.axisLeft(yScale)
        .ticks(height / 80, )
  } 
  

  // Compute titles.
  const T = title === undefined ? Z : title === null ? null : d3.map(data, winratio);          //title

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .style("-webkit-tap-highlight-color", "transparent")
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());


  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom + 1})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

//Y Axis Grid          
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr("class", `yGrid`)
      
      .call(g => g.select(".domain").remove())   
      .call(yAxisGrid()
        .tickSize(-width)
        .tickFormat("")
      
      );
    
      
      
     
        //-width
       // .tickFormat() ;
       //.attr("style", "stroke: red !important; stroke-opacity: 0.7;  shape-rendering: crispEdges;")
    
    
    
    //.style("stroke","red");
      
  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", typeof color === "string" ? color : "#ff0")
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
      .style("mix-blend-mode", mixBlendMode)
      .attr("stroke", (d,i)=>colorScheme(i))     //d => color(d.key)    //.attr("stroke", (d,i) =>   )                                            //typeof color === "function" ? () => color(I) : color)
      .attr("d", ([, I]) => line(I))
      //.attr("stroke-dasharray", [lineLength*t,lineLength])
      
      ;

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);
    const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
    path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
    dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
    if (T) dot.select("text").text(T[i]);
    //if (T) dot.select("text").text("Testttt");
     
    svg.property("value", O[i]).dispatch("input", {bubbles: true});
  }

  function pointerentered() {
    path.style("mix-blend-mode", null).style("stroke", "#fff");
    dot.attr("display", null);
  }

  function pointerleft() {
    path.style("mix-blend-mode", "multiply").style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
  }

  return Object.assign(svg.node(), {value: null});
}
)});




main.variable(observer("LineChartAnimated")).define("LineChartAnimated", ["d3","allKeys","lineLength","t"], function(d3,allKeys,lineLength,t){
  
  
  return(
 
  function LineChartAnimated(data, {

  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 800, // outer height, in pixels
  xType = d3.scaleTime, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  xFormat =  d3.timeFormat("%Y %B"),
  //color = function(selector) { 
  //                              
  //                              return "#f0f"
  //                            }, //"currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity, // stroke opacity of line
  mixBlendMode = "multiply" // blend mode of lines
  } = {}) 
  
{
  // Compute values.
  const colorScheme = d3.scaleOrdinal().domain(allKeys).range(d3.schemePaired);  //(d3.schemePaired);   //d3.scaleOrdinal().domain(name).range(colorbrewer.Set2[6]);         (d3.schemePaired)

  const X = d3.map(data, x);
  //alert (X);
  const Y = d3.map(data, y);
  //alert (Y);
  const Z = d3.map(data, z);
  //alert (Z);
  const O = d3.map(data, d => d);
  //alert(O);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat);       //.tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  
  function yAxisGrid() {
     return d3.axisLeft(yScale)
        .ticks(height / 80, )
  } 
  

  // Compute titles.
  const T = title === undefined ? Z : title === null ? null : d3.map(data, winratio);          //title

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .style("-webkit-tap-highlight-color", "transparent")
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());


  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom + 1})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

//Y Axis Grid          
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr("class", `yGrid`)
      
      .call(g => g.select(".domain").remove())   
      .call(yAxisGrid()
        .tickSize(-width)
        .tickFormat("")
      
      );
    
      
      
     
        //-width
       // .tickFormat() ;
       //.attr("style", "stroke: red !important; stroke-opacity: 0.7;  shape-rendering: crispEdges;")
    
    
    
    //.style("stroke","red");
      
  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", typeof color === "string" ? color : "#ff0")
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
      .style("mix-blend-mode", mixBlendMode)
      .attr("stroke", (d,i)=>colorScheme(i))     //d => color(d.key)    //.attr("stroke", (d,i) =>   )                                            //typeof color === "function" ? () => color(I) : color)
      .attr("d", ([, I]) => line(I))
      .attr("stroke-dasharray", [lineLength*t,lineLength])
      
      ;

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);
    const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
    path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
    dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
    if (T) dot.select("text").text(T[i]);
    //if (T) dot.select("text").text("Testttt");
     
    svg.property("value", O[i]).dispatch("input", {bubbles: true});
  }

  function pointerentered() {
    path.style("mix-blend-mode", null).style("stroke", "#fff");
    dot.attr("display", null);
  }

  function pointerleft() {
    path.style("mix-blend-mode", "multiply").style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
  }

  return Object.assign(svg.node(), {value: null});
}
)});

  



main.variable(observer("LineChartAnimatedMulti")).define("LineChartAnimatedMulti", ["d3","allKeys","lineLength","t2"], function(d3,allKeys,lineLength,t2){
  
  
  return(
  
  function LineChartAnimatedMulti(data, {

  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 800, // outer height, in pixels
  xType = d3.scaleTime, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  xFormat =  d3.timeFormat("%Y %B"),
  //color = function(selector) { 
  //                              
  //                              return "#f0f"
  //                            }, //"currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity, // stroke opacity of line
  mixBlendMode = "multiply" // blend mode of lines
  } = {}) 
  
{
  // Compute values.
  const colorScheme = d3.scaleOrdinal().domain(allKeys).range(d3.schemePaired);  //(d3.schemePaired);   //d3.scaleOrdinal().domain(name).range(colorbrewer.Set2[6]);         (d3.schemePaired)

  const X = d3.map(data, x);
  //alert (X);
  const Y = d3.map(data, y);
  //alert (Y);
  const Z = d3.map(data, z);
  //alert (Z);
  const O = d3.map(data, d => d);
  //alert(O);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat);       //.tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  
  function yAxisGrid() {
     return d3.axisLeft(yScale)
        .ticks(height / 80, )
  } 
  
  // Compute titles.
  const T = title === undefined ? Z : title === null ? null : d3.map(data, winratio);          //title

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .style("-webkit-tap-highlight-color", "transparent")
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());


  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom + 1})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

//Y Axis Grid          
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr("class", `yGrid`)
      
      .call(g => g.select(".domain").remove())   
      .call(yAxisGrid()
        .tickSize(-width)
        .tickFormat("")
      
      );
    
      
      
     
        //-width
       // .tickFormat() ;
       //.attr("style", "stroke: red !important; stroke-opacity: 0.7;  shape-rendering: crispEdges;")
    
    
    
    //.style("stroke","red");
      
  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", typeof color === "string" ? color : "#ff0")
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
      .style("mix-blend-mode", mixBlendMode)
      .attr("stroke", (d,i)=>colorScheme(i))     //d => color(d.key)    //.attr("stroke", (d,i) =>   )                                            //typeof color === "function" ? () => color(I) : color)
      .attr("d", ([, I]) => line(I))
      .attr("stroke-dasharray", [lineLength*t2,lineLength])
      
      ;

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);
    const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
    path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
    dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
    if (T) dot.select("text").text(T[i]);
    //if (T) dot.select("text").text("Testttt");
     
    svg.property("value", O[i]).dispatch("input", {bubbles: true});
  }

  function pointerentered() {
    path.style("mix-blend-mode", null).style("stroke", "#fff");
    dot.attr("display", null);
  }

  function pointerleft() {
    path.style("mix-blend-mode", "multiply").style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
  }

  return Object.assign(svg.node(), {value: null});
}
)});

  
 

main.variable(observer("lineLength")).define("lineLength", ["htl","dataframesByPoints"], function(htl,dataframesByPoints){return(
   3000
   //htl.svg`<path d="${line(dataframesByPoints)}">`.getTotalLength()
)});



main.variable(observer("formatDate")).define("formatDate", ["d3"], function(d3){return(
    d3.utcFormat("%Y-%m-%d %H:%M:%S")
    //d3.utcFormat("%Y")
)});
main.variable(observer("html")).define("html", ["htl"], function(htl){return(
htl.html
)});

main.variable(observer()).define(["html"], function(html){return(
html`


<style type="text/css">
      line {

        stroke: gray;
        stroke-opacity: 0.7;
        stroke-width: 0.4;
        shape-rendering: crispEdges;
     
      }
      .axis text {
        font-family: sans-serif;
        font-size: 18px;
      }
      
      .domain {

        stroke: gray;
        stroke-opacity: 0.7;
        stroke-width: 0.2;
        shape-rendering: crispEdges;
     
      }
      
    </style>



`
)}); 


 const child1 = runtime.module(define1);
  
  main.import("Scrubber", child1);
  
  return main;

}
     
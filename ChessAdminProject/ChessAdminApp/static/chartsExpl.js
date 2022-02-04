import define1 from "./scrubber.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["rankingHistory.csv",new URL("/getRankingHistory",import.meta.url)]]);              //   /getRankingHistory       //     /static/PaxHeader.csv
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
 
main.variable(observer()).define(["md"], function(md){return(
md`# Data`
)});
main.variable(observer()).define(["md"], function(md){return(
md`Download the Ranking data from /getRankingHistory Web Service. It is a GET request and can be invoked directly from the browser. A CSV file should be downloaded.`
)});
main.variable(observer("tryDownload")).define("tryDownload", ["htl"], function(htl){return(
   htl.html`<a href="/getRankingHistory">=> Try to download from the Web Service</a><br/><br/>`
)});
main.variable(observer()).define(["md"], function(md){return(
md`Store the downloaded data in an Array.`
)});
main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("rankingHistory.csv").csv({typed: true})
)});
main.variable(observer()).define(["md"], function(md){return(
md`The data will go through various transformations. The most important ones are described below`
)});
main.variable(observer()).define(["md"], function(md){return(
md`Extract unique names in a Set.`
)});
main.variable(observer("names")).define("names", ["data"], function(data){return(
new Set(data.map(d => d.name))
)});
main.variable(observer()).define(["md"], function(md){return(
md`Extract unique dates in an Array of Array elements. This array is called datepoints (from date and points of a Player, it could be rank values or win rations etc).`
)}); 
main.variable(observer()).define(["md"], function(md){return(
md`The Array elements of the datepoints array have 2 elements. Element one is the unique date and element two is a map with all data for this date. It is a Map so it can be indexed on the unique name.`
)}); 
main.variable(observer()).define(["md"], function(md){return(
md`The Key on the Map is the unique Name of the Player and the Value is the actual exported Ranking record (for this Date and this Player).`
)}); 
main.variable(observer("datepoints")).define("datepoints", ["d3","data"], function(d3,data){
    var mapDateGroups = d3.group(data, d => d.date); 

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
 


main.variable(observer()).define(["md"], function(md){return(
md`There are a few other transformations used before the actula plotting happens like paring for the purpose of comparison, internal ranking for the purpose of positioning on the chart etc. Those internal transformations will be ommited from the detailed description, but can be discussed if they present a point of interest.`
)});
main.variable(observer()).define(["md"], function(md){return(
md`The functions for those transformations as well as the functions feeding the chart drawings are listed at the bottom of the page.`
)});

main.variable(observer()).define(["md"], function(md){return(
md`Charts are fed with data from an Array of Arrays. This array is similar to the datepoints Array, there is a difference however in the 2nd element of the Array element. It is not a Map, it is an Array.
The size of Array in the second element can also differ from the size of the Map. It is like that because we use interpolation and the higher the interpolation factor, the more records we are going to have in this Array.  
`
)});
main.variable(observer()).define(["md"], function(md){return(
md`Examine the array. Look at the "rank" filed and how the values change. It is an essential part of the data input for the chart and it also interacts with the selected number of Top 'n' Players being tracked.
`
)});

main.variable(observer()).define(["md"], function(md){return(
md`Since we have on the page two different chart types (two of them plotting on the Rank value and the third one on Points value) - we have two of the Arrays described above. Examine bothe arrays below.
`
)});


main.variable(observer("dataframes")).define("dataframes", ["d3","k","datepoints","rankByRank","n"], function(d3,k,datepoints,rankByRank,n)
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
        rankByRank(name => (a.get(name) ? a.get(name).points : 0) * (1 - t) + (b.get(name) ? b.get(name).points : 0) * t, a)        
        //            
        //(a.get(name) ? a.get(name).value : 0) * (1 - t) + (b.get(name) ? b.get(name).value : 0) * t, name2 => (a.get(name2) ? a.get(name2).rank : 999))
      ]);
    }
  }                                                                                         
  data_frames.push([new Date(kb), rankByRank(name => b.get(name) ? b.get(name).points : 0,  b)]);

  
  return data_frames;
}
);

main.variable(observer("dataframesByPoints")).define("dataframesByPoints", ["d3","k","datepoints","rankByPoints","n"], function(d3,k,datepoints,rankByPoints,n)
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
);
main.variable(observer()).define(["md"], function(md){return(
md`The charts are drawing based on one dataframe at a time. As we traverse throug the dataframes described above, the current dataframe is used as a datasource for teh chart.`
)});

main.variable(observer()).define(["md"], function(md){return(
md`The relevant current dataframes are positions right below the charts so that we can observe how the dataframe change is ploted on the chart. Examin this dataframe while chart is animating.`
)});

main.variable(observer()).define(["md"], function(md){return(
md`# Drawing`
)});

main.variable(observer()).define(["md"], function(md){return(
md`The actual drawing and rendering of the charts is done with SVG.`
)});

main.variable(observer()).define(["md"], function(md){return(
md`The following set of functions manipulate the data and the actual drawing:`
)});

main.variable(observer("rankByRank")).define("rankByRank", ["names","d3","n"], function(names,d3,n){return(
function rank(valueF, a) {
  const data = Array.from(names, name => ({name, points: valueF(name), rankValue: a && a.get(name) ? a.get(name).rank : 999,  winratio: a && a.get(name) ? a.get(name).winratio :  999}));
  
  
  for (let i = 0; i < data.length; ++i)
  {
      data[i].rank = Math.min(n, data[i].rank);

  } 
      
  //data.sort((a, b) => d3.descending(a.points, b.points));
  data.sort((a, b) => d3.ascending(a.rankValue, b.rankValue));
  for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
  
  return data;
}
)});

main.variable(observer("rankByPoints")).define("rankByPoints", ["names","d3","n"], function(names,d3,n){return(
function rank(valueF, a) {
  const data = Array.from(names, name => ({name, points: valueF(name), rankValue: a && a.get(name) ? a.get(name).rank : 999,  winratio: a && a.get(name) ? a.get(name).winratio :  999}));
  
  for (let i = 0; i < data.length; ++i)
  {
      data[i].rank = Math.min(n, data[i].rank);

  } 
      
  data.sort((a, b) => d3.descending(a.points, b.points));
  //data.sort((a, b) => d3.ascending(a.rankValue, b.rankValue));
  for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
  
  return data;
}
)});

main.variable(observer("bars")).define("bars", ["n","color","y","x"], function(n,color,y,x){return(
function bars(svg) {
  let bar = svg.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("rect");

  return ([date, data], transition) => bar = bar
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("rect")
        .attr("fill", color)
        .attr("height", y.bandwidth())
        .attr("x", x(0))
        .attr("y", y(n))
        .attr("width", d => x(d.points) - x(0)),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("y", y(n))
        .attr("width", d => x(d.points) - x(0))
    )
    .call(bar => bar.transition(transition)
      .attr("y", d => y(d.rank))
      .attr("width", d => x(d.points) - x(0)));
}
)});

main.variable(observer("barsSimple")).define("barsSimple", ["n","color","y","x"], function(n,color,y,x){return(
function bars(svg) {
  let bar = svg.append("g")
        .attr("fill-opacity", 0.6)
        .selectAll("rect");
  const barWidth = 1200
  return ([date, data], transition) => bar = bar
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("rect")
        .attr("fill", color)
        .attr("height", y.bandwidth())
        .attr("x", x(0))
        .attr("y", y(n))
        .attr("width", d => barWidth),             //.attr("width", d => x(d.points) - x(0)),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("y", y(n))
        .attr("width", d => barWidth)     //.attr("width", d => x(d.points) - x(0))
    )
    .call(bar => bar.transition(transition)
      .attr("y", d => y(d.rank))
      .attr("width", d => barWidth));     //.attr("width", d => x(d.points) - x(0)));
}
)});

main.variable(observer("labelsPoints")).define("labelsPoints", ["n","x","y","textTween","parseNumber"], function(n,x,y,textTween,parseNumber){return(
function labelsPoints(svg) {
  let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
    .selectAll("text");

  return ([date, data], transition) => label = label
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("text")
        .attr("fill-opacity", 0.7)
        .attr("transform", d => `translate(${x(d.points)},${y(n)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", -6)
        .attr("dx", "-3.25em")
        .attr("dy", "-0.30em")
        .text("points:")
        .call(text => text.append("tspan")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", -6)
          .attr("dx", "+0.20em")
          .attr("dy", "-0em")),
      update => update,                                                                                  
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x(d.points)},${y(n)})`)
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.points)},${y(d.rank)})`)
      .call(g => g.select("tspan").tween("text", function(d) {
          return textTween(parseNumber(this.textContent), d.points);
        })));
}
)});

main.variable(observer("labelsWinratio")).define("labelsWinratio", ["n","x","y","textTween","parseNumber"], function(n,x,y,textTween,parseNumber){return(
function labelsWinratio(svg) {
  let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      //.attr("text-anchor", "start")
    .selectAll("text");

  return ([date, data], transition) => label = label
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("text")
        .attr("fill-opacity", 0.7)
        .attr("transform", d => `translate(${x(d.points)},${y(n)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", -6)
        .attr("dx", "-3.25em")          //-3.25em
        .attr("dy", "0.95em")
        .text("win ratio:")
        .attr("text-anchor", "end")
        .call(text => text.append("tspan")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", -6)
          .attr("dx", "-1.25em")      //-0.25em
          .attr("dy", "-0em")
          //.attr("text-anchor", "middle")
          
          )
          //.textContent("TestText")
          ,
      update => update,                                                                                  
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x(d.points)},${y(n)})`)
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.points)},${y(d.rank)})`)
      //.call(g => g.select("tspan").tween(text, "123")) 
     //.call(g => g.select("tspan").textContent = "TestText")
     .call(g => g.select("tspan").text(d => d.winratio))
     );
}
)});

main.variable(observer("labelsRank")).define("labelsRank", ["n","x","y","textTween","parseNumber"], function(n,x,y,textTween,parseNumber){return(
function labelsRank(svg) {
   let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "start")
    .selectAll("text");

  return ([date, data], transition) => label = label
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("text")
        .attr("transform", d => `translate(${x(0)},${y(n)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", +3)
        .attr("dx", "+2.90em")
        .attr("dy", "+0.30em")
        .text(d => d.name)
        .call(text => text.append("tspan")
          .attr("text-anchor", "end")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", 0)
          .attr("dx", "+1.90em")
          .attr("dy", "+0.0em")),
      update => update,                                                                                  
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x(0)},${y(n)})`)
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(0)},${y(d.rank)})`)
     .call(g => g.select("tspan").tween("text", function(d) {
          return textTween(parseNumber(this.textContent), d.rankValue);
        })));
}
)});

main.variable(observer("textTween")).define("textTween", ["d3","formatNumber"], function(d3,formatNumber){return(
function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function(t) {
    this.textContent = formatNumber(i(t));
  };
}
)});

main.variable(observer("parseNumber")).define("parseNumber", function(){return(
string => +string.replace(/,/g, "")
)});

main.variable(observer("formatNumber")).define("formatNumber", ["d3"], function(d3){
 
  return d3.format(",d")  //locale.format(",d") 

});

main.variable(observer("axis")).define("axis", ["margin","d3","x","width","barSize","n","y"], function(margin,d3,x,width,barSize,n,y){return(
function axis(svg) {
  const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top})`);

  const axis = d3.axisTop(x)
      .ticks(width / 300)                     //400
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

  return (_, transition) => {
    g.transition(transition).call(axis);
    g.select(".tick:first-of-type text").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
    g.select(".domain").remove();
  };
}
)});

main.variable(observer("ticker")).define("ticker", ["barSize","width","margin","n","formatDate","dataframes"], function(barSize,width,margin,n,formatDate,dataframes){return(
function ticker(svg) {
  const now = svg.append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", margin.top + barSize * (n - 0.45))
      .attr("dy", "0.32em")
      .text(formatDate(dataframes[0][0]));

  return ([date], transition) => {
  
    transition.end().then(() => now.text(formatDate(date)));
  };
}
)});

main.variable(observer("formatDate")).define("formatDate", ["d3"], function(d3){return(
    d3.utcFormat("%Y-%m-%d %H:%M:%S")
    //d3.utcFormat("%Y")
)});

main.variable(observer("color")).define("color", ["d3","data"], function(d3,data)
{
  const scale = d3.scaleOrdinal(d3.schemePaired);       //schemePaired //schemeSet3
  return d => scale(d.name);
}
);

main.variable(observer("x")).define("x", ["d3","margin","width"], function(d3,margin,width){return(
d3.scaleLinear([0, 1], [margin.left, width - margin.right])
)});

main.variable(observer("y")).define("y", ["d3","n","margin","barSize"], function(d3,n,margin,barSize){return(
d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1)
)});

main.variable(observer("height")).define("height", ["margin","barSize","n"], function(margin,barSize,n){return(
margin.top + barSize * n + margin.bottom
)});
  main.variable(observer("barSize")).define("barSize", function(){return(
48
)});

main.variable(observer("margin")).define("margin", function(){return(
{top: 16, right: 6, bottom: 6, left: 0}
)});

main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});

main.variable(observer("u1")).define("u1", ["chartByRankSimple", "chartByRankExtended","chartByPoints","dataframe"], function(chartByRankSimple,chartByRankExtended,chartByPoints,dataframe){return(
  //chartByPoints.update(dataframe)
  chartByRankSimple.update(dataframe)
  //chartByRankExtended.update(dataframe)
)});
 
main.variable(observer("u2")).define("u2", ["chartByRankSimple", "chartByRankExtended","chartByPoints","dataframe"], function(chartByRankSimple,chartByRankExtended,chartByPoints,dataframe){return(
//chartByPoints.update(dataframe)
//chartByRankSimple.update(dataframe)
chartByRankExtended.update(dataframe)
)});

main.variable(observer("u3")).define("u3", ["chartByPoints","dataframeByPoints"], function(chartByPoints,dataframeByPoints){return(
//chartByPoints.update(dataframe)
//chartByRankSimple.update(dataframe)
chartByPoints.update(dataframeByPoints)
)});

main.variable(observer("html")).define("html", ["htl"], function(htl){return(
htl.html
)});











main.variable(observer("chartByRankSimple")).define("chartByRankSimple", ["d3","width","height","barsSimple","axis","labelsPoints","ticker","invalidation","duration","x","labelsRank","labelsWinratio"], function(d3,width,height,barsSimple,axis,labelsPoints,ticker,invalidation,duration,x,labelsRank,labelsWinratio)
{
  const svg = d3.create("svg")
      .attr("width", 1400)
      .attr("viewBox", [0, 0, width, height]);
      
  const updateBars = barsSimple(svg);
  //const updateAxis = axis(svg);
  //const updateLabelsPoints = labelsPoints(svg);
  const updateTicker = ticker(svg);
  const updateLabelsRank = labelsRank(svg);
  //const updateLabelsWinratio = labelsWinratio(svg);

  invalidation.then(() => svg.interrupt());

  return Object.assign(svg.node(), {
    update(dataframe) {
      const transition = svg.transition()
          .duration(duration)
          .ease(d3.easeLinear);

      var max = 1200; //d3.max(dataframe[1], function(d) { return d.points; });
      
      x.domain([0, max]);
      //x.domain([0, keyframe[1][0].value]);

      //updateAxis(dataframe, transition);
      updateBars(dataframe, transition);
      //updateLabelsPoints(dataframe, transition);
      updateTicker(dataframe, transition);
      updateLabelsRank(dataframe, transition);
     // updateLabelsWinratio(dataframe, transition);
    }
  });
}
);

main.variable(observer("chartByRankExtended")).define("chartByRankExtended", ["d3","width","height","bars","axis","labelsPoints","ticker","invalidation","duration","x","labelsRank","labelsWinratio"], function(d3,width,height,bars,axis,labelsPoints,ticker,invalidation,duration,x,labelsRank,labelsWinratio)
{
  const svg = d3.create("svg")
      .attr("width", 1400)
      .attr("viewBox", [0, 0, width, height]);
      
  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabelsPoints = labelsPoints(svg);
  const updateTicker = ticker(svg);
  const updateLabelsRank = labelsRank(svg);
  const updateLabelsWinratio = labelsWinratio(svg);

  invalidation.then(() => svg.interrupt());

  return Object.assign(svg.node(), {
    update(dataframe) {
      const transition = svg.transition()
          .duration(duration)
          .ease(d3.easeLinear);

      var max = d3.max(dataframe[1], function(d) { return d.points; });
      
      x.domain([0, max]);
      //x.domain([0, keyframe[1][0].value]);

      updateAxis(dataframe, transition);
      updateBars(dataframe, transition);
      updateLabelsPoints(dataframe, transition);
      updateTicker(dataframe, transition);
      updateLabelsRank(dataframe, transition);
      updateLabelsWinratio(dataframe, transition);
    }
  });
}
);



main.variable(observer("viewof dataframe")).define("viewof dataframe", ["Scrubber","dataframes","formatDate","duration"], function(Scrubber,dataframes,formatDate,duration){return(
Scrubber(dataframes, {
  format: ([date]) => formatDate(date),
  delay: duration,
  loop: false
})
)});

 main.variable(observer("dataframe")).define("dataframe", ["Generators", "viewof dataframe"], (G, _) => G.input(_));
 



 main.variable(observer()).define(["md"], function(md){return(
md`# Chess Club Ranking History - Chart by Points`
)});

main.variable(observer("chartByPoints")).define("chartByPoints", ["d3","width","height","bars","axis","labelsPoints","ticker","invalidation","duration","x","labelsRank","labelsWinratio"], function(d3,width,height,bars,axis,labelsPoints,ticker,invalidation,duration,x,labelsRank,labelsWinratio)
{
  const svg = d3.create("svg")
      .attr("width", 1400)
      .attr("viewBox", [0, 0, width, height]);
      
  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabelsPoints = labelsPoints(svg);
  const updateTicker = ticker(svg);
  const updateLabelsRank = labelsRank(svg);
  const updateLabelsWinratio = labelsWinratio(svg);

  invalidation.then(() => svg.interrupt());

  return Object.assign(svg.node(), {
    update(dataframe) {
      const transition = svg.transition()
          .duration(duration)
          .ease(d3.easeLinear);

      var max = d3.max(dataframe[1], function(d) { return d.points; });
      
      x.domain([0, max]);
      //x.domain([0, keyframe[1][0].value]);

      updateAxis(dataframe, transition);
      updateBars(dataframe, transition);
      updateLabelsPoints(dataframe, transition);
      updateTicker(dataframe, transition);
      updateLabelsRank(dataframe, transition);
      updateLabelsWinratio(dataframe, transition);
    }
  });
}
);


main.variable(observer("viewof dataframeByPoints")).define("viewof dataframeByPoints", ["Scrubber","dataframesByPoints","formatDate","duration"], function(Scrubber,dataframesByPoints,formatDate,duration){return(
Scrubber(dataframesByPoints, {
  format: ([date]) => formatDate(date),
  delay: duration,
  loop: false
})
)});
  
main.variable(observer("dataframeByPoints")).define("dataframeByPoints", ["Generators", "viewof dataframeByPoints"], (G, _) => G.input(_));


main.variable(observer()).define(["md"], function(md){return(
md`The following parameters control the transision speed, the interpolation factor and top 'n' number of Plyers being tracked.`
)}); 
main.variable(observer()).define(["md"], function(md){return(
md`Change values and observe the change in behaviour`
)}); 

main.variable(observer()).define(["md"], function(md){return(
md`# => Let's play`
)}); 

main.variable(observer("viewof duration")).define("viewof duration", ["Inputs"], function(Inputs){return(
Inputs.number({label: "duration:"})
)});
main.variable(observer("duration")).define("duration", ["Generators", "viewof duration"], (G, _) => G.input(_));

main.variable(observer("viewof k")).define("viewof k", ["Inputs"], function(Inputs){return(
Inputs.number({label: "k:"})
)});
main.variable(observer("k")).define("k", ["Generators", "viewof k"], (G, _) => G.input(_));

main.variable(observer("viewof n")).define("viewof n", ["Inputs"], function(Inputs){return(
Inputs.number({label: "n:"})
)});
main.variable(observer("n")).define("n", ["Generators", "viewof n"], (G, _) => G.input(_));

const child1 = runtime.module(define1);
main.import("Scrubber", child1);
return main;
}
     
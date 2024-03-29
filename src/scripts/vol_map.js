/* Prepare CSV Data
***********************************************************************/
// CSV column types for streets_lines.csv
var slConverter = function(d) {
	return {
		id: +d.line,
		streetname: d.streetname,
		directions: d.directions,
		x1: +d.x1,
		y1: +d.y1,
		x2: +d.x2,
		y2: +d.y2
	};
};

var ssConverter = function(d) {
	return {
		id: +d.segment,
		streetname: d.streetname,
		direction: d.direction,
		segdesc: d.segdesc,
		x1: +d.x1,
		y1: +d.y1,
		x2: +d.x2,
		y2: +d.y2
	};
};

var parseDate = d3.timeParse("%m/%d/%Y %I:%M");
var dataConverter = function(d) {
	return {
		id: +d.segment,
		direction: d.direction,
		month: parseDate(d.mon),
		time_period: d.time_period,
		volume: +d.volume,
		pct_change: +d.pct_change
	};
};



/* Setup SVGs
***********************************************************************/
var svgW = 1300;
var svgH = 550;

// Create SVG container
var svgContainer = d3.select("#vol_map")
	.attr("width", svgW)
	.attr("height", svgH);

// Create Label Group
var labelGroup = svgContainer.append("g")
	.attr("id", "labelgroup");

// Create streets_lines no data group
var slNoData = svgContainer.append("g")
	.attr("id", "slnodata");

// Create streets_lines Group
var slGroup = svgContainer.append("g")
	.attr("id", "slgroup");

// Create streets_segments Group
var ssGroup = svgContainer.append("g")
	.attr("id", "ssgroup");

// Create legend Group
var legendGroup = svgContainer.append("g")
	.attr("id", "legendgroup");



/* Scale SVGs
***********************************************************************/
var xArr, yArr, xMin, xMax, yMin, yMax, xScale, yScale;
function scaling(arr) {
	xArr = [(d3.max(arr, function(obj) {return obj.x1;})),
			(d3.max(arr, function(obj) {return obj.x2;})),
			(d3.min(arr, function(obj) {return obj.x1;})),
			(d3.min(arr, function(obj) {return obj.x2;}))];

	yArr = [(d3.max(arr, function(obj) {return obj.y1;})),
			(d3.max(arr, function(obj) {return obj.y2;})),
			(d3.min(arr, function(obj) {return obj.y1;})),
			(d3.min(arr, function(obj) {return obj.y2;}))];

	xMin = d3.min(xArr);
	xMax = d3.max(xArr);
	yMin = d3.min(yArr);
	yMax = d3.max(yArr);

	xScale = d3.scaleLinear()
		.domain([xMin, xMax])
		.range([120, svgW-200]); // left 100px, right 200px whitespace
	yScale = d3.scaleLinear()
		.domain([yMin, yMax])
		.range([150, svgH-100]); // top 150px, bottom 100px whitespace
}



/* Get min/max segment coordinates
***********************************************************************/
var minx1, minx2, miny1, miny2, maxx1, maxx2, maxy1, maxy2;
// takes array of objs and gets min of property across all objs
function getMin(arr, prop){
	return arr.reduce((min, obj) => Math.min(min, obj[prop]), arr[0][prop]);
}

// takes array of objs and gets max of property across all objs
function getMax(arr, prop){
	return arr.reduce((max, obj) => Math.max(max, obj[prop]), arr[0][prop]);
}



/* Create tooltip
***********************************************************************/
var divtip = d3.select("#vol_map_container").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);



/* Data filter functions
***********************************************************************/
// loop through radio button values
var periodIDs = ["AM", "PM"];
var monthIDs = ["Nov","Dec","Jan","Feb"];
var current_period = document.getElementById("AM").value;
var current_month = document.getElementById("Nov").value;

// check which buttons are selected, updates current period and month
function buttonChecker() {
	periodIDs.forEach(function(buttonID) {
		if (document.getElementById(buttonID).checked == true) {
			current_period = document.getElementById(buttonID).value;
			console.log(current_period);
		};
	});
	monthIDs.forEach(function(buttonID) {
		if (document.getElementById(buttonID).checked == true) {
			current_month = document.getElementById(buttonID).value;
			console.log(current_month);
		};
	});
	console.log([current_period,current_month])
}

function selectChecker() {
	periodIDs.forEach(function(selectID) {
			current_month = document.getElementById("AMPM").value;
			console.log(current_month);
	});
	monthIDs.forEach(function(selectID) {
			current_month = document.getElementById("month").value;
			console.log(current_month);
	});
	console.log([current_period,current_month])
}

/* Colouring segments
***********************************************************************/
var cNeg4 = "#4d9221", cNeg3 = "#7fbc41", cNeg2 = "#b8e186", cNeg1 = "#e6f5d0";
var cPos1 = "#fde0ef", cPos2 = "#f1b6da", cPos3 = "#de77ae", cPos4 = "#c51b7d";
var cND = "grey";

// colour path based on segment volume percent change
function pctColour(obj) {
	// given obj, returns a colour string
	var colour = "";
	if (obj.pct_change >= 0) { // zero or positive change is increase in volume compared to base; bad
		if (0 <= obj.pct_change && obj.pct_change < 5) {
			colour = cPos1;
			return colour;
		}
		else if (5 <= obj.pct_change && obj.pct_change < 10) {
			colour = cPos2;
			return colour;
		}
		else if (10 <= obj.pct_change && obj.pct_change < 20) {
			colour = cPos3;
			return colour;
		}
		else if (20 <= obj.pct_change) {
			colour = cPos4;
			return colour;
		}
	}
	else if (obj.pct_change < 0) { // negative change is decrease in volume compared to base; good
		if (-5 < obj.pct_change && obj.pct_change < 0) {
			colour = cNeg1;
			return colour;
		}
		else if (-10 < obj.pct_change && obj.pct_change <= -5) {
			colour = cNeg2;
			return colour;
		}
		else if (-20 < obj.pct_change && obj.pct_change <= -10) {
			colour = cNeg3;
			return colour;
		}
		else if (obj.pct_change <= -20) {
			colour = cNeg4;
			return colour;
		}
	}
	else {
		colour = cND // no data colour
		return colour;
	};
}



/* Functions to draw SVGs
***********************************************************************/
var slstrokeWidth = 3;
var sllinecap = "round";

var ssstroke = "black";
var ssstrokeWidth = 1;
var fillDefault = "grey";

// Create line path generator (for sl)
var lpath;
function pathFunc(obj) {
	lpath = d3.path();
	lpath.moveTo(xScale(obj.x1),yScale(obj.y1));
	lpath.lineTo(xScale(obj.x2),yScale(obj.y2));
	return lpath;
}

//// Variables and functions for polygon path generator (for ss)
var polywidth = 3;
var path, seglist;

// function for inner polygons of the map graphic
function inside(obj, arr) {
	// cases based on directions
	if (obj.direction == "S") {
		// populate seglist
		seglist = arr.filter(function(seg) {
			return ((obj.x2 == seg.x1) && (obj.y2 == seg.y1) && (seg.direction == "W")) ||
				((obj.x1 == seg.x2) && (obj.y1 == seg.y2) && (seg.direction == "E"));
		})

		// draw polygon path, assuming last position at obj x2 and y2
		if (seglist.length == 2) {
			path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2 - polywidth));
			path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1 + polywidth));
			path.closePath();
		}
		else if (seglist.length == 1) {
			if ((obj.x2 == seglist[0].x1) && (obj.y2 == seglist[0].y1) && (seglist[0].direction == "W")) {
				path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2 - polywidth));
				path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1));
				path.closePath();
			}
			else {
			// if ((obj.x1 == seglist[0].x2) && (obj.y1 == seglist[0].y2) && (seglist[0].direction == "E"))
				path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2));
				path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1 + polywidth));
				path.closePath();
			}
		}
		else { // if (seglist.length == 0)
			path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2));
			path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1));
			path.closePath();
		}
	}
	else if (obj.direction == "E") {
		// populate seglist
		seglist = arr.filter(function(seg) {
			return ((obj.x2 == seg.x1) && (obj.y2 == seg.y1) && (seg.direction == "S")) ||
				((obj.x1 == seg.x2) && (obj.y1 == seg.y2) && (seg.direction == "N"));
		})

		// draw polygon path, assuming last position at obj x2 and y2
		if (seglist.length == 2) {
			path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2 + polywidth));
			path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1 + polywidth));
			path.closePath();
		}
		else if (seglist.length == 1) {
			if ((obj.x2 == seglist[0].x1) && (obj.y2 == seglist[0].y1) && (seglist[0].direction == "S")) {
				path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2 + polywidth));
				path.lineTo(xScale(obj.x1), yScale(obj.y1 + polywidth));
				path.closePath();
			}
			else {
			// if ((obj.x1 == seglist[0].x2) && (obj.y1 == seglist[0].y2) && (seglist[0].direction == "N"))
				path.lineTo(xScale(obj.x2), yScale(obj.y2 + polywidth));
				path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1 + polywidth));
				path.closePath();
			}
		}
		else { // if (seglist.length == 0)
			path.lineTo(xScale(obj.x2), yScale(obj.y2 + polywidth));
			path.lineTo(xScale(obj.x1), yScale(obj.y1 + polywidth));
			path.closePath();
		}
	}
	else if (obj.direction == "N") {
		// populate seglist
		seglist = arr.filter(function(seg) {
			return ((obj.x2 == seg.x1) && (obj.y2 == seg.y1) && (seg.direction == "E")) ||
				((obj.x1 == seg.x2) && (obj.y1 == seg.y2) && (seg.direction == "W"));
		})

		// draw polygon path, assuming last position at obj x2 and y2
		if (seglist.length == 2) {
			path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2 + polywidth));
			path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1 - polywidth));
			path.closePath();
		}
		else if (seglist.length == 1) {
			if ((obj.x2 == seglist[0].x1) && (obj.y2 == seglist[0].y1) && (seglist[0].direction == "E")) {
				path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2 + polywidth));
				path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1));
				path.closePath();
			}
			else {
			// if ((obj.x1 == seglist[0].x2) && (obj.y1 == seglist[0].y2) && (seglist[0].direction == "W"))
				path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2));
				path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1 - polywidth));
				path.closePath();
			}
		}
		else { // if (seglist.length == 0)
			path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2));
			path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1));
			path.closePath();
		}
	}
	else if (obj.direction == "W") {
		// populate seglist
		seglist = arr.filter(function(seg) {
			return ((obj.x2 == seg.x1) && (obj.y2 == seg.y1) && (seg.direction == "N")) ||
				((obj.x1 == seg.x2) && (obj.y1 == seg.y2) && (seg.direction == "S"));
		})

		// draw polygon path, assuming last position at obj x2 and y2
		if (seglist.length == 2) {
			path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2 - polywidth));
			path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1 - polywidth));
			path.closePath();
		}
		else if (seglist.length == 1) {
			if ((obj.x2 == seglist[0].x1) && (obj.y2 == seglist[0].y1) && (seglist[0].direction == "N")) {
				path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2 - polywidth));
				path.lineTo(xScale(obj.x1), yScale(obj.y1 - polywidth));
				path.closePath();
			}
			else {
			// if ((obj.x1 == seglist[0].x2) && (obj.y1 == seglist[0].y2) && (seglist[0].direction == "S"))
				path.lineTo(xScale(obj.x2), yScale(obj.y2 - polywidth));
				path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1 - polywidth));
				path.closePath();
			}
		}
		else { // if (seglist.length == 0)
			path.lineTo(xScale(obj.x2), yScale(obj.y2 - polywidth));
			path.lineTo(xScale(obj.x1), yScale(obj.y1 - polywidth));
			path.closePath();
		}
	}
	else {
		console.log(obj);
	}
}


// function for outer/edge polygons of the map graphic
function outside(obj, arr) {
	// NW corner
	if (obj.x2 == minx2 && obj.y2 == miny2 && obj.direction == "W") {
		path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2 - polywidth));
		path.lineTo(xScale(obj.x1), yScale(obj.y1 - polywidth));
		path.closePath();
	}
	else if (obj.x1 == minx1 && obj.y1 == miny1 && obj.direction == "S") {
		path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2));
		path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1 - polywidth));
		path.closePath();
	}
	// SW corner
	else if (obj.x2 == minx2 && obj.y2 == maxy2 && obj.direction == "S") {
		path.lineTo(xScale(obj.x2 - polywidth), yScale(obj.y2 + polywidth));
		path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1));
		path.closePath();
	}
	else if (obj.x1 == minx1 && obj.y1 == maxy1 && obj.direction == "E") {
		path.lineTo(xScale(obj.x2), yScale(obj.y2 + polywidth));
		path.lineTo(xScale(obj.x1 - polywidth), yScale(obj.y1 + polywidth));
		path.closePath();
	}
	// NE corner
	else if (obj.x1 == maxx1 && obj.y1 == miny1 && obj.direction == "W") {
		path.lineTo(xScale(obj.x2), yScale(obj.y2 - polywidth));
		path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1 - polywidth));
		path.closePath();
	}
	else if (obj.x2 == maxx2 && obj.y2 == miny2 && obj.direction == "N") {
		path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2 - polywidth));
		path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1));
		path.closePath();
	}
	// SE corner
	else if (obj.x1 == maxx1 && obj.y1 == maxy1 && obj.direction == "N") {
		path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2));
		path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1 + polywidth));
		path.closePath();
	}
	else if (obj.x2 == maxx2 && obj.y2 == maxy2 && obj.direction == "E") {
		path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2 + polywidth));
		path.lineTo(xScale(obj.x1), yScale(obj.y1 + polywidth));
		path.closePath();
	}
	// E Wellington/Front St corner exceptions
	else if (obj.streetname == "Front1" && obj.segdesc == "Church to Jarvis") {
		path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2 + polywidth));
		path.lineTo(xScale(obj.x1), yScale(obj.y1 + polywidth));
		path.closePath();
	}
	else if (obj.streetname == "Jarvis" && obj.segdesc == "Wellington to King") {
		path.lineTo(xScale(obj.x2 + polywidth), yScale(obj.y2));
		path.lineTo(xScale(obj.x1 + polywidth), yScale(obj.y1 + polywidth));
		path.closePath();
	}
	// otherwise, run function for inside segments
	else {
		inside(obj, arr);
	}
}


// Create polygon path generator (for ss)
function fancy(obj, arr) {
	path = d3.path();
	path.moveTo(xScale(obj.x1),yScale(obj.y1));
	path.lineTo(xScale(obj.x2),yScale(obj.y2));

	outside(obj, arr);

	return path;
}


// draw all objects in streets_lines
function slpathGen(arr, group) {
	if (group == "#slnodata") { // streets with no data are bottom layer and grey
		d3.select(group)
			.selectAll("path")
			.data(arr.filter(function(obj) {return (obj.streetname == "Portland" || obj.streetname == "Wellington" ||
					obj.streetname == "Peter/Blue Jays" || obj.streetname == "John" ||
					obj.streetname == "Simcoe" || obj.streetname == "University" || obj.streetname == "York" ||
					obj.streetname == "Yonge" || obj.streetname == "Church");}))
			.enter()
			.append("path")
			.attr("id", function(obj) {return obj.streetname;})
			.attr("d", function(obj) {return pathFunc(obj);})
			.attr("stroke", "grey")
			.attr("stroke-dasharray", "5, 10")
			.attr("stroke-width", slstrokeWidth)
			.attr("stroke-linecap", sllinecap);
	}
	else { // streets with data are top layer and black
		d3.select(group)
			.selectAll("path")
			.data(arr
					.filter(function(obj) {return !(obj.streetname == "Portland" || obj.streetname == "Wellington" ||
					obj.streetname == "Peter/Blue Jays" || obj.streetname == "John" ||
					obj.streetname == "Simcoe" || obj.streetname == "University" || obj.streetname == "York" ||
					obj.streetname == "Yonge" || obj.streetname == "Church");}))
			.enter()
			.append("path")
			.attr("id", function(obj) {return obj.streetname;})
			.attr("d", function(obj) {return pathFunc(obj);})
			.attr("stroke", "white")
			.attr("stroke-width", slstrokeWidth)
			.attr("stroke-linecap", sllinecap);
	};
}

// draw all objects in streets_segments
function sspathGen(ssarr) {
	d3.select("#ssgroup") // create and draw the ss path elements
		.selectAll("path")
		.data(ssarr, function(obj) {return obj.direction + obj.id;}) // key for binding
		.enter()
		.append("path")
		.attr("id", function(obj) {return obj.direction + obj.id;})
		.attr("d", function(obj) {return fancy(obj, ssarr);})
		.attr("stroke", "white")
		.attr("stroke-width", ssstrokeWidth)
		.attr("fill", fillDefault); // default colour, also no-data colour
}

//update segment polygons by binding data
function sspathUpdate(dataset) {
	// update variables current_period and current_month
	console.log('About to check buttons')
	selectChecker();

	// bind data to ss paths
	var segments = d3.select("#ssgroup")
		.selectAll("path")
		.data(dataset.filter(function(obj) // filter for current period and month
					{return (obj.time_period == current_period)
						&& ((obj.month.getMonth() + 1) == current_month);}),
				function(obj) {return obj.direction + obj.id;}) // key for binding

	// colour by data with transition
	segments.transition()
		.duration(1000)
		.attr("fill", function(obj) {return pctColour(obj);})

	// tooltip
	segments.on("mouseover", function(obj) {
			divtip.transition()
				.duration(200)
				.style("opacity", .9);
			divtip.html("Volume Change: " + obj.pct_change + "%" + "<br>" + "Actual Volume: " + obj.volume)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 30) + "px");})
		.on("mouseout", function(obj) {
			divtip.transition()
				.duration(500)
				.style("opacity", 0);});
}



/* Functions to label SVGs
***********************************************************************/
var fontsize = "12px";
var fontfill = "black"; // font colour

var anchEW = "end";
var anchNS = "start";
var dxEW = -20;
var dxNS = 20;
var dyEW = ".35em"; // add half the text's height to its y attribute
var dyNS = ".35em"; // add half the text's height to its y attribute

function labelStreets(arr) {
	d3.select("#labelgroup")
		.selectAll("text")
		.data(arr)
		.enter()
		.append("text")
		.text(function(obj) {if (obj.streetname == "Front1") {return "Front";} // Front exceptions
							else if (obj.streetname == "Front2") {return "";}
							else {return obj.streetname;};})
		.attr("class", "labels-text")
		.attr("x", function(obj) {return xScale(obj.x1);})
		.attr("y", function(obj) {return yScale(obj.y1);})
		.attr("font_size", fontsize)
		.attr("fill", fontfill)
		.attr("text-anchor", function(obj) { // rotate NS street labels
			if (obj.directions == "NS" || obj.directions == "N" || obj.directions == "S")
				{return anchNS;}
			else {return anchEW;};})
		.attr("transform", function(obj) {
			if (obj.directions == "NS" || obj.directions == "N" || obj.directions == "S")
				{return "rotate(270 "
				+ xScale(obj.x1) + "," + yScale(obj.y1) + ")";}
			else {return "";};})
		.attr("dx", function(obj) {if (obj.directions == "NS" || obj.directions == "N" || obj.directions == "S")
										{return dxNS;}
									else {return dxEW;};})
		.attr("dy", function(obj) {if (obj.directions == "NS" || obj.directions == "N" || obj.directions == "S")
										{return dyNS;}
									else {return dyEW;};});
}



/* Create a legend
***********************************************************************/
// data and variables for legend
var legendText = ["Volume Change (%)",
	"&minus;20", "&minus;10", "&minus;10 to &minus;5", "&minus;5 to 0",
	"0", "5 to 10", "+10", "+20", "No Data"]; // requires length of 10
var legendX = svgW - 120;
var legendY = [0, 40, 80, 120, 140, 160, 180, 200, 240, 280]; // requires length of 10
var legendColours = [cND, cNeg4, cNeg3, cNeg2, cNeg1, cPos1, cPos2, cPos3, cPos4, cND]; // requires length of 10
var legendData = []; // will be length of 10


function createLegend() {
	// create objects from text, x, y, and colour to put into legendData array
	legendText.forEach(function(t, i) {
		legendData.push({text: t,
						x: legendX,
						y: legendY[i]+130, // shift legend height
						colour: legendColours[i]});
	});

	// display text for legend
	d3.select("#legendgroup")
		.selectAll("text")
		.data(legendData.filter(function(d) {return d.text == legendText[0] || d.text == legendText[1] ||
											d.text == legendText[2] || d.text == legendText[5] ||
											d.text == legendText[7] || d.text == legendText[8] ||
											d.text == legendText[9];}))
		.enter()
		.append("text")
		.html(function(d) {return d.text;})
		.attr("class", "legend-text")
		.attr("x", function(d) {if (d.text == legendText[0]) {return d.x-40;}
								else {return d.x;}})
		.attr("y", function(d) {if (d.text == legendText[1]) {return d.y+20;}
								else if (d.text == legendText[2]) {return d.y+20;}
								else if (d.text == legendText[5]) {return d.y-20;}
								else if (d.text == legendText[7]) {return d.y-20;}
								else if (d.text == legendText[8]) {return d.y-20;}
								else {return d.y;}})
		.attr("font-size", function(d) {if (d.text == legendText[0]) {return 18;}
								else {return 14;}})
		.attr("fill", "black")
		.attr("dy", ".35em");

	// display symbol for legend
	d3.select("#legendgroup")
		.selectAll("line")
		.data(legendData.filter(function(d) {return d.text != legendText[0];}))
		.enter()
		.append("line")
		.attr("x1", function(d) {return d.x-40;})
		.attr("y1", function(d) {return d.y;})
		.attr("x2", function(d) {return d.x-9;})
		.attr("y2", function(d) {return d.y;})
		.attr("stroke", function(d) {return d.colour;})
		.attr("stroke-width", 40);
};


/* Draw SVGs
***********************************************************************/
// Load data and execute functions requiring immediate access to external data
var streets_lines = [];
var dataURL = "https://cityoftoronto.github.io/bdit_king_pilot_dashboard/data/street_volumes.csv";
var vol_data;
var streets_segments = [];

// CSV calls
d3.csv("https://cityoftoronto.github.io/bdit_king_pilot_dashboard/d3-volume_map/streets_lines3.csv", function(sl) {
	d3.csv("https://cityoftoronto.github.io/bdit_king_pilot_dashboard/d3-volume_map/streets_segments31.csv", function(ss) {
		d3.csv(dataURL, function(file) {
			// typify data
			streets_lines = sl.map(slConverter);
			streets_segments = ss.map(ssConverter);
			vol_data = file.map(dataConverter);

			// get min/max segment coordinates
			minx1 = getMin(streets_segments, "x1");
			minx2 = getMin(streets_segments, "x2");
			miny1 = getMin(streets_segments, "y1");
			miny2 = getMin(streets_segments, "y2");

			maxx1 = getMax(streets_segments, "x1");
			maxx2 = getMax(streets_segments, "x2");
			maxy1 = getMax(streets_segments, "y1");
			maxy2 = getMax(streets_segments, "y2");

			// create scale and labels
			scaling(streets_lines);
			labelStreets(streets_lines);
			createLegend();

			// create and draw paths
			slpathGen(streets_lines, "#slnodata");
			slpathGen(streets_lines, "#slgroup");
			sspathGen(streets_segments);

			// initial data view
			sspathUpdate(vol_data);
		});
	});
});

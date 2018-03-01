var carStr = JSON.stringify(data);
var dataobj = JSON.parse(carStr);
var blStr = JSON.stringify(bl);
var blobj = JSON.parse(blStr);

var ylist = [];
for (j=0; j<dataobj.length; j++) {
  ylist.push(dataobj[j].travel_time);
};
var ymax = Math.max.apply(Math, ylist);

var divlst = ['mydiv1','mydiv2','mydiv3','mydiv4','mydiv5','mydiv6'];
var polist = ['Dundas', 'Richmond', 'Wellington', 'Queen', 'Adelaide', 'Front'];

function avg (column) {
  var total = 0;
  for(var i = 0; i < column.length; i++) {
    total += column[i];
  }
  aver = total / column.length
  return aver.toFixed(1);
};


function beforeAttr(position, time){
  var bvalue = [0,0];
  for(var i = 0; i < blobj.length; i++){
    if (blobj[i].corridor == position && blobj[i].time_period == time) {
      if (blobj[i].dir == "EB") {
        bvalue[0] = blobj[i].travel_time;
      }
      else if (blobj[i].dir == "WB") {
        bvalue[1] = blobj[i].travel_time;
      }
    }
  }
  return bvalue;
};


function afterAttr(position, time, mon){
  var avalue = [0,0];
  var EBtemp = [];
  var WBtemp = [];
  for(var i = 0; i < dataobj.length; i++){
    var month = new Date(dataobj[i].mon);
    var nmonth = month.getMonth();
    if (dataobj[i].corridor == position && dataobj[i].time_period == time) {
      if (mon == "all") {
        if (dataobj[i].dir == "EB") {
          EBtemp.push (dataobj[i].travel_time);
        }
        else if (dataobj[i].dir == "WB") {
          WBtemp.push (dataobj[i].travel_time);
        }
      }
      else {
        var nmon = parseInt(mon);
        if (nmon == (nmonth + 1)) {
          if (dataobj[i].dir == "EB") {
            EBtemp.push (dataobj[i].travel_time);
          }
          else if (dataobj[i].dir == "WB") {
            WBtemp.push (dataobj[i].travel_time);
          }
        }
      }
    }
  }
  if (EBtemp.length == 0) {
    EBtemp.push (0);
  }
  if (WBtemp.length == 0) {
    WBtemp.push (0);
  }
  EBtemp = parseFloat(avg(EBtemp));
  WBtemp = parseFloat(avg(WBtemp));
  avalue[0] = EBtemp;
  avalue[1] = WBtemp;
  return avalue;
};

var AMPMIDs = ["AM", "PM"];
var monthIDs = ["all","11","12","1","2"];
var current_period = document.getElementById("AM").value;
var current_month = document.getElementById("Nov").value;

function selectChecker() {
	AMPMIDs.forEach(function(selectID) {
			current_period = document.getElementById("AMPM").value;
	});
  monthIDs.forEach(function(selectID) {
			current_month = document.getElementById("month").value;
	});
	console.log([current_period,current_month]);
};

function diff (bvalue, avalue){
  diffvalE = parseInt(bvalue[0] - avalue[0]);
  diffvalW = parseInt(bvalue[1] - avalue[1]);
  if (bvalue[0] - avalue[0] == 0){
    diffvalE = "-";
  }
  else if (diffvalE > 0){
    diffvalE = diffvalE.toString();
    diffvalE = '+' + diffvalE + 'min';
  }
  else if (diffvalE < 0){
    diffvalE = diffvalE.toString();
    diffvalE = diffvalE + 'min';
  }
  if (bvalue[1] - avalue[1] == 0){
    diffvalW = "-";
  }
  else if (diffvalW > 0){
    diffvalW = diffvalW.toString();
    diffvalW = '+' + diffvalW + 'min';
  }
  else if (diffvalW < 0){
    diffvalW = diffvalW.toString();
    diffvalW = diffvalW + 'min';
  }
  return [diffvalE, diffvalW];
}


function graphdata(){
  selectChecker();
  var i;
  for (i = 0; i < polist.length; i++){
    var bvalue = beforeAttr(polist[i], current_period);
    var avalue = afterAttr(polist[i], current_period, current_month);
    //console.log([bvalue, avalue]);
    var before = {
      x: ['EASTBOUND', 'WESTBOUND'],
      y: bvalue,
      text: bvalue,
      textposition: 'auto',
      insidetextfont:{
        size: 11,
        color: 'rgb(255, 255, 255)'
      },
      hoverinfo: 'y+name',
      name: 'before',
      type: 'bar',
      marker: {
        color: 'rgb(255, 197, 91)',
        width: .3
      },
    };
    var after = {
      x: ['EASTBOUND', 'WESTBOUND'],
      y: avalue,
      text: avalue,
      textposition: 'auto',
      insidetextfont:{
        size: 11,
        color: 'rgb(255, 255, 255)'
      },
      hoverinfo: 'y+name',
      name: 'after',
      type: 'bar',
      marker: {
        color: 'rgb(137, 186, 249)',
        width: .3
      },
    };
    var data = [before, after];
    diff(bvalue, avalue);
    var layout = {
      title: polist[i],
      font: {
        size: 10
      },
      xaxis: {
        title: "DIRECTION",
        titlefont: {
          size: 11
        }},
      yaxis: {
        title: 'TRAVEL TIME',
        titlefont: {
          size: 11
      }},
      autosize: true,
      showlegend: false,
      annotations: [
        {
          x: 'EASTBOUND',
  				y: ymax + 2,
  				text: diffvalE,
  				xref: 'centre',
  				yanchor: 'top',
  				showarrow: false,
  				font:{
            color: "black",
            size: 13
          }
        },
        {
          x: 'WESTBOUND',
  				y: ymax + 2,
  				text: diffvalW,
  				xref: 'centre',
  				yanchor: 'top',
  				showarrow: false,
  				font:{
            color: "black",
            size: 13
          }
        }
      ]
    };
    Plotly.newPlot(divlst[i], data, layout, {displayModeBar: false});
  }
};

graphdata();

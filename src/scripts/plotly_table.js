var totalgra = document.getElementById("totalgra");
var totaltab = document.getElementById("totaltab");
var wtable = document.getElementById("wholetab");
var period = document.getElementById("AMPM");
var month = document.getElementById("month");
var togbutton = document.getElementById("tog");
var filter = document.getElementById("filter");


function toggle(){
  if (totalgra.style.display == "none") {
    totalgra.style.display = "inline-block";
    period.style.display = "inline-block";
    month.style.display = "inline-block";
    vol_map.style.display = "block";
    wtable.style.display = "none";
    totaltab.style.display = "none";
    filter.style.display = "none";
    togbutton.value = "Table";
  } else {
    totalgra.style.display = "none";
    period.style.display = "none";
    filter.style.display = "inline-block";
    filter.value = "Filtered tables";
    month.style.display = "none";
    vol_map.style.display = "none";
    wtable.style.display = "block";
    togbutton.value = "Graphs";
    tabledata();
  }
};

function toggleTAB(){
  if (wtable.style.display == "none") {
    wtable.style.display = "block";
    totaltab.style.display = "none";
    filter.value = "Filtered tables";
  } else {
    wtable.style.display = "none";
    totaltab.style.display = "block";
    filter.value = "Whole table";
    filterTAB();
  }
};

var corr_id = [];
var corr = [];
var dirlst = [];
var datelst = [];
var periodlst = [];

function tabledata(){
  for (j=0; j<dataobj.length; j++) {
    corr_id.push(dataobj[j].corridor_id);
    corr.push(dataobj[j].corridor);
    dirlst.push(dataobj[j].dir);
    datelst.push(dataobj[j].mon);
    periodlst.push(dataobj[j].time_period);
  };
  var alldata = [corr_id, corr, dirlst, datelst, periodlst, ylist];
  var tdata = [{
    type: 'table',
    header: {
      values: [["corridor_id"], ["corridor"], ["dir"], ["mon"], ["time_period"],['travel_time']],
      align: "center",
      line: {width: 1, color: 'black'},
      fill: {color: "rgb(27, 83, 155)"},
      font: {family: "Arial", size: 12, color: "white"}
    },
    cells: {
      values: alldata,
      align: "center",
      line: {color: "black", width: 1},
      font: {family: "Arial", size: 11, color: ["black"]}
    }
  }];
  var tlayout = {
    title: "All data"
  }
  Plotly.plot("wholetab", tdata, tlayout,{displayModeBar: false});
};

function filterdata(corridor) {
  var fcorr_id = [];
  var fcorr = [];
  var fdirlst = [];
  var fdatelst = [];
  var fperiodlst = [];
  var fttlst = [];
  for (j=0; j<dataobj.length; j++) {
    if (dataobj[j].corridor == corridor) {
      fcorr_id.push(dataobj[j].corridor_id);
      fcorr.push(dataobj[j].corridor);
      fdirlst.push(dataobj[j].dir);
      fdatelst.push(dataobj[j].mon);
      fperiodlst.push(dataobj[j].time_period);
      fttlst.push(dataobj[j].travel_time);
    }
  };
  return [fcorr_id,fcorr,fdirlst,fdatelst,fperiodlst,fttlst];
}

var tablelst = ['mytab1','mytab2','mytab3','mytab4','mytab5','mytab6'];

function filterTAB(){
  var fdata = [];
  for (i=0; i<polist.length; i++) {
    fdata = filterdata(polist[i]);
    var fdata = [{
      type: 'table',
      header: {
        values: [["corridor_id"], ["corridor"], ["dir"], ["mon"], ["time_period"],['travel_time']],
        align: "center",
        line: {width: 1, color: 'black'},
        fill: {color: "rgb(27, 83, 155)"},
        font: {family: "Arial", size: 12, color: "white"}
      },
      cells: {
        values: fdata,
        align: "center",
        line: {color: "black", width: 1},
        font: {family: "Arial", size: 11, color: ["black"]}
      }
    }];
    var flayout = {
      title: polist[i]
    }
    Plotly.plot(tablelst[i], fdata, flayout,{displayModeBar: false});
  }
};

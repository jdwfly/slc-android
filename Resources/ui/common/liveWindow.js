var globals = require('lib/globals');
var tableView = Ti.UI.createTableView({
  height: '150dp',
  bottom: 0,
  backgroundColor: '#e9e9e9',
  separatorColor: '#e9e9e9'
});
var data = [];
exports.liveWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Live Stream',
    backgroundColor: '#e9e9e9'
  });

  var liveImage = Ti.UI.createImageView({
    image: "/data/livestream.png",
    top: '20dp',
    width: '300dp',
    height: '103dp'
  });
  instance.add(liveImage);
  var liveButton = Ti.UI.createButton({
    title: "Watch Live",
    font: {fontWeight: "bold", fontSize: '12dp'},
    width: '200dp',
    height: '40dp',
    top: '140dp',
    backgroundImage: "/data/watchlive.png",
    color: "#ffffff"
  });
  liveButton.addEventListener('click', function(f) {
    Ti.App.fireEvent('live.click');
  });
  instance.add(liveButton);
  
  var lsTitle = Ti.UI.createLabel({
    text: 'Upcoming Live Stream Events',
    color: "#313131",
    font: {fontFamily:"Georgia", fontSize: '16dp', fontWeight: 'bold'},
    width: 'auto',
    top: '185dp'
  });
  instance.add(lsTitle);
  
  var lsServicesView = Ti.UI.createView({
    width: 'auto',
    top: '215dp',
    height: 'auto',
    layout: 'vertical'
  });
  var lsSunAM = Ti.UI.createLabel({
    text: 'Sunday Morning @ 11 am',
    font: {fontSize: '14dp', fontWeight: 'bold'},
    color: "#313131",
    height: 'auto',
    width: 'auto'
  });
  var lsSunPM = Ti.UI.createLabel({
    text: 'Sunday Evening @ 5 pm',
    font: {fontSize: '14dp', fontWeight: 'bold'},
    color: "#313131",
    height: 'auto',
    width: 'auto'
  });
  var lsWed = Ti.UI.createLabel({
    text: 'Thursday Evening @ 7 pm',
    font: {fontSize: '14dp', fontWeight: 'bold'},
    color: "#313131",
    height: 'auto',
    width: 'auto'
  });
  lsServicesView.add(lsSunAM);
  lsServicesView.add(lsSunPM);
  lsServicesView.add(lsWed);
  instance.add(lsServicesView);
  /* TODO: Change to auto-load this instead of commenting out.
  tableView.setData(data, {animated: false});
  instance.add(tableView);
  
  instance.addEventListener('focus', function(f) {
    Ti.App.fireEvent('live.update');
  });
  */
  return instance;
};

function updateLiveData() {
  parseData = JSON.parse(globals.liveData());
  var i = 0;
  data = [];
  for (var i = 0, nodes; nodes = parseData.nodes[i]; i++) {
    node = nodes.node; // annoying but needed    
    var row = Ti.UI.createTableViewRow({
      height: 40, 
      selectionStyle: "none"
    });
    content = Ti.UI.createView({
      height: 'auto',
      width: 'auto',
      layout: 'vertical',
      bottom: 0,
      left: '10dp',
      right: '10dp'
    });
    
    sessionFirst = Ti.UI.createLabel({
      text: globals.html_decode(node.title),
      font: {fontSize: '14dp', fontWeight: 'bold'},
      color: "#313131",
      height: 'auto',
      width: 'auto'
    });
    content.add(sessionFirst);
    
    sessionSecond = Ti.UI.createLabel({
      text: (node.day + " @ " + node.datefrom),
      font: {fontSize: '12dp'},
      color: "#313131",
      height: 'auto',
      width: 'auto'
    });
    content.add(sessionSecond);
    
    row.add(content);
    
    var paddingRow = Ti.UI.createTableViewRow({
      height: '10dp',
      selectionStyle: "none"
    });
        
    data.push(row);
    data.push(paddingRow);
  }
  tableView.setData(data, {animated: false});
}

Ti.App.addEventListener('live.updateTableView', function(f) {
  updateLiveData();
});

var globals = require('lib/globals');
var scheduleTableView = '';

exports.scheduleWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Schedule',
    backgroundColor: '#eeeeee'
  });
  
  // Android Specific Code
  instance.backgroundColor = "#111111";
  instance.activity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;
    var menuItem = menu.add({title:"Refresh"});
    menuItem.addEventListener("click", function(e) {
      Ti.App.fireEvent('events.update');
    });
  };

  var scheduleData = getEventData();
  scheduleTableView = Ti.UI.createTableView({
    data:scheduleData,
    separatorColor: '#eeeeee',
    backgroundColor: '#eeeeee'
  });
  scheduleTableView.addEventListener('click', function(x) {
    //Ti.API.info("x = "+x.row.hasChild);
    if (x.row.hasChild) {
      Ti.App.fireEvent('schedule.click', {nid: x.row.nid});
    }
  });
  instance.add(scheduleTableView);
  
  instance.addEventListener('open', function(e) {
    instance.addEventListener('focus', function(f) {
      Ti.App.fireEvent('events.update');
    });
  });

  return instance;
};

Ti.App.addEventListener('schedule.updateTableView', function(x) {
  var scheduleData = getEventData();
  scheduleTableView.setData(scheduleData);
});

// Will return an array for use in a TableView
function getEventData() {
  var events = globals.dbGetEvents();
  var x;
  var data = [];
  var header = '';
  var currentDay = '';
  var currentSection = '';
  var row = '';
  var time, room, title, topView, bottomView, timeLabel, roomLabel, titleLabel;
  for (x in events) {
    //Ti.API.info(x);
    currentDay = events[x].day;
    time = globals.secondsToTime(events[x].datefrom) + "-" + 
           globals.secondsToTime(events[x].dateto);
    room = events[x].room;
    title = globals.html_decode(events[x].title);
    row = Ti.UI.createTableViewRow({
      height: "60dp",
      backgroundColor: '#eeeeee',
      layout: 'absolute'
    });
    if (events[x].eventtype == 'Workshop') {
      row.hasChild = true;
    }
    timeLabel = Ti.UI.createLabel({
      text: time,
      color: '#273a51',
      top: "5dp",
      left: "25dp",
      font: {fontWeight: 'bold', fontSize: "10dp"},
      height: 'auto',
      width: 'auto'
    });
    roomLabel = Ti.UI.createLabel({
      text: room,
      color: '#20607c',
      top: "5dp",
      width: 'auto',
      height: 'auto',
      right: "25dp",
      font: {fontWeight: 'bold', fontSize: "10dp"}
    });
    titleLabel = Ti.UI.createLabel({
      text: title,
      color: '#515151',
      top: "25dp",
      left: "25dp",
      width: "80%",
      height: 'auto',
      font: {fontFamily: 'Times New Roman', fontSize: "16dp"}
    });
    row.add(Ti.UI.createView({
      top: 0,
      left: 0,
      height: "1dp",
      backgroundColor: '#e0e0e0',
      width: "100%"
    }));
    row.add(timeLabel);
    row.add(roomLabel);
    row.add(titleLabel);

    row.nid = events[x].nid;
    
    if (header == currentDay) {
      currentSection.add(row);
    } else {
      if (currentSection != '') {
        data.push(currentSection);
      }
      var timestamp = globals.strtotime(currentDay) + 25212;
      var formattedDay = globals.date('l, F j', timestamp);
      var headerView = Ti.UI.createView({
        backgroundColor: '#eeeeee',
        height: "30dp",
        width: 'auto'
      });
      var headerLabel = Ti.UI.createLabel({
        text: formattedDay,
        color: '#20607c',
        font: {fontSize: "18dp", fontWeight: 'bold'},
        left: "25dp"
      });
      headerView.add(headerLabel);
      var footerView = Ti.UI.createView({
        height: "16dp",
        backgroundColor: '#eeeeee'
      });
      if (globals.osname === "android") {
        currentSection = Ti.UI.createTableViewSection({
          headerTitle: formattedDay,
          footerView: footerView
        });
      } else {
        currentSection = Ti.UI.createTableViewSection({
          headerView: headerView,
          footerView: footerView
        });
      }
      currentSection.add(row);
    }
    header = currentDay;
  }
  // Push the last section into the data array
  data.push(currentSection);
  return data;
}

exports.getMainScheduleData = function() {
  return getEventData();
};

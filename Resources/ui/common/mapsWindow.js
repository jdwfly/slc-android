var globals = require('lib/globals');
exports.mapsWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Maps',
    backgroundColor: '#eeeeee'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  
  var tableView = exports.mapsTableView();
  
  tableView.addEventListener('click', function(f) {
    Ti.App.fireEvent('map.click', {
      arg: f.rowData.arg,
      title: f.rowData.title,
      callback: false
    });
  });
  instance.add(tableView);
  
  return instance;
};

// Creates the Table View for the Maps Window/Views
exports.mapsTableView = function() {
  var instance = '';
  var dataHasChild = true;
  
  var data = [
    {title: "Auditorium Seating", color: '#515151', hasChild:dataHasChild, winClass:'../pages/staticpage.js', arg: 'seating.html'},
    {title: "Campus", color: '#515151', hasChild:dataHasChild, winClass:'../pages/staticpage.js', arg: 'campus.html'},
    {title: "Nursery", color: '#515151', hasChild:dataHasChild, winClass:'../pages/staticpage.js', arg: 'nursery.html'},
    {title: "Revels Floor 1", color: '#515151', hasChild:dataHasChild, winClass:'../pages/staticpage.js', arg: 'revels1.html'},
    {title: "Revels Floor 2", color: '#515151', hasChild:dataHasChild, winClass:'../pages/staticpage.js', arg: 'revels2.html'},
    {title: "Revels Floor 3", color: '#515151', hasChild:dataHasChild, winClass:'../pages/staticpage.js', arg: 'revels3.html'},
    {title: "West Wing Floor 1", color: "#515151", hasChild:dataHasChild, winClass:'../pages/staticpages.js', arg: 'ww1.html'},
    {title: "West Wing Floor 2", color: "#515151", hasChild:dataHasChild, winClass:'../pages/staticpages.js', arg: 'ww2.html'}
  ];

  instance = Ti.UI.createTableView({data:data, backgroundColor: 'transparent'});

  return instance;
};

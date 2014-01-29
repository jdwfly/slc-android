var g = require('lib/globals');
var tableView = '';
var data = [];
var index = [];

exports.window = function() {
  var instance = Ti.UI.createWindow({
    title: 'Sessions',
    backgroundColor: '#eeeeee'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  
  // iPhone Specific Code
  if (g.osname === 'iphone' || g.osname === 'ipad') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('events.update', {prune: true});
    });
    instance.rightNavButton = refresh;
  }
  
  var search = Ti.UI.createSearchBar({
    showCancel: true
  });
  search.addEventListener('change', function(e) {
    e.value;
  });
  search.addEventListener('return', function(e) {
    search.blur();
  });
  search.addEventListener('cancel', function(e) {
    search.blur();
  });
  tableView = Ti.UI.createTableView({
    data: getSessionData(),
    search: search,
    searchHidden: false,
    filterAttribute: 'searchTerm'
  });
  /**
  tableView.data = getSessionData();
  tableView.search = search;
  tableView.searchHidden = false;
  tableView.filterAttribute = 'searchTerm';
  //tableView.index = index;
  */
  instance.add(tableView);
  
  instance.addEventListener('open', function(e) {
    instance.addEventListener('focus', function(f) {
      Ti.App.fireEvent('events.update');
    });
  });
  instance.addEventListener('click', function(e) {
    Ti.App.fireEvent('session.click', {nid: e.row.node.nid});
  });
  
  return instance;
};

Ti.App.addEventListener('sessions.updateTableView', function(e) {
  var sessionData = getSessionData();
  tableView.setData(sessionData);
});

function getSessionData() {
  var events = g.slcdbGetSessions(),
      data = [],
      row = '',
      title = '';
  for (var i = 0, node; node = events[i]; i++) {
    // no download, dont show
    if (node.download == 'None') continue;
    title = g.html_decode(node.title);
    speaker = node.speaker;
    room = node.room;
    category = g.html_decode(node.track);
    row = Ti.UI.createTableViewRow({
      backgroundColor: '#eeeeee',
      layout: 'absolute',
      height: 78,
      searchTerm: title + ' ' + speaker + ' ' + category,
      hasChild: true
    });
    row.node = node;
    
    textView = Ti.UI.createView({
      top: 5,
      left: 15,
      width: 'auto',
      height: 'auto',
      layout: 'vertical'
    });
    
    titleLabel = Ti.UI.createLabel({
      text: title,
      color: '#273a51',
      font: {fontWeight: 'bold'},
      left: 0
    });
    textView.add(titleLabel);
    
    speakerLabel = Ti.UI.createLabel({
      text: speaker,
      color: '#4d73a0',
      font: {fontSize: 12},
      left: 0
    });
    textView.add(speakerLabel);
    
    categoryLabel = Ti.UI.createLabel({
      text: category,
      color: '#515151',
      font: {fontSize: 12, fontStyle: 'italic'},
      left: 0
    });
    textView.add(categoryLabel);
    
    row.add(textView);
    /*
     TODO iOS 7 has a line so this can be removed
    row.add(Ti.UI.createView({
      bottom: 0,
      width: "90%",
      height: 1,
      backgroundColor: '#e0e0e0'
    }));
    */
    data.push(row);
   
  }
  return data;
}

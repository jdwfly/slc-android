var globals = require('lib/globals');
exports.mainTabView = function() {
  var instance = Ti.UI.createTabGroup();
  var apiLevel = Ti.Platform.Android.API_LEVEL, 
      activity;
  /*
  // Not Used after conference
  var scheduleWindow = require('ui/common/scheduleWindow').scheduleWindow;
  var scheduleTab = Ti.UI.createTab({  
    icon: 'data/11-clock.png',
    title: 'Schedule',
    window: new scheduleWindow()
  });
  instance.addTab(scheduleTab);
  */
  var sessionWindow = require('ui/common/sessionWindow').window;
  var sessionTab = Ti.UI.createTab({
    title: 'Sessions',
    window: new sessionWindow()
  });
  instance.addTab(sessionTab);

  var mapsWindow = require('ui/common/mapsWindow').mapsWindow;
  var mapsTab = Ti.UI.createTab({
    title: 'Maps',
    window: new mapsWindow()
  });
  instance.addTab(mapsTab);
  
  var newsWindow = require('ui/common/newsWindow').newsWindow;
  var newsTab = Ti.UI.createTab({
    title: 'Videos',
    window: new newsWindow()
  });
  instance.addTab(newsTab);
  
  /*
  Until the conference is closer this tab will be disabled.
  var speakersWindow = require('ui/common/speakersWindow').speakersWindow;
  var speakersTab = Ti.UI.createTab({
    title: 'Speakers',
    window: new speakersWindow()
  });
  instance.addTab(speakersTab);
  */
  
  if (globals.osname === 'android' && Ti.Platform.Android.API_LEVEL >= 14) {
    var liveWindow = require('ui/common/liveWindow').liveWindow;
    var liveTab = Ti.UI.createTab({
      title: 'Live',
      window: new liveWindow()
    });
    instance.addTab(liveTab);
  }

  instance.addEventListener('focus', function(e) {
    activity.invalidateOptionsMenu();
  });
  
  instance.addEventListener('open', function(args) {
    activity = instance.getActivity();
    if (apiLevel >= 11) {
      actionBar = activity.actionBar;
      actionBar.setIcon(null);
      actionBar.setTitle('SLC');
    }
    else {
      activity.onPrepareOptionsMenu = function(e) {
        createOptionsMenu(e);
      };
    }
    activity.onCreateOptionsMenu = function(e) {
      createOptionsMenu(e);
    };
    activity.invalidateOptionsMenu();
  });
  
  function createOptionsMenu(e) {
    var menu = e.menu;
    menu.clear();
    switch (instance.activeTab.title) {
      case 'Sessions':
        var menuItemSessions = menu.add({
          title: 'Refresh',
          showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
        });
        menuItemSessions.addEventListener('click', function(args){
          Ti.App.fireEvent('events.update');
        });
        break;
      case 'Maps':
        // No menu needed for Maps
        break;
      case 'Videos':
        var menuItemVideos = menu.add({
          title: 'Refresh',
          showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
        });
        menuItemVideos.addEventListener('click', function(args){
          Ti.App.fireEvent('news.updateTableViewData');
        });
        break;
      case 'Speakers':
        var menuItemSpeakers = menu.add({
          title: 'Refresh',
          showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
        });
        menuItemSpeakers.addEventListener('click', function(args){
          Ti.App.fireEvent('speakers.update', {callback: updateSpeakerData, prune: true});
        });
        break;
      case 'Live':
        // TODO : needs menu to refresh but only during conference.
        break;
    }
  }
  
  return instance;
};

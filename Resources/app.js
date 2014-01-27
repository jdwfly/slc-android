// GLOBAL VARS
var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;

// Initialize and Configure Flurry Analytics
var flurry = require('sg.flurry');
flurry.setContinueSessionMillis(10000);
flurry.setReportLocation(true);
flurry.setUseHttps(true);
flurry.setCaptureUncaughtExceptions(true);
flurry.onStartSession('KY6S957MMTP2NVBXXD8B');
flurry.onEndSession();


var MainTabView;
MainTabView = require('/ui/common/mainTabView').mainTabView;

// If there are no sessions, populate the database
var result = globals.dbGetEvents();
if (result.length == 0) {
  Ti.API.info("About to create events");
  Ti.App.fireEvent('events.update', {prune: true});
}
mainTabView = new MainTabView();

mainTabView.open();

// Global Event Listeners

/*
 * Logs when a session is played to Flurry
 */
Ti.App.addEventListener('play.click', function(args) {
  flurry.logEvent('Session Play', {
    title: args.title,
    speaker: args.speaker,
    track: args.track
  });
});

/*
 * Updates the event data in the db
 */
Ti.App.addEventListener('events.update', function(args){
  if (Ti.Network.online) {
    var events_xhr = new HTTPClientWithCache({
      baseUrl: globals.baseUrl,
      retryCount: 2,
      cacheSeconds: 300,
      onload: function(response) {
        //Ti.API.info("Response Data: "+ response.responseText);
        //Ti.API.info("Is this cached data?: " + response.cached);
        globals.slcdbSaveEvents(response.responseText);
        if (typeof args.callback === 'function') {
          args.callback;
        }
      }
    });
    if (args.prune) {
      events_xhr.prune_cache(0);
    }
    events_xhr.post({url: globals.eventsUrl});
  } else {
    // Maybe this should fail silently with just a log message
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the schedule data.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
});

Ti.App.addEventListener('speakers.update', function(args){
  if (Ti.Network.online) {
    var speakers_xhr = new HTTPClientWithCache({
      baseUrl: globals.baseUrl,
      retryCount: 2,
      cacheSeconds: 300,
      onload: function(response) {
        //Ti.API.info("Response Data: "+ response.responseText);
        //Ti.API.info("Is this cached data?: " + response.cached);
        globals.setSpeakerData(response.responseText);
        Ti.App.fireEvent('speakers.updateTableView');
        if (typeof args.callback === 'function') {
          args.callback;
        }
      }
    });
    if (args.prune) {
      speakers_xhr.prune_cache(0);
    }
    speakers_xhr.post({url: globals.speakersUrl});
  } else {
    // Maybe this should fail silently with just a log message
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the speakers data.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
});

Ti.App.addEventListener('schedule.click', function(opts) {
  var winClass = require('ui/common/workshopWindow').workshopWindow;
  var nodeData = globals.dbGetWorkshopEvents(opts.nid);
  var workshop = globals.dbGetSingleEvent(opts.nid);
  var args = {
    workshop: workshop,
    nodes: nodeData
  };
  var scheduleFirstWin = new winClass(args);
  mainTabView.activeTab.open(scheduleFirstWin, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    opts.callback();
  }
});

Ti.App.addEventListener('session.click', function(opts) {
  var winClass = require('ui/common/sessionDetailWindow').window;
  var nodeData = globals.dbGetSingleEvent(opts.nid);
  var args = {node: nodeData[0]};
  var audioPlayerWin = new winClass(args);
  mainTabView.activeTab.open(audioPlayerWin, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    opts.callback();
  }
});

// TODO: Remove this code, no longer needed.
Ti.App.addEventListener('day.click', function(opts){
  var winClass = require('ui/common/workshopWindow').workshopWindow;
  var workshopWin = new winClass(opts);
  mainTabView.activeTab.open(workshopWin, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
});

Ti.App.addEventListener('map.click', function(opts) {
  var winClass = require('ui/common/staticPageWindow').staticPageWindow;
  var mapDetailWindow = new winClass(opts);
  /**
  if (globals.osname === "ipad") {
    Ti.App.fireEvent('detailView.change', {
      requirejs: 'ui/common/staticPageWindow',
      classname: 'staticPageWindow',
      args: opts
    });
  } else {
    Ti.API._activeTab.open(mapDetailWindow, {animated: true});
  }
  */
  mainTabView.activeTab.open(mapDetailWindow, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
});

Ti.App.addEventListener('speakers.click', function(opts) {
  var winClass = require('ui/common/speakerDetailWindow').speakerDetailWindow;
  var speakerDetailWindow = new winClass(opts);
  mainTabView.activeTab.open(speakerDetailWindow, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
});

Ti.App.addEventListener('live.click', function() {
  if (Ti.Network.online) {
    var winClass = require('ui/iphon/livePlayerWindow').livePlayerWindow;
    var livePlayerWindow = new winClass();
    flurry.logEvent('Livestream Play');
    mainTabView.activeTab.open(livePlayerWindow, {animated: true});
  } else {
    var dialog = Ti.UI.createAlertDialog({
      title: 'Oh noes!',
      message: 'You must be online in order to access our live stream events.',
      ok: 'Okay'
    }).show();
  }
});
Ti.App.addEventListener('live.update', function(args) {
  if (Ti.Network.online) {
    var live_xhr = new HTTPClientWithCache({
      baseUrl: globals.baseUrl,
      retryCount: 2,
      cacheSeconds: 300,
      onload: function(response) {
        //Ti.API.info("Response Data: "+ response.responseText);
        //Ti.API.info("Is this cached data?: " + response.cached);
        globals.setLiveData(response.responseText);
        Ti.App.fireEvent('live.updateTableView');
        if (typeof args.callback === 'function') {
          args.callback;
        }
      }
    });
    if (args.prune) {
      live_xhr.prune_cache(0);
    }
    live_xhr.post({url: globals.liveUrl});
  } else {
    var dialog = Ti.UI.createAlertDialog({
      title: 'Oh noes!',
      message: 'You must be online in order to update the live stream event feed.',
      ok: 'Okay'
    }).show();
  }
});

Ti.App.addEventListener('photos.click', function(opts) {
  var winClass = require('ui/common/photosDetailWindow').photosDetailWindow;
  var photoDetailWindow = new winClass(opts);
  if (globals.osname != 'android') photoDetailWindow.hideTabBar();
  Ti.API._activeTab.open(photoDetailWindow, {animated: true});
  if (typeof opts.callback === 'function') {
    callback();
  }
});

// Audio Player init - Not sure where else to do this
var audioPlayer = Ti.Media.createAudioPlayer({
  allowBackground: true
});
var nowPlaying = {};

Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;

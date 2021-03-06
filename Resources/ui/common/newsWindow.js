var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;
var newsTableView = '',
    navBar = '',
    tableData = [];

exports.newsWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Videos',
    backgroundColor: '#eeeeee'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];

  newsTableView = Ti.UI.createTableView({
    data: tableData,
    separatorColor: '#eeeeee',
    backgroundColor: '#eeeeee'
  });
  instance.add(newsTableView);
  
  // Load table data when window is focused
  instance.addEventListener('focus', function(x) {
    Ti.App.fireEvent('news.updateTableViewData');
  });
  
  return instance;
};

Ti.App.addEventListener('news.updateTableViewData', function(x) {
  getVideoData();
});

Ti.App.addEventListener('news.setTableViewData', function(x) {
  newsTableView.setData(x.data);
});

function getVideoData() {
  if (Ti.Network.online){
    var videos_xhr = new HTTPClientWithCache({
      baseUrl: 'http://slconference.com/app/1/',
      retryCount: 2,
      cacheSeconds: 30,
      onload: function(response) {
        var videos = JSON.parse(response.responseText);
        var tdata = [], row, thumb, title;
        for (var c in videos.nodes) {
          row = Ti.UI.createTableViewRow({
            backgroundColor: '#eeeeee',
            layout: 'vertical'
          });
          thumb = Ti.UI.createImageView({
            image: videos.nodes[c].node.image,
            width: '280dp',
            height: '135dp',
            top: '10dp'
          });
          row.add(thumb);
          title = Ti.UI.createLabel({
            text: videos.nodes[c].node.title,
            width: '280dp',
            height: 'auto',
            font: {fontSize: '14dp'}
          });
          row.add(title);
          
          row.vimeo = videos.nodes[c].node.vimeo;
          
          row.addEventListener('click', function(s) {
            if (s.row.vimeo != undefined) {
              Ti.Platform.openURL('http://vimeo.com/' + s.row.vimeo);
            }
          });
          
          tdata.push(row);
        }        
        
        if (newsTableView != undefined) {
          newsTableView.setData(tdata);
        }
      }
    });
    videos_xhr.post({url: 'videos'});
  } else {
    alertUserWhenOffline();
  }
}

exports.getNewsVideoData = function() {
  return getVideoData();
};

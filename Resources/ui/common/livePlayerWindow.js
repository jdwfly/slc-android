exports.livePlayerWindow = function() {
  var instance = Ti.UI.createWindow({});
  
  instance.addEventListener('android:back', function(e) {
    this.close();
  });
  
  var webview = Ti.UI.createWebView({
    url: 'http://new.livestream.com/accounts/7973191/events/2929816/player?width=960&height=540&autoPlay=true&mute=false',
    softKeyboardOnFocus: Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS,
    enableZoomControls: false
  });
  instance.add(webview);
  
  return instance;
};

var globals = require('lib/globals');
exports.staticPageWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.title,
    backgroundColor: '#eeeeee'
  });
  
  var webView = Ti.UI.createWebView({
    url: '/ui/static/' + opts.arg,
    softKeyboardOnFocus: Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
  });
  instance.add(webView);
  
  instance.addEventListener('android:back', function(e) {
    this.close();
  });
  
  instance.addEventListener('open', function(e) {
    Ti.UI.Android.hideSoftKeyboard();
  });
  
  return instance;
};

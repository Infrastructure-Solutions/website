Foundation.utils.S(document).ready(function(){
  //Authorization popup window code
  Foundation.utils.S.oauthGH = function(options){
    options.windowName = options.windowName ||  'ConnectWithOAuth'; // should not include space for IE
    options.windowOptions = options.windowOptions || 'location=0,status=0,width=800,height=400';
    options.callback = options.callback || function(){ window.location.reload(); };
    var that = this;
    that._oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
    that._oauthInterval = window.setInterval(function(){
      var $link = "";
      if (that._oauthWindow.location.href)
        $link = that._oauthWindow.location.href;
      if($link.indexOf(options.redirectUrl) > -1){
         options.callback(that._oauthWindow);
         that._oauthWindow.close();
         clearInterval(that._oauthInterval);
        }
    }, 1000);
  };

});
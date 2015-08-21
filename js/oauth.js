Foundation.utils.S(document).ready(function(){
  //Authorization popup window code
  Foundation.utils.S.oauthGH = function(options){
    options.windowName = options.windowName ||  'ConnectWithOAuth'; // should not include space for IE
    options.windowOptions = options.windowOptions || 'location=0,status=0,width=800,height=400';
    options.callback = options.callback || function(){ window.location.reload(); };
    var that = this;
    that._oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
    that._oauthInterval = window.setInterval(function(){
      if(that._oauthWindow.location.href.includes("github/github_oauth_cb"))
         options.callback(that._oauthWindow);
         that._oauthWindow.close();
         clearInterval(that._oauthInterval);
    }, 1000);
  };

});
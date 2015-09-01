Foundation.utils.S(document).foundation({
   joyride: {
      cookieMonster: true,
      cookieName: 'JoyRide',
      cookieDomain: true,
      cookie_expires: 5
   }
 }).foundation('joyride', 'start').ready(function(){

  var configurationJSON = ''+
    '{ "server_provider" : [' +
      '{ "slug":"amazon_web_services", "name":"Amazon Web Services" },' +
      '{ "slug":"digital_ocean", "name":"Digital Ocean" },' +
      '{ "slug":"google_cloud", "name":"Google Cloud" },' +
      '{ "slug":"none", "name":"None" }' +
      ' ]' +
    '},'+
    '{ "distribution" : [' +
      '{ "slug":"ubuntu", "name":"Ubuntu" },' +
      '{ "slug":"freebsd", "name":"FreeBSD" },' +
      '{ "slug":"fedora", "name":"Fedora" },' +
      '{ "slug":"debian", "name":"Debian" },' +
      '{ "slug":"coreos", "name":"CoreOS" },' +
      '{ "slug":"centos", "name":"CentOS" }' +
      ' ]' +
    '},'+
    '{ "service" : [' +
      '{ "slug":"amazon_web_services", "name":"Amazon Web Services" },' +
      '{ "slug":"digital_ocean", "name":"Digital Ocean" },' +
      '{ "slug":"google_cloud", "name":"Google Cloud" },' +
      '{ "slug":"none", "name":"None" }' +
      ' ]' +
    '}';

  var $list_automation_software = ["Puppet","Ansible","Chef"];
  var $list_server_provider = ["Amazon Web Services","Digital Ocean","Google Cloud","None"];
  var $list_distribution = ["Ubuntu",  "FreeBSD",  "Fedora",  "Debian",  "CoreOS", "CentOS"];
  var $list_aplication = ["freeBSDAMP",   "LAMP",   "LEMP",   "MEAN",   "Joomla",   "Drone",   "Ghost",   "Rails",  "Drupal",   "MongoDB",   "Node",   "Cassandra",   "Stack",   "Django",   "Docker",   "Magento",   "GitLab",   "MumbleServer",   "MediaWiki",   "WordPress", "OwnCloud",   "Dokku",   "PHPMyAdmin",   "Redmine", "None"];
  var $list_packages = ["Sinatra",   "Ruby",   "Haskell",   "Emacs",   "VIM"];
  var $user_keys = [];

  var $project_name = "";
  var $active_user_repo = "";
  var $active_user_keys = [];
  var $active_automation_software = 0;
  var $active_server_provider = 1;
  var $active_distribution = 3;
  var $active_distribution_version = "";
  var $active_aplication = 24;
  var $active_packages = [0, 3];
  
  var changeBtnValue = function(value,text){
    value.text(text);
  }
  
  var changeActive = function(value){
    if( !value.hasClass("active") )
      value.addClass("active");
    else
      value.removeClass("active");
  }
  
  var createAlertBox = function(text, type){
    Foundation.utils.S('.alertBox').html('<div class="large-4 large-offset-8 columns">'+
                                            '<div data-alert class="alert-box '+ type +' radius">'+
                                               text +
                                              '<a href="#" class="close">&times;</a>'+
                                            '</div>'+
                                          '</div>');
    Foundation.utils.S(document).foundation('alert', 'reflow');
    setTimeout(function () {
        Foundation.utils.S(".alert-box a.close").trigger("click.fndtn.alert");
      }, 2000);
  }
  
  var modifyClass = function(value,active,className){
    if( active )
      value.addClass(className);
    else
      value.removeClass(className);
  }
  
  var updateServiceConection = function(){
    if (getCookie("userData_github")!= ""){
      changeBtnValue(Foundation.utils.S('.btn-connect[data-type="github"]'),"Disconnect");
      modifyClass(Foundation.utils.S('.btn-connect[data-type="github"]').parent().parent(),true,"active");
      modifyClass(Foundation.utils.S('.btn-connect[data-type="github"]'),true,"alert");
      modifyClass(Foundation.utils.S('.btn-config[data-type="github"]'),false,"hide");
    }else{
      changeBtnValue(Foundation.utils.S('.btn-connect[data-type="github"]'),"Connect");
      modifyClass(Foundation.utils.S('.btn-connect[data-type="github"]').parent().parent(),false,"active");
      modifyClass(Foundation.utils.S('.btn-connect[data-type="github"]'),false,"alert");
      modifyClass(Foundation.utils.S('.btn-config[data-type="github"]'),true,"hide");
    }
    if (getCookie("userData_digitalocean")!= ""){
      changeBtnValue(Foundation.utils.S('.btn-connect[data-type="digital-ocean"]'),"Disconnect");
      modifyClass(Foundation.utils.S('.btn-connect[data-type="digital-ocean"]').parent().parent(),true,"active");
      modifyClass(Foundation.utils.S('.btn-connect[data-type="digital-ocean"]'),true,"alert");
    }else{
      changeBtnValue(Foundation.utils.S('.btn-connect[data-type="digital-ocean"]'),"Connect");
      modifyClass(Foundation.utils.S('.btn-connect[data-type="digital-ocean"]').parent().parent(),false,"active");
      modifyClass(Foundation.utils.S('.btn-connect[data-type="digital-ocean"]'),false,"alert");
    }
  }
  
  var showUserRepos = function(){
    jQuery.ajax({
     url: '/github/user/'+jQuery.parseJSON(getCookie("userData_github")).Username+'/repos',
     type: "GET",
     beforeSend: function(xhr){xhr.setRequestHeader('token', jQuery.parseJSON(getCookie("userData_github")).AccessToken);},
     success: function(data) { 
        setCookie("userData_github_user_repos",data,5);
        var repoList = "";
        $.each(data, function(key, value){
            repoList += '<div class="switch round large"><input type="radio" name="user-repo" value="'+value.full_name+'" id="'+key+'" '+ ($active_user_repo == value.full_name && 'checked="checked"') + '><label for="'+key+'"><span class="switch-on">ON</span><span class="switch-off">OFF</span><span class="switch-label">'+value.full_name+'</span></label></div>';
        });
        Foundation.utils.S('#modalPopUp').html('<h2 id="firstModalTitle">Your Repositories.</h2>'+
                            '<form><div class="large-10 columns end">'+
                              '<p>Select the Repository to be provisioned</p>'+
                              repoList+
                            '</div>'+
                            '<a class="close-reveal-modal" aria-label="Close">&#215;</a></form>');
        Foundation.utils.S(document).foundation('switch', 'reflow');
        $('#modalPopUp').foundation('reveal','open');
     }
   });
  }
  
  var updatePublicKeys = function(){
    var $temp_user_keys = "";
    $user_keys = [];
    $.each(JSON.parse(getCookie("userData_publickKeys")), function(index, item){
      $user_keys.push(item[0], item[1]);
      if (index === JSON.parse(getCookie("userData_publickKeys")).length - 1) {
        $temp_user_keys += '<div class="large-3 medium-6 small-12 columns end">'+
          '<ul class="pricing-table" data-name="'+ item[0] +'" data-type="public_keys" data-id="'+ index +'">'+
            '<li class="bullet-item">'+ item[0] +'</li>'+
          '</ul>'+
        '</div>';
      }else{
        $temp_user_keys += '<div class="large-3 medium-6 small-12 columns">'+
          '<ul class="pricing-table" data-name="'+ item[0] +'" data-type="public_keys" data-id="'+ index +'">'+
            '<li class="bullet-item">'+ item[0] +'</li>'+
          '</ul>'+
        '</div>';
      }
    });
    Foundation.utils.S("#ssh_keys").html($temp_user_keys);
  }

  Foundation.utils.S("#label-automation-software").text($list_automation_software[$active_automation_software]);
  Foundation.utils.S("#label-server-provider").text($list_server_provider[$active_server_provider]);
  Foundation.utils.S("#label-distribution").text($list_distribution[$active_distribution]+" "+Foundation.utils.S('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"] select').val());
  Foundation.utils.S("#label-aplications").text($list_aplication[$active_aplication]);
  Foundation.utils.S("#label-packages").text("");
  $active_distribution_version = Foundation.utils.S('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"] select').val();
  $active_user_repo = getCookie("active_user_repo");
  $active_packages.forEach(function(id){
      Foundation.utils.S("#label-packages").append($list_packages[id]+"</br>");
  });
  if($active_packages.length==0)
    Foundation.utils.S("#label-packages").append("none");
  updateServiceConection();
  updatePublicKeys();

  Foundation.utils.S(document.body).on('click', '#show_ssh_key', function(){
    modifyClass(Foundation.utils.S('.ssh_key_content'),false,"hide");
    Foundation.utils.S('#show_ssh_key').css("opacity","0.2");
  });
  
  Foundation.utils.S(document.body).on('click', '#hide_ssh_key', function(){
    modifyClass(Foundation.utils.S('.ssh_key_content'),true,"hide");
    Foundation.utils.S('#show_ssh_key').css("opacity","1");
  });
  
  Foundation.utils.S(document.body).on('click', '#save_ssh_key', function(){
    if ( Foundation.utils.S('#ssh_key_content_value').val() != "" && Foundation.utils.S('#ssh_key_content_title').val()!= "" ){
      $user_keys.push([Foundation.utils.S('#ssh_key_content_title').val(), Foundation.utils.S('#ssh_key_content_value').val()]);
      setCookie("userData_publickKeys", JSON.stringify($user_keys),5);
      Foundation.utils.S('#ssh_key_content_value').val("");
      Foundation.utils.S('#ssh_key_content_title').val("");
      modifyClass(Foundation.utils.S('.ssh_key_content'),true,"hide");
      modifyClass(Foundation.utils.S('#ssh_key_content_title_error'),true,"hide");
      modifyClass(Foundation.utils.S('#ssh_key_content_value_error'),true,"hide");
      Foundation.utils.S('#ssh_key_content_value').css("margin-bottom","1em");
      Foundation.utils.S('#show_ssh_key').css("opacity","1");
      updatePublicKeys();
    }else{
      if ( Foundation.utils.S('#ssh_key_content_value').val()== "" ){
        modifyClass(Foundation.utils.S('#ssh_key_content_value_error'),false,"hide");
        Foundation.utils.S('#ssh_key_content_value').css("margin-bottom","0");
      }else{
        modifyClass(Foundation.utils.S('#ssh_key_content_value_error'),true,"hide");
        Foundation.utils.S('#ssh_key_content_value').css("margin-bottom","1em");
      }
      if ( Foundation.utils.S('#ssh_key_content_title').val()== "" ){
        modifyClass(Foundation.utils.S('#ssh_key_content_title_error'),false,"hide");
      }else{
        modifyClass(Foundation.utils.S('#ssh_key_content_title_error'),true,"hide");
      }
    }
  });

  Foundation.utils.S(document.body).on('click', '.pricing-table', function(){
    selectActive(Foundation.utils.S(this));
  });
  
  Foundation.utils.S(document.body).on('click', '.btn-connect', function(){
    if( Foundation.utils.S(this).data('type') == "github" ){
      if (getCookie("userData_github")!= ""){
        setCookie("userData_github","",5);
        setCookie("active_user_repo","",5);
        $active_user_repo = "";
      }else{
        connectService(Foundation.utils.S(this));
      }
    }else if( Foundation.utils.S(this).data('type') == "digital-ocean" ){
      if (getCookie("userData_digitalocean")!= ""){
        setCookie("userData_digitalocean","",5);
      }else{
        connectService(Foundation.utils.S(this));
      }
    }
    updateServiceConection();
  });
  
  Foundation.utils.S(document.body).on('change', 'input[name="user-repo"]', function(){
    $active_user_repo = Foundation.utils.S(this).val();
    setCookie("active_user_repo",$active_user_repo);
    createAlertBox($active_user_repo+' User Repo Selected','success');
  });
  
  Foundation.utils.S(document.body).on('click', '.btn-config', function(){    
    if( Foundation.utils.S(this).data('type') == "github" ){
      if (getCookie("userData_github")!= ""){
        showUserRepos();
      }else{
      }
    }else if( Foundation.utils.S(this).data('type') == "digital-ocean" ){
      if (getCookie("userData_digitalocean")!= ""){
      }else{
      }
    }
  });
  
  Foundation.utils.S(document.body).on('click', '#btn-create_service', function(){
    if( $active_packages.length > 0 && $project_name != "" ){
      if( $active_user_repo == "" ){
        createAlertBox('Select User Repo','warning');
      }else{
        $user_object = new User($list_server_provider[$active_server_provider], JSON.parse(getCookie("userData_digitalocean")).info.name, "github.com", JSON.parse(getCookie("userData_github")).Username);
        $server_object = new Server($project_name.split('.')[0],$project_name.split('.')[1], $list_automation_software[$active_automation_software], $list_distribution[$active_distribution], $active_distribution_version, $list_aplication[$active_aplication], "latest", null);
        $.each($active_packages, function(index, value){
            $server_object.addPackage($list_packages[value], "lastest", null);
        });
        $.each($active_user_keys, function(index){
          $user_object.addPublicKey(JSON.parse(getCookie("userData_publickKeys"))[index][0], JSON.parse(getCookie("userData_publickKeys"))[index][1]);
        });
        $data_object = new Data($user_object, $server_object);
      }
    }
  });

  Foundation.utils.S(document.body).on('change', '.pricing-table[data-type="distribution"] li select', function(){
    Foundation.utils.S("#label-distribution").text($list_distribution[$active_distribution]+" "+Foundation.utils.S('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"] select').val());
    $active_distribution_version = Foundation.utils.S('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"] select').val();
  });

  var connectService = function(value){
    if( value.data('type') == "github" ){
      Foundation.utils.S.oauthGH({
          path: '/github/login',
          redirectUrl: 'github/github_oauth_cb',
          callback: function(data)
          {
              setCookie("userData_github",data.document.body.getElementsByTagName("pre")[0].innerHTML,5);
              createAlertBox('Success GitHub Logging.','success');
              updateServiceConection();
              showUserRepos();
          }
      });
    }else if( value.data('type') == "digital-ocean" ){
      Foundation.utils.S.oauthGH({
          path: '/digitalocean/',
          redirectUrl: 'digitalocean/do_callback',
          callback: function(data)
          {
              setCookie("userData_digitalocean",data.document.body.getElementsByTagName("pre")[0].innerHTML,5);
              createAlertBox('Success Digital Ocean Logging.','success');
              updateServiceConection();
          }
      });
    }
  }
  
  var selectActive = function(value){
    if( value.data('type') == "automation-software" ){
      if( value.data('id') != $active_automation_software ){
        Foundation.utils.S('.pricing-table[data-type="automation-software"][data-id="'+ $active_automation_software +'"]').removeClass('active');
        changeActive(value);
        $active_automation_software = value.data('id');
      }
      Foundation.utils.S("#label-automation-software").text($list_automation_software[$active_automation_software]);
    }else if( value.data('type') == "server-provider" ){
      if( value.data('id') != $active_server_provider ){
        Foundation.utils.S('.pricing-table[data-type="server-provider"][data-id="'+ $active_server_provider +'"]').removeClass('active');
        changeActive(value);
        $active_server_provider = value.data('id');
      }
      Foundation.utils.S("#label-server-provider").text($list_server_provider[$active_server_provider]);
    }else if( value.data('type') == "distribution" ){
      if( value.data('id') != $active_distribution ){
        Foundation.utils.S('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"]').removeClass('active');
        changeActive(value);
        $active_distribution = value.data('id');
      }
      Foundation.utils.S("#label-distribution").text($list_distribution[$active_distribution]+" "+Foundation.utils.S('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"] select').val());
    }else if( value.data('type') == "aplications" ){
      if( value.data('id') != $active_aplication ){
        Foundation.utils.S('.pricing-table[data-type="aplications"][data-id="'+ $active_aplication +'"]').removeClass('active');
        changeActive(value);
        $active_aplication = value.data('id');
      }
      Foundation.utils.S("#label-aplications").text($list_aplication[$active_aplication]);
    }else if( value.data('type') == "package" ){
      if( $active_packages.indexOf(value.data('id')) != -1 ){
        $active_packages.splice($active_packages.indexOf(value.data('id')),1);
      }else{
        $active_packages.push(value.data('id'));
      }
      Foundation.utils.S("#label-packages").text("");
      $active_packages.forEach(function(id){
          Foundation.utils.S("#label-packages").append($list_packages[id]+"</br>");
      });
      if($active_packages.length==0)
        Foundation.utils.S("#label-packages").append("none");
      changeActive(value);
    }else if( value.data('type') == "public_keys" ){
      if( $active_user_keys.indexOf(value.data('id')) != -1 ){
        $active_user_keys.splice($active_user_keys.indexOf(value.data('id')),1);
      }else{
        $active_user_keys.push(value.data('id'));
      }
      Foundation.utils.S("#label-keys").text("");
      $active_user_keys.forEach(function(index){
          Foundation.utils.S("#label-keys").append(JSON.parse(getCookie("userData_publickKeys"))[index][0]+"</br>");
      });
      if($active_user_keys.length==0)
        Foundation.utils.S("#label-keys").append("none");
      changeActive(value);
    }
    validateService();
  }

  var validateService = function(){
    if( $active_packages.length > 0 && $project_name != "" ){
      Foundation.utils.S("#btn-create_service").removeClass("disabled");
    }else{
      Foundation.utils.S("#btn-create_service").addClass("disabled");
    }
  }

    Foundation.utils.S(document.body).on('input focusout', '#input-project_name', function(event){
      if( Foundation.utils.S(this).is(':invalid') ){
          if ( /^([a-z0-9]){1,15}/.test(Foundation.utils.S(this).val()) ){ //Match domain
              if ( /^([a-z0-9]){1,15}\./.test(Foundation.utils.S(this).val()) ){ //Match domain.
                  if ( /^([a-z0-9]){1,15}\.([a-z0-9]){1,15}/.test(Foundation.utils.S(this).val()) ){ //Match domain.hostname
                      Foundation.utils.S(this).val( /^([a-z0-9]){1,15}\.([a-z0-9]){1,15}/.exec(Foundation.utils.S(this).val())[0] );
                  }else{
                      Foundation.utils.S(this).val( /^([a-z0-9]){1,15}\./.exec(Foundation.utils.S(this).val())[0] );
                  }
              }else{
                  Foundation.utils.S(this).val( /^([a-z0-9]){1,15}/.exec(Foundation.utils.S(this).val())[0] );
              }
          }else{
              if ( /^([a-z0-9]){1,15}/.exec(Foundation.utils.S(this).val()) )
                Foundation.utils.S(this).val( /^([a-z0-9]){1,15}/.exec(Foundation.utils.S(this).val())[0] );
              else
                Foundation.utils.S(this).val( "" );
          }
          if(Foundation.utils.S(this).val().toString()=="")
            Foundation.utils.S("#label-project-name").text("none");
          else
            Foundation.utils.S("#label-project-name").text(Foundation.utils.S(this).val());
      }else{
        $project_name = Foundation.utils.S(this).val();
        if(Foundation.utils.S(this).val().toString()=="")
          Foundation.utils.S("#label-project-name").text("none");
        else
          Foundation.utils.S("#label-project-name").text(Foundation.utils.S(this).val());
        validateService();
      }
  });

});
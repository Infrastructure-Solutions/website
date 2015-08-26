$(document).foundation({
   joyride: {
      cookieMonster: true,
      cookieName: 'JoyRide',
      cookieDomain: false,
      cookie_expires: 5
   }
 }).foundation('joyride', 'start');

function Server_provider(id, name, image) {
    this.init();
}

Server_provider.prototype.init = function(id, name, value) {
    this.id = id;
    this.name = name;
    this.value = value;
};

function Distribution(id, name, image) {
    this.init();
}

Distribution.prototype.init = function(id, name, value) {
    this.id = id;
    this.name = name;
    this.value = value;
};

function Aplication(id, name, image) {
    this.init();
}

Aplication.prototype.init = function(id, name, value) {
    this.id = id;
    this.name = name;
    this.value = value;
};

function Service(id, name, image) {
    this.init();
}

Service.prototype.init = function(id, name, value) {
    this.id = id;
    this.name = name;
    this.value = value;
};

Foundation.utils.S(document).ready(function(){

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
  var $list_aplication = ["freeBSDAMP",   "LAMP",   "LEMP",   "MEAN",   "Joomla",   "Drone",   "Ghost",   "Rails",  "Drupal",   "MongoDB",   "Node",   "Cassandra",   "Stack",   "Django",   "Docker",   "Magento",   "GitLab",   "MumbleServer",   "MediaWiki",   "WordPress", "OwnCloud",   "Dokku",   "PHPMyAdmin",   "Redmine"];
  var $list_packages = ["Sinatra",   "Ruby",   "Haskell",   "Emacs",   "VIM"];

  var $project_name = "";
  var $active_automation_software = 0;
  var $active_server_provider = 1;
  var $active_distribution = 3;
  var $active_aplication = 7;
  var $active_packages = [0, 3];

  Foundation.utils.S("#label-automation-software").text($list_automation_software[$active_automation_software]);
  Foundation.utils.S("#label-server-provider").text($list_server_provider[$active_server_provider]);
  Foundation.utils.S("#label-distribution").text($list_distribution[$active_distribution]+" "+Foundation.utils.S('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"] select').val());
  Foundation.utils.S("#label-aplications").text($list_aplication[$active_aplication]);
  Foundation.utils.S("#label-packages").text("");
  $active_packages.forEach(function(id){
      Foundation.utils.S("#label-packages").append($list_packages[id]+"</br>");
  });
  if($active_packages.length==0)
    Foundation.utils.S("#label-packages").append("none");

  Foundation.utils.S(document.body).on('click', '.pricing-table', function(){
    selectActive(Foundation.utils.S(this));
  });
  
  Foundation.utils.S(document.body).on('click', '.btn-connect', function(){
    connectService(Foundation.utils.S(this));
  });

  Foundation.utils.S(document.body).on('change', '.pricing-table[data-type="distribution"] li select', function(){
    Foundation.utils.S("#label-distribution").text($list_distribution[$active_distribution]+" "+Foundation.utils.S('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"] select').val());
  });

  var connectService = function(value){
    if( value.data('type') == "github" ){
      Foundation.utils.S.oauthGH({
          path: '/github/login',
          redirectUrl: 'github/github_oauth_cb',
          callback: function(data)
          {
              document.cookie= "userData_github="+data.document.body.getElementsByTagName("pre")[0].innerHTML;
          }
      });
    }else if( value.data('type') == "digital-ocean" ){
      Foundation.utils.S.oauthGH({
          path: '/digitalocean/',
          redirectUrl: 'digitalocean/do_callback',
          callback: function(data)
          {
              document.cookie= "userData_digitalocean="+data.document.body.getElementsByTagName("pre")[0].innerHTML;
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
    }
    validateService();
  }

  var changeActive = function(value){
    if( !value.hasClass("active") )
      value.addClass("active");
    else
      value.removeClass("active");
  }

  var validateService = function(){
    if( $active_packages.length > 0 && $project_name != "" ){
      Foundation.utils.S("#btn-create_service").removeClass("disabled");
    }else{
      Foundation.utils.S("#btn-create_service").addClass("disabled");
    }
  }

  Foundation.utils.S(document.body).on('keyup', '#input-project_name', function(e){
    $project_name = Foundation.utils.S(this).val();
    Foundation.utils.S("#label-project-name").text(Foundation.utils.S(this).val());
    if(Foundation.utils.S(this).val().toString()=="")
      Foundation.utils.S("#label-project-name").text("none");
    validateService();
  });

});
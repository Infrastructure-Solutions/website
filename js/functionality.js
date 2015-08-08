$(document).foundation();

var $j = jQuery.noConflict();

$j(document).ready(function(){

  var $active_server_provider = 1;
  var $active_distribution = 1;
  var $active_aplication = 8;
  var $active_services = [2, 5];

  $j(document.body).on('click', '.pricing-table', function(){
    if( $j(this).data('type') == "server-provider" ){
      if( $j(this).data('id') != $active_server_provider ){
        $j('.pricing-table[data-type="server-provider"][data-id="'+ $active_server_provider +'"]').removeClass('active');
        changeActive($j(this));
        $active_server_provider = $j(this).data('id');
      }
    }else if( $j(this).data('type') == "distribution" ){
      if( $j(this).data('id') != $active_distribution ){
        $j('.pricing-table[data-type="distribution"][data-id="'+ $active_distribution +'"]').removeClass('active');
        changeActive($j(this));
        $active_distribution = $j(this).data('id');
      }
    }else if( $j(this).data('type') == "aplications" ){
      if( $j(this).data('id') != $active_aplication ){
        $j('.pricing-table[data-type="aplications"][data-id="'+ $active_aplication +'"]').removeClass('active');
        changeActive($j(this));
        $active_aplication = $j(this).data('id');
      }
    }else if( $j(this).data('type') == "services" ){
      changeActive($j(this));
      if( $active_services.indexOf($j(this).data('id')) != -1 ){
        $active_services.splice($active_services.indexOf($j(this).data('id')),1);
      }else{
        $active_services.push($j(this).data('id'));
      }
      $active_services.sort();
    }
  });

  var changeActive = function(value){
    if( !value.hasClass("active") )
      value.addClass("active");
    else
      value.removeClass("active");
  }

});

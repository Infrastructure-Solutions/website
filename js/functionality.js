$(document).foundation();

var $j = jQuery.noConflict();

$j(document).ready(function(){

  $j(document.body).on('click', '.pricing-table', function(){
    console.log($j(this).data('id'));
    if( !$j(this).hasClass("active") )
      $j(this).addClass("active");
    else
      $j(this).removeClass("active");
  });

});

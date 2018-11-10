/**
 * Magento
 *
 * Mini Cart Header
 * Author: Hire Magento
 * Website: www.hiremagento.com 
 * Suport Email: hiremagento@gmail.com
 *
**/
document.observe('dom:loaded', function() {
  $('minicart').observe('mouseover', function(e) {
    $('minicart-panel').show();
  });
  $('minicart').observe('mouseout', function(e) {
    $('minicart-panel').hide();
  });
});
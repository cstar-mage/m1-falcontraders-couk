<?php
class Ansyori_Autotrans_IndexController extends Mage_Core_Controller_Front_Action{
    public function IndexAction() {
      
	  $this->loadLayout();   
	 
      $this->renderLayout(); 
	  
    }
}
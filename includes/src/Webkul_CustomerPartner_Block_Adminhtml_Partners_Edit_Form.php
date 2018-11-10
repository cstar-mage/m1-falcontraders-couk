<?php
  class Webkul_CustomerPartner_Block_Adminhtml_Partners_Edit_Form extends Mage_Adminhtml_Block_Widget_Form  {

    protected function _prepareForm()    {
      $form = new Varien_Data_Form(array(
        'id' => 'edit_form',
        'action' => $this->getUrl('*/*/save', array('indexid' => $this->getRequest()->getParam('indexid'))),
        'method' => 'post',
        'enctype' => 'multipart/form-data'
      ));
      $form->setUseContainer(true);
      $this->setForm($form);
      return parent::_prepareForm();
    }

  }
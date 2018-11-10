<?php
    class Webkul_CustomerPartner_Block_Adminhtml_Order_Grid extends Mage_Adminhtml_Block_Widget_Grid    {

        public function __construct()     {
            parent::__construct();
            $this->setId("customerpartnerGrid");
        }

        public function getMainButtonsHtml()    {
            return "";
        }
        
        protected function _prepareCollection()      {		
        		$customerid = $this->getRequest()->getParam("id");
        		$collection = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter("mageproownerid",$customerid);
        		foreach ($collection as $item) {
          			$item->view = "<a href='".$this->getUrl('adminhtml/sales_order/view/order_id/'.$item->getMageorderid())."'>view</a>";
          			$order = Mage::getModel("sales/order")->load($item->getMageorderid());
          			$status = $order->getStatus();
          			$item->status = $status;
        		}
        		$this->setCollection($collection);
        		return parent::_prepareCollection();
        }

        protected function _prepareColumns(){

            $this->addColumn("mageorderid", array(
                "header"    => Mage::helper("customerpartner")->__("ID"),
                "width"     => "50px",
                "index"     => "mageorderid",
                "type"      => "number",
    			      "filter"    => false,
                "sortable"  => false
            ));

            $this->addColumn("magerealorderid", array(
                "header"    => Mage::helper("customerpartner")->__("Order#"),
                "index"     => "magerealorderid",
    			      "filter"    => false,
                "sortable"  => false
            ));
      		 
      		  $this->addColumn("mageproname", array(
                "header"    => Mage::helper("customerpartner")->__("Product Name"),
                "index"     => "mageproname",
    			      "filter"    => false,
                "sortable"  => false
            ));
      		
      		  $this->addColumn("mageproprice", array(
                "header"    => Mage::helper("customerpartner")->__("Price"),
                "index"     => "mageproprice",
    			      "filter"    => false,
                "sortable"  => false
            ));
      		
      		  $this->addColumn("status", array(
                "header"    => Mage::helper("customerpartner")->__("Status"),
                "index"     => "status",
    			      "filter"    => false,
                "sortable"  => false
            ));

      		  $this->addColumn("cleared_at", array(
                "header"    => Mage::helper("customerpartner")->__("Order At"),
                "index"     => "cleared_at",
    			      "filter"    => false,
                "sortable"  => false
            ));

            return parent::_prepareColumns();

        }
        
      	public function getRowUrl($row) {
            return $this->getUrl("adminhtml/sales_order/view/", array("order_id" => $row->getMageorderid()));
        }
      
    }
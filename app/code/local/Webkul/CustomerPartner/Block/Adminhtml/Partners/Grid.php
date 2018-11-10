<?php
	class Webkul_CustomerPartner_Block_Adminhtml_Partners_Grid extends Mage_Adminhtml_Block_Widget_Grid		{

		public function __construct()		{
			parent::__construct();
			$this->setId("customerpartnerGrid");
			$this->setSaveParametersInSession(true);
			$this->setUseAjax(true);
		}

		public function getMainButtonsHtml()    {
            return "";
        }

		protected function _prepareCollection()	{
			$prefix = Mage::getConfig()->getTablePrefix();
			$collection = Mage::getResourceModel("customer/customer_collection")
		    ->addNameToSelect()
		    ->joinAttribute("billing_postcode", "customer_address/postcode", "default_billing", null, "left")
		    ->joinAttribute("billing_city", "customer_address/city", "default_billing", null, "left")
		    ->joinAttribute("billing_telephone", "customer_address/telephone", "default_billing", null, "left")
		    ->joinAttribute("billing_region", "customer_address/region", "default_billing", null, "left")
		    ->joinAttribute("billing_country_id", "customer_address/country_id", "default_billing", null, "left");		    
		    $collection->getSelect()->join(array("cpu" => $prefix."customerpartner_userdata"),"cpu.mageuserid = e.entity_id",array("partnerstatus"=>"partnerstatus","paymentsource"=>"paymentsource"));		   
			foreach ($collection as $data)
				$data->order = sprintf("<a href='%s' title='".Mage::helper('customerpartner')->__('View Order')."'>".Mage::helper("customerpartner")->__('Order')."</a>",$this->getUrl("customerpartner/adminhtml_order/index/id/".$data->getEntityId()."/"));
			$this->setCollection($collection);
	        return parent::_prepareCollection();		        		
	    }

		protected function _prepareColumns(){

	        $this->addColumn("id", array(
	            "header"    => Mage::helper("customerpartner")->__("ID"),
	            "width"     => "50px",
	            "index"     => "entity_id"
	        ));

	        $this->addColumn("name", array(
	            "header"    => Mage::helper("customerpartner")->__("Name"),
	            "index"     => "name"
	        ));

	        $this->addColumn("email", array(
	            "header"    => Mage::helper("customerpartner")->__("Email"),
	            "width"     => "150",
	            "index"     => "email"
	        ));

			$this->addColumn("partnerstatus", array(
	            "header"    => Mage::helper("customerpartner")->__("Partner Status"),
	            "type"      => "text",
	            "index"     => "partnerstatus",
				"filter"    => false,
	            "sortable"  => false
	        ));

			$this->addColumn("paymentsource", array(
	            "header"    => Mage::helper("customerpartner")->__("Mode Of Payment"),
	            "type"      => "text",
	            "index"     => "paymentsource",
				"filter"    => false,
	            "sortable"  => false
	        ));

			$this->addColumn("order", array(
	            "header"    => Mage::helper("customerpartner")->__("Order"),
	            "index"     => "order",
				"type"      => "text",
				"align"     => "center",
				"filter"    => false,
	            "sortable"  => false
	        ));

	        $this->addColumn("Telephone", array(
	            "header"    => Mage::helper("customer")->__("Telephone"),
	            "width"     => "100",
	            "index"     => "billing_telephone",
	        ));

	        $this->addColumn("billing_postcode", array(
	            "header"    => Mage::helper("customer")->__("ZIP"),
	            "width"     => "90",
	            "index"     => "billing_postcode",
	        ));

	        $this->addColumn("billing_country_id", array(
	            "header"    => Mage::helper("customer")->__("Country"),
	            "width"     => "100",
	            "type"      => "country",
	            "index"     => "billing_country_id"
	        ));

	        $this->addColumn("billing_region", array(
	            "header"    => Mage::helper("customer")->__("State/Province"),
	            "width"     => "100",
	            "index"     => "billing_region"
	        ));

	        $this->addColumn("customer_since", array(
	            "header"    => Mage::helper("customerpartner")->__("Customer Since"),
	            "type"      => "datetime",
	            "align"     => "center",
	            "index"     => "created_at"
	        ));

	        return parent::_prepareColumns();
	    }

	    protected function _prepareMassaction() {
	        $this->setMassactionIdField("entity_id");
	        $this->getMassactionBlock()->setFormFieldName("customer");
	        $this->getMassactionBlock()->addItem("ispartner", array(
	             "label"    => Mage::helper("customerpartner")->__("Subscribe to Partner "),
	             "url"      => $this->getUrl("*/*/massispartner")
	        ));
			$this->getMassactionBlock()->addItem("isnotpartner", array(
	             "label"    => Mage::helper("customerpartner")->__("Unsubscribe from Partner"),
	             "url"      => $this->getUrl("*/*/massnotpartner")
	        ));			
	        return $this;
	    }

	    public function getGridUrl()    {
            return $this->getUrl("*/*/grid",array("_current"=>true));
        }

	 	public function getRowUrl($row) {
	        return $this->getUrl('*/*/edit', array('indexid' => $row->getId()));
	    }

	}
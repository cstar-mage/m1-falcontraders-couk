<?php
    class Webkul_CustomerPartner_Block_Adminhtml_Products_Grid extends Mage_Adminhtml_Block_Widget_Grid    {

        public function __construct()      {
        	parent::__construct();
        	$this->setId("customerpartnerGrid");
        	$this->setUseAjax(true);
            $this->setSaveParametersInSession(true);
            $this->setDefaultSort("index_id");
        	$this->setDefaultDir("DESC");
        }

        public function getMainButtonsHtml()    {
            return "";
        }

        protected function _prepareCollection()     {
            $allStores = Mage::app()->getStores();
            if(count($allStores) > 1)
                    $store_id = (int) $this->getRequest()->getParam("store", 0);
            else
                    $store_id = 0;


        	$collection = Mage::getModel("customerpartner/product")->getCollection();
            $prefix = Mage::getConfig()->getTablePrefix();
            $eavAttribute = new Mage_Eav_Model_Mysql4_Entity_Attribute();
            $pro_att_id = $eavAttribute->getIdByCode("catalog_product","name");
            $collection->getSelect()->join($prefix."catalog_product_entity_varchar","main_table.mageproductid = ".$prefix."catalog_product_entity_varchar.entity_id",array("proname"=>"value"))->where($prefix."catalog_product_entity_varchar.attribute_id = ".$pro_att_id)->where($prefix."catalog_product_entity_varchar.store_id = ".$store_id);
            $collection->addFilterToMap("proname",$prefix."catalog_product_entity_varchar.value");

            $price_att_id = $eavAttribute->getIdByCode("catalog_product","price");
            $collection->getSelect()->joinLeft($prefix."catalog_product_entity_decimal","main_table.mageproductid = ".$prefix."catalog_product_entity_decimal.entity_id",array("price"=>"value"))->where($prefix."catalog_product_entity_decimal.attribute_id = ".$price_att_id)->where($prefix."catalog_product_entity_decimal.store_id = 0");
            $collection->addFilterToMap("price",$prefix."catalog_product_entity_decimal.value");
            
            $collection->getSelect()->joinLeft($prefix."cataloginventory_stock_item","main_table.mageproductid = ".$prefix."cataloginventory_stock_item.product_id",array("qty"=>"qty"));
            $collection->getSelect()->joinLeft($prefix."catalog_product_entity","main_table.mageproductid = ".$prefix."catalog_product_entity.entity_id",array("created_at"=>"created_at"));
            $weight_att_id = $eavAttribute->getIdByCode("catalog_product","weight");
            $collection->getSelect()
            ->join(array("pw" => $prefix."catalog_product_entity_decimal"),"pw.entity_id = main_table.mageproductid",array("weight" => "value"))->where("pw.attribute_id = ".$weight_att_id);
            $collection->addFilterToMap("weight","pw.value");
            $fnameid = Mage::getModel("eav/entity_attribute")->loadByCode("1", "firstname")->getAttributeId();
            $lnameid = Mage::getModel("eav/entity_attribute")->loadByCode("1", "lastname")->getAttributeId();
            $collection->getSelect()
            ->join(array("ce1" => $prefix."customer_entity_varchar"),"ce1.entity_id = main_table.userid",array("fname" => "value"))->where("ce1.attribute_id = ".$fnameid)
            ->join(array("ce2" => $prefix."customer_entity_varchar"),"ce2.entity_id = main_table.userid",array("lname" => "value"))->where("ce2.attribute_id = ".$lnameid)
            ->columns(new Zend_Db_Expr("CONCAT(`ce1`.`value`, ' ',`ce2`.`value`) AS fullname"));
            $collection->addFilterToMap("fullname","CONCAT(`ce1`.`value`, ' ',`ce2`.`value`)");
        	$this->setCollection($collection);
        	parent::_prepareCollection();
            foreach ($this->getCollection() as $item) {
				$item->prev = sprintf("<span data='%s' product-id='%s' customer-id='%s' title='Click to Review' class='prev wk_cp_button'>preview</span>",$this->getUrl("customerpartner/adminhtml_products/preview/id/".$item->getMageproductid()),$item->getMageproductid(),$item->getuserid());
				if(!(is_null($item->getmageproductid())) && $item->getmageproductid() != 0) {
    				$product = Mage::getModel("catalog/product")->load($item->getmageproductid());
    				$stock_inventory = Mage::getModel("cataloginventory/stock_item")->loadByProduct($item->getmageproductid());
        			$quantity = Mage::getModel("customerpartner/saleslist")->getSalesdetail($item->getmageproductid());
        			$item->qty_sold = (int)$quantity["quantitysold"];
        			$item->qty_soldconfirmed = (int)$quantity["quantitysoldconfirmed"];
        			$symbol = Mage::app()->getLocale()->currency(Mage::app()->getStore()->getCurrentCurrencyCode())->getSymbol(); 
        			$item->qty_soldpending = (int)$quantity["quantitysoldpending"];
        			$item->amount_earned = $symbol.$quantity["amountearned"];
                }
    		}
        }

        protected function _prepareColumns()     {

            $this->addColumn("index_id", array(
                "header"    => Mage::helper("customerpartner")->__("ID"),
                "width"     => "50px",
                "index"     => "index_id",
                "align"     => "center"
            ));

            $this->addColumn("fullname", array(
                "header"    => Mage::helper("customerpartner")->__("Customer Name"),
                "index"     => "fullname",
                "align"     => "center",
                "width"     => "150px"
            ));

    	    $this->addColumn("proname", array(
                "header"    => Mage::helper("customerpartner")->__("Product Name"),
                "index"     => "proname",
                "width"     => "150px",
            ));

    		$this->addColumn("price", array(
                "header"    => Mage::helper("customerpartner")->__("Price"),
                "type"      => "number",
                "index"     => "price"
            ));

            $this->addColumn("qty", array(
                "header"    => Mage::helper("customerpartner")->__("Stock"),
                "type"      => "number",
                "index"     => "qty"
            ));

            $this->addColumn("weight", array(
                "header"    => Mage::helper("customerpartner")->__("Weight"),
                "type"      => "number",
                "index"     => "weight"
            ));

            $this->addColumn("status", array(
                "header"    => Mage::helper("customerpartner")->__("Status"),
                "index"     => "status",
                "type"      => "options",
                "align"     => "center",
                "options"   => array("1" => "Approved", "2" => "UnApproved")
            ));

            $this->addColumn("prev", array(
                "header"    => Mage::helper("customerpartner")->__("Preview"),
                "index"     => "prev",
                "type"      => "text",
                "filter"    => false,
                "sortable"  => false,
                "align"     => "center"
            ));

    		$this->addColumn("qty_soldconfirmed", array(
                "header"    => Mage::helper("customerpartner")->__("Qty. Confirmed"),
                "index"     => "qty_soldconfirmed",
                "type"      => "number",
                "filter"    => false,
                "sortable"  => false
            ));

    		$this->addColumn("qty_soldpending", array(
                "header"    => Mage::helper("customerpartner")->__("Qty. Pending"),
                "index"     => "qty_soldpending",
                "type"      => "number",
                "filter"    => false,
                "sortable"  => false
            ));

            $this->addColumn("qty_sold", array(
                "header"    => Mage::helper("customerpartner")->__("Qty. Sold"),
                "index"     => "qty_sold",
                "type"      => "number",
                "filter"    => false,
                "sortable"  => false
            ));

            $this->addColumn("amount_earned", array(
                "header"    => Mage::helper("customerpartner")->__("Earned"),
                "index"     => "amount_earned",
                "type"      => "price",
                "filter"    => false,
                "sortable"  => false
            ));

            $this->addColumn("created_at", array(
                "header"    => Mage::helper("customerpartner")->__("Created"),
                "index"     => "created_at",
                "type"      => "datetime"
            ));

            return parent::_prepareColumns();
        }

        public function getGridUrl()    {
            return $this->getUrl("*/*/grid",array("_current"=>true));
        }

        public function getRowUrl($row) {
            if($row->getStatus() == 2)
                return $this->getUrl("*/*/approve", array("id" => $row->getMageproductid()));
            else
                return $this->getUrl("adminhtml/catalog_product/edit", array("id" => $row->getMageproductid()));
        }

    }
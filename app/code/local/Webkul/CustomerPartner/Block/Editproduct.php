<?php

	class Webkul_CustomerPartner_Block_Editproduct extends Mage_Customer_Block_Account_Dashboard	{

		public function getProduct() {
			$id = $this->getRequest()->getParam("id");
			$products = Mage::getModel("catalog/product")->load($id);
			return $products;
		}

	}
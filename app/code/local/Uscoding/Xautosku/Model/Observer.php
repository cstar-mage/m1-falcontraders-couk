<?php

class Uscoding_Xautosku_Model_Observer {
    public function hookProductPrepareSave($observer) {
        $product = $observer->getProduct();
        $request = $observer->getRequest();

        $enabled = Mage::getStoreConfig('Xautosku/mainmenu/enabled');//enable extension
        $sku_type = Mage::getStoreConfig('Xautosku/mainmenu/sku_type');//sku type

        if($enabled == 1){
            $lastId = 2;
            if($sku_type == 3){// create sku by category's prefix and product name
                if($request->getParam('category_ids') != ''){
                    $category_ids = explode(',', $request->getParam('category_ids'));
                }else{
                    $category_ids = $product->getCategoryIds();
                }
                if(count($category_ids) > 0){
                    $lastId = $category_ids[count($category_ids) - 1];
                }
                $categoryCollection = Mage::getModel('catalog/category')->load($lastId);
                $sku_prefix = $categoryCollection->getData('sku_prefix');
                $sku = $product->getSku();
                if (strpos($sku, $sku_prefix . '-') === false) {
                    $sku = $sku_prefix . '-' . ucwords( $product->getName());
                    $sku = $this->slug($sku);
                    $product->setSku($sku);
                }
            }

        }
    }

public function hookProductAfterSaveMultiVendor($observer) {

        $data = $observer->getEvent()->getData();
        $productId = $data['id'];
        $product = Mage::getModel('catalog/product')->load($productId);
        $enabled = Mage::getStoreConfig('Xautosku/mainmenu/enabled');//enable extension
        $sku_type = Mage::getStoreConfig('Xautosku/mainmenu/sku_type');//sku type

        if($enabled == 1){
            $lastId = 2;
            if($sku_type == 3){// create sku by category's prefix and product name
                $category_ids = $product->getCategoryIds();
                if(count($category_ids) > 0){
                    $lastId = $category_ids[count($category_ids) - 1];
                }
                $categoryCollection = Mage::getModel('catalog/category')->load($lastId);
                $sku_prefix = $categoryCollection->getData('sku_prefix');
                $sku = $product->getSku();
                if (strpos($sku, $sku_prefix . '-') === false) {
                    $sku = $sku_prefix . '-' . ucwords( $product->getName());
                    $sku = $this->slug($sku);
                    $product->setSku($sku);
                }
            }
        }
		$payment_method = implode(',', $wholedata['payment_method']);
		$shipping_method = implode(',', $wholedata['shipping_method']);		
		$product->setData('payment_method', $payment_method);
		$product->setData('shipping_method', $shipping_method);
        $product->save();
    }

    public function slug($str) {
        //$str = strtolower(trim($str));
        $str = preg_replace('/[^a-zA-Z0-9-]/', '-', $str);
        $str = preg_replace('/-+/', "-", $str);
        return $str;
    }
}
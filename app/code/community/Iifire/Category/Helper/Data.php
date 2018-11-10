<?php

class Iifire_Category_Helper_Data extends Mage_Core_Helper_Abstract
{
	protected $_crosssellNum = 4;
	protected $_relatedNum = 4;
	protected $_upsellNum = 4;
	
	const XML_PRODUCT_CROSSSELL_NUM = 'iifire_category/product/crosssell';
	const XML_PRODUCT_RELATED_NUM = 'iifire_category/product/related';
	const XML_PRODUCT_UPSELL_NUM = 'iifire_category/product/upsell';

	
	public function getCrosssellNum()
	{
		$num = (int)Mage::getStoreConfig(self::XML_PRODUCT_CROSSSELL_NUM);
		return $num ? $num : $this->_crosssellNum;
	}
	public function getRelatedNum()
	{
		$num = (int)Mage::getStoreConfig(self::XML_PRODUCT_RELATED_NUM);
		return $num ? $num : $this->_relatedNum;
	}
	public function getUpsellNum()
	{
		$num = (int)Mage::getStoreConfig(self::XML_PRODUCT_UPSELL_NUM);
		return $num ? $num : $this->_upsellNum;
	}
	public function getTypeOptions()
	{
		return array(
			'related' => $this->__('Related'),
			'upsell' => $this->__('Up-sell'),
			'crosssell' => $this->__('Cross-sell'),
			'all' => $this->__('All'),
		);
	}
	public function getCategoryIdString($orignIdString)
	{
		$categoryIds = str_replace(' ','',$orignIdString);
		$categoryIds = explode(',',$categoryIds);
		$tmp = array();
    	if (count($categoryIds)) {
    		foreach($categoryIds as $c) {
	    		if (!in_array($c, $tmp) && $c) {
	    			array_push($tmp,$c);
	    		}
	    	}
	    	if (count($tmp)) {
	    		return implode(',',$tmp);
	    	} else {
	    		return;
	    	}
    	} else {
    		return;
    	}
	}
	public function getProductCollectionByCategoryIds($categoryIds,$productId)
	{
		$categoryProductTable = Mage::getSingleton('core/resource')->getTableName('catalog_category_product');
		$select = "select distinct(product_id) product_id from {$categoryProductTable} where category_id in (".$categoryIds.") and product_id!={$productId} order by rand()";
		$data = Mage::getSingleton('core/resource')->getConnection('core_read')->fetchAll($select);
		$collection = Mage::getResourceModel('catalog/product_collection')
            ->addAttributeToSelect(Mage::getSingleton('catalog/config')->getProductAttributes())
            ->addMinimalPrice()
            ->addFinalPrice()
            ->addTaxPercents();
        $collection->addAttributeToFilter('entity_id',array('in'=>array_values($data)));
		
		Mage::getSingleton('catalog/product_status')->addVisibleFilterToCollection($collection);
		Mage::getSingleton('catalog/product_visibility')->addVisibleInCatalogFilterToCollection($collection);
        $collection->addStoreFilter();
		$collection->getSelect()->order('rand()');
		return $collection;
	}
}

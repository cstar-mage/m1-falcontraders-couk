<?php
class Iifire_Category_Adminhtml_Iifire_CategoryController extends Mage_Adminhtml_Controller_Action  
{
    public function indexAction()
    {
        $this->_title($this->__('Iifire Category Management'));
        $this->loadLayout();
        $this->getLayout()->getBlock('head')->setCanLoadExtJs(true)
            ->setContainerCssClass('catalog-categories');
        $this->_setActiveMenu('catalog');
        $this->renderLayout();
    }
    public function editAction()
    {
    	$categoryId = (int) $this->getRequest()->getParam('id',false);
    	$storeId    = (int) $this->getRequest()->getParam('store');
    	$category = Mage::getModel('catalog/category');
        $category->setStoreId($storeId);
        $type = $this->getRequest()->getParam('type');
        Mage::register('iifire_category_type', $type);
        if ($categoryId) {
            $category->load($categoryId);
        }
    	if ($this->getRequest()->getQuery('isAjax')) {
            // prepare breadcrumbs of selected category, if any
            $breadcrumbsPath = $category->getPath();
            $this->loadLayout();
            $this->getResponse()->setBody(Mage::helper('core')->jsonEncode(array(
                'messages' => $this->getLayout()->getMessagesBlock()->getGroupedHtml(),
                'content' =>
                    $this->getLayout()->getBlock('iifire.categories')->toHtml()
            )));
            return;
        }
    }
    public function categoriesJsonAction()
    {
        if ($this->getRequest()->getParam('expand_all')) {
            Mage::getSingleton('admin/session')->setIsTreeWasExpanded(true);
        } else {
            Mage::getSingleton('admin/session')->setIsTreeWasExpanded(false);
        }

        if ($categoryId = (int) $this->getRequest()->getParam('category')) {
        	//echo $categoryId;
            $this->getResponse()->setBody(
                $this->getLayout()->createBlock('iifire_category/adminhtml_categories')
                    ->getCategoryChildrenJson($categoryId)
            );
        }
    }
    public function saveAction()
    {
    	$categoryId = $this->getRequest()->getParam('category_id');
    	$categoryIds = trim($this->getRequest()->getParam('category_ids'));
    	$categoryIds = explode(',',$categoryIds);
    	$tmp = array();
    	if (count($categoryIds)) {
    		foreach($categoryIds as $c) {
	    		if (!in_array($c, $tmp) && $c) {
	    			array_push($tmp,$c);
	    		}
	    	}
	    	$categoryIds = implode(',',$tmp);
    	} else {
    		$categoryIds = '';
    	}
	    	
    	$type = $this->getRequest()->getParam('type_switcher');
    	$msg = false;
    	$category = Mage::getModel('catalog/category')->load($categoryId);
    	if ($category->getId()) {
    		if ($type == "related") {
    			$category->setRelatedCategories($categoryIds);
    		} else if ($type == "upsell") {
    			$category->setUpsellCategories($categoryIds);
    		} else if ($type == "crosssell") {
    			$category->setCrosssellCategories($categoryIds);
    		} else {
    			$category->setRelatedCategories($categoryIds)
    				->setUpsellCategories($categoryIds)
    				->setCrosssellCategories($categoryIds);
    		}
    		try {
    			$category->save();
    			$msg = true;
    			$this->_getSession()->addSuccess(Mage::helper('icategory')->__('Saved successfully.'));
    		} catch (Exception $e) {
    			$msg = false;
    			$this->_getSession()->addError($e->getMessage());
    		};
    	} 
    	$this->getResponse()->setBody($msg);
    }
    protected function _getSession()
    {
    	return Mage::getSingleton('adminhtml/session');
    }
    
}
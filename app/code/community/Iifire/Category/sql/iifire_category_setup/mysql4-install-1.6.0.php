<?php
$installer = new Mage_Catalog_Model_Resource_Eav_Mysql4_Setup('catalog_setup');
$installer->startSetup();
$installer->addAttribute('catalog_category', 'related_categories',  array(
    'type'     => 'varchar',
    'label'    => 'Related Categories',
    'input'    => 'text',
    'sort_order' => 30,
    'global'   => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_STORE,
    'required' => false,
    'group'    => 'General Information',
));
$installer->addAttribute('catalog_category', 'upsell_categories',  array(
    'type'     => 'varchar',
    'label'    => 'Upsell Categories',
    'input'    => 'text',
    'sort_order' => 31,
    'global'   => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_STORE,
    'required' => false,
    'group'    => 'General Information',
));
$installer->addAttribute('catalog_category', 'crosssell_categories',  array(
    'type'     => 'varchar',
    'label'    => 'Cross-Sell Categories',
    'input'    => 'text',
    'sort_order' => 32,
    'global'   => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_STORE,
    'required' => false,
    'group'    => 'General Information',
));
$installer->endSetup();

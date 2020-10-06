<?php
/**
 * @package yii2-widget-datedropper
 * @author Simon Karlen <simi.albi@outlook.com>
 */

namespace simialbi\yii2\datedropper;

use simialbi\yii2\web\AssetBundle;

/**
 * Asset bundle for datedropper Widget
 *
 * @author Simon karlen <simi.albi@outlook.com>
 */
class DatedropperAsset extends AssetBundle
{
    /**
     * {@inheritDoc}
     */
    public $css = [
        'css/datedropper.css'
    ];

    /**
     * {@inheritDoc}
     */
    public $js = [
        'js/datedropper.pro.min.js'
    ];

    /**
     * {@inheritDoc}
     */
    public $depends = [
        'yii\web\JqueryAsset'
    ];
}
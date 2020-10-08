<?php
/**
 * @package yii2-widget-datedropper
 * @author Simon Karlen <simi.albi@outlook.com>
 */

namespace simialbi\yii2\datedropper;

use simialbi\yii2\helpers\FormatConverter;
use simialbi\yii2\widgets\InputWidget;
use Yii;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\web\View;

class Datedropper extends InputWidget
{
    /**
     * @var string
     */
    public $lang;

    /**
     * @var array
     */
    public $icons = [
        'arrow' => [
            'l' => '<svg viewBox="0 -1 6 16" height="14" width="8"><polyline points="6 0 0 6 6 12" stroke="currentColor" stroke-width="2" fill="none"></polyline></svg>',
            'r' => '<svg viewBox="6 -1 6 16" height="14" width="8"><polyline points="6 0 12 6 6 12" stroke="currentColor" stroke-width="2" fill="none"></polyline></svg>'
        ],
        'checkmark' => '<svg viewBox="0 0 22 18" height="18" width="32"><polyline points="0 8 8 16 22 1" stroke="currentColor" stroke-width="2" fill="none" ></polyline></svg>',
        'expand' => '<svg width="18" height="18" viewBox="0 -3 12 18" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="8 0 12 0 12 4" fill="none"></polyline><path d="M11.4444444,0.555555556 L6.97196343,5.02803657" stroke-linecap="square"></path><path d="M5.5,6.5 L0.555555556,11.4444444" stroke-linecap="square"></path><polyline points="0 8 0 12 4 12" fill="none"></polyline></svg>'
    ];

    /**
     * @throws \ReflectionException
     * @throws \yii\base\InvalidConfigException
     */
    public function init()
    {
        parent::init();

        if (!isset($this->lang)) {
            $this->lang = substr(Yii::$app->language, 0, 2);
        }

        $this->registerTranslations();
    }

    /**
     * {@inheritDoc}
     */
    public function run()
    {
        $js = Json::htmlEncode([
            'languages' => [
                $this->lang => [
                    'name' => $this->lang,
                    'months' => [
                        'short' => [
                            Yii::t('simialbi/datedropper/datedropper', 'Jan', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Feb', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Mar', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Apr', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'May s', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Jun', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Jul', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Aug', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Sep', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Oct', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Nov', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Dec', [], $this->lang)
                        ],
                        'full' => [
                            Yii::t('simialbi/datedropper/datedropper', 'January', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'February', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'March', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'April', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'May', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'June', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'July', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'August', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'September', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'October', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'November', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'December', [], $this->lang)
                        ]
                    ],
                    'weekdays' => [
                        'short' => [
                            Yii::t('simialbi/datedropper/datedropper', 'Sun', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Mon', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Tue', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Wed', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Thu', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Fri', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Sat', [], $this->lang)
                        ],
                        'full' => [
                            Yii::t('simialbi/datedropper/datedropper', 'Sunday', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Monday', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Tuesday', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Wednesday', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Thursday', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Friday', [], $this->lang),
                            Yii::t('simialbi/datedropper/datedropper', 'Saturday', [], $this->lang)
                        ]
                    ]
                ]
            ],
            'icons' => $this->icons,
            'autoInit' => true
        ]);
        $this->view->registerJs("\$.dateDropperSetup = $js;", View::POS_HEAD, 'dateDropperSetup');

        $this->clientOptions = $this->getClientOptions();

        $this->registerPlugin('dateDropper');

        return ($this->hasModel())
            ? Html::activeInput('text', $this->model, $this->attribute, $this->options)
            : Html::input($this->name, $this->value, $this->options);
    }

    /**
     * Get client options
     *
     * @return array
     */
    protected function getClientOptions()
    {
        $format = ArrayHelper::remove($this->clientOptions, 'format', FormatConverter::convertDateIcuToPhp(Yii::$app->formatter->dateFormat));

        return ArrayHelper::merge($this->clientOptions, [
            'format' => $format,
            'lang' => $this->lang
        ]);
    }
}
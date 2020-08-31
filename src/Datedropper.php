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
     * @var string
     */
    public $inlineCss = '.picker-input{cursor:text}.picker-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.8);z-index:2147483637;opacity:1;visibility:visible;-webkit-transition:opacity .4s ease,visibility .4s ease;-o-transition:opacity .4s ease,visibility .4s ease;transition:opacity .4s ease,visibility .4s ease}.picker-overlay.picker-overlay-hidden{opacity:0;visibility:hidden}div.datedropper{--dd-color1:#fd4741;--dd-color2:white;--dd-color3:#4D4D4D;--dd-color4:white;--dd-radius:6px;--dd-width:180px;--dd-shadow:0 0 32px 0 rgba(0, 0, 0, 0.1);-ms-touch-action:none;touch-action:none;position:absolute;top:0;left:0;z-index:2147483638;-webkit-transform:translate3d(-50%, 0, 0);transform:translate3d(-50%, 0, 0);line-height:1;font-family:sans-serif;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);opacity:0;visibility:hidden;margin-top:-8px;-webkit-backface-visibility:hidden;backface-visibility:hidden;border-radius:6px!important;border-radius:var(--dd-radius)!important}div.datedropper.leaf{--dd-color1:#1ecd80;--dd-color2:#fefff2;--dd-color3:#528971;--dd-color4:#fefff2;--dd-radius:6px;--dd-width:180px;--dd-shadow:0 0 32px 0 rgba(0, 0, 0, 0.1)}div.datedropper.vanilla{--dd-color1:#feac92;--dd-color2:#FFF;--dd-color3:#9ed7db;--dd-color4:#faf7f4;--dd-radius:6px;--dd-width:180px;--dd-shadow:0 0 32px 0 rgba(0, 0, 0, 0.1)}div.datedropper.ryanair{--dd-color1:#7e57dc;--dd-color2:#50388a;--dd-color3:#ffffff;--dd-color4:#FFF;--dd-radius:6px;--dd-width:180px;--dd-shadow:0 0 32px 0 rgba(0, 0, 0, 0.1)}@media only screen and (max-width:479px){div.datedropper{position:fixed;top:50%!important;left:50%!important;-webkit-transform:translate3d(-50%, -50%, 0);transform:translate3d(-50%, -50%, 0);margin:0}div.datedropper:before{display:none}div.datedropper .picker{-webkit-box-shadow:0 0 64px 32px rgba(0, 0, 0, 0.06)!important;box-shadow:0 0 64px 32px rgba(0, 0, 0, 0.06)!important}}div.datedropper *{-webkit-box-sizing:border-box;box-sizing:border-box;width:auto;height:auto;margin:0;padding:0;border:0;font-size:100%}div.datedropper svg{fill:currentColor}div.datedropper:before{content:"";position:absolute;width:16px;height:16px;top:-8px;left:50%;-webkit-transform:translateX(-50%) rotate(45deg);-ms-transform:translateX(-50%) rotate(45deg);transform:translateX(-50%) rotate(45deg);border-top-left-radius:4px;background-color:white;z-index:1}div.datedropper.picker-focused{opacity:1;visibility:visible;margin-top:8px}@media only screen and (max-width:479px){div.datedropper.picker-focused{margin-top:0}}div.datedropper .pick-submit{margin:0 auto;outline:0;width:56px;height:100%;line-height:64px;border-radius:56px;font-size:24px;cursor:pointer;border-bottom-left-radius:0;border-bottom-right-radius:0;text-align:center;position:relative;top:0}div.datedropper .pick-submit:focus,div.datedropper .pick-submit:hover{top:4px;-webkit-box-shadow:0 0 0 16px rgba(0, 0, 0, 0.04), 0 0 0 8px rgba(0, 0, 0, 0.04);box-shadow:0 0 0 16px rgba(0, 0, 0, 0.04), 0 0 0 8px rgba(0, 0, 0, 0.04)}div.datedropper .pick-submit svg{position:relative;top:20px}div.datedropper .picker{position:relative;overflow:hidden}div.datedropper .picker+div{font-weight:bold;font-size:10px;text-transform:uppercase;padding:.5rem;text-align:center}div.datedropper .picker+div a{text-decoration:none;color:currentColor}div.datedropper .picker+div a:hover{text-decoration:underline}div.datedropper .picker ul{margin:0;padding:0;list-style:none;cursor:pointer;position:relative;z-index:2}div.datedropper .picker ul.pick{position:relative;overflow:hidden;outline:0}div.datedropper .picker ul.pick:nth-of-type(2){-webkit-box-shadow:0 1px rgba(0, 0, 0, 0.06);box-shadow:0 1px rgba(0, 0, 0, 0.06)}div.datedropper .picker ul.pick li{position:absolute;top:0;left:0;width:100%;height:100%;text-align:center;opacity:.5;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;text-align:center;pointer-events:none}div.datedropper .picker ul.pick li span{font-size:16px;position:absolute;left:0;width:100%;line-height:0;bottom:24px}div.datedropper .picker ul.pick li.pick-afr{-webkit-transform:translateY(100%);-ms-transform:translateY(100%);transform:translateY(100%)}div.datedropper .picker ul.pick li.pick-bfr{-webkit-transform:translateY(-100%);-ms-transform:translateY(-100%);transform:translateY(-100%)}div.datedropper .picker ul.pick li.pick-sl{opacity:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);z-index:1;pointer-events:auto}div.datedropper .picker ul.pick:focus .pick-arw-s1,div.datedropper .picker ul.pick:hover .pick-arw-s1{opacity:0.6}div.datedropper .picker ul.pick:focus.pick-jump .pick-arw-s2,div.datedropper .picker ul.pick:hover.pick-jump .pick-arw-s2{pointer-events:auto;opacity:0.6}div.datedropper .picker ul.pick:focus.pick-jump .pick-arw-s2.pick-arw-r,div.datedropper .picker ul.pick:hover.pick-jump .pick-arw-s2.pick-arw-r{-webkit-transform:translateX(-8px);-ms-transform:translateX(-8px);transform:translateX(-8px)}div.datedropper .picker ul.pick:focus.pick-jump .pick-arw-s2.pick-arw-l,div.datedropper .picker ul.pick:hover.pick-jump .pick-arw-s2.pick-arw-l{-webkit-transform:translateX(8px);-ms-transform:translateX(8px);transform:translateX(8px)}div.datedropper .picker ul.pick .pick-arw{position:absolute;top:0;height:100%;width:25%;font-size:10px;text-align:center;display:block;z-index:10;cursor:pointer;overflow:hidden;opacity:0}div.datedropper .picker ul.pick .pick-arw div{line-height:0;top:50%;left:50%;position:absolute;display:block;-webkit-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}div.datedropper .picker ul.pick .pick-arw svg{width:16px;height:16px}div.datedropper .picker ul.pick .pick-arw.pick-arw:hover{opacity:1}div.datedropper .picker ul.pick .pick-arw.pick-arw-r{right:0}div.datedropper .picker ul.pick .pick-arw.pick-arw-l{left:0}div.datedropper .picker ul.pick .pick-arw.pick-arw-s2{pointer-events:none}div.datedropper .picker ul.pick .pick-arw.pick-arw-s2.pick-arw-r{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}div.datedropper .picker ul.pick .pick-arw.pick-arw-s2.pick-arw-l{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}div.datedropper .picker ul.pick.pick-m,div.datedropper .picker ul.pick.pick-y{height:60px}div.datedropper .picker ul.pick.pick-m{font-size:32px}div.datedropper .picker ul.pick.pick-y{font-size:24px}div.datedropper .picker ul.pick.pick-d{height:100px;font-size:64px;font-weight:bold}div.datedropper .picker ul.pick.pick-d li div{margin-top:-16px}div.datedropper .picker ul.pick:focus:after,div.datedropper .picker ul.pick:hover:after{content:"";pointer-events:none;position:absolute;top:6px;left:6px;bottom:6px;right:6px;background-color:rgba(0, 0, 0, 0.04);border-radius:6px}div.datedropper .picker .pick-lg{z-index:1;margin:0 auto;height:0;overflow:hidden}div.datedropper .picker .pick-lg.pick-lg-focused{background-color:rgba(0, 0, 0, 0.025)}div.datedropper .picker .pick-lg.down{-webkit-animation:down .8s ease;animation:down .8s ease}div.datedropper .picker .pick-lg .pick-h:after,div.datedropper .picker .pick-lg .pick-h:before{opacity:0.32}div.datedropper .picker .pick-lg ul:after{content:"";display:table;clear:both}div.datedropper .picker .pick-lg ul li{float:left;text-align:center;width:14.285714286%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;text-align:center;font-size:14px;position:relative}div.datedropper .picker .pick-lg ul li:after,div.datedropper .picker .pick-lg ul li:before{position:absolute;z-index:2;display:block;line-height:30px;height:30px;width:30px;top:50%;left:50%;-webkit-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}div.datedropper .picker .pick-lg ul li:after{content:attr(data-value);z-index:2}div.datedropper .picker .pick-lg ul li:before{content:""}div.datedropper .picker .pick-lg ul.pick-lg-h{height:16.6666666667%;padding:0 10px}div.datedropper .picker .pick-lg ul.pick-lg-h li{height:100%}div.datedropper .picker .pick-lg ul.pick-lg-b{height:83.3333333333%;padding:10px}div.datedropper .picker .pick-lg ul.pick-lg-b li{height:16.6666666667%;cursor:pointer;position:relative}div.datedropper .picker .pick-lg ul.pick-lg-b li div{position:absolute;top:0;left:0;right:0;bottom:0;z-index:1}div.datedropper .picker .pick-lg ul.pick-lg-b li.pick-lk{pointer-events:none;opacity:.6}div.datedropper .picker .pick-lg ul.pick-lg-b li.pick-lk:after{text-decoration:line-through}div.datedropper .picker .pick-lg ul.pick-lg-b li.pick-dir div{opacity:.25}div.datedropper .picker .pick-lg ul.pick-lg-b li:not(.pick-h):hover{z-index:2}div.datedropper .picker .pick-lg ul.pick-lg-b li:not(.pick-h):hover:before{border-radius:32px;-webkit-box-shadow:0 0 32px rgba(0, 0, 0, 0.1);box-shadow:0 0 32px rgba(0, 0, 0, 0.1)}div.datedropper .picker .pick-lg ul.pick-lg-b li:not(.pick-h):hover:after,div.datedropper .picker .pick-lg ul.pick-lg-b li:not(.pick-h):hover:before{-webkit-transform:translate(-50%, -50%) scale(1.5);-ms-transform:translate(-50%, -50%) scale(1.5);transform:translate(-50%, -50%) scale(1.5)}div.datedropper .picker .pick-lg ul.pick-lg-b li.pick-sl:before{z-index:2;border-radius:32px;-webkit-box-shadow:0 0 32px rgba(0, 0, 0, 0.1);box-shadow:0 0 32px rgba(0, 0, 0, 0.1)}div.datedropper .picker .pick-lg ul.pick-lg-b li.pick-sl:after,div.datedropper .picker .pick-lg ul.pick-lg-b li.pick-sl:before{-webkit-transform:translate(-50%, -50%) scale(1.5);-ms-transform:translate(-50%, -50%) scale(1.5);transform:translate(-50%, -50%) scale(1.5)}div.datedropper .picker .pick-lg ul.pick-lg-b li.pick-sl.pick-sl-a:not(.pick-sl-b):before{border-top-right-radius:8px;-webkit-transform:translate(-50%, -50%) scale(1.5) rotate(45deg)!important;-ms-transform:translate(-50%, -50%) scale(1.5) rotate(45deg)!important;transform:translate(-50%, -50%) scale(1.5) rotate(45deg)!important}div.datedropper .picker .pick-lg ul.pick-lg-b li.pick-sl.pick-sl-b:not(.pick-sl-a):before{border-top-left-radius:8px;-webkit-transform:translate(-50%, -50%) scale(1.5) rotate(-45deg)!important;-ms-transform:translate(-50%, -50%) scale(1.5) rotate(-45deg)!important;transform:translate(-50%, -50%) scale(1.5) rotate(-45deg)!important}div.datedropper .picker .pick-btns{margin:-1px;position:relative;z-index:11;height:56px}div.datedropper .picker .pick-btns div{cursor:pointer;line-height:0}div.datedropper .picker .pick-btns .pick-btn{position:absolute;width:36px;height:36px;bottom:0;text-align:center;line-height:38px;font-size:16px;margin:8px;outline:0;border-radius:4px;background:rgba(0, 0, 0, 0.03);-webkit-box-shadow:0 0 32px rgba(0, 0, 0, 0.1);box-shadow:0 0 32px rgba(0, 0, 0, 0.1);-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}div.datedropper .picker .pick-btns .pick-btn svg{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}div.datedropper .picker .pick-btns .pick-btn:focus,div.datedropper .picker .pick-btns .pick-btn:hover{-webkit-box-shadow:0 0 24px rgba(0, 0, 0, 0.1);box-shadow:0 0 24px rgba(0, 0, 0, 0.1);-webkit-transform:scale(0.95);-ms-transform:scale(0.95);transform:scale(0.95)}div.datedropper .picker .pick-btns .pick-btn.pick-btn-sz{right:0}div.datedropper .picker .pick-btns .pick-btn.pick-btn-lng{left:0;-webkit-transform-origin:left bottom;-ms-transform-origin:left bottom;transform-origin:left bottom}div.datedropper.picker-clean .picker-jumped-years{display:none}div.datedropper .picker-jumped-years{position:absolute;z-index:10;top:60px;left:0;right:0;bottom:0;padding:4px;padding-bottom:56px;opacity:0;overflow:hidden;overflow-y:scroll;-webkit-overflow-scrolling:touch;visibility:hidden;pointer-events:none;-webkit-transform:translateY(16px);-ms-transform:translateY(16px);transform:translateY(16px);-webkit-transform-origin:bottom center;-ms-transform-origin:bottom center;transform-origin:bottom center}div.datedropper .picker-jumped-years.picker-jumper-years-visible{opacity:1;visibility:visible;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);pointer-events:auto}div.datedropper .picker-jumped-years>div{float:left;width:50%;padding:4px;position:relative;cursor:pointer}div.datedropper .picker-jumped-years>div:before{content:"";display:block;border-radius:6px;padding:16px;padding-bottom:50%;background-color:rgba(0, 0, 0, 0.05)}div.datedropper .picker-jumped-years>div:after{text-align:center;font-size:20px;content:attr(data-id);position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}div.datedropper .picker-jumped-years>div:hover:before{background-color:rgba(0, 0, 0, 0.025)}div.datedropper.picker-lg{width:300px}div.datedropper.picker-lg ul.pick.pick-d{-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);height:0!important}div.datedropper.picker-lg .pick-lg{height:256px}@media only screen and (max-width:479px){div.datedropper.picker-lg{width:auto!important;height:auto!important;top:1rem!important;left:1rem!important;right:1rem!important;bottom:1rem!important;-webkit-transform:none;-ms-transform:none;transform:none}div.datedropper.picker-lg.picker-modal{width:100%!important;height:100%!important;padding:1rem!important}div.datedropper.picker-lg .picker{height:100%}div.datedropper.picker-lg .picker .pick{max-height:unset!important}div.datedropper.picker-lg .pick-lg{height:62%!important;max-height:unset!important}div.datedropper.picker-lg .pick-lg .pick-lg-h{height:16.6666666667%}div.datedropper.picker-lg .pick-lg .pick-lg-b{height:83.3333333333%}div.datedropper.picker-lg .pick-lg .pick-lg-b li{height:16.6666666667%}div.datedropper.picker-lg .picker-jumped-years{top:13%!important;padding-bottom:12%!important}div.datedropper.picker-lg .pick-l,div.datedropper.picker-lg .pick-m,div.datedropper.picker-lg .pick-y{height:13%!important}div.datedropper.picker-lg .pick-btns{height:12%!important}}@-webkit-keyframes picker_rumble{0%,to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-2px, 0, 0);transform:translate3d(-2px, 0, 0)}20%,40%,60%,80%{-webkit-transform:translate3d(2px, 0, 0);transform:translate3d(2px, 0, 0)}}@keyframes picker_rumble{0%,to{-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-2px, 0, 0);transform:translate3d(-2px, 0, 0)}20%,40%,60%,80%{-webkit-transform:translate3d(2px, 0, 0);transform:translate3d(2px, 0, 0)}}div.datedropper .picker-rumble{-webkit-animation:picker_rumble .4s ease;animation:picker_rumble .4s ease}div.datedropper.picker-locked .pick-submit{opacity:0.35}div.datedropper.picker-locked .pick-submit:hover{-webkit-box-shadow:none!important;box-shadow:none!important}div.datedropper.picker-modal{top:50%!important;left:50%!important;-webkit-transform:translate3d(-50%, -50%, 0)!important;transform:translate3d(-50%, -50%, 0)!important;position:fixed!important;margin:0!important}div.datedropper.picker-modal:before{display:none}div.datedropper.picker-fxs{-webkit-transition:opacity .2s ease,visibility .2s ease, margin .2s ease;-o-transition:opacity .2s ease,visibility .2s ease, margin .2s ease;transition:opacity .2s ease,visibility .2s ease, margin .2s ease}@media only screen and (min-width:480px){div.datedropper.picker-fxs.picker-transit{-webkit-transition:width 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), opacity 0.2s ease, visibility 0.2s ease, margin 0.2s ease;-o-transition:width 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), opacity 0.2s ease, visibility 0.2s ease, margin 0.2s ease;transition:width 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), opacity 0.2s ease, visibility 0.2s ease, margin 0.2s ease}div.datedropper.picker-fxs.picker-transit .pick-lg{-webkit-transition:height 0.8s cubic-bezier(1, -0.55, 0.2, 1.37);-o-transition:height 0.8s cubic-bezier(1, -0.55, 0.2, 1.37);transition:height 0.8s cubic-bezier(1, -0.55, 0.2, 1.37)}div.datedropper.picker-fxs.picker-transit .pick-d{-webkit-transition:top 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), height 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), background-color 0.4s ease, -webkit-transform 0.8s cubic-bezier(1, -0.55, 0.2, 1.37);transition:top 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), height 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), background-color 0.4s ease, -webkit-transform 0.8s cubic-bezier(1, -0.55, 0.2, 1.37);-o-transition:top 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), transform 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), height 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), background-color 0.4s ease;transition:top 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), transform 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), height 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), background-color 0.4s ease;transition:top 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), transform 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), height 0.8s cubic-bezier(1, -0.55, 0.2, 1.37), background-color 0.4s ease, -webkit-transform 0.8s cubic-bezier(1, -0.55, 0.2, 1.37)}}div.datedropper.picker-fxs ul.pick.pick-y{-webkit-transition:background-color .4s ease;-o-transition:background-color .4s ease;transition:background-color .4s ease}div.datedropper.picker-fxs ul.pick li{-webkit-transition:opacity .4s ease, -webkit-transform .4s ease;transition:opacity .4s ease, -webkit-transform .4s ease;-o-transition:transform .4s ease, opacity .4s ease;transition:transform .4s ease, opacity .4s ease;transition:transform .4s ease, opacity .4s ease, -webkit-transform .4s ease}div.datedropper.picker-fxs ul.pick .pick-arw{-webkit-transition:opacity .2s ease, -webkit-transform .2s ease;transition:opacity .2s ease, -webkit-transform .2s ease;-o-transition:transform .2s ease, opacity .2s ease;transition:transform .2s ease, opacity .2s ease;transition:transform .2s ease, opacity .2s ease, -webkit-transform .2s ease}div.datedropper.picker-fxs ul.pick .pick-arw i{-webkit-transition:right .2s ease, left .2s ease;-o-transition:right .2s ease, left .2s ease;transition:right .2s ease, left .2s ease}div.datedropper.picker-fxs .picker-jumped-years{-webkit-transition:opacity .2s ease, visibility .2s ease, -webkit-transform .2s ease;transition:opacity .2s ease, visibility .2s ease, -webkit-transform .2s ease;-o-transition:transform .2s ease, opacity .2s ease, visibility .2s ease;transition:transform .2s ease, opacity .2s ease, visibility .2s ease;transition:transform .2s ease, opacity .2s ease, visibility .2s ease, -webkit-transform .2s ease}div.datedropper.picker-fxs .pick-lg .pick-lg-b li{-webkit-transition:background-color .2s ease;-o-transition:background-color .2s ease;transition:background-color .2s ease}div.datedropper.picker-fxs .pick-btns .pick-submit{-webkit-transition:top .2s ease, background-color .4s ease, -webkit-box-shadow .4s ease;transition:top .2s ease, background-color .4s ease, -webkit-box-shadow .4s ease;-o-transition:top .2s ease, box-shadow .4s ease, background-color .4s ease;transition:top .2s ease, box-shadow .4s ease, background-color .4s ease;transition:top .2s ease, box-shadow .4s ease, background-color .4s ease, -webkit-box-shadow .4s ease}div.datedropper.picker-fxs .pick-btns .pick-submit svg{height:18px}div.datedropper.picker-fxs .pick-btns .pick-btn{-webkit-transition:all .2s ease;-o-transition:all .2s ease;transition:all .2s ease}div.datedropper.picker-fxs .pick-btns .pick-btn svg{width:18px;height:18px}div.datedropper .null{-webkit-transition:none;-o-transition:none;transition:none}div.datedropper:not(.picker-lg){width:180px!important;width:var(--dd-width)!important}div.datedropper .picker{-webkit-box-shadow:0 0 32px 0 rgba(0, 0, 0, 0.1)!important;box-shadow:0 0 32px 0 rgba(0, 0, 0, 0.1)!important;-webkit-box-shadow:var(--dd-shadow)!important;box-shadow:var(--dd-shadow)!important}div.datedropper .pick:focus:after,div.datedropper .pick:hover:after,div.datedropper .picker{border-radius:6px!important;border-radius:var(--dd-radius)!important}div.datedropper .picker-jumped-years{border-bottom-left-radius:6px!important;border-bottom-right-radius:var(--dd-radius)!important}div.datedropper .pick-dir div,div.datedropper .pick-lg-b .pick-sl:before,div.datedropper .pick-lg-h,div.datedropper .pick-submit,div.datedropper:not(.picker-clean) .pick:first-of-type,div.datedropper:not(.picker-clean):before{background-color:#fd4741!important;background-color:var(--dd-color1)!important}div.datedropper .pick-btn,div.datedropper .pick-lg-b .pick-wke,div.datedropper .pick-lg-b li:not(.pick-sl):not(.pick-h):hover:after,div.datedropper .pick-y.pick-jump,div.datedropper .picker+div,div.datedropper .pick li span{color:#fd4741!important;color:var(--dd-color1)!important}div.datedropper .pick-btn,div.datedropper .pick-btn:hover,div.datedropper .pick-l,div.datedropper .pick-lg-b li:not(.pick-sl):not(.pick-h):hover:before,div.datedropper .picker,div.datedropper .picker-jumped-years,div.datedropper:before{background-color:white!important;background-color:var(--dd-color2)!important}div.datedropper .pick-arw,div.datedropper .pick-l,div.datedropper .picker{color:#4D4D4D!important;color:var(--dd-color3)!important}div.datedropper .pick-lg-b .pick-sl:after,div.datedropper .pick-lg-h,div.datedropper .pick-submit,div.datedropper:not(.picker-clean) .pick:first-of-type,div.datedropper:not(.picker-clean) .pick:first-of-type *{color:white!important;color:var(--dd-color4)!important}';

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
            'autoInit' => true,
            'inlineCss' => $this->inlineCss
        ]);
        $this->view->registerJs("\$.dateDropperSetup = $js;", View::POS_READY, 'dateDropperSetup');

        $this->clientOptions = $this->getClientOptions();

        $this->registerPlugin('dateDropper');

        return ($this->hasModel())
            ? Html::activeInput('text', $this->model, $this->attribute)
            : Html::input($this->name, $this->value);
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
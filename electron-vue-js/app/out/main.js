!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=3)}([function(e,n){e.exports=require("electron")},function(e,n){e.exports=require("url")},function(e,n){e.exports=require("path")},function(e,n,t){e.exports=t(4)},function(e,n,t){"use strict";t.r(n);var o=t(0),r=t(1),u=t(2);t(5);let i=null;function c(){(i=new o.BrowserWindow({width:800,height:600,show:!1,webPreferences:{nodeIntegration:!0}})).on("ready-to-show",function(){i&&(i.show(),i.focus())}),i.on("closed",function(){i=null});{i.removeMenu?i.removeMenu():i.setMenu(null);const e=i.loadURL(Object(r.format)({pathname:Object(u.join)(__dirname,"index.html"),protocol:"file:",slashes:!0}));void 0!==e&&"function"==typeof e.then&&"function"==typeof e.catch&&e.catch(e=>{console.log(e)})}}function f(){i||c()}o.app.on("window-all-closed",function(){"darwin"!==process.platform&&o.app.quit()}),o.app.on("activate",function(){null===i&&c()}),"function"==typeof o.app.whenReady?o.app.whenReady().then(f):o.app.on("ready",f)},function(e,n){e.exports=require("fs")}]);
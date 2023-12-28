/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property laws,
* including trade secret and or copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/
const SELECTOR_FOR_VISIBLE_LIGHTBOX_VIEWER='.a-b-Sh-ng.a-b-va-Zf:not([style*="display: none;"])',PDF_MIME_TYPE="application/pdf",FILE_ROW_SELECTOR='.O5x1db.ACGwFc:not([data-double-click-handler-added="true"])',CUSTOM_ATTRIBUTE_NAME="data-double-click-handler-added",getVisibleLightBoxViewerElement=()=>document.querySelector(SELECTOR_FOR_VISIBLE_LIGHTBOX_VIEWER),fileRowDoubleClickCallback=()=>{setTimeout((()=>{try{const e=document.querySelector(SELECTOR_FOR_VISIBLE_LIGHTBOX_VIEWER);e&&sendAnalyticsIfPDF(e)}catch(e){}}),1e3)},sendAnalyticsIfPDF=e=>{try{const t=JSON.parse(e.querySelector("#drive-active-item-info")?.textContent);t&&t?.mimeType===PDF_MIME_TYPE&&chrome.runtime.sendMessage({main_op:"analytics",analytics:[["DCBrowserExt:Gdrive:PDF:Viewer"]]})}catch(e){}},addDoubleClickListenerToFileRow=e=>{try{e.addEventListener("dblclick",fileRowDoubleClickCallback)}catch(e){}},addDoubleClickEventListenerToAllFileRows=()=>{try{const e=document.querySelectorAll(FILE_ROW_SELECTOR);for(let t of e){const e=t.closest("[role='row']");t.getAttribute(CUSTOM_ATTRIBUTE_NAME)||(t.setAttribute(CUSTOM_ATTRIBUTE_NAME,"true"),addDoubleClickListenerToFileRow(e))}}catch(e){}};function addBodyObserver(){try{const e={childList:!0,subtree:!0};new MutationObserver((function(e){for(let t of e)if(t.addedNodes&&document.querySelector(FILE_ROW_SELECTOR)){addDoubleClickEventListenerToAllFileRows();break}})).observe(document.body,e)}catch(e){}}addBodyObserver();
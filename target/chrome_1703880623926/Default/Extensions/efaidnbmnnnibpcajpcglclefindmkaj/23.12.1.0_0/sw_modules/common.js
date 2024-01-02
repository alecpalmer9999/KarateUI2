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
import{util as e}from"./util.js";import{Proxy as t}from"./proxy.js";import{analytics as i}from"../common/analytics.js";import{SETTINGS as s}from"./settings.js";import{dcLocalStorage as r}from"../common/local-storage.js";let n=null,o={prod:{cloud_host:"https://cloud.acrobat.com/",redirect_uri:"https://createpdf.acrobat.com/static/js/aicuc/cpdf-template/sign_in_complete.html",cpdf_host:"https://createpdf.acrobat.com/",frictionless_uri:"https://acrobat.adobe.com/proxy/hosted-extension/iframe-index.html",env:"prod",viewer_ims_client_id:"dc-prod-chrome-viewer",acrobat_viewer_uri:"https://acrobat.adobe.com/proxy/chrome-viewer/index.html",imsURL:"https://ims-na1.adobelogin.com",floodgateUri:"https://p13n.adobe.io/fg/api",imsLibUrl:"https://auth.services.adobe.com/imslib/imslib.min.js",dcApiUri:"https://dc-api.adobe.io",viewer_ims_client_id_social:"dc-prod-chrome-viewer-social",uninstall_url:"https://acrobat.adobe.com/proxy/chrome-viewer/index.html?la=true#/uninstall",welcomePdfUrlHost:"https://acrobat.adobe.com",ims_context_id:"v:2,s,9122f250-90cf-11ed-9fe5-b3719c660a78",loggingUri:"https://dc-api.adobe.io",viewer_uri:{latest_uri:"https://acrobat.adobe.com/proxy/chrome-viewer/index.html",internal_uri:"https://acrobat.adobe.com/proxy/chrome-viewer/index.html",external_uri:"https://acrobat.adobe.com/proxy/chrome-viewer/1.0.4/index.html",version_template:"https://acrobat.adobe.com/proxy/chrome-viewer/{VERSION}/index.html"},version_config_uri:"https://acrobat.adobe.com/dc-chrome-extension/version-config.json",popup_cdn_uri:"https://acrobat.adobe.com/dc-hosted-extension/react-index.html"}};export function deriveCDNURL(e="prod"){if(!r.getItem("enableCDNVersioning"))return o[e]?.acrobat_viewer_uri;let t;const i="prod"===e?"prod":"non_prod";let s=o[e]?.viewer_uri.external_uri;try{const n=r.getItem("adobeInternal");"true"===n&&(s=o[e]?.viewer_uri.internal_uri);const a=r.getItem("version-config");a&&(t="true"===n?a[`iv_${i}`]:a[`ev_${i}`],t&&""!==t&&null!==t&&(s="latest"===t?o[e]?.viewer_uri.latest_uri:o[e]?.viewer_uri.version_template.replace(new RegExp("{VERSION}","g"),t)))}catch{}return s}export function onMessageListener(e){const t=e.env;switch(e.requestType){case"update_env":{const e=o[t],i=deriveCDNURL(t),s=e.viewer_ims_client_id,n=e.viewer_ims_client_id_social,a=e.ims_context_id,h=e.imsURL,l=e.imsLibUrl,c=e.dcApiUri,d=new URL(e.uninstall_url);d.searchParams.append("callingApp",chrome.runtime.id),d.searchParams.append("theme",r.getItem("theme")||"auto");try{r.setItem("cdnUrl",i),r.setItem("viewerImsClientId",s),r.setItem("viewerImsClientIdSocial",n),r.setItem("imsContextId",a),r.setItem("imsURL",h),r.setItem("imsLibUrl",l),r.setItem("dcApiUri",c),chrome.runtime.setUninstallURL(d.href)}catch(e){}break}}}class a{constructor(){this.$GET_headers={Accept:"application/vnd.adobe.dex+json;version=1",Authorization:null,"x-api-client-id":"api_browser_ext"},this.$POST_headers={Accept:"application/vnd.adobe.dex+json;version=1","Content-Type":"application/vnd.adobe.dex+json;version=1;charset=utf-8",Authorization:null,"x-api-client-id":"api_browser_ext"},this.reset()}proxy(...e){return t.proxy.bind(this)(...e)}uuid(){return"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g,(function(){return"0123456789abcdef"[Math.floor(16*Math.random())]}))}deriveCDNURL(e="prod"){return deriveCDNURL(e)}reset(t="prod"){this.settings={cpdf_api:null,files_host:null,files_api:null,files_upload:null,files_root:null,fillsign_api:null,auth_token:null,ims_host:null},this.server=o[t]||o[Object.keys(o)[0]];const i=this.deriveCDNURL(t);this.settings=e.extend(this.settings,this.server),this.settings={...this.settings,acrobat_viewer_uri:i}}connected(){return!!this.settings.auth_token}setGlobals(e){this.globals=e}async getFrictionlessUri(){return this.settings.frictionless_uri||o.prod.frictionless_uri}async getPopupCDNUrl(){return this.settings.popup_cdn_uri||o.prod.popup_cdn_uri}getUninstallUrl(){return this.settings.uninstall_url?this.settings.uninstall_url:o.prod.uninstall_url}getVersionConfigUrl(){return this.settings.version_config_uri?this.settings.version_config_uri:o.prod.version_config_uri}getEnv(){return this.settings.env||"prod"}getViewerIMSClientId(){return this.settings.viewer_ims_client_id?this.settings.viewer_ims_client_id:o.prod.viewer_ims_client_id}getViewerIMSClientIdSocial(){return this.settings.viewer_ims_client_id_social?this.settings.viewer_ims_client_id_social:o.prod.viewer_ims_client_id_social}getImsContextId(){return this.settings.ims_context_id?this.settings.ims_context_id:o.prod.ims_context_id}getIMSurl(){return this.settings.imsURL?this.settings.imsURL:o.prod.imsURL}getImsLibUrl(){return this.settings.imsLibUrl?this.settings.imsLibUrl:o.prod.imsLibUrl}getDcApiUri(){return this.settings.dcApiUri?this.settings.dcApiUri:o.prod.dcApiUri}getFloodgateuri(){return this.settings.floodgateUri?this.settings.floodgateUri:o.prod.floodgateUri}getWelcomePdfUrlHost(){return this.settings.welcomePdfUrlHost?this.settings.welcomePdfUrlHost:o.prod.welcomePdfUrlHost}getLoggingUri(){return"development"===r.getItem("installSource")?"https://dc-api-stage.adobe.io":this.settings.loggingUri?this.settings.loggingUri:o.prod.loggingUri}GET_headers(){return this.$GET_headers["x-request-id"]=this.uuid(),this.$GET_headers.Authorization=this.settings.auth_token,this.$GET_headers}POST_headers(){return this.$POST_headers["x-request-id"]=this.uuid(),this.$POST_headers.Authorization=this.settings.auth_token,this.$POST_headers}noToken(e){e&&e.reject()}filesBaseUris(){var t=e.Deferred();return this.settings.files_api?t.resolve():e.ajax({url:this.settings.files_host+"api/base_uris",headers:{Accept:this.GET_headers().Accept,"x-api-client-id":this.GET_headers()["x-api-client-id"]}}).then(this.proxy((function(e){this.settings.files_api=e.api,this.settings.files_upload=e.upload,t.resolve()})),(function(){t.reject()})),t.promise()}cloudBaseUris(){var t=e.Deferred();return this.settings.cloud_api?t.resolve():e.ajax({url:this.settings.cloud_host+"api/base_uris",headers:{Accept:this.GET_headers().Accept,"x-api-client-id":this.GET_headers()["x-api-client-id"]}}).then(this.proxy((function(e){this.settings.cloud_api=e.api,this.settings.files_host=e.files,this.settings.fillsign_api=e.fss,this.settings.ims_host=e.ims,this.settings.cpdf_api=e.cpdf,t.resolve()})),(function(){t.reject()})),t.promise()}baseUris(){var t=e.Deferred();return this.cloudBaseUris().done(this.proxy((function(){this.filesBaseUris().done(this.proxy((function(){t.resolve()})))}))),t.promise()}connect(){var t=e.Deferred();return this.settings.auth_code?(this.baseUris().then(this.proxy((function(){if(this.settings.auth_code){var s={grant_type:"authorization_code",code:this.settings.auth_code,client_id:this.settings.ims_client_id,client_secret:this.settings.ims_client_secret};e.ajax({url:this.settings.ims_host+"ims/token/v1",type:"POST",data:s,contentType:"application/x-www-form-urlencoded;charset=UTF-8"}).then(this.proxy((function(s){var r=(new Date).getTime(),n=/@adobe(test)?\.com$/i.test(s.email);this.settings.auth_code=null,n?(this.settings.auth_token="Bearer "+s.access_token,this.settings.refresh_token=s.refresh_token,this.settings.token_expiry=r+s.expires_in,this.settings.refresh_time=r+s.expires_in/2,this.settings.displayName=s.displayName,t.resolve(),e.consoleLog("got auth token")):(alert("PDF Helper Extension is available to Adobe Employees only"),i.event(i.e.EXTENSION_FORCE_UNINSTALL),chrome.management.uninstallSelf())})),this.proxy((function(){this.noToken(t)})))}else this.noToken(t)})),this.proxy((function(){this.noToken(t)}))),t.promise()):(t.reject(),t.promise())}refreshToken(t){var i,s=(new Date).getTime(),r=e.Deferred();return this.settings.refresh_token?!t&&s<this.settings.refresh_time?r.resolve():s>this.settings.token_expiry?r.reject():(i={grant_type:"refresh_token",refresh_token:this.settings.refresh_token,client_id:this.settings.ims_client_id,client_secret:this.settings.ims_client_secret},e.ajax({url:this.settings.ims_host+"ims/token/v1",type:"POST",data:i,contentType:"application/x-www-form-urlencoded; charset=UTF-8"}).then(this.proxy((function(t){var i=(new Date).getTime();this.settings.auth_token="Bearer "+t.access_token,this.settings.refresh_token=t.refresh_token,this.settings.token_expiry=i+t.expires_in,this.settings.refresh_time=i+t.expires_in/2,r.resolve(),e.consoleLog("refresh token result"),e.consoleLogDir(t)})),this.proxy((function(){this.noToken(r)})))):r.reject(),r.promise()}ajaxReady(t){let i=e.Deferred();return this.settings.auth_token?this.refreshToken(t).then(this.proxy((function(){i.resolve()})),this.proxy((function(){this.noToken(i)}))):this.connect().then(this.proxy((function(){this.settings.files_root?i.resolve():e.ajax({url:this.settings.files_api+"root",type:"GET",headers:this.GET_headers()}).then(this.proxy((function(e){i.resolve(),this.settings.files_root=e.id})),this.proxy((function(){this.noToken(i)})))})),this.proxy((function(){this.noToken(i)}))),i.promise()}sso_url(t){return e.ajax({url:this.settings.cloud_api+"session/sso_uri?path="+t,type:"GET",headers:this.GET_headers()})}authorize(e){return this.settings.auth_code=e,this.settings.auth_token=null,delete this.settings.refresh_token,delete this.settings.token_expiry,delete this.settings.refresh_time,this.ajaxReady()}clearAuth(){this.settings.auth_token&&(e.ajax({url:this.settings.cloud_api+"session",type:"DELETE",headers:this.$POST_headers}),delete this.settings.auth_token,delete this.settings.refresh_token,delete this.settings.token_expiry,delete this.settings.refresh_time,delete this.settings.displayName)}LOG(t,i){return e.Deferred().resolve()}}n||(n=new a,e.ajaxError((function(e,t,i,s){401===t.status&&n.clearAuth()})));export const common=n;
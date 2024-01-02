(()=>{"use strict";var e;let t;!function(e){e[e.Background=1]="Background",e[e.ActiveTabTopContent=2]="ActiveTabTopContent",e[e.ActiveTabTopPage=3]="ActiveTabTopPage",e[e.AllContents=4]="AllContents",e[e.AllPages=5]="AllPages",e[e.OwnerContent=6]="OwnerContent",e[e.OwnedPage=7]="OwnedPage",e[e.OptionsPage=8]="OptionsPage",e[e.ActionPage=9]="ActionPage",e[e.SiblingContent=10]="SiblingContent",e[e.SiblingMediator=11]="SiblingMediator",e[e.Offscreen=12]="Offscreen"}(e||(e={})),t="undefined"!=typeof chrome?chrome:browser;const n=t.runtime.sendMessage;t.runtime.reload,t.runtime.onInstalled;class s{constructor(e){this.name=e}set(e){this.data=e}get(){if(void 0===this.data)throw`'${this.name} - data was not yet set`;return this.data}}const o=new s("currentMessageOriginProvider"),i=new s("mediatorToContentRouterConnectorProvider"),r=e=>((e,n)=>new Promise(((s,i)=>{const r=n;r.originPart=o.get(),e(r,(e=>{const n=t.runtime.lastError;n?i("Runtime last error: "+n.message):(null==e?void 0:e.success)?s(e.result):i(null==e?void 0:e.error)}))})))(n,e);var a;!function(e){e[e.Deny=0]="Deny",e[e.Accept=1]="Accept",e[e.Neutral=2]="Neutral"}(a||(a={}));const c=(e,t)=>{for(let n=0;n<e.length;n++){const s=e[n].getFilterResult(t);if(s==a.Deny)return!1;if(s==a.Accept)return!0}return!0};var l;!function(e){e[e.Silly=0]="Silly",e[e.Verbose=1]="Verbose",e[e.Debug=2]="Debug",e[e.Info=3]="Info",e[e.Warn=4]="Warn",e[e.Error=5]="Error"}(l||(l={}));const u="Communication",d=[],h=[],g=new class{constructor(e,t){this.appenders=e,this.logFilters=t,this.logsPerLevel=100,this.allLogs={},this.sendTimeByMessage={};for(const e in l){const t=Number(l[e]);this.allLogs[t]=[]}}getHistory(e){return this.allLogs[e]}log(e,t,n,s){const o={level:e,message:t,subject:s,data:n,time:Date.now()};c(this.logFilters,o)&&(this.addToLogHistory(o),this.appenders.map((e=>{try{e.log(o)}catch(e){}})))}addToLogHistory(e){for(const t in l){const n=Number(l[t]);if(n<=e.level){const t=this.allLogs[n];for(t.push(e);t.length>this.logsPerLevel;)t.splice(0,1)}}}silly(e,t,n){this.log(l.Silly,e,t,n)}verbose(e,t,n){this.log(l.Verbose,e,t,n)}trace(e,t,n){this.log(l.Verbose,e,t,n)}debug(e,t,n){this.log(l.Debug,e,t,n)}info(e,t,n){this.log(l.Info,e,t,n)}warn(e,t,n){this.log(l.Warn,e,t,n)}error(e,t,n){this.log(l.Error,e,t,n)}daily(e,t,n,s,o){this.limited(e,t,n,864e5,s,o)}limited(e,t,n,s,o,i){const r=Date.now(),a=this.sendTimeByMessage[n];void 0!==a&&r-a<s?this.log(t,n,o,i):(this.sendTimeByMessage[n]=r,this.log(e,n,o,i))}}(h,d);const v=new class{constructor(e){this.name=e,this.wasSet=!1}set(e){g.debug(`${this.name} - getAsync - setting data`,e),this.data=e,this.wasSet=!0,this.resolveFunc&&(this.resolveFunc(e),this.resolveFunc=void 0,this.resolvePromise=void 0)}get(){return e=this,t=void 0,s=function*(){return this.wasSet?(g.trace(`${this.name} - getAsync - data already available`,this.data),this.data):(this.resolvePromise||(g.debug(`${this.name} - getAsync - creating promise`),this.resolvePromise=new Promise((e=>{this.resolveFunc=e}))),this.resolvePromise)},new((n=void 0)||(n=Promise))((function(o,i){function r(e){try{c(s.next(e))}catch(e){i(e)}}function a(e){try{c(s.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,a)}c((s=s.apply(e,t||[])).next())}));var e,t,n,s}getSync(){return{wasSet:this.wasSet,data:this.data}}}("mediatorToContentMessageSenderProvider");const f=e=>{return t=void 0,n=void 0,o=function*(){return(yield v.get()).send(e)},new((s=void 0)||(s=Promise))((function(e,i){function r(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(r,a)}c((o=o.apply(t,n||[])).next())}));var t,n,s,o};const m=(n,s)=>{return o=void 0,a=void 0,l=function*(){switch(n){case e.Background:return(e=>(()=>{var e;try{return!!(null===(e=null==t?void 0:t.runtime)||void 0===e?void 0:e.id)}catch(e){return!1}})()?r(e):(i.get().stop(),Promise.reject()))(s);case e.SiblingContent:return f(s)}},new((c=void 0)||(c=Promise))((function(e,t){function n(e){try{i(l.next(e))}catch(e){t(e)}}function s(e){try{i(l.throw(e))}catch(e){t(e)}}function i(t){var o;t.done?e(t.value):(o=t.value,o instanceof c?o:new c((function(e){e(o)}))).then(n,s)}i((l=l.apply(o,a||[])).next())}));var o,a,c,l};class w{handleMessage(e,t,n){return f(e).then((e=>{t&&t({success:!0,result:e})})).catch((e=>{t&&t({success:!1,error:e})})),!0}}const p=e=>null==e?void 0:e.data,y=e=>e.message;class x{constructor(e,t,n){this.action=e,this.allowedOrigins=t,this.blockedOrigins=n}handle(e,t){return n=this,s=void 0,i=function*(){if(g.trace("messageHandler handle called",e,u),e.action!=this.action)throw"unsupported action: "+e.action+", expected: "+this.action;const n=e.data;return this.handleImpl(n,t)},new((o=void 0)||(o=Promise))((function(e,t){function r(e){try{c(i.next(e))}catch(e){t(e)}}function a(e){try{c(i.throw(e))}catch(e){t(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(r,a)}c((i=i.apply(n,s||[])).next())}));var n,s,o,i}}class b extends x{constructor(e,t){super(e),this.handler=t}handleImpl(e,t){return this.handler(e,t)}}class M{static empty(){return"ffffffffffffffffffffffffffffffff"}static newGuid(){return M.newGuidByPattern("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx")}static newGuidNoHyphens(){return M.newGuidByPattern("xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx")}static newGuidByPattern(e){return e.replace(/[xy]/g,(e=>{const t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}))}}let P=0;const C=`testListenerAlive.${M.newGuidNoHyphens()}`,R=(e,t)=>new Promise((n=>{const s=`${C}.${P++}`;((e,t,n)=>{const s=new b(e,(s=>{return o=void 0,i=void 0,a=function*(){clearTimeout(s),t.removeMessageHandler(e),n(!0)},new((r=void 0)||(r=Promise))((function(e,t){function n(e){try{c(a.next(e))}catch(e){t(e)}}function s(e){try{c(a.throw(e))}catch(e){t(e)}}function c(t){var o;t.done?e(t.value):(o=t.value,o instanceof r?o:new r((function(e){e(o)}))).then(n,s)}c((a=a.apply(o,i||[])).next())}));var o,i,r,a}));t.addMessageHandler(s)})(s,e,n);const o=setTimeout((()=>{e.removeMessageHandler(s),n(!1)})),i=((e,t)=>({action:e,data:t,needsResponse:!1}))(s,o);t.send(i,!0)}));class L{constructor(e){this.handleEvent=e}handle(e){this.handleEvent(e)}canHandle(e){return(e=>{const t=p(e);if(!t)return!1;const n=y(t);return!!n&&!!n.action})(e)}}class O{constructor(e){this.communicationObject=e,this.communicationMessageHandlers=[]}start(){this.communicationObject.registerOnMessage((e=>this.handleMessageEvent(e)))}stop(){this.communicationObject.unregister()}reRegisterCommunication(){this.communicationObject.registerOnMessage((e=>this.handleMessageEvent(e)))}addCommunicationMessageHandler(e){this.communicationMessageHandlers.push(e)}handleMessageEvent(e){this.communicationMessageHandlers.map((t=>{try{t.canHandle(e)&&t.handle(e)}catch(n){g.debug("failed handling event",{event:e,handler:t,exception:n},u)}}))}}class H{constructor(e,t,n,s){this.responder=e,this.selfSender=t,this.messageRouter=n,this.communicationObject=s,this.communicationObjectConnector=new O(this.communicationObject)}start(){this.communicationObjectConnector.start();const e=new L((e=>this.handleRegularRoutingMessage(e)));this.addCommunicationMessageHandler(e)}stop(){this.communicationObjectConnector.stop()}verifyCommunication(){return e=this,t=void 0,s=function*(){(yield R(this.messageRouter,this.selfSender))||this.communicationObjectConnector.reRegisterCommunication()},new((n=void 0)||(n=Promise))((function(o,i){function r(e){try{c(s.next(e))}catch(e){i(e)}}function a(e){try{c(s.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,a)}c((s=s.apply(e,t||[])).next())}));var e,t,n,s}addCommunicationMessageHandler(e){this.communicationObjectConnector.addCommunicationMessageHandler(e)}handleRegularRoutingMessage(e){const t=p(e),n=y(t);g.trace("CommunicationObjectMessageRouter - handling event",e,u),this.messageRouter.handleMessage(n,(e=>{this.sendResponse(t,e)}))}sendResponse(e,t){this.responder.sendResponse(e,t)}}const T="response";class S{constructor(e,t){this.postMessageFn=e,this.responseMessageHandler=t,this.runningMessageId=0}send(e,t=!1){return n=this,s=void 0,r=function*(){g.trace("CommunicationObjectMessageSender send called",e,u);const n=e;n.originPart=o.get();const s=this.createCommunictionObjectMessage(n);if(g.trace("CommunicationObjectMessageSender send wrapped message",s,u),!t)return new Promise(((e,t)=>{this.responseMessageHandler.waitForResponse(s.id,e,t),this.sendRaw(s)}));this.sendRaw(s)},new((i=void 0)||(i=Promise))((function(e,t){function o(e){try{c(r.next(e))}catch(e){t(e)}}function a(e){try{c(r.throw(e))}catch(e){t(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof i?n:new i((function(e){e(n)}))).then(o,a)}c((r=r.apply(n,s||[])).next())}));var n,s,i,r}sendResponse(e,t){var n;if((null===(n=e.message)||void 0===n?void 0:n.action)==T)return;const s={messageId:e.id,resultData:t},i={action:T,needsResponse:!1,data:s,originPart:o.get()};this.send(i,!0)}sendRaw(e){if(g.trace("CommunicationObjectMessageSender sendSync",e),!this.postMessageFn)throw"postMessageFn object wasn't initialized";this.postMessageFn(e)}createCommunictionObjectMessage(e){return{id:e.action+(new Date).getTime()+"_"+this.runningMessageId++,message:e}}}const I=T;class j extends x{constructor(){super(I),this.pendingRequests={}}handleImpl(e){return t=this,n=void 0,o=function*(){if(void 0===this.pendingRequests[e.messageId])return;const t=this.pendingRequests[e.messageId];delete this.pendingRequests[e.messageId],e.resultData.success?t.resolve(e.resultData.result):t.reject(e.resultData.error)},new((s=void 0)||(s=Promise))((function(e,i){function r(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(r,a)}c((o=o.apply(t,n||[])).next())}));var t,n,s,o}waitForResponse(e,t,n){this.pendingRequests[e]={resolve:t,reject:n}}}class k{constructor(e){this.doc=e,this.callbacks=[],this.observer=new MutationObserver((e=>{e.some((e=>Array.from(e.removedNodes).some((e=>e.toString().includes("DocumentType")))))&&this.runRegisteredCallbacks()}))}runRegisteredCallbacks(){this.callbacks.forEach((e=>{try{e()}catch(e){}}))}start(){this.observer.disconnect(),this.observer.observe(this.doc,{childList:!0})}stop(){this.observer.disconnect()}addListener(e){this.removeListener(e),this.callbacks.push(e)}removeListener(e){this.callbacks=this.callbacks.filter((t=>e!=t))}}let E;const $="forward",F="consoleLog",D="logToEventCollector",A={};A[F]=l.Verbose,A[D]=l.Verbose,A.getLibItems=l.Verbose,A[$]=l.Verbose,A[T]=l.Verbose;const N=e=>new Promise((t=>{setTimeout((()=>t()),e)})),B=(e,t)=>new Promise(((n,s)=>{let o=!1,i=!1;e.then((e=>{o||(i=!0,n(e))})).catch((e=>{o||s(e)})),N(t).then((()=>{i||(o=!0,s("timeout"))}))}));const V=new s("sendMessageProvider"),G=(e,t)=>{return n=void 0,s=void 0,i=function*(){return V.get()(t,e)},new((o=void 0)||(o=Promise))((function(e,t){function r(e){try{c(i.next(e))}catch(e){t(e)}}function a(e){try{c(i.throw(e))}catch(e){t(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(r,a)}c((i=i.apply(n,s||[])).next())}));var n,s,o,i};var W=function(e,t,n,s){return new(n||(n=Promise))((function(o,i){function r(e){try{c(s.next(e))}catch(e){i(e)}}function a(e){try{c(s.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,a)}c((s=s.apply(e,t||[])).next())}))};class q{constructor(e,t,n){var s,o,i;this.action=e,this.target=t,this.needsResponse=null===(s=null==n?void 0:n.needsResponse)||void 0===s||s,this.timeout=null!==(o=null==n?void 0:n.timeout)&&void 0!==o?o:3e3,this.autoRetry=null===(i=null==n?void 0:n.autoRetry)||void 0===i||i}createMessage(e){return{action:this.action,needsResponse:this.needsResponse,data:e}}send(e){var t;return W(this,void 0,void 0,(function*(){const n=null!==(t=A[this.action])&&void 0!==t?t:l.Debug;g.trace(`messageSender send was called for action ${this.action}`,e,u);const s=this.createMessage(e);g.log(n,`messageSender - sending message (${this.action})`,s,u);let o=0;for(;;)try{const e=G(s,this.target),t=yield B(e,this.timeout);return g.log(n,`messageSender - got result for message (${s.action})`,t,u),t}catch(e){if(!this.autoRetry){if(this.needsResponse)throw e;return}if(o++,o>5)throw g.debug(`messageSender failed for message (${s.action}), max retries reached.`,e,u),e;yield N(500),g.trace(`messageSender failed for message (${s.action}), retrying`,e,u)}throw"timeout"}))}}class U extends q{constructor(e,t,n){super(e,t,n)}send(e){const t=Object.create(null,{send:{get:()=>super.send}});return W(this,void 0,void 0,(function*(){return t.send.call(this,e)}))}}const J=new q("checkShouldRestoreCommunicationOnDocumentWrite",e.SiblingContent);const z=(e,t)=>{const n=(e=>((e,t,n)=>{let s;const o=e=>{s(e.detail)},i=(t,n)=>{const s=(o={data:n},"undefined"!=typeof cloneInto?cloneInto(o,e):o);var o;const i=new CustomEvent(t,{detail:s});e.dispatchEvent(i)};return{postMessage:e=>{i(n,e)},postToSelf:e=>{i(t,e)},registerOnMessage:n=>{e.removeEventListener(t,o),n&&(s=n,e.addEventListener(t,o))},unregister:()=>{e.removeEventListener(t,o)}}})(e,"wmContentToMediator","wmMediatorToContent"))(e),s=((e,t)=>{const n=t.getMessageHandler(I),s=null!=n?n:new j;n||t.addMessageHandler(s);const o=new S(e.postMessage,s),i=new S(e.postToSelf,s),r=new H(o,i,t,e);return r.start(),{routerConnector:r,sender:o,selfSender:i}})(n,t);_(e,s.routerConnector),v.set(s.sender),i.set(s.routerConnector)},_=(e,t)=>{return n=void 0,s=void 0,i=function*(){try{(yield J.send())&&(n=e.document,s=()=>t.verifyCommunication(),E||(E=new k(n),E.start()),E.addListener(s))}catch(e){}var n,s},new((o=void 0)||(o=Promise))((function(e,t){function r(e){try{c(i.next(e))}catch(e){t(e)}}function a(e){try{c(i.throw(e))}catch(e){t(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(r,a)}c((i=i.apply(n,s||[])).next())}));var n,s,o,i},K=new q("mediatorStarted",e.SiblingContent,{needsResponse:!1,autoRetry:!1});class Q extends x{constructor(){super($)}handleImpl(e){return t=this,n=void 0,o=function*(){const t=X(e);return G(t,e.destination)},new((s=void 0)||(s=Promise))((function(e,i){function r(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(r,a)}c((o=o.apply(t,n||[])).next())}));var t,n,s,o}}const X=e=>e.message;class Y{constructor(e=!1){this.ignoreUnhandledMessages=e,this.events={}}handleMessage(e,t,n){var s;const o=null!==(s=A[e.action])&&void 0!==s?s:l.Debug;if(g.log(o,`MessageRouter - handleMessage (${e.action})`,e,u),!e.action)return g.debug(`message ${e} has no action, ignoring.`),!1;const i=this.events[e.action],r=this.checkCanHandle(e,i);return r.canHandle?(i.handle(e,n).then((n=>{g.log(o,`MessageRouter - done handling (${e.action})`,n,u),t&&t({success:!0,result:n})})).catch((e=>{t&&t({success:!1,error:e})})),!0):(!this.ignoreUnhandledMessages&&t&&t({success:!1,error:r.reason}),!1)}addMessageHandler(e){if(this.events[e.action])throw`action ${e.action} was already registered`;this.events[e.action]=e}getMessageHandler(e){return this.events[e]}removeMessageHandler(e){delete this.events[e]}checkCanHandle(e,t){return t?this.isOriginBlockedForHandler(e,t)?(g.debug(`blocked message ${e.action} from ${e.originPart} due to blocked origin`),{canHandle:!1,reason:"origin not allowed"}):this.isOriginAllowedForHandler(e,t)?{canHandle:!0}:(g.debug(`blocked message ${e.action} from ${e.originPart} due to not allowed origin`),{canHandle:!1,reason:"origin not allowed"}):(g.debug(`message ${e.action} from ${e.originPart} has no handler`),{canHandle:!1,reason:"unknown action: "+e.action})}isOriginBlockedForHandler(e,t){return!(!t.blockedOrigins||!t.blockedOrigins.length)&&!(void 0!==e.originPart&&!t.blockedOrigins.includes(e.originPart))}isOriginAllowedForHandler(e,t){return!t.allowedOrigins||!t.allowedOrigins.length||!(void 0===e.originPart||!t.allowedOrigins.includes(e.originPart))}}const Z=e=>{t.runtime.onMessage.addListener(e)};class ee{constructor(e,t){this.registerToMessages=e,this.router=t}start(){this.registerToMessages(((e,t,n)=>this.handleNativeMessage(e,t,n)))}handleNativeMessage(e,t,n){g.trace("handleNativeMessage",e,u);const s=(e=>({tabId:e.tab?e.tab.id:void 0,tabUrl:e.tab?e.tab.url:void 0,frameId:e.frameId}))(t);return this.router.handleMessage(e,n,s)}}const te=(e,t)=>{if(t instanceof Error)try{const e={};return Object.getOwnPropertyNames(t).forEach((n=>{e[n]=t[n]})),e}catch(e){}return t};const ne=new U(D,e.Background,{needsResponse:!1}),se=e=>{return t=void 0,n=void 0,o=function*(){if(e.data)try{e.data=(e=>{if(void 0===e)return e;const t=JSON.stringify(e,te);return JSON.parse(t)})(e.data)}catch(e){}ne.send(e)},new((s=void 0)||(s=Promise))((function(e,i){function r(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(r,a)}c((o=o.apply(t,n||[])).next())}));var t,n,s,o},oe=new q("getLoggerConfiguration",e.Background),ie=()=>oe.send();class re{constructor(e){this.subjectsToDeny=e}getFilterResult(e){return e.subject&&this.subjectsToDeny.indexOf(e.subject)>-1?a.Deny:a.Neutral}}const ae=new s("currentExtensionPartProvider");class ce{getFilterResult(e){return a.Deny}}class le{constructor(e){this.minLogLevel=e}getFilterResult(e){return e.level<this.minLogLevel?a.Deny:a.Neutral}}class ue extends le{constructor(e){super(e),this.minLogLevel=e}getFilterResult(e){return"undefined"==typeof window||window==(null===window||void 0===window?void 0:window.top)?a.Neutral:super.getFilterResult(e)}}const de=["Content","Page","ContentMediator"],he=e=>{const t=[];e.enabled||t.push(new ce);const n=ae.get();return de.includes(n)&&t.push(new ue(e.minIframeLogLevel)),t.push(new le(e.minTopLogLevel)),t};new U(F,e.ActiveTabTopContent,{autoRetry:!1,needsResponse:!1});const ge=new s("logToConsoleProvider");var ve=function(e,t,n,s){return new(n||(n=Promise))((function(o,i){function r(e){try{c(s.next(e))}catch(e){i(e)}}function a(e){try{c(s.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,a)}c((s=s.apply(e,t||[])).next())}))};const fe=(...e)=>ve(void 0,void 0,void 0,(function*(){console.log(...e)}));class me{constructor(e,t){this.logFilters=e,this.rateLimitEnforcer=t,this.didNotifyRateExceed=!1}handleRateLimitBlock(e){var t;if(this.didNotifyRateExceed)return;this.didNotifyRateExceed=!0;const n=((e,t)=>({level:l.Warn,message:"Rate limit blocked",time:e.time,data:{blockedLogMessage:e,rateLimit:t}}))(e,null===(t=this.rateLimitEnforcer)||void 0===t?void 0:t.rateLimit);this.logImpl(n)}log(e){c(this.logFilters,e)&&(!this.rateLimitEnforcer||this.rateLimitEnforcer.isAllowed()?this.logImpl(e):this.handleRateLimitBlock(e))}}class we extends me{constructor(){super(...arguments),this.currentLogs=[]}logImpl(e){return t=this,n=void 0,o=function*(){const t=e.subject?e.subject+" - ":"",n=`[${l[e.level]}]`;if(!this.currentLogs.includes(e.message)){this.currentLogs.push(e.message);try{const s=ae.get();yield((...e)=>ve(void 0,void 0,void 0,(function*(){const t=ge.get();t&&(yield t(...e))})))(`${new Date(e.time).toISOString()} [${s}] - ${n} ${t}${e.message}`,e.data)}catch(e){}const s=this.currentLogs.indexOf(e.message);this.currentLogs.splice(s,1)}},new((s=void 0)||(s=Promise))((function(e,i){function r(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(r,a)}c((o=o.apply(t,n||[])).next())}));var t,n,s,o}}const pe=new s("logToEventCollectorProvider");class ye extends me{logImpl(e){return t=this,n=void 0,o=function*(){const t=e;t.extensionPart=ae.get();const n=pe.get();n&&n(t)},new((s=void 0)||(s=Promise))((function(e,i){function r(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(r,a)}c((o=o.apply(t,n||[])).next())}));var t,n,s,o}}const xe=new s("currentLoggerConfigProvider");class be{constructor(e){this.rateLimit=e,this.timesHistory=[]}addToHistory(e){for(this.timesHistory.push(e);this.timesHistory.length>this.rateLimit.maxTimesInInterval;)this.timesHistory.splice(0,1)}isAllowed(){const e=Date.now(),t=((e,t,n,s,o)=>e>=s&&void 0!==t&&n-t<o)(this.timesHistory.length,this.timesHistory[0],e,this.rateLimit.maxTimesInInterval,this.rateLimit.intervalInMs);return!t&&(this.addToHistory(e),!0)}}const Me=e=>{if(e)return new be(e)};var Pe,Ce;Ce=function*(){var e,t,n,s,i;yield(e={extensionPart:"ContentMediator",messageOrigin:"Content",fetchLogConfig:ie,logToEventCollector:se,sendMessageFunction:m},t=void 0,n=void 0,s=void 0,i=function*(){var t;ae.set(e.extensionPart),o.set(null!==(t=e.messageOrigin)&&void 0!==t?t:e.extensionPart),V.set(e.sendMessageFunction),(e=>{xe.set(e);const t=he(e.console),n=Me(e.console.rateLimit),s=new we(t,n),o=he(e.remote);o.push(new re([u]));const i=Me(e.remote.rateLimit),r=[s,new ye(o,i)];var a;a=[],d.length=0,a.map((e=>d.push(e))),(e=>{h.length=0,e.map((e=>h.push(e)))})(r)})(yield e.fetchLogConfig()),pe.set(e.logToEventCollector),ge.set(e.logToConsole||fe)},new(s||(s=Promise))((function(e,o){function r(e){try{c(i.next(e))}catch(e){o(e)}}function a(e){try{c(i.throw(e))}catch(e){o(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof s?n:new s((function(e){e(n)}))).then(r,a)}c((i=i.apply(t,n||[])).next())}))),g.debug("WalkMe Content Mediator - started");const r=new Y;var a;a=r,[new Q].map((e=>{try{a.addMessageHandler(e)}catch(e){}})),z(window,r),K.send();const c=new w;new ee(Z,c).start()},new((Pe=void 0)||(Pe=Promise))((function(e,t){function n(e){try{o(Ce.next(e))}catch(e){t(e)}}function s(e){try{o(Ce.throw(e))}catch(e){t(e)}}function o(t){var o;t.done?e(t.value):(o=t.value,o instanceof Pe?o:new Pe((function(e){e(o)}))).then(n,s)}o((Ce=Ce.apply(void 0,[])).next())}))})();
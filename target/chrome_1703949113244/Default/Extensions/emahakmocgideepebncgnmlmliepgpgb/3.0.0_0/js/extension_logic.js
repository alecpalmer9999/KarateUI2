// Copyright 2017 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines the ExtensionLogic object.
 */

class LegacyTechnologyDefinition {
  /**
   * @param {string} name The name of the technology.
   * @param {!Array<string>}  querySelectors
   * @param {function(!HTMLElement):boolean} nodeRequiresTech
   * @param {function(!HTMLElement): !Array<string>} getTechAttributes
   */
  constructor(name, querySelectors, nodeRequiresTech, getTechAttributes) {
    /** @const {string} */
    this.name = name;

    /** @const {!Array<string>} */
    this.querySelectors = querySelectors;

    /** @const {function(!HTMLElement):boolean} */
    this.nodeRequiresTech = nodeRequiresTech;

    /** @const {function(!HTMLElement): !Array<string>} */
    this.getTechAttributes = getTechAttributes;
  }

  /** @return {string} LegacyTechnologyDefinition string representation.*/
  toString() {
    return `{
      name: '${this.name}',
      querySelectors: '${this.querySelectors}',
      nodeRequiresTech: ${this.nodeRequiresTech},
      getTechAttributes: ${this.getTechAttributes}
    }`;
  }
}

class LegacyTechnologyRequiredResults {
  /**
   * @param {string} name Name of the legacy technology.
   * @param {!Array<string>} nodeAttributes List of the attributes of each nodes
   *     that requires that technology.
   */
  constructor(name, nodeAttributes) {
    this.name = name;
    this.nodeAttributes = nodeAttributes;
  }

  /** @return {string} LegacyTechnologyRequiredResults string representation.*/
  toString() {
    return `{
        name: ${this.name},
        nodeAttributes: ${this.nodeAttributes}
    }`;
  }
}

class UrlUsageStats {
  constructor() {
    this.totalActiveDuration = 0;
    this.activeSince = -1;
    this.totalFocusedDuration = 0;
    this.focusedSince = -1;
    this.updated = true;
    this.legacyTechnologies = [];
    this.legacyTechnologiesNodeAttributes = {};
    this.reportedEvents = [];
  }
}

/** Encapsulates the logic of the extension. */
class ExtensionLogic {
  constructor() {
    // Defines polling intervals for various events in seconds. This is the
    // resolution of the chrome.alarm API.
    this.UpdatePeriods = {
      FREQUENTLY_CHANGING_STATE: 30,   // 30min
      RARELY_CHANGING_STATE: 24 * 60,  // 24h
      PERSIST_DATA: 1,                 // 1min
      LOCK_STATUS_POLL_INTERVAL: 1     // 1min between polls.
    };

    // Half of the minimal delay for the report uploads retry rate.
    // It doubles this number every time it schedules a retry therefore the
    // initial retry delay is already double this number.
    this.MINIMAL_RETRY_HALF_DELAY = 0.5;  // 30sec
    this.MAXIMAL_RETRY_DELAY = 1440;      // 24h
    this.retryDelay = this.MINIMAL_RETRY_HALF_DELAY;

    this.port = null;
    this.db = null;
    // Unfortunately there is no way to know in advance is this really true.
    // We get message when this state changes but we can not know what is the
    // initial state.
    this.sessionLocked = false;
    this.reportingApiMessages = {};

    /** @const {!Array<!LegacyTechnologyDefinition>} */
    this.legacyTechnologyDefinitions = [
      new LegacyTechnologyDefinition(
          'flash',
          [
            'object[data]', 'object[src]', 'embed[data]', 'embed[src]',
            '[type="application/x-shockwave-flash"]'
          ],
          (node) => {
            const dataIsSwf = node.hasAttribute('data') &&
                node.getAttribute('data').endsWith('.swf');
            const srcIsSwf = node.hasAttribute('src') &&
                node.getAttribute('src').endsWith('.swf');
            const isFlashMime =
                node.getAttribute('type') === 'application/x-shockwave-flash';
            const nodeRequiresFlash = dataIsSwf || srcIsSwf || isFlashMime;
            return nodeRequiresFlash;
          },
          (node) => {
            let result = [];
            if (node.hasAttribute('type')) {
              result.push(`type:${node.getAttribute('type')}`);
            }
            if (node.hasAttribute('src')) {
              result.push(`src:${node.getAttribute('src')}`);
            }
            if (node.hasAttribute('data')) {
              result.push(`data:${node.getAttribute('data')}`);
            }
            return result;
          }),
      new LegacyTechnologyDefinition(
          'activeX',
          [
            'object[classid]', 'embed[classid]', 'object[data]', 'embed[data]',
            'object[src]', 'embed[src]', '[type="application/olescript"]'
          ],
          (node) => {
            const hasClassIdAttribute = node.hasAttribute('classid') &&
                node.getAttribute('classid').startsWith('clsid:');
            const dataIsAxs = node.hasAttribute('data') &&
                node.getAttribute('data').endsWith('.axs');
            const srcIsAxs = node.hasAttribute('src') &&
                node.getAttribute('src').endsWith('.axs');
            const isActiveXMime =
                node.getAttribute('type') === 'application/olescript';
            const nodeRequiresActiveX =
                hasClassIdAttribute || dataIsAxs || srcIsAxs || isActiveXMime;
            return nodeRequiresActiveX;
          },
          (node) => {
            let result = [];
            if (node.hasAttribute('type')) {
              result.push(`type:${node.getAttribute('type')}`);
            }
            if (node.hasAttribute('classid')) {
              result.push(`classid:${node.getAttribute('classid')}`);
            }
            if (node.hasAttribute('src')) {
              result.push(`src:${node.getAttribute('src')}`);
            }
            if (node.hasAttribute('data')) {
              result.push(`data:${node.getAttribute('data')}`);
            }
            return result;
          }),
      new LegacyTechnologyDefinition(
          'silverlight',
          [
            '[type^="application/x-silverlight"]',
            '[data^="data:application/x-silverlight"]'
          ],
          // If there is at least one node found, it requires silverlight.
          () => {
            return true;
          },
          (node) => {
            let result = [];
            if (node.hasAttribute('type')) {
              result.push(`type:${node.getAttribute('type')}`);
            }
            if (node.hasAttribute('data')) {
              result.push(`data:${node.getAttribute('data')}`);
            }
            return result;
          }),
      new LegacyTechnologyDefinition(
          'java',
          [
            'applet', '[archive]', '[code]', '[classid]',
            '[codetype="application/java"]', '[type="application/java"]'
          ],
          (node) => {
            const isApplet = node.nodeName === 'APPLET';
            const hasArchiveAttribute = node.hasAttribute('archive') &&
                node.getAttribute('archive').endsWith('.jar');
            const hasClassIdAttribute = node.hasAttribute('classid') &&
                node.getAttribute('classid').endsWith('.class');
            const hasCodeAttribute = node.hasAttribute('code') &&
                node.getAttribute('code').endsWith('.class');
            const isJavaCodeType =
                node.getAttribute('codetype') === 'application/java';
            const isJavaMime = node.getAttribute('type') === 'application/java';
            const nodeRequiresJava = isApplet || hasArchiveAttribute ||
                hasClassIdAttribute || hasCodeAttribute || isJavaCodeType ||
                isJavaMime;
            return nodeRequiresJava;
          },
          (node) => {
            let result = [];
            if (node.nodeName === 'APPLET') {
              result.push('applet');
            }
            if (node.hasAttribute('type')) {
              result.push(`type:${node.getAttribute('type')}`);
            }
            if (node.hasAttribute('codetype')) {
              result.push(`codetype:${node.getAttribute('codetype')}`);
            }
            if (node.hasAttribute('classid')) {
              result.push(`classid:${node.getAttribute('classid')}`);
            }
            if (node.hasAttribute('archive')) {
              result.push(`archive:${node.getAttribute('archive')}`);
            }
            return result;
          }),
    ];

    this.policyProvider = new PolicyProvider();
    this.logEntryFactory = new LogEntryFactory();
  }

  /**
   * Writes an item to the database.
   * @param {!LogEntry} item
   * @return {!Promise<number>} The id of the newly added item.
   */
  writeToDb(item) {
    if (!this.db) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['events'], 'readwrite');
      const store = transaction.objectStore('events');
      const request = store.add(item);
      request.onsuccess = event => resolve(event.target.result);
      request.onerror = (e) => {
        console.error('Error in transaction ' + e);
        reject();
      };
    });
  }

  /**
   * Gets and writes the specified log to the database.
   * @param {!PolicyNames} policy
   * @param {!TypeId} typeId
   * @param {!any} data
   * @return {!Promise<boolean>} True if something was successfully written to
   *     the database.
   */
  async maybeWriteEventLogEntryToDb(policy, typeId, data) {
    if (!!policy && !(await this.policyProvider.getPolicyValue(policy))) {
      return false;
    }

    const logEntry = this.logEntryFactory.getLogEntryForEvent(typeId, data);
    // If typeId is not handled by the Log entry factory, no LogEntry is
    // returned.
    if (!logEntry) return false;
    const writeSuccess =
        await this.writeToDb(logEntry).then(() => true).catch(err => false);
    return writeSuccess;
  }

  /**
   * Gets and writes the specified log to the database.
   * @param {!PolicyNames} policy
   * @param {!TypeId} typeId
   * @return {!Promise<boolean>} True if something was successfully written to
   *     the database.
   */
  async maybeWriteLogEntryTodb(policy, typeId) {
    if (!!policy && !(await this.policyProvider.getPolicyValue(policy))) {
      return false;
    }

    const writeSuccess =
        await this.logEntryFactory.getLogEntry(typeId, this.port)
            .then(item => this.writeToDb(item))
            .then(() => true)
            .catch(err => false);
    return writeSuccess;
  }

  /**
   * Finalizes the usage stats and stores them in an array for serialization.
   * @return {object!} The computed per site usage stats from the ongoing raw
   * data.
   */
  async prepareSiteUsageReport() {
    const activeSites = await this.updateActiveTabs();
    const siteUsage = [];
    const now = Date.now();
    for (const url in activeSites) {
      const stats = activeSites[url];
      if (stats.activeSince !== -1) {
        stats.totalActiveDuration += now - stats.activeSince;
      }
      if (stats.focusedSince !== -1) {
        stats.totalFocusedDuration += now - stats.focusedSince;
      }
      siteUsage.push({
        'url': url,
        'legacy_technologies': stats.legacyTechnologies,
        'legacy_technologies_node_attributes':
            stats.legacyTechnologiesNodeAttributes,
        'active_duration': stats.totalActiveDuration,
        'focused_duration': stats.totalFocusedDuration,
        'reported_events': stats.reportedEvents
      });
    }

    await new Promise(
        resolve => chrome.storage.local.set(
            {
              siteUsage: JSON.stringify(siteUsage),
              siteUsageTime: now.valueOf()
            },
            () => {
              if (chrome.runtime.lastError !== undefined) {
                console.error(
                    'Can\'t store site usage information to local storage!');
              }
              resolve();
            }))
        .then(() => this.clearActiveTabsFromLocalStorage());
    return siteUsage;
  }

  /**
   * Gathers and logs relatively static browser information.
   */
  async logStaticData() {
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_VERSION_DATA, TypeId.OS_INFO);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_VERSION_DATA, TypeId.AGENT_INFO);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_EXTENSIONS_DATA, TypeId.EXTENSIONS_INFO);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_EXTENSIONS_DATA, TypeId.PLUGINS_INFO);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_USER_ID_DATA, TypeId.USER_INFO);

    // Get a new snapshot rarely.
    chrome.alarms.create(
        'logStaticData',
        {delayInMinutes: this.UpdatePeriods.RARELY_CHANGING_STATE});
  }

  /**
   *  Gather and logs data that requires the native host.
   * @return {!Promise<void>}
   */
  async logDataRequiringNativeHost() {
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_POLICY_DATA, TypeId.CHROME_POLICY_INFO);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_SYSTEM_TELEMETRY_DATA, TypeId.CHROME_CRASHES);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_MACHINE_ID_DATA, TypeId.IP_ADDRESSES_INFO);

    // Get a new snapshot rarely.
    chrome.alarms.create(
        'logDataRequiringNativeHost',
        {delayInMinutes: this.UpdatePeriods.RARELY_CHANGING_STATE});
  }

  /**
   * Gathers and logs frequently changing performance information.
   */
  async logPerfData() {
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_SYSTEM_TELEMETRY_DATA, TypeId.MEMORY_INFO);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_SYSTEM_TELEMETRY_DATA, TypeId.CPU_INFO);
    await this.prepareSiteUsageReport();
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_USER_BROWSING_DATA, TypeId.SITE_USAGE_INFO);

    // Get a new snapshot frequently.
    chrome.alarms.create(
        'logPerfData',
        {delayInMinutes: this.UpdatePeriods.FREQUENTLY_CHANGING_STATE});
  }

  /**
   * Returns all the legacy technologies from the current page. This script
   * runs inside the client.
   * @param {!HTMLElement} rootElement
   * @param {!Array<!LegacyTechnologyDefinition>} technoDefinitions
   * @return {!Array<!LegacyTechnologyRequiredResults>} List of legacy
   *     technologies required by the tab.
   */
  getLegacyTechnologiesInPage(rootElement, technoDefinitions) {
    const getNodes = (root, querySelectors) =>
        Array.from(root.querySelectorAll(querySelectors));
    // Html nodes not under shadow dom that could require a legacy techno.
    const getNodesInShadowDom = (root, querySelectors, result) => {
      if (root.shadowRoot) {
        result.push(...getNodes(root.shadowRoot, querySelectors));
        getNodesInShadowDom(root.shadowRoot, querySelectors, result);
      }
      root = root.firstChild;
      while (root) {
        getNodesInShadowDom(root, querySelectors, result);
        root = root.nextSibling;
      }
    };

    /** @const {!Array<!LegacyTechnologyRequiredResults>} */
    const result = [];

    for (const techno of technoDefinitions) {
      const nodes = getNodes(rootElement, techno.querySelectors);
      getNodesInShadowDom(rootElement, techno.querySelectors, nodes);
      const nodesUsingTech = nodes.filter(techno.nodeRequiresTech);
      if (nodesUsingTech.length) {
        result.push({
          name: techno.name,
          nodeAttributes: nodesUsingTech.flatMap(techno.getTechAttributes)
        });
      }
    }
    return result;
  }

  /**
   * Returns all the legacy technologies from a tab.
   * @param {number} tabId Id of the tab to check for legacy technologies.
   * @return {!Promise<!Array<!LegacyTechnologyRequiredResults>>} List of legacy
   *     technologies required by the tab.
   */
  async getTabLegacyTechnologies(tabId) {
    const legacyTechnologies = await new Promise(
        resolve => chrome.tabs.executeScript(
            tabId, {
              allFrames: true,
              code: `
           (function() {
             const technologyDefinitions = [${
                  this.legacyTechnologyDefinitions}];
             const getLegacyTechnologies = function ${
                  this.getLegacyTechnologiesInPage};
             return getLegacyTechnologies(document, technologyDefinitions);
           })()`
            },
            result => resolve(
                !chrome.runtime.lastError && result ?
                    result.flatMap(legacyTechno => legacyTechno) :
                    [])));
    return legacyTechnologies;
  }

  /**
   * Registers an event listener for the ReportingAPI events for each frame in
   * each tab.
   * @param {number} tabId Id of the tab to check for legacy technologies.
   */
  registerForTabReportingEvents(tabId) {
    chrome.tabs.executeScript(tabId, {
      allFrames: true,
      code: `
       (function() {
         if (window.reporting_extension_event_listener_installed) {
           return;
         }
         window.reporting_extension_event_listener_installed = true;
         window.addEventListener('message', (event) => {
           // We only accept messages from ourselves
           if (event.source !== window) {
             return;
           }

           if (event.data.type && (event.data.type === 'EVENT_FROM_PAGE')) {
             chrome.runtime.sendMessage({'tabId': ${tabId},
                                        'data': JSON.parse(event.data.data)});
           }
         }, false);
         const observer = new ReportingObserver((reports, observer) => {
           for (const report of reports) {
             window.postMessage({ type: 'EVENT_FROM_PAGE',
                                  data: JSON.stringify(report)}, '*');
           }
         }, {buffered: true});
         observer.observe();
       })()`
    });
  }

  /**
   * Clears the site usage data from the local storage.
   * @return {!Promise}
   */
  clearActiveTabsFromLocalStorage() {
    return new Promise(
        resolve =>
            chrome.storage.local.remove(['activeSites'], () => resolve()));
  }

  /**
   * Returns an updated usage state for a tab.
   * @param {!tabs.Tab} tab
   * @param {?UrlUsageStats} oldStats
   * @return {!Promise<!UrlUsageStats>}
   */
  async getTabState(tab, oldStats) {
    const now = Date.now();
    const stats = oldStats || new UrlUsageStats();
    const wasFocused = stats.focusedSince !== -1;
    const wasActive = stats.activeSince !== -1;

    const legacyTechnologiesResult =
        (await this.getTabLegacyTechnologies(tab.id))
            .filter((item) => item != undefined);
    const legacyTechnologies = legacyTechnologiesResult.map(({name}) => name);
    stats.legacyTechnologies = Array.from(
        new Set([...stats.legacyTechnologies, ...legacyTechnologies]));
    legacyTechnologiesResult.forEach(result => {
      stats.legacyTechnologiesNodeAttributes[result.name] = Array.from(new Set([
        ...(stats.legacyTechnologiesNodeAttributes[result.name] || []),
        ...result.nodeAttributes
      ]));
    });
    // Merge and clear the reported events buffer for this tab.
    stats.reportedEvents = Array.from(new Set([
      ...stats.reportedEvents, ...(this.reportingApiMessages[tab.id] || [])
    ]));
    this.reportingApiMessages[tab.id] = new Set();

    if (this.sessionLocked) {
      if (wasFocused) {
        stats.totalFocusedDuration += now - stats.focusedSince;
        stats.focusedSince = -1;
        stats.updated = true;
      }
      if (wasActive) {
        stats.totalActiveDuration += now - stats.activeSince;
        stats.activeSince = -1;
        stats.updated = true;
      }
      return stats;
    }
    // Deactivating previously activated url. Only if this is the only tab for
    // this url. Otherwise we end up undercounting urls that have more than
    // one tab.
    if (!stats.updated) {
      if (wasActive && !tab.active) {
        stats.totalActiveDuration += now - stats.activeSince;
        stats.activeSince = -1;
        stats.updated = true;
      }
      // Unfocusing window. Only if this is the only window with this url.
      // Otherwise we end up undercounting urls that have more than one
      // window.
      if (wasFocused && !tab.focused) {
        stats.totalFocusedDuration += now - stats.focusedSince;
        stats.focusedSince = -1;
        stats.updated = true;
      }
    }
    // Tab becomes active
    if (!wasActive && tab.active) {
      stats.activeSince = new Date(now);
      stats.updated = true;
    }
    // Window becomes focused
    if (!wasFocused && tab.focused) {
      stats.focusedSince = new Date(now);
      stats.updated = true;
    }
    return stats;
  }

  /**
   * Updates the active and focused durations for a url usage stats.
   * @param {!UrlUsageStats} stats
   */
  updateStatsDurations(stats) {
    const now = Date.now();
    if (!stats.updated) {
      if (stats.activeSince !== -1) {
        stats.totalActiveDuration += now - stats.activeSince;
        stats.activeSince = -1;
      }
      if (stats.focusedSince !== -1) {
        stats.totalFocusedDuration += now - stats.focusedSince;
        stats.focusedSince = -1;
      }
    }
  }

  /**
   * Keeps track of how long each url is used. Two metrics are collected for
   * usage time - time the page is active which means in a selected tab in a
   * window, and focused time which mean how long the window with the active
   * tab is focused. No time is accumulated when the session is locked.
   * @return {!Promise<!Object<string, !UrlUsageStats>>}
   */
  async updateActiveTabs() {
    const reportBrowsingData = await this.policyProvider.getPolicyValue(
        PolicyNames.REPORT_USER_BROWSING_DATA);
    if (!reportBrowsingData) return;

    const activeSitesJson = await new Promise(
        resolve => chrome.storage.local.get(
            ['activeSites'], ({activeSites}) => resolve(activeSites || '{}')));

    const activeSites = JSON.parse(activeSitesJson);

    // Keep track of which sites are present to clear closed tabs in the end
    // and convert parsed dates from string to Date objects.
    Object.values(activeSites).forEach(stats => {
      stats.updated = false;
      if (typeof (stats.activeSince) === 'string') {
        stats.activeSince = new Date(stats.activeSince);
      }
      if (typeof (stats.focusedSince) === 'string') {
        stats.focusedSince = new Date(stats.focusedSince);
      }
    });

    const windows = await new Promise(
        resolve => chrome.windows.getAll(
            {populate: true}, windows => resolve(windows)));

    // Gets a list of all the tabs from non-incognito windows.
    const tabs = windows.filter(({incognito}) => !incognito)
                     .flatMap(
                         ({tabs, focused}) =>
                             tabs.filter(({url}) => url.length).map(tab => {
                               let url = tab.url;
                               try {
                                 const anchor = new URL(tab.url);
                                 // Strip the url from query params.
                                 url = anchor.origin + anchor.pathname;
                               } catch (e) {
                                 console.log('Can\'t decode' + tab.url);
                               }
                               // Keep track of the focused state of the window
                               // containing the tab.
                               return {...tab, url, focused};
                             }));
    for (const tab of tabs) {
      activeSites[tab.url] = await this.getTabState(tab, activeSites[tab.url]);
    }

    Object.values(activeSites).forEach(this.updateStatsDurations);

    await new Promise(
        resolve => chrome.storage.local.set(
            {'activeSites': JSON.stringify(activeSites)}, () => resolve()));
    return activeSites;
  }

  /**
   * Dispatch timer events. The name of the alarm is the name of the method
   * that Should handle the timer.
   * @param {Object!} alarm The alarm object that is triggered.
   */
  onAlarm(alarm) {
    this[alarm.name]();
  }

  /**
   * Processes Reporting API messages and stores them in a dictionary.
   * @param {Object!} msg The message from the tab.
   */
  onReportingApiMessage(msg) {
    // Ignore messages not coming from the script.
    if (!msg || !msg.tabId || !msg.data) {
      return;
    }

    if (!this.reportingApiMessages[msg.tabId]) {
      this.reportingApiMessages[msg.tabId] = new Set();
    }
    this.reportingApiMessages[msg.tabId].add(msg.data);
  }

  /**
   * Initializes listeners for event logging.
   */
  async registerForNotifications() {
    chrome.alarms.onAlarm.addListener(this.onAlarm.bind(this));
    chrome.runtime.onMessage.addListener(this.onReportingApiMessage.bind(this));

    chrome.management.onEnabled.addListener(
        data => this.maybeWriteEventLogEntryToDb(
            PolicyNames.REPORT_EXTENSIONS_DATA, TypeId.EXTENSION_EVENT,
            {...data, action: 'enabled'}));
    chrome.management.onDisabled.addListener(
        data => this.maybeWriteEventLogEntryToDb(
            PolicyNames.REPORT_EXTENSIONS_DATA, TypeId.EXTENSION_EVENT,
            {...data, action: 'disabled'}));
    chrome.management.onInstalled.addListener(
        data => this.maybeWriteEventLogEntryToDb(
            PolicyNames.REPORT_EXTENSIONS_DATA, TypeId.EXTENSION_EVENT,
            {...data, action: 'installed'}));
    chrome.management.onUninstalled.addListener(
        data => this.maybeWriteEventLogEntryToDb(
            PolicyNames.REPORT_EXTENSIONS_DATA, TypeId.EXTENSION_EVENT,
            {...data, action: 'uninstalled'}));

    if (!!chrome.safeBrowsingPrivate) {
      chrome.safeBrowsingPrivate.onPolicySpecifiedPasswordReuseDetected
          .addListener(
              data => this.maybeWriteEventLogEntryToDb(
                  PolicyNames.REPORT_SAFE_BROWSING_DATA,
                  TypeId.SB_PASSWORD_REUSE_EVENT, data));
      chrome.safeBrowsingPrivate.onPolicySpecifiedPasswordChanged.addListener(
          userName => this.maybeWriteEventLogEntryToDb(
              PolicyNames.REPORT_SAFE_BROWSING_DATA,
              TypeId.SB_PASSWORD_CHANGE_EVENT, {userName}));
      chrome.safeBrowsingPrivate.onDangerousDownloadOpened.addListener(
          data => this.maybeWriteEventLogEntryToDb(
              PolicyNames.REPORT_SAFE_BROWSING_DATA,
              TypeId.SB_DANGEROUS_DOWNLOAD_EVENT, data));
      chrome.safeBrowsingPrivate.onSecurityInterstitialShown.addListener(
          data => this.maybeWriteEventLogEntryToDb(
              PolicyNames.REPORT_SAFE_BROWSING_DATA,
              TypeId.SB_SECURITY_INTERSTITIAL_SHOWN_EVENT, data));
      chrome.safeBrowsingPrivate.onSecurityInterstitialProceeded.addListener(
          data => this.maybeWriteEventLogEntryToDb(
              PolicyNames.REPORT_SAFE_BROWSING_DATA,
              TypeId.SB_SECURITY_INTERSTITIAL_OVERRIDE_EVENT, data));
    }
    chrome.identity.onSignInChanged.addListener(
        (_accountid, signed_in) => chrome.identity.getProfileUserInfo(
            data => this.maybeWriteEventLogEntryToDb(
                PolicyNames.REPORT_USER_ID_DATA, TypeId.USER_INFO_EVENT,
                {...data, signed_in})));

    // Set up tab lifecycle related notifications.
    chrome.tabs.onCreated.addListener(tab => {
      if (tab.url !== '') {
        this.updateActiveTabs();
      }
    });
    chrome.tabs.onUpdated.addListener(async (tab_id, change_info, tab) => {
      if (tab.url !== '' && !tab.url.startsWith('chrome://') &&
          change_info.status === 'complete') {
        await this.updateActiveTabs();
        const reportReportingApiData = await this.policyProvider.getPolicyValue(
            PolicyNames.REPORT_REPROTING_API_DATA);
        if (reportReportingApiData) {
          this.registerForTabReportingEvents(tab_id);
        }
      }
    });
    chrome.tabs.onActivated.addListener(this.updateActiveTabs.bind(this));
    chrome.tabs.onRemoved.addListener(this.updateActiveTabs.bind(this));
    chrome.windows.onFocusChanged.addListener(this.updateActiveTabs.bind(this));
  }

  /**
   * Initializes the extension.
   * @return {!Promise}
   */
  async init() {
    await this.initDb();
    await this.logStaticData();
    await this.logPerfData();
    this.port = new Port(
        this.portConnected.bind(this), this.portDisconnected.bind(this),
        this.hostMessageReceived.bind(this));
    this.port.initialize();
  }

  /**
   * Initializes the local database.
   * @return {!Promise}
   */
  initDb() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('EventLog', 1);
      request.onsuccess = async (event) => {
        this.db = event.target.result;
        await this.checkDbConsistency();
        resolve();
      };
      request.onerror = (e) => {
        console.error('Error creating the indexedDB: ' + e);
        reject();
      };
      request.onupgradeneeded = (event) => {
        const store = event.currentTarget.result.createObjectStore(
            'events', {keyPath: 'id', autoIncrement: true});
        store.createIndex('id', 'id', {unique: true});
        store.createIndex('sourceId', 'sourceId', {unique: false});
        store.createIndex('typeId', 'typeId', {unique: false});
      };
    });
  }

  /**
   * Verifies that the DB is in sync with the cursor of the most recently
   * written item.
   * @return {!Promise}
   */
  async checkDbConsistency() {
    const lastTransferredId = await this.getLastTransferredLogId();

    // First write something to the db.
    const extensionStartedLog = await this.logEntryFactory.getLogEntry(
        TypeId.EXTENSION_STARTED, this.port);
    const writtenId = await this.writeToDb(extensionStartedLog).catch(() => -1);

    if (writtenId == -1) {
      console.error('Critical error in using the event db. Stopping!');
      return;
    }
    if (lastTransferredId >= writtenId) {
      console.error('Last written event is ahead of DB. Will reset!');
      await this.setLastTransferredLogId(0);
    } else {
      this.deleteLogEntryFromLocalDbWithUpperBound(lastTransferredId);
    }
  }
  /**
   * Callback for the result of a log transfer.
   * @param {!LogEntry} data
   * @param {boolean} success
   */
  async onLogEntryTransferred(data, success) {
    if (success) {
      if (!await this.setLastTransferredLogId(data.id)) {
        console.error('Could not store last transferred id index.');
        return;
      }
      await this.deleteLogEntryFromLocalDbWithUpperBound(data.id);
    } else {
      console.warn(
          'Could not write log for id ' + data.id + ' will retry in a bit.');
    }
  }

  /**
   * Transfers log entries one by one and to avoid overrunning the input queue
   * of the native host.
   * @param {!LogEntry} data
   * @param {boolean} logToEventlog Whether the entry should be written to the
   * windows system event log as well.
   */
  transferLogEntry(data, logToEventlog) {
    this.port.sendCommand(
        async ({success}) => this.onLogEntryTransferred(data, success),
        HostCommands.TRANSFER_LOG_ENTRY,
        {log_to_eventlog: logToEventlog, entry: JSON.stringify(data)});
  }

  /**
   * Returns the id of the last transferred log, 0 if none was transferred.
   * @return {!Promise<number>}
   */
  getLastTransferredLogId() {
    return new Promise(
        resolve => chrome.storage.local.get(
            ['lastTransferredId'],
            ({lastTransferredId}) => resolve(lastTransferredId || 0)));
  }

  /**
   * Sets the id of the last transferred log.
   * @param {number} lastTransferredId
   * @return {!Promise<boolean>}
   */
  setLastTransferredLogId(lastTransferredId) {
    return new Promise(
        resolve => chrome.storage.local.set(
            {lastTransferredId: lastTransferredId},
            () => resolve(chrome.runtime.lastError === undefined)));
  }

  /**
   * Deletes a log entry from the local db.
   * @param {number} id
   * @return {!Promise}
   */
  deleteLogEntryFromLocalDbWithUpperBound(id) {
    const key_range = IDBKeyRange.upperBound(id);
    const transaction = this.db.transaction(['events'], 'readwrite');
    const store = transaction.objectStore('events');
    const request = store.delete(key_range);
    return new Promise(resolve => request.onsuccess = () => resolve());
  }

  /**
   * Returns a list of accumulated log entries to transfer to the native host.
   * @return {!Promise<!Array<!LogEntry>>}
   */
  async getLogEntriesToTransfer() {
    const lastTransferredId = await this.getLastTransferredLogId();
    const key_range = IDBKeyRange.lowerBound(lastTransferredId, true);
    const transaction = this.db.transaction(['events'], 'readonly');
    const store = transaction.objectStore('events');
    const data = [];
    return new Promise(
        resolve => store.openCursor(key_range).onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            data.push(cursor.value);
            cursor.continue();
          } else {
            resolve(data);
          }
        });
  }

  /**
   * Transfers newly accumulated logs if any present.
   */
  async maybeTransferLogs() {
    if (!this.port) {
      chrome.alarms.create(
          'maybeTransferLogs',
          {delayInMinutes: this.UpdatePeriods.PERSIST_DATA});
      return;
    }
    if (chrome.runtime.lastError) {
      // Avoid wiping the current policy if there was an error reading the new
      // values. The cache should stay active until the situation is resolved.
      this.port.sendCommand(null, HostCommands.LOG_ERROR, {
        error:
            'background.js:transferLogs() : ' + chrome.runtime.lastError.message
      });
      chrome.alarms.create(
          'maybeTransferLogs',
          {delayInMinutes: this.UpdatePeriods.PERSIST_DATA});
      return;
    }

    const logEventToLog =
        await this.policyProvider.getPolicyValue(PolicyNames.LOG_TO_EVENTLOG);
    const logsToTransfer = await this.getLogEntriesToTransfer();

    for (let i = 0; i < logsToTransfer.length; ++i)
      await this.transferLogEntry(logsToTransfer[i], logEventToLog);

    chrome.alarms.create(
        'maybeTransferLogs', {delayInMinutes: this.UpdatePeriods.PERSIST_DATA});
  }

  /**
   * Callback that is called when the native messaging host application sent a
   * message that is not a response of an extension message.
   * Currently the only such type of message is the session locked
   * notification.
   * @param {Object!} message An object representing the content of a message
   *     received from the native host that is not a reply to a request sent
   * from the extension.
   */
  hostMessageReceived(message) {
    if (message.session_locked !== undefined && message.success === true) {
      this.sessionLocked = !!message.session_locked;
      this.updateActiveTabs();
    }
  }

  /**
   * Callback that is called when the native messaging port has been
   * initialized. Only after this is true we can load the policy and start
   * parsing urls. It might be called later on again if the connection needed
   * to be re-established in which case initialization is skipped.
   */
  async portConnected() {
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_USER_ID_DATA, TypeId.CURRENT_OS_USER_INFO);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_VERSION_DATA, TypeId.OS_VERSION_INFO);
    await this.maybeWriteLogEntryTodb(
        PolicyNames.REPORT_MACHINE_ID_DATA, TypeId.OS_HOSTNAME);

    await this.logDataRequiringNativeHost();

    await this.maybeTransferLogs();
  }

  /**
   * Callback that is called if the native messaging port loses its
   * connection.
   */
  portDisconnected() {
    console.error('Native port not reachable!');
  }
}

(async function() {
  const logic = new ExtensionLogic();
  await logic.init();
  await logic.registerForNotifications();
})();

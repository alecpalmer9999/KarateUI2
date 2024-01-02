// Copyright 2019 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines the LogEntryFactoryObject.
 */

/** @enum{number} */
SourceId = {
  REPORTING_EXTENSION: 1,
  NATIVE_HOST: 2,
  OTHER: 3
};

/** @enum{number} */
TypeId = {
  OS_INFO: 1,
  OS_VERSION_INFO: 2,
  EXTENSIONS_INFO: 3,
  EXTENSION_EVENT: 4,
  PLUGINS_INFO: 5,
  MEMORY_INFO: 6,
  CPU_INFO: 7,
  USER_INFO: 8,
  USER_INFO_EVENT: 9,
  CHROME_POLICY_INFO: 10,
  AGENT_INFO: 11,
  SITE_USAGE_INFO: 12,
  NAVIGATION_EVENT: 13,
  CURRENT_OS_USER_INFO: 14,
  IP_ADDRESSES_INFO: 15,
  CHROME_CRASHES: 16,
  EXTENSION_STARTED: 17,
  OS_HOSTNAME: 18,
  SB_PASSWORD_REUSE_EVENT: 19,
  SB_PASSWORD_CHANGE_EVENT: 20,
  SB_DANGEROUS_DOWNLOAD_EVENT: 21,
  SB_SECURITY_INTERSTITIAL_SHOWN_EVENT: 22,
  SB_SECURITY_INTERSTITIAL_OVERRIDE_EVENT: 23,
  OTHER: 1000
};

class LogEntry {
  /**
   * @param {!SourceId} sourceId
   * @param {!TypeId} typeId
   * @param {string} sourceLabel
   * @param {!any} data
   * @param {number} version
   * @param {!Date=} timestamp
   * @param {?number=} id
   */
  constructor(sourceId, typeId, sourceLabel, data, version, timestamp, id) {
    this.sourceId = sourceId;
    this.typeId = typeId;
    this.timestamp = timestamp || new Date();
    this.sourceLabel = sourceLabel;
    this.data = data;
    this.version = version;
	if (id != null)
      this.id = id;
  }
}

class LogEntryFactory {
  constructor() {
    this.handlers = {
      [TypeId.OS_INFO]: this.getOSInfo,
      [TypeId.OS_VERSION_INFO]: this.getOsVersion,
      [TypeId.EXTENSIONS_INFO]: this.getExtensionsInfo,
      [TypeId.PLUGINS_INFO]: this.getPluginsInfo,
      [TypeId.MEMORY_INFO]: this.getMemoryInfo,
      [TypeId.CPU_INFO]: this.getCPUInfo,
      [TypeId.USER_INFO]: this.getUserInfo,
      [TypeId.CHROME_POLICY_INFO]: this.getChromePolicyInfo,
      [TypeId.AGENT_INFO]: this.getUserAgentInfo,
      [TypeId.SITE_USAGE_INFO]: this.getSiteUsageReport,
      [TypeId.CURRENT_OS_USER_INFO]: this.getUsernameAndDomain,
      [TypeId.IP_ADDRESSES_INFO]: this.getIpAddresses,
      [TypeId.CHROME_CRASHES]: this.getChromeCrashes,
      [TypeId.EXTENSION_STARTED]: this.getExtensionStarted,
      [TypeId.OS_HOSTNAME]: this.getHostname,
    };

    this.eventHandlers = {
      [TypeId.EXTENSION_EVENT]: this.getExtensionEvent,
      [TypeId.USER_INFO_EVENT]: this.getUserInfoEvent,
      [TypeId.NAVIGATION_EVENT]: this.getNavigationEvent,
      [TypeId.SB_PASSWORD_REUSE_EVENT]: this.getSafeBrowsingPasswordReuseEvent,
      [TypeId.SB_PASSWORD_CHANGE_EVENT]:
          this.getSafeBrowsingPasswordChangeEvent,
      [TypeId.SB_DANGEROUS_DOWNLOAD_EVENT]:
          this.getSafeBrowsingDangerousDownloadEvent,
      [TypeId.SB_SECURITY_INTERSTITIAL_SHOWN_EVENT]:
          this.getSafeBrowsingSecurityInterstitialShownEvent,
      [TypeId.SB_SECURITY_INTERSTITIAL_OVERRIDE_EVENT]:
          this.getSafeBrowsinfSecurityInterstitialOverrideEvent,
    };
  }

  /**
   * @param {!TypeId} typeId
   * @param {!any} data Extension event data.
   * @return {!LogEntry} Log entry for the extension events.
   */
  getLogEntryForEvent(typeId, data) {
    if (this.eventHandlers[typeId] !== undefined) {
      return this.eventHandlers[typeId](data);
    }
    return undefined;
  }

  /**
   * @param {!TypeId} typeId
   * @param {!Port} port
   * @return {!Promise<!LogEntry>}
   */
  getLogEntry(typeId, port) {
    if (this.handlers[typeId] !== undefined) {
      return this.handlers[typeId](port);
    }
    return Promise.reject();
  }

  /** @return {!Promise<!LogEntry>} Log entry for the OS info. */
  getOSInfo() {
    return new Promise(
        resolve => chrome.runtime.getPlatformInfo(
            info => resolve(new LogEntry(
                SourceId.REPORTING_EXTENSION, TypeId.OS_INFO, 'OS Info', info,
                1))));
  }

  /**
   * @param {!Port} port
   * @return {!Promise<!LogEntry>} Log entry for the OS version info.
   */
  getOsVersion(port) {
    return new Promise(
        (resolve, reject) => port.sendCommand(
            ({success, major, minor, build, architecture, version}) => {
              if (success) {
                resolve(new LogEntry(
                    SourceId.NATIVE_HOST, TypeId.OS_VERSION_INFO,
                    'Current OS Version', {major, minor, build, architecture},
                    version));
              } else {
                reject();
              }
            },
            HostCommands.GET_OS_VERSION));
  }

  /** @return {!Promise<!LogEntry>} Log entry for the extensions info. */
  getExtensionsInfo() {
    return new Promise(resolve => chrome.management.getAll(info => {
      resolve(new LogEntry(
          SourceId.REPORTING_EXTENSION, TypeId.EXTENSIONS_INFO,
          'Chrome Extensions List', info, 1));
    }));
  }

  /** @return {!Promise<!LogEntry>} Log entry for the plugins info. */
  getPluginsInfo() {
    let plugin_info = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
      plugin_info.push({
        description: navigator.plugins[i].description,
        filename: navigator.plugins[i].filename,
        name: navigator.plugins[i].name
      });
    }
    return Promise.resolve(new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.PLUGINS_INFO,
        'Chrome Plugins List', plugin_info, 1));
  }

  /** @return {!Promise<!LogEntry>} Log entry for the memory info. */
  getMemoryInfo() {
    return new Promise(
        resolve => chrome.system.memory.getInfo(
            info => resolve(new LogEntry(
                SourceId.REPORTING_EXTENSION, TypeId.MEMORY_INFO, 'Memory Info',
                info, 1))));
  }

  /** @return {!Promise<!LogEntry>} Log entry for the CPU info. */
  getCPUInfo() {
    return new Promise(
        resolve => chrome.system.cpu.getInfo(
            info => resolve(new LogEntry(
                SourceId.REPORTING_EXTENSION, TypeId.CPU_INFO, 'CPU Info', info,
                1))));
  }

  /** @return {!Promise<!LogEntry>} Log entry for the user info. */
  getUserInfo() {
    return new Promise(resolve => chrome.identity.getProfileUserInfo(info => {
      resolve(new LogEntry(
          SourceId.REPORTING_EXTENSION, TypeId.USER_INFO,
          'Chrome Profile User Info', info, 1));
    }));
  }

  /**
   * @param {!Port} port
   * @return {!Promise<!LogEntry>} Log entry for the chrome policies info.
   */
  getChromePolicyInfo(port) {
    return new Promise((resolve, reject) => {
      port.sendCommand(
          ({success, user_policies, machine_policies, version}) => {
            if (success) {
              resolve(new LogEntry(
                  SourceId.NATIVE_HOST, TypeId.CHROME_POLICY_INFO,
                  'Chrome Policy Info', {machine_policies, user_policies},
                  version));
            } else {
              reject();
            }
          },
          HostCommands.GET_CHROME_POLICY_LIST);
    });
  }

  /** @return {!Promise<!LogEntry>} Log entry for the user agent info. */
  getUserAgentInfo() {
    const navigator_info = {
      userAgentString: navigator.userAgent,
      languages: navigator.languages,
      onLine: navigator.onLine
    };
    return Promise.resolve(new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.AGENT_INFO, 'Chrome Agent Info',
        navigator_info, 1));
  }

  /** @return {!Promise<!LogEntry>} Log entry for the user browsing data. */
  getSiteUsageReport() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(
          ['siteUsage', 'siteUsageTime'], ({siteUsage, siteUsageTime}) => {
            if (siteUsage !== undefined && siteUsageTime !== undefined) {
              resolve(new LogEntry(
                  SourceId.REPORTING_EXTENSION, TypeId.SITE_USAGE_INFO,
                  'Current Set Of Used Sites', JSON.parse(siteUsage), 2,
                  new Date(siteUsageTime)));
            } else {
              reject();
            }
          });
    });
  }

  /**
   * @param {!Port} port
   * @return {!Promise<!LogEntry>} Log entry for the current os user info.
   */
  getUsernameAndDomain(port) {
    return new Promise((resolve, reject) => {
      port.sendCommand(({success, username, version}) => {
        if (success) {
          resolve(new LogEntry(
              SourceId.NATIVE_HOST, TypeId.CURRENT_OS_USER_INFO,
              'Current OS User Info', {username}, version));
        } else {
          reject();
        }
      }, HostCommands.GET_USERNAME_AND_DOMAIN);
    });
  }

  /**
   * @param {!Port} port
   * @return {!Promise<!LogEntry>} Log entry for the IP addresses.
   */
  getIpAddresses(port) {
    return new Promise((resolve, reject) => {
      port.sendCommand(({success, version, addresses}) => {
        if (success) {
          resolve(new LogEntry(
              SourceId.NATIVE_HOST, TypeId.IP_ADDRESSES_INFO,
              'Active IP Addresses Info', {ipAddresses: addresses}, version));
        } else {
          reject();
        }
      }, HostCommands.GET_IP_ADDRESSES);
    });
  }

  /**
   * @param {!Port} port
   * @return {!Promise<!LogEntry>} Log entry for the chrome crash dumps.
   */
  getChromeCrashes(port) {
    // Doing this through the native host is only a stopgap solution until the
    // proper APIs are available in Chrome to query this list.
    return new Promise((resolve, reject) => {
      port.sendCommand(({success, crashes, version}) => {
        if (success) {
          resolve(new LogEntry(
              SourceId.NATIVE_HOST, TypeId.CHROME_CRASHES,
              'Recorded Chrome Crashes', {crashes}, version));
        } else {
          reject();
        }
      }, HostCommands.GET_CHROME_CRASHES);
    });
  }

  /** @return {!Promise<!LogEntry>} Log entry for the extension load. */
  getExtensionStarted() {
    return Promise.resolve(new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.EXTENSION_STARTED,
        'Extension Started', {}, 1, new Date()));
  }

  /**
   * @param {!Port} port
   * @return {!Promise<!LogEntry>} Log entry for the hostname.
   */
  getHostname(port) {
    return new Promise(
        (resolve, reject) =>
            port.sendCommand(({success, hostname, version}) => {
              if (success) {
                resolve(new LogEntry(
                    SourceId.NATIVE_HOST, TypeId.OS_HOSTNAME,
                    'Current OS Hostname', {hostname}, version));
              } else {
                reject();
              }
            }, HostCommands.GET_HOSTNAME));
  }

  /**
   * @param {!any} data Extension event data.
   * @return {!LogEntry} Log entry for the extension events.
   */
  getExtensionEvent(data) {
    return new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.EXTENSION_EVENT,
        'Chrome Extension Changed', data, 1);
  }
  /**
   * @param {!any} data User info event data.
   * @return {!LogEntry} Log entry for the user info events.
   */
  getUserInfoEvent(data) {
    return new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.USER_INFO_EVENT,
        'Chrome Profile User Info Changed', data, 1);
  }
  /**
   * @param {!any} data Navigation event data.
   * @return {!LogEntry} Log entry for the navigation events.
   */
  getNavigationEvent(data) {
    return new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.NAVIGATION_EVENT,
        'User Loaded Resource', data, 1);
  }

  /**
   * @param {!any} data Safe browsing password reuse event data.
   * @return {!LogEntry} Log entry for the Safe browsing password reuse events.
   */
  getSafeBrowsingPasswordReuseEvent(data) {
    return new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.SB_PASSWORD_REUSE_EVENT,
        'Safe Browsing - Password Reuse', data, 1);
  }

  /**
   * @param {!any} data Safe browsing password change event data
   * @return {!LogEntry} Log entry for the Safe browsing password change events.
   */
  getSafeBrowsingPasswordChangeEvent(data) {
    return new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.SB_PASSWORD_CHANGE_EVENT,
        'Safe Browsing - Password Change', data, 1);
  }

  /**
   * @param {!any} data Safe browsing dangerous download event data
   * @return {!LogEntry} Log entry for the Safe browsing dangerous download
   *       events.
   */
  getSafeBrowsingDangerousDownloadEvent(data) {
    return new LogEntry(
        SourceId.REPORTING_EXTENSION, TypeId.SB_DANGEROUS_DOWNLOAD_EVENT,
        'Safe Browsing - Dangerous Download', data, 1);
  }

  /**
   * @param {!any} data Safe browsing security interstitial shown event data
   * @return {!LogEntry} Log entry for the Safe browsing security interstitial
   *       shown events.
   */
  getSafeBrowsingSecurityInterstitialShownEvent(data) {
    return new LogEntry(
        self.SourceId.REPORTING_EXTENSION,
        self.TypeId.SB_SECURITY_INTERSTITIAL_SHOWN_EVENT,
        'Safe Browsing - Security Interstitial Shown', data, 1);
  }

  /**
   * @param {!any} data Safe browsing security interstitial override event data
   * @return {!LogEntry} Log entry for the Safe browsing security interstitial
   *       override events.
   */
  getSafeBrowsinfSecurityInterstitialOverrideEvent(data) {
    return new LogEntry(
        self.SourceId.REPORTING_EXTENSION,
        self.TypeId.SB_SECURITY_INTERSTITIAL_OVERRIDE_EVENT,
        'Safe Browsing - Security Interstitial Override', data, 1);
  }
}

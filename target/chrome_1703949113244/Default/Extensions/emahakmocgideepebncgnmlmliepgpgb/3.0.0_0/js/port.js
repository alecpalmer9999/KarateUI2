// Copyright 2017 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines the Port object.
 */

/**
 * @typedef {{
 *   id: number,
 *   success: boolean,
 *   error: ?string,
 * }}
 */
let HostResponseMessage;

/**
 * @typedef {{session_locked: boolean}}
 */
let SessionLockedMessage;

/** @typedef {{ error: string }} */
let ErrorCommandPayload;

/**
 * @typedef {{
      entry: string,
      log_to_eventlog: boolean
    }}
    */
let LogEntryCommandPayload;

/** @enum {string} */
const HostCommands = {
  GET_CHROME_POLICY_LIST: 'getChromePolicyList',
  GET_USERNAME_AND_DOMAIN: 'getUsernameAndDomain',
  GET_HOSTNAME: 'getHostname',
  GET_OS_VERSION: 'getOsVersion',
  GET_IP_ADDRESSES: 'getIpAddresses',
  GET_CHROME_CRASHES: 'getChromeCrashes',
  TRANSFER_LOG_ENTRY: 'transferLogEntry',
  LOG_ERROR: 'logError',
};


/**
 * Constructor for the Port object. This object encapsulates the communication
 * over the native messaging API to the host application.
 * @unrestricted
 */
class Port {
  /**
   * @param {function()} connectCallback The callback to be called when the
   * connection to the host has been established.
   * @param {function()} disconnectCallback The callback to be called if the
   * connection to the host has permanently failed to be established.
   * @param {function(!HostResponseMessage)} messageCallback The callback to be
   * called when the host has sent a message which is not a response of
   * extension message.
   */
  constructor(connectCallback, disconnectCallback, messageCallback) {
    this.MAX_CONNECT_ATTEMPTS = 3;
    this.port_ = null;

    /**
     * @private {!Array<function(!HostResponseMessage)>}
     * @const
     */
    this.callbacks_ = [messageCallback];
    this.nextCallbackId_ = 1;
    this.connectAttemptsLeft_ = this.MAX_CONNECT_ATTEMPTS;
    this.lastConnectTime_ = 0;
    this.connectCallback_ = connectCallback;
    this.disconnectCallback_ = disconnectCallback;
  }

  /**
   * Called by the constructor to initialize the port and open the connection to
   * the native app.
   * @return {!Promise<boolean>}
   */
  initialize() {
    var self = this;
    return new Promise(resolve => {
      self.port_ = chrome.runtime.connectNative('com.google.chromereporting');
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        self.port_ = null;
        self.disconnectCallback_();
        resolve(false);
        return;
      }
      self.port_.onMessage.addListener(self.onMessageReceived_.bind(self));
      self.port_.onDisconnect.addListener(function() {
        console.error(
            'Lost connection to the native host: ' +
            chrome.runtime.lastError.message);
        self.port_ = null;
        if (--self.connectAttemptsLeft_ > 0) {
          // Retry up to three times to re-establish connection with some delay.
          // Meanwhile requests will fail but retrying them should succeed.
          setTimeout(self.initialize.bind(self), 200);
          return;
        }
        self.disconnectCallback_();
      });
      try {
        // Try to send one message to verify that the port is usable.
        // This is unfortunately needed because the connectNative function might
        // not fail in some cases where the native app is actually unreachable.
        const callback = () => {
          self.connectCallback_();
          resolve(true);
        };
        self.sendCommand(
            callback, HostCommands.LOG_ERROR, {error: 'Ignore me.'});
      } catch (err) {
        self.port_ = null;
        resolve(false);
      }
    });
  }

  /**
   * @param {!HostResponseMessage} message The object passed from the native
   *     host.
   * @private
   */
  onMessageReceived_(message) {
    if (!message.success) {
      console.error('Command Nr.' + message.id + ' failed:' + message.error);
    }
    this.callbacks_[message.id](message);

    // Messages with id 0 are not replies to messages and are always handled the
    // same way.
    if (message.id !== 0) {
      delete this.callbacks_[message.id];
    }
  }

  /**
   * Adds a callback to the callbacks_ registry.
   * @param {function(!HostResponseMessage): void} callback The callback to be
   *     added.
   * @return {number} The id of the callback added.
   */
  registerCallback(callback) {
    if (callback) {
      const id = this.nextCallbackId_++;
      this.callbacks_[id] = callback;
      return id;
    }
    return 0;
  }

  /**
   * Sends a command to the native host with an optional payload and registers
   * @param {function(!HostResponseMessage): void} callback The callback to be
   *     added.
   * @param {!HostCommands} command
   * @param {(!LogEntryCommandPayload|!ErrorCommandPayload)=} payload
   * a callback to handle the response
   */
  sendCommand(callback, command, payload) {
    if (!this.port_) {
      if (callback)
        callback({id: 0, success: false, error: 'No native connection!'});
      return;
    }

    if (command === HostCommands.LOG_ERROR && (!payload || !payload.error)) {
      callback({id: 0, success: false, error: 'No error provided to log.'});
      return;
    }

    if (command === HostCommands.TRANSFER_LOG_ENTRY) {
      if (!payload || !payload.entry) {
        callback(
            {id: 0, success: false, error: 'No entry provided to transfer.'});
        return;
      }
      payload.log_to_eventlog = !!payload.log_to_eventlog;
    }

    this.port_.postMessage(
        {...payload, command, id: this.registerCallback(callback)});
  }
}

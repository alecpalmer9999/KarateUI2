// Copyright 2017 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines the PolicyProvider object.
 */

/** @enum {string} */
const PolicyNames = {
  REPORT_USER_BROWSING_DATA: 'report_user_browsing_data',
  REPORT_EXTENSIONS_DATA: 'report_extensions_data',
  REPORT_VERSION_DATA: 'report_version_data',
  REPORT_POLICY_DATA: 'report_policy_data',
  REPORT_MACHINE_ID_DATA: 'report_machine_id_data',
  REPORT_USER_ID_DATA: 'report_user_id_data',
  REPORT_SYSTEM_TELEMETRY_DATA: 'report_system_telemetry_data',
  REPORT_SAFE_BROWSING_DATA: 'report_safe_browsing_data',
  REPORT_REPROTING_API_DATA: 'report_reporting_api_data',
  LOG_TO_EVENTLOG: 'log_to_eventlog',
};

/**
 * Provides convenient interface to the policy API of Chrome.
 * @unrestricted
 */
class PolicyProvider {
  constructor() {
    this.policyDefaultValues_ = {
      [PolicyNames.REPORT_USER_BROWSING_DATA]: false,
      [PolicyNames.REPORT_EXTENSIONS_DATA]: true,
      [PolicyNames.REPORT_VERSION_DATA]: true,
      [PolicyNames.REPORT_POLICY_DATA]: true,
      [PolicyNames.REPORT_MACHINE_ID_DATA]: true,
      [PolicyNames.REPORT_USER_ID_DATA]: true,
      [PolicyNames.REPORT_SYSTEM_TELEMETRY_DATA]: true,
      [PolicyNames.REPORT_SAFE_BROWSING_DATA]: false,
      [PolicyNames.REPORT_REPROTING_API_DATA]: false,
      [PolicyNames.LOG_TO_EVENTLOG]: false,
    };
  }

  /**
   * Returns the value of |policy| or the default value if |policy| is not set.
   * @param {string} policy The name of the policy
   * @return {!Promise<boolean>} The value of the policy
   */
  getPolicyValue(policy) {
    return new Promise(
        resolve => chrome.storage.managed.get([policy], items => {
          resolve(
              items[policy] !== undefined ? items[policy] :
                                            this.policyDefaultValues_[policy]);
        }));
  }
}

import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
if (process.env.REACT_APP_MIXPANEL_TOKEN && process.env.REACT_APP_ENABLE_ANALYTICS === 'true') {
  mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage'
  });
}

class Analytics {
  static isEnabled() {
    return process.env.REACT_APP_ENABLE_ANALYTICS === 'true' && process.env.REACT_APP_MIXPANEL_TOKEN;
  }

  static identify(userId, properties = {}) {
    if (!this.isEnabled()) return;
    
    mixpanel.identify(userId);
    if (Object.keys(properties).length > 0) {
      mixpanel.people.set(properties);
    }
  }

  static track(eventName, properties = {}) {
    if (!this.isEnabled()) return;
    
    mixpanel.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      user_agent: navigator.userAgent
    });
  }

  static pageView(pageName, properties = {}) {
    this.track('Page View', {
      page_name: pageName,
      ...properties
    });
  }

  static challengeEvent(eventType, challengeId, properties = {}) {
    this.track(`Challenge ${eventType}`, {
      challenge_id: challengeId,
      ...properties
    });
  }

  static socialEvent(eventType, properties = {}) {
    this.track(`Social ${eventType}`, properties);
  }

  static paymentEvent(eventType, amount, currency = 'USD', properties = {}) {
    this.track(`Payment ${eventType}`, {
      amount,
      currency,
      ...properties
    });
  }

  static userEngagement(action, properties = {}) {
    this.track('User Engagement', {
      action,
      ...properties
    });
  }

  static setUserProperties(properties) {
    if (!this.isEnabled()) return;
    
    mixpanel.people.set(properties);
  }

  static incrementUserProperty(property, value = 1) {
    if (!this.isEnabled()) return;
    
    mixpanel.people.increment(property, value);
  }

  static reset() {
    if (!this.isEnabled()) return;
    
    mixpanel.reset();
  }
}

export default Analytics;

// Convenience functions for common events
export const trackChallengeCreated = (challengeId, category, difficulty) => {
  Analytics.challengeEvent('Created', challengeId, { category, difficulty });
};

export const trackChallengeJoined = (challengeId, category) => {
  Analytics.challengeEvent('Joined', challengeId, { category });
};

export const trackChallengeCompleted = (challengeId, duration, category) => {
  Analytics.challengeEvent('Completed', challengeId, { duration, category });
};

export const trackFriendRequest = (action, targetUserId) => {
  Analytics.socialEvent('Friend Request', { action, target_user_id: targetUserId });
};

export const trackPaymentAttempt = (plan, amount) => {
  Analytics.paymentEvent('Attempt', amount, 'USD', { plan });
};

export const trackPaymentSuccess = (plan, amount, subscriptionId) => {
  Analytics.paymentEvent('Success', amount, 'USD', { plan, subscription_id: subscriptionId });
};

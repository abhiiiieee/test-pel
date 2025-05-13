function _PEL_Event(t, e) {
  (this.object = t.object),
    (this.action = t.action),
    (this.actor = t.actor),
    (this.platform = t.platform),
    (this.objectContext = t.objectContext || {}),
    (this.actorContext = t.actorContext || {}),
    (this.webContext = t.webContext || {}),
    (this.pageContext = t.pageContext || {}),
    (this.geolocationContext = t.geolocationContext || {}),
    (this.attributionContext = t.attributionContext || {}),
    (this.productContext = t.productContext || {}),
    (this.screenContext = t.screenContext || {}),
    (this.deviceContext = t.deviceContext || {}),
    (this.actionContext = t.actionContext || {}),
    (this.namespace = t.namespace),
    (this.version = t.version || 1),
    (this.userAgent = navigator.userAgent);
}
(_PEL_Event.prototype.getObject = function () {
  return this.object;
}),
  (_PEL_Event.prototype.getAction = function () {
    return this.action;
  }),
  (_PEL_Event.prototype.getActor = function () {
    return this.actor;
  }),
  (_PEL_Event.prototype.getPlatform = function () {
    return this.platform;
  }),
  (_PEL_Event.prototype.getNamespace = function () {
    return this.namespace;
  }),
  (_PEL_Event.prototype.getVersion = function () {
    return this.version;
  }),
  (_PEL_Event.prototype.setObject = function (t) {
    t && (this.object = t);
  }),
  (_PEL_Event.prototype.setAction = function (t) {
    t && (this.action = t);
  }),
  (_PEL_Event.prototype.setActor = function (t) {
    t && (this.actor = t);
  }),
  (_PEL_Event.prototype.setPlatform = function (t) {
    t && (this.platform = t);
  }),
  (_PEL_Event.prototype.setNamespace = function (t) {
    t && (this.namespace = t);
  }),
  (_PEL_Event.prototype.setVersion = function (t) {
    t && (this.version = t);
  }),
  (_PEL_Event.prototype.setContexts = function (t) {
    t.object && (this.objectContext = t.object),
      t.actor && (this.actorContext = t.actor),
      t.web && (this.webContext = t.web),
      t.page && (this.pageContext = t.page),
      t.geolocation && (this.geolocationContext = t.geolocation),
      t.attribution && (this.attributionContext = t.attribution),
      t.product && (this.productContext = t.product),
      t.screen && (this.screenContext = t.screen),
      t.device && (this.deviceContext = t.device),
      t.action && (this.actionContext = t.action);
  });
function removeEmptyProperties(e) {
  const t = {};
  return (
    Object.entries(e).forEach(function (e) {
      var o = e[0],
        r = e[1];
      r === Object(r) && (r = removeEmptyProperties(r)),
        (r || r === !1) && (t[o] = r);
    }),
    t
  );
}
function getPlatformInfo(e) {
  var t,
    o,
    r = "Web",
    n = helper.properties();
  return (
    (t = {
      browser: n.browser,
      "browser version": n.browser_version,
      referrer: n.referrer,
      "action medium": n.action_medium,
      "action campaign": n.action_campaign,
    }),
    (pageContext = { url: n.current_url }),
    e &&
      "object" == typeof e &&
      Object.keys(e).forEach(function (t) {
        n[t] = e[t];
      }),
    ["iOS", "Android", "BlackBerry"].indexOf(n.os) > -1 && (r = "Mweb"),
    {
      platform: r,
      web: t,
      page: pageContext,
      device: o || {},
      screen: {},
      isBlockedUA: n.isBlockedUA,
    }
  );
}
(_PEL_Event.prototype.getJSON = function (e, t, o) {
  var r = {},
    n = [
      "objectContext",
      "webContext",
      "pageContext",
      "geolocationContext",
      "attributionContext",
      "productContext",
      "screenContext",
      "deviceContext",
      "actionContext",
    ];
  (r.eventName = this.object + " " + this.action),
    (r.Actor = this.actor),
    (r.Platform = this.platform),
    (r.userAgent = this.userAgent),
    t ? n.push("actorContext") : (r.actorContext = this.actorContext);
  var a = this;
  return (
    n.forEach(function (t, n) {
      if (a[t])
        for (property in a[t]) {
          var i = convertToStartCase(property, e);
          o &&
            isArrayUtil(a[t][property]) &&
            (a[t][property] = a[t][property].join(",")),
            (r[i] = convertToStartCase(a[t][property], e));
        }
    }),
    t && ((r.namespace = this.namespace), (r.version = this.version)),
    (r.PelVersion = "1.6.8"),
    r
  );
}),
  (_PEL_Event.prototype.logEvent = function (e) {
    var t = getPlatformInfo(),
      o = analyticsEndpoints.clevertap;
    if (t.isBlockedUA) return !0;
    delete t.isBlockedUA,
      (this.platform = t.platform),
      (t = removeEmptyProperties(t)),
      this.setContexts(t);
    var r = (Object.keys(analyticsEndpoints), JSON.stringify(this.getJSON())),
      n = this.getJSON(!1, !1, !0),
      a = this.getJSON(!0, !0, !0);
    r = window.btoa(unescape(encodeURIComponent(r)));
    var i = readCookie("pelUUID");
    i || ((i = pelUUID()), storeCookie("pelUUID", i));
    var s = new XMLHttpRequest();
    s.overrideMimeType("application/json"),
      (a.Timestamp = parseInt(Date.now() / 1e3)),
      delete a.actorContext,
      delete a.Action,
      delete a.Object,
      (a.fingerprint = i);
    var p = {},
      c = analyticsEndpoints["event-pipeline"];
    (p.version = a.version),
      (p.namespace = a.namespace
        ? a.namespace
        : c.getEventNameSpace(a.eventName)),
      (p.eventName = a.eventName),
      delete a.eventName,
      (p.cleverTapId = o.getPractoCleverTapId()),
      (a = removeEmptyProperties(a)),
      (p.payload = a),
      (eventData = JSON.stringify({ data: [p] })),
      s.open("POST", c.url, !0),
      s.setRequestHeader("Content-Type", "application/json;charset=UTF-8"),
      s.send(eventData),
      (s.onreadystatechange = function () {
        4 == s.readyState && "200" != s.status && console.log(s);
      }),
      (n.fingerprint = i),
      (n.cleverTapId = o.getPractoCleverTapId()),
      o.logEvent(n);
  }),
  (_PEL_Event.prototype.setLinkClickObserver = function (e) {
    var t = analyticsEndpoints.mixpanel,
      o = this.getJSON();
    t.trackLinks(e, o.eventName, o);
  });
var pelProject = "practoTesting",
  subdomain = window.location.hostname.split(".")[0].split("-")[0],
  eventsPipelineURL =
    window.location.origin.replace(subdomain, "events") + "/v1/events",
  analyticsEndpoints = {
    mixpanel: _MIXPANEL(),
    "event-pipeline": _EVENTS_PIPELINE(),
    clevertap: _CLEVERTAP(),
  };
function _CLEVERTAP(e) {
  var t = function (e) {
      if (e.actorContext) {
        var t = [
          "email",
          "Email",
          "phone",
          "Phone",
          "Mobile",
          "mobile",
          "First Name",
          "first_name",
          "Name",
          "name",
          "last_name",
          "Last Name",
        ];
        t.forEach(function (t) {
          delete e.actorContext[t];
        });
      }
      try {
        if (
          (e.Actor && (e.actorContext.Identity = e.Actor),
          !isEmptyObject(e.actorContext))
        ) {
          var a = e.actorContext;
          (a = { Site: a }), clevertap.onUserLogin.push(a);
        }
      } catch (o) {
        console.log(o);
      }
    },
    a = function (e) {
      var t = e.eventName;
      delete e.eventName, delete e.actorContext;
      try {
        clevertap.event.push(t, e);
      } catch (a) {
        console.log(a);
      }
    };
  return {
    logEvent: function (e) {
      t(e), a(e);
    },
    getDistinctId: function () {
      return clevertap &&
        clevertap.getCleverTapID &&
        "function" == typeof clevertap.getCleverTapID
        ? clevertap.getCleverTapID()
        : readCookie("pelUUID");
    },
    getPractoCleverTapId: function () {
      return clevertap &&
        clevertap.getCleverTapID &&
        "function" == typeof clevertap.getCleverTapID
        ? clevertap.getCleverTapID()
        : readCookie("pelUUID");
    },
    enabled: !0,
  };
}
function _EVENTS_PIPELINE() {
  var e = {
    "Practopedia Card Interacted": "Practopedia",
    "Practopedia Card Read": "Practopedia",
    "Practopedia Card Viewed": "Practopedia",
    "Practopedia Interaction": "Practopedia",
    "Practopedia Item Interacted": "Practopedia",
    "Practopedia Navigation Interacted": "Practopedia",
    "Practopedia Pin Code Interacted": "Practopedia",
    "Practopedia Search Cancelled": "Practopedia",
    "Practopedia Search Initiated": "Practopedia",
    "Practopedia Search Successful": "Practopedia",
    "Practopedia Shared": "Practopedia",
    "Practopedia Viewed": "Practopedia",
    "Order Add Rx Completed": "Order",
    "Order Add Rx Initiated": "Order",
    "Order Add Rx Interacted": "Order",
    "Order Add Rx Skipped": "Order",
    "Order Address Add Completed": "Order",
    "Order Address Add Initiated": "Order",
    "Order Address Edit Completed": "Order",
    "Order Address Edit Initiated": "Order",
    "Order Address Form Cancelled": "Order",
    "Order Address Form Interacted": "Order",
    "Order Address Form Viewed": "Order",
    "Order Address List Viewed": "Order",
    "Order Address Pincode Added": "Order",
    "Order Address Pincode Viewed": "Order",
    "Order Address Remove": "Order",
    "Order Address Selected": "Order",
    "Order Cancelled": "Order",
    "Order Cart Interacted": "Order",
    "Order Cart Viewed": "Order",
    "Order Changes Viewed": "Order",
    "Order Coupon Applied": "Order",
    "Order Delivery Details Confirmed": "Order",
    "Order Delivery Details Viewed": "Order",
    "Order Feedback Add Initiated": "Order",
    "Order Feedback Added": "Order",
    "Order Feedback Cancelled": "Order",
    "Order Feedback Ratings Selected": "Order",
    "Order Feedback Reason Selected": "Order",
    "Order History Viewed": "Order",
    "Order Home Viewed": "Order",
    "Order Initiated": "Order",
    "Order Instruction Added": "Order",
    "Order Login Closed": "Order",
    "Order Login Interacted": "Order",
    "Order Login Success": "Order",
    "Order Login Viewed": "Order",
    "Order Missing SKU Add Initiated": "Order",
    "Order Missing SKU Cancelled": "Order",
    "Order Notification Sent": "Order",
    "Order Payment Details Viewed": "Order",
    "Order Payment Failed": "Order",
    "Order Payment Initiated": "Order",
    "Order Payment Mode Selected": "Order",
    "Order Payment Retry": "Order",
    "Order Payment Successful": "Order",
    "Order Placed": "Order",
    "Order Playstore Review Cancelled": "Order",
    "Order Playstore Review Initiated": "Order",
    "Order Promotion Interacted": "Order",
    "Order Promotion Viewed": "Order",
    "Order Referral Channel Selected": "Order",
    "Order Referral Initiated": "Order",
    "Order Referral Viewed": "Order",
    "Order Search Completed": "Order",
    "Order Search Initiated": "Order",
    "Order Search Interacted": "Order",
    "Order Search Viewed": "Order",
    "Order SKU Added": "Order",
    "Order SKU Interacted": "Order",
    "Order Subscription Schedule Viewed": "Order",
    "Order Subscription Viewed": "Order",
    "Order Support Called": "Order",
    "Order Support Pinged": "Order",
    "Order Viewed": "Order",
    "Payment Failed status Modal mweb Viewed": "Order",
    satish_order_medicines_booked: "Order",
    "View All Orders Clicked": "Order",
    "Authentication Interacted": "Accounts",
    "Authentication Successful": "Accounts",
    "Authentication Viewed": "Accounts",
    "Login Interacted": "Accounts",
    "Login Viewed": "Accounts",
    "User Setting Interacted": "Accounts",
    "User Setting Viewed": "Accounts",
    "Appointment Patient Details Completed": "Book",
    "Appointment Patient Details Initiated": "Book",
    "Appointment Patient Details Interacted": "Book",
    "Appointment Reminder Completed": "Book",
    "Appointment Reminder Initiated": "Book",
    "Doctor Appointment Cancelled": "Book",
    "Doctor Appointment Initiated": "Book",
    "Doctor Calendar Interacted": "Book",
    "Doctor Calendar Selected": "Book",
    "My Doctors Completed": "Book",
    "My Doctors Interacted": "Book",
    "Search Viewed": "Book",
    "Consult Ask Interacted": "Consult",
    "Consult Ask Opened": "Consult",
    "Consult Ask Viewed": "Consult",
    "Consult Chat Interacted": "Consult",
    "Consult Chat Viewed": "Consult",
    "Consult Feed Viewed": "Consult",
    "Consult Home Viewed": "Consult",
    "Consult Online Viewed": "Consult",
    "Consult QnA Interacted": "Consult",
    "Consult QnA Opened": "Consult",
    "Consult QnA Viewed": "Consult",
    "Diagnostic Appointment Completed": "Diagnostics",
    "Diagnostic Appointment Interacted": "Diagnostics",
    "Diagnostic Appointment Viewed": "Diagnostics",
    "Diagnostic Call Called": "Diagnostics",
    "Diagnostic Card Interacted": "Diagnostics",
    "Diagnostic Content Interacted": "Diagnostics",
    "Diagnostic Content Viewed": "Diagnostics",
    "Diagnostic Home Viewed": "Diagnostics",
    "Diagnostic Listing Interacted": "Diagnostics",
    "Diagnostic Listing Viewed": "Diagnostics",
    "Diagnostic Order Interacted": "Diagnostics",
    "Diagnostic Order Viewed": "Diagnostics",
    "Diagnostic Patient Details Interacted": "Diagnostics",
    "Diagnostic Patient Details Viewed": "Diagnostics",
    "Diagnostic Profile Called": "Diagnostics",
    "Diagnostic Profile Interacted": "Diagnostics",
    "Diagnostic Profile Viewed": "Diagnostics",
    "Diagnostic Search Interacted": "Diagnostics",
    "Diagnostic Search Viewed": "Diagnostics",
    "Diagnostic Time Slot Selected": "Diagnostics",
    "undefined Interacted": "Diagnostics",
    "Browser Permission Interacted": "Drive",
    "Drive App Banner Interacted": "Drive",
    "Drive App Banner Viewed": "Drive",
    "Drive Failed": "Drive",
    "Drive Login Interacted": "Drive",
    "Drive Login Viewed": "Drive",
    "Drive Menu Viewed": "Drive",
    "Drive Permission Interacted": "Drive",
    "Drive Permission Viewed": "Drive",
    "Drive Viewed": "Drive",
    "Record Add Initiated": "Drive",
    "Record Added": "Drive",
    "Record Deleted": "Drive",
    "Record Downloaded": "Drive",
    "Record Share Initiated": "Drive",
    "Record Shared": "Drive",
    "Record Timeline Viewed": "Drive",
    "Record Viewed": "Drive",
    "Records Group Deleted": "Drive",
    "Records Group Edit Initiated": "Drive",
    "Records Group Edited": "Drive",
    "Records Group Viewed": "Drive",
    "Clinic Feedback Card Interacted": "Feedback",
    "Clinic Feedback Viewed": "Feedback",
    "Clinic Feedbacks Viewed": "Feedback",
    "Doctor Feedback Card Interacted": "Feedback",
    "Doctor Feedback Dismissed": "Feedback",
    "Doctor Feedback Failed": "Feedback",
    "Doctor Feedback Initiated": "Feedback",
    "Doctor Feedback Submitted": "Feedback",
    "Doctor Feedback Upload Proof Initiated": "Feedback",
    "Doctor Feedback Upload Proof Successful": "Feedback",
    "Doctor Feedback Viewed": "Feedback",
    "Doctor Feedbacks Interacted": "Feedback",
    "Doctor Feedbacks Viewed": "Feedback",
    "My Feedback Viewed": "Feedback",
    "App Close": "HealtApp",
    "App Feedback Interacted": "HealtApp",
    "App Feedback Viewed": "HealtApp",
    "App Home Segments Initiated": "HealtApp",
    "App Home Viewed": "HealtApp",
    "App Install": "HealtApp",
    "App Open": "HealtApp",
    "App Shortcut Interacted": "HealtApp",
    "App Tutorial Skipped": "HealtApp",
    "App Tutorial Viewed": "HealtApp",
    "Authentication Completed": "HealtApp",
    "Data Security Link Interacted": "HealtApp",
    "Health Interests Skipped": "HealtApp",
    "Help Category Selected": "HealtApp",
    "Help Viewed": "HealtApp",
    "Issue Initiated": "HealtApp",
    "Issue Selected": "HealtApp",
    "Issue Submitted": "HealtApp",
    "My Offers Interacted": "HealtApp",
    "My Offers Viewed": "HealtApp",
    "Offers Banner Viewed": "HealtApp",
    "Reminder Add Initiated": "HealtApp",
    "Reminder Added": "HealtApp",
    "Reminder Edit Initiated": "HealtApp",
    "Reminder Edited": "HealtApp",
    "Reminder Interacted": "HealtApp",
    "Reminder Timeline Viewed": "HealtApp",
    "Reminder Viewed": "HealtApp",
    "Todo Card Dismissed": "HealtApp",
    "Todo Card Interacted": "HealtApp",
    "Todo Card Timeline Viewed": "HealtApp",
    "Todo Card Viewed": "HealtApp",
    "Trace Initiated": "HealtApp",
    "User Onboarding Interacted": "HealtApp",
    "User Profile Update Cancelled": "HealtApp",
    "User Profile Updated": "HealtApp",
    "User Profile Viewed": "HealtApp",
    "User Setting Updated": "HealtApp",
    "Wallet History Viewed": "HealtApp",
    "HF Article Interacted": "healthfeed",
    "HF Health Interests Interacted": "healthfeed",
    "HF Listing Viewed": "healthfeed",
    "HF Misc Interacted": "healthfeed",
    "HF Search Interacted": "healthfeed",
    "Nav Bar Interacted": "Nav web",
    "Nav Drawer Interacted": "Nav web",
    "Nav Drawer Viewed": "Nav web",
    "Nav Profile Interacted": "Nav web",
    "Nav Provider Marketing Interacted": "Nav web",
    "Nav Provider Marketing Viewed": "Nav web",
    "Practo Logo Interacted": "Nav web",
    "Checkout Dismissed": "Payments",
    "Checkout Interacted": "Payments",
    "Checkout Viewed": "Payments",
    "KYC Form Viewed": "Payments",
    "Payment Dismissed": "Payments",
    "Payment Failed": "Payments",
    "Payment Initiated": "Payments",
    "Payment Interacted": "Payments",
    "Payment Successful": "Payments",
    "Saved Payment Modes Removed": "Payments",
    "Saved Payment Modes Viewed": "Payments",
    "Contact Us Initiated": "Providers",
    "Contact Us Submitted": "Providers",
    "Product Demo Initiated": "Providers",
    "Product Demo Submitted": "Providers",
    "Provider Marketing Interacted": "Providers",
    "Provider Marketing Viewed": "Providers",
    "Ray Trial Initiated": "Providers",
    "Ray Trial Submitted": "Providers",
    "City Home Interacted": "Search",
    "City Home Viewed": "Search",
    "Clinic Card Interacted": "Search",
    "Clinic Impression": "Search",
    "Clinic Listing Interacted": "Search",
    "Clinic Listing Viewed": "Search",
    "Clinic Number Called": "Search",
    "Clinic Number Viewed": "Search",
    "Clinic Profile Interacted": "Search",
    "Clinic Profile Viewed": "Search",
    "Doctor Appointment Confirmed": "Search",
    "Doctor Card Interacted": "Search",
    "Doctor Impression": "Search",
    "Doctor Listing Interacted": "Search",
    "Doctor Listing Viewed": "Search",
    "Doctor Number Called": "Search",
    "Doctor Number Viewed": "Search",
    "Doctor Profile Interacted": "Search",
    "Doctor Profile Viewed": "Search",
    "Health Wiki Interacted": "Search",
    "Hospital Card Interacted": "Search",
    "Hospital Impression": "Search",
    "Hospital Listing Interacted": "Search",
    "Hospital Listing Viewed": "Search",
    "Hospital Number Called": "Search",
    "Hospital Number Viewed": "Search",
    "Hospital Profile Interacted": "Search",
    "Hospital Profile Viewed": "Search",
    "Location Prediction Completed": "Search",
    "Location Prediction Initiated": "Search",
    "Location Selector Initiated": "Search",
    "Query Prediction Completed": "Search",
    "Query Prediction Initiated": "Search",
    "Query Prediction Interacted": "Search",
    "Search Home Interacted": "Search",
    "Search Home Viewed": "Search",
    "Search Prompt Impression": "Search",
    "Search Prompt Interacted": "Search",
    freshchat_mail_report: "freshchat",
    "Dashboard Viewed": "Querent",
  };
  return {
    getEventNameSpace: function (r) {
      return (r = r.trim()), e[r];
    },
    url: eventsPipelineURL,
    enabled: !0,
  };
}
function _MIXPANEL(e) {
  var t = function (e) {
      var t = {
          first_name: "first_name",
          last_name: "last_name",
          created: "created",
          email: "email",
          name: "name",
          "First Name": "first_name",
          "Last Name": "last_name",
          Created: "created",
          Email: "email",
          Name: "name",
        },
        a = {},
        n = {},
        i = {};
      if (e.actorContext) {
        var o = [
          "email",
          "Email",
          "phone",
          "Phone",
          "Mobile",
          "mobile",
          "First Name",
          "first_name",
          "Name",
          "name",
          "last_name",
          "Last Name",
        ];
        o.forEach(function (t) {
          delete e.actorContext[t];
        });
      }
      for (actorDataKey in e.actorContext)
        if (t[actorDataKey]) {
          var r = "$" + t[actorDataKey];
          a[r] = e.actorContext[actorDataKey];
        } else
          "object" == typeof e.actorContext[actorDataKey] &&
          e.actorContext[actorDataKey] &&
          e.actorContext[actorDataKey].length
            ? (n[actorDataKey] = e.actorContext[actorDataKey])
            : "increment" == actorDataKey
            ? (i = e.actorContext.increment)
            : -1 !== actorDataKey.indexOf("Account id") &&
              -1 !== actorDataKey.indexOf("AccountId") &&
              (a[actorDataKey] = e.actorContext[actorDataKey]);
      try {
        e.Actor &&
          ((a["Account Id"] = e.Actor),
          mixpanel[pelProject].people.set(a),
          Object.keys(n).length && mixpanel[pelProject].people.union(n),
          Object.keys(i).length && mixpanel[pelProject].people.increment(i),
          mixpanel[pelProject].identify(e.Actor));
        var c =
          mixpanel[pelProject] &&
          "function" == typeof mixpanel[pelProject].get_distinct_id
            ? mixpanel[pelProject].get_distinct_id()
            : null;
        e.Actor && c && c != e.Actor && mixpanel[pelProject].reset();
      } catch (l) {
        console.log(l);
      }
    },
    a = function (e) {
      var t = e.eventName;
      delete e.eventName,
        delete e.actorContext,
        (e.practo_mixpanel_distinct_id = readCookie(
          "practo_mixpanel_distinct_id"
        ));
      try {
        mixpanel[pelProject].track(t, e);
      } catch (a) {
        console.log(a);
      }
    },
    n = function (e) {
      (mixpanelInitialized = !0), (e = e ? e : function () {});
      try {
        if (mixpanel) {
          if (mixpanel[pelProject]) return e();
          var t = TrakerConfig;
          return (
            (t = t ? t : {}),
            (t.loaded = function () {
              return (
                storeCookie(
                  "practo_mixpanel_distinct_id",
                  mixpanel[pelProject].get_distinct_id()
                ),
                e()
              );
            }),
            mixpanel.init(mpToken, t, pelProject)
          );
        }
        throw new Error("Mixpanel is not initialized");
      } catch (a) {
        return e();
      }
    };
  return (
    setTimeout(function () {
      mixpanelInitialized || n();
    }, 100),
    {
      logEvent: function (e) {
        mixpanelInitialized
          ? (t(e), a(e))
          : n(function () {
              t(e), a(e);
            });
      },
      trackLinks: function (e, a, i) {
        n();
        try {
          mixpanel[pelProject].track_links(e, a, function (e) {
            return (
              t(i),
              delete i.eventName,
              delete i.actorContext,
              (i.practo_mixpanel_distinct_id = readCookie(
                "practo_mixpanel_distinct_id"
              )),
              i
            );
          });
        } catch (o) {
          console.log(o);
        }
      },
      getDistinctId: function () {
        var e = readCookie("practo_mixpanel_distinct_id");
        return e ? e : (n(), readCookie("practo_mixpanel_distinct_id"));
      },
      getPractoMixpanelDistinctId: function () {
        return readCookie("practo_mixpanel_distinct_id");
      },
      enabled: !1,
    }
  );
}
var mixpanelInitialized = !1;
var cleverTapLoaded = cleverTapLoaded ? cleverTapLoaded : !1;
if (!cleverTapLoaded) {
  var clevertap = {
    event: [],
    profile: [],
    account: [],
    onUserLogin: [],
    notifications: [],
    region: "in",
    privacy: [],
  };
  clevertap.account.push({ id: "8W6-695-WK5Z" }),
    clevertap.privacy.push({ optOut: !1 }),
    clevertap.privacy.push({ useIP: !0 }),
    (function () {
      var originalEventPush = Array.prototype.push;
      clevertap.event.push = function (eventObj) {
        var scriptUrl = "https://www.practostatic.com/pel/clevertap/a.js";
        if (
          eventObj &&
          eventObj.eventName === "Doctor Profile Viewed" &&
          eventObj.namespace === "Search"
        ) {
          scriptUrl =
            "https://www.practostatic.com/pel/clevertap/clevertap.min.js";
        }
        var wzrk = document.createElement("script");
        wzrk.type = "text/javascript";
        wzrk.async = !0;
        wzrk.src = scriptUrl;
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(wzrk, s);
        return originalEventPush.apply(this, arguments);
      };
    })(),
    (cleverTapLoaded = !0);
}
function isArrayUtil(e) {
  return "isArray" in Array
    ? Array.isArray(e)
    : "[object Array]" === Object.prototype.toString.call(e);
}
function isEmptyObject(e) {
  for (var r in e) if (e.hasOwnProperty(r)) return !1;
  return JSON.stringify(e) === JSON.stringify({});
}
function convertToStartCase(e, r) {
  if (r) return "string" == typeof e ? e.trim() : e;
  var o,
    n = [];
  return e && isArrayUtil(e)
    ? e
    : ((o =
        e || "number" == typeof e || "boolean" == typeof e
          ? e.toString().split(" ")
          : []),
      o.forEach(function (e) {
        (e = e.trim()), e && ((e = e[0].toUpperCase() + e.slice(1)), n.push(e));
      }),
      (e = n.join(" ")),
      e.trim());
}
function setItemToPELStore(e, r) {
  localStorage && "undefined" != typeof localStorage
    ? localStorage.setItem(e, r)
    : (localVariableStore[e] = r);
}
function getItemFromPELStore(e) {
  return localStorage && "undefined" != typeof localStorage
    ? localStorage.getItem(e)
    : localVariableStore[e]
    ? localVariableStore[e]
    : null;
}
function storeCookie(e, r) {
  document.cookie = e + "=" + r + ";domain=.practo.com;path=/";
}
function readCookie(e) {
  return document.cookie.length > 0 &&
    ((c_start = document.cookie.indexOf(e + "=")), -1 != c_start)
    ? ((c_start = c_start + e.length + 1),
      (c_end = document.cookie.indexOf(";", c_start)),
      -1 == c_end && (c_end = document.cookie.length),
      unescape(document.cookie.substring(c_start, c_end)))
    : "";
}
var win;
win = "undefined" == typeof window ? { navigator: {} } : window;
var ArrayProto = Array.prototype,
  FuncProto = Function.prototype,
  ObjProto = Object.prototype,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  windowConsole = win.console,
  navigator = win.navigator,
  document = win.document,
  userAgent = navigator.userAgent,
  helper = {
    browser: function (e, r, o) {
      return (
        (r = r || ""),
        o || e.indexOf(" OPR/") > -1
          ? e.indexOf("Mini") > -1
            ? "Opera Mini"
            : "Opera"
          : /(BlackBerry|PlayBook|BB10)/i.test(e)
          ? "BlackBerry"
          : e.indexOf("IEMobile") > -1 || e.indexOf("WPDesktop") > -1
          ? "Internet Explorer Mobile"
          : e.indexOf("Edge") > -1
          ? "Microsoft Edge"
          : e.indexOf("FBIOS") > -1
          ? "Facebook Mobile"
          : e.indexOf("Chrome") > -1
          ? "Chrome"
          : e.indexOf("CriOS") > -1
          ? "Chrome iOS"
          : e.indexOf("FxiOS") > -1
          ? "Firefox iOS"
          : r.indexOf("Apple") > -1
          ? e.indexOf("Mobile")
            ? "Mobile Safari"
            : "Safari"
          : e.indexOf("Android") > -1
          ? "Android Mobile"
          : e.indexOf("Konqueror") > -1
          ? "Konqueror"
          : e.indexOf("Firefox") > -1
          ? "Firefox"
          : e.indexOf("MSIE") > -1 || e.indexOf("Trident/") > -1
          ? "Internet Explorer"
          : e.indexOf("Gecko") > -1
          ? "Mozilla"
          : ""
      );
    },
    browserVersion: function (e, r, o) {
      var n = helper.browser(e, r, o),
        t = {
          "Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
          "Microsoft Edge": /Edge\/(\d+(\.\d+)?)/,
          Chrome: /Chrome\/(\d+(\.\d+)?)/,
          "Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
          Safari: /Version\/(\d+(\.\d+)?)/,
          "Mobile Safari": /Version\/(\d+(\.\d+)?)/,
          Opera: /(Opera|OPR)\/(\d+(\.\d+)?)/,
          Firefox: /Firefox\/(\d+(\.\d+)?)/,
          "Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
          Konqueror: /Konqueror:(\d+(\.\d+)?)/,
          BlackBerry: /BlackBerry (\d+(\.\d+)?)/,
          "Android Mobile": /android\s(\d+(\.\d+)?)/,
          "Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
          Mozilla: /rv:(\d+(\.\d+)?)/,
        },
        i = t[n];
      if (void 0 === i) return null;
      var a = e.match(i);
      return a ? parseFloat(a[a.length - 2]) : null;
    },
    referringDomain: function (e) {
      var r = e.split("/");
      return r.length >= 3 ? r[2] : "";
    },
    parse_url: function (e) {
      if (e.indexOf("?") > -1) {
        queryString = e.split("?")[1];
        var r = queryString.split("&"),
          o = {};
        return (
          r.forEach(function (e) {
            (e = e.split("=")), (o[e[0]] = decodeURIComponent(e[1] || ""));
          }),
          o
        );
      }
    },
    action_campaign: function (e) {
      var r = helper.parse_url(e);
      return r && (r.action_campaign || r.utm_campaign)
        ? r.action_campaign || r.utm_campaign
        : ((r = helper.parse_url(window.location.href)),
          r && (r.action_campaign || r.utm_campaign));
    },
    action_medium: function (e) {
      var r = helper.parse_url(e);
      return r && (r.action_medium || r.utm_medium)
        ? r.action_medium || r.utm_medium
        : ((r = helper.parse_url(window.location.href)),
          r && (r.action_medium || r.utm_medium));
    },
    isBlockedUA: function (e) {
      return !!/(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(
        e
      );
    },
    os: function (e) {
      var r = e;
      return /Windows/i.test(r)
        ? /Phone/.test(r) || /WPDesktop/.test(r)
          ? "Windows Phone"
          : "Windows"
        : /(iPhone|iPad|iPod)/.test(r)
        ? "iOS"
        : /Android/.test(r)
        ? "Android"
        : /(BlackBerry|PlayBook|BB10)/i.test(r)
        ? "BlackBerry"
        : /Mac/i.test(r)
        ? "Mac OS X"
        : /Linux/.test(r)
        ? "Linux"
        : "";
    },
    properties: function () {
      return {
        os: helper.os(userAgent),
        browser: helper.browser(userAgent, navigator.vendor, window.opera),
        referrer: document.referrer,
        current_url: window.location.href,
        browser_version: helper.browserVersion(
          userAgent,
          navigator.vendor,
          window.opera
        ),
        action_medium: helper.action_medium(document.referrer),
        action_campaign: helper.action_campaign(document.referrer),
        isBlockedUA: helper.isBlockedUA(userAgent),
      };
    },
  },
  localVariableStore = localVariableStore ? localVariableStore : {},
  pelUUID = (function () {
    var e = function () {
        for (var e = 1 * new Date(), r = 0; e == 1 * new Date(); ) r++;
        return e.toString(16) + r.toString(16);
      },
      r = function () {
        return Math.random().toString(16).replace(".", "");
      },
      o = function () {
        function e(e, r) {
          var o,
            n = 0;
          for (o = 0; o < r.length; o++) n |= t[o] << (8 * o);
          return e ^ n;
        }
        var r,
          o,
          n = navigator.userAgent,
          t = [],
          i = 0;
        for (r = 0; r < n.length; r++)
          (o = n.charCodeAt(r)),
            t.unshift(255 & o),
            t.length >= 4 && ((i = e(i, t)), (t = []));
        return t.length > 0 && (i = e(i, t)), i.toString(16);
      };
    return function () {
      var n = (screen.height * screen.width).toString(16);
      return e() + "-" + r() + "-" + o() + "-" + n + "-" + e();
    };
  })();
function _log_local_event(e) {
  TrakerConfig = e;
  var t = JSON.parse(getItemFromPELStore("pendingEvents"));
  (t = t ? t : []),
    t.forEach(function (e) {
      var t = getPlatformInfo(e.platform);
      e.platform = t.platform;
      var o = new _PEL_Event(e);
      o.setContexts(t), o.logEvent();
    }),
    localStorage && localStorage.removeItem("pendingEvents");
}
var TrakerConfig = {};
if ("undefined" == typeof window.Tracker) {
  window.Tracker = function (e) {
    TrakerConfig = e;
  };
  var pelUUIDVal = readCookie("pelUUID");
  pelUUIDVal || ((pelUUIDVal = pelUUID()), storeCookie("pelUUID", pelUUIDVal));
}
setTimeout(function () {
  var e = getItemFromPELStore("config");
  (e = e ? JSON.parse(e) : {}), _log_local_event(e);
}, 100),
  (Tracker.prototype.createEvent = function (e) {
    var t = getPlatformInfo(e.platform);
    e.platform = t.platform;
    var o = new _PEL_Event(e);
    return o.setContexts(t), o;
  }),
  (Tracker.prototype.logEvent = function (e) {
    var t = getPlatformInfo(e.platform);
    e.platform = t.platform;
    var o = new _PEL_Event(e);
    o.setContexts(t), o.logEvent();
  }),
  (Tracker.prototype.getDistinctId = function () {
    var e = analyticsEndpoints.mixpanel.getDistinctId();
    return (e = e ? e : analyticsEndpoints.clevertap.getPractoCleverTapId());
  }),
  (Tracker.prototype.getPractoMixpanelDistinctId = function () {
    var e = analyticsEndpoints.mixpanel.getPractoMixpanelDistinctId();
    return (e = e ? e : analyticsEndpoints.clevertap.getPractoCleverTapId());
  }),
  (Tracker.prototype.getCleverTapId = function () {
    return analyticsEndpoints.clevertap.getPractoCleverTapId();
  }),
  (Tracker.prototype.requestPushPermission = function () {
    (pushPermissionTemplate = {
      titleText: "Would you like to receive Push Notifications?",
      bodyText:
        "We promise to only send you relevant content and give you updates on your transactions",
      okButtonText: "Sign me up!",
      rejectButtonText: "No thanks",
      okButtonColor: "#f28046",
      askAgainTimeInSeconds: 5,
      skipDialog: !0,
      serviceWorkerPath: "webpush-service-worker.js",
    }),
      clevertap.notifications.push(pushPermissionTemplate);
  });
function validatePropertry(e, t) {
  for (
    var r = validatorSchema[t].required, i = Object.keys(r), n = i.length - 1;
    n >= 0;
    n--
  ) {
    var o = i[n];
    if (!e[o] && 0 != e[o]) return !1;
    if (typeof e[o] != r[o]) return !1;
  }
  return !0;
}
function validateEventForCase(e) {
  for (key in e)
    if (key.indexOf("Context") > -1)
      for (context in e[key])
        for (
          var t =
              e[key] && e[key][context]
                ? e[key][context].toString().split(" ")
                : [],
            r = t.length - 1;
          r >= 0;
          r--
        ) {
          var i = t[r];
          if (
            i[0] &&
            i[0] !== i[0].toUpperCase() &&
            -1 == i.indexOf("@") &&
            -1 == i.indexOf("iOS")
          )
            throw new Error(
              i +
                " present in " +
                key +
                " is not as per specification it should be Start Case"
            );
        }
    else
      for (
        var t = e[key] ? e[key].toString().split(" ") : [], r = t.length - 1;
        r >= 0;
        r--
      ) {
        var i = t[r];
        if (
          i[0] &&
          i[0] !== i[0].toUpperCase() &&
          -1 == i.indexOf("@") &&
          -1 == i.indexOf("iOS")
        )
          throw new Error(
            i +
              " present in " +
              key +
              " is not as per specification it should be Start Case"
          );
      }
}

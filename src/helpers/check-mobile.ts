const check = {
    androidChrome: (userAgent: string) =>
        /Android/i.test(userAgent) && /Chrome\/[.0-9]*\sMobile/i.test(userAgent),
    androidWebView: (userAgent: string) =>
        /\bwv\b/i.test(userAgent) && /Chrome\/[.0-9]*\sMobile/i.test(userAgent),
    androidFirefox: (userAgent: string) =>
        /Android/i.test(userAgent) && /Gecko\/[.0-9]*\sFirefox\/[.0-9]*/i.test(userAgent),
    iOSChrome: (userAgent: string) =>
        /iPhone|iPad/i.test(userAgent) && /CriOS\/[.0-9]*\sMobile/i.test(userAgent),
    iOSFirefox: (userAgent: string) =>
        /iPhone|iPad/i.test(userAgent) && /FxiOS\/[.0-9]*\sMobile/i.test(userAgent),
    iOSSafari: (userAgent: string) =>
        /iPhone|iPad/i.test(userAgent) &&
        /Version\/[.0-9]*\sMobile\/[A-Za-z0-9]*\sSafari\/[.0-9]*/i.test(userAgent),
};

const checkMobile = (userAgent: string): boolean =>
    Object.values(check).some(callback => callback(userAgent));

export default checkMobile;

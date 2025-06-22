/**
 * Thanks to https://medium.com/geekculture/detecting-mobile-vs-desktop-browsers-in-javascript-ad46e8d23ce5 for this very useful function :D
 */
function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

type DeviceType = 'desktop' | 'mobile';

export function detectDevice(): DeviceType {
    return isMobile() ? 'mobile' : 'desktop';
}

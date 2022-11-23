import mapboxgl from '!mapbox-gl';
import { message } from 'antd';
import { getCurrentPosition } from './General.function';
const defaultLocation = [126.9585, 37.5070]

export const initGeo = async (mapContainer, marker,setLng, setLat, mapStyle='streets-v11', zoom= 15) => {
    return new Promise(async (resolve, reject) => {
        let location = []
        let pos = await getCurrentPosition()
        if (pos) {
            location = ([pos.lng, pos.lat])
        } else {
            message.warning('App cannot get user location (switch default location)')
            location = (defaultLocation)
        }
           
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmFvcXV5bGFuIiwiYSI6ImNrNnhzY2I3dTBoMnkzZnM2MWdmcndjbngifQ.gRlKi7Q0R5YLenCHp4PuAQ';
        // eslint-disable-next-line react-hooks/exhaustive-deps
       let  map = new mapboxgl.Map({
            container: mapContainer,
            style: `mapbox://styles/mapbox/${mapStyle}`,
            center: location,
            zoom: zoom,
            // pitch: 45,
        });
        setLng(location[0])
        setLat(location[1])
        marker.setLngLat(location)
        marker.addTo(map)
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            })
        );
        resolve(map)
    })
  
}

var bb = {
    success: 0,
    error: 0,
    blackberryTimeoutId: -1
};
function handleBlackBerryLocationTimeout() {
    if (bb.blackberryTimeoutId != -1) {
        bb.error({
            message: "Timeout error",
            code: 3
        })
    }
}
function handleBlackBerryLocation() {
    clearTimeout(bb.blackberryTimeoutId);
    bb.blackberryTimeoutId = -1;
    if (bb.success && bb.error) {
        if (blackberry.location.latitude == 0 && blackberry.location.longitude == 0) {
            bb.error({
                message: "Position unavailable",
                code: 2
            })
        } else {
            var a = null;
            if (blackberry.location.timestamp) {
                a = new Date(blackberry.location.timestamp)
            }
            bb.success({
                timestamp: a,
                coords: {
                    latitude: blackberry.location.latitude,
                    longitude: blackberry.location.longitude
                }
            })
        }
        bb.success = null;
        bb.error = null
    }
}
export const geoPosition = function () {
    var b = {};
    var d = null;
    var a = "undefined";
    var c = "http://freegeoip.net/json/?callback=JSONPCallback";
    b.getCurrentPosition = function (g, e, f) {
        d.getCurrentPosition(g, e, f)
    }
        ;
    b.jsonp = {
        callbackCounter: 0,
        fetch: function (e, h) {
            var f = "JSONPCallback_" + this.callbackCounter++;
            window[f] = this.evalJSONP(h);
            e = e.replace("=JSONPCallback", "=" + f);
            var g = document.createElement("SCRIPT");
            g.src = e;
            document.getElementsByTagName("HEAD")[0].appendChild(g)
        },
        evalJSONP: function (e) {
            return function (f) {
                e(f)
            }
        }
    };
    b.confirmation = function () {
        return confirm("This Webpage wants to track your physical location.\nDo you allow it?")
    }
        ;
    b.init = function () {
        try {
            var f = typeof (navigator.geolocation) != a;
            if (!f) {
                if (!b.confirmation()) {
                    return false
                }
            }
            if ((typeof (geoPositionSimulator) != a) && (geoPositionSimulator.length > 0)) {
                d = geoPositionSimulator
            } else {
                if (typeof (bondi) != a && typeof (bondi.geolocation) != a) {
                    d = bondi.geolocation
                } else {
                    if (f) {
                        d = navigator.geolocation;
                        b.getCurrentPosition = function (j, e, i) {
                            function h(k) {
                                var l;
                                if (typeof (k.latitude) != a) {
                                    l = {
                                        timestamp: k.timestamp,
                                        coords: {
                                            latitude: k.latitude,
                                            longitude: k.longitude
                                        }
                                    }
                                } else {
                                    l = k
                                }
                                j(l)
                            }
                            d.getCurrentPosition(h, e, i)
                        }
                    } else {
                        if (typeof (window.blackberry) != a && blackberry.location.GPSSupported) {
                            if (typeof (blackberry.location.setAidMode) == a) {
                                return false
                            }
                            blackberry.location.setAidMode(2);
                            b.getCurrentPosition = function (i, e, h) {
                                bb.success = i;
                                bb.error = e;
                                if (h.timeout) {
                                    bb.blackberryTimeoutId = setTimeout("handleBlackBerryLocationTimeout()", h.timeout)
                                } else {
                                    bb.blackberryTimeoutId = setTimeout("handleBlackBerryLocationTimeout()", 60000)
                                }
                                blackberry.location.onLocationUpdate("handleBlackBerryLocation()");
                                blackberry.location.refreshLocation()
                            }
                                ;
                            d = blackberry.location
                        } else {
                            if (typeof (Mojo) != a && typeof (Mojo.Service.Request) != "Mojo.Service.Request") {
                                d = true;
                                b.getCurrentPosition = function (i, e, h) {
                                    parameters = {};
                                    if (h) {
                                        if (h.enableHighAccuracy && h.enableHighAccuracy == true) {
                                            parameters.accuracy = 1
                                        }
                                        if (h.maximumAge) {
                                            parameters.maximumAge = h.maximumAge
                                        }
                                        if (h.responseTime) {
                                            if (h.responseTime < 5) {
                                                parameters.responseTime = 1
                                            } else {
                                                if (h.responseTime < 20) {
                                                    parameters.responseTime = 2
                                                } else {
                                                    parameters.timeout = 3
                                                }
                                            }
                                        }
                                    }
                                    r = new Mojo.Service.Request("palm://com.palm.location", {
                                        method: "getCurrentPosition",
                                        parameters: parameters,
                                        onSuccess: function (j) {
                                            i({
                                                timestamp: j.timestamp,
                                                coords: {
                                                    latitude: j.latitude,
                                                    longitude: j.longitude,
                                                    heading: j.heading
                                                }
                                            })
                                        },
                                        onFailure: function (j) {
                                            if (j.errorCode == 1) {
                                                e({
                                                    code: 3,
                                                    message: "Timeout"
                                                })
                                            } else {
                                                if (j.errorCode == 2) {
                                                    e({
                                                        code: 2,
                                                        message: "Position unavailable"
                                                    })
                                                } else {
                                                    e({
                                                        code: 0,
                                                        message: "Unknown Error: webOS-code" + errorCode
                                                    })
                                                }
                                            }
                                        }
                                    })
                                }
                            } else {
                                if (typeof (device) != a && typeof (device.getServiceObject) != a) {
                                    d = device.getServiceObject("Service.Location", "ILocation");
                                    b.getCurrentPosition = function (i, e, h) {
                                        function k(n, m, l) {
                                            if (m == 4) {
                                                e({
                                                    message: "Position unavailable",
                                                    code: 2
                                                })
                                            } else {
                                                i({
                                                    timestamp: null,
                                                    coords: {
                                                        latitude: l.ReturnValue.Latitude,
                                                        longitude: l.ReturnValue.Longitude,
                                                        altitude: l.ReturnValue.Altitude,
                                                        heading: l.ReturnValue.Heading
                                                    }
                                                })
                                            }
                                        }
                                        var j = new Object();
                                        j.LocationInformationClass = "BasicLocationInformation";
                                        d.ILocation.GetLocation(j, k)
                                    }
                                } else {
                                    b.getCurrentPosition = function (i, e, h) {
                                        b.jsonp.fetch(c, function (j) {
                                            i({
                                                timestamp: j.timestamp,
                                                coords: {
                                                    latitude: j.latitude,
                                                    longitude: j.longitude,
                                                    heading: j.heading
                                                }
                                            })
                                        })
                                    }
                                        ;
                                    d = true
                                }
                            }
                        }
                    }
                }
            }
        } catch (g) {
            if (typeof (console) != a) {
                console.log(g)
            }
            return false
        }
        return d != null
    }
        ;
    return b
}()
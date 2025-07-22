export default {
    _generateRandomOffset(lat, lng, radius) {
        const radiusInDegrees = radius / 111;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.sqrt(Math.random()) * radiusInDegrees;

        const latOffset = distance * Math.cos(angle);
        const lngOffset = distance * Math.sin(angle) / Math.cos(lat * Math.PI / 180);
        console.log("[OFFSET] ", lat+latOffset, lng+lngOffset)
        return {
            lat: lat + latOffset,
            long: lng + lngOffset
        };
    }
}
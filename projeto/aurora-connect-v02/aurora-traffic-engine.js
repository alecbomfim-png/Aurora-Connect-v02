/**
 * Aurora Connect — Traffic Intelligence Engine (V03)
 * Provider-neutral client adapter. Receives normalized events from the Aurora backend.
 *
 * IMPORTANT:
 * - This module does not scrape Google/Waze or fabricate live traffic.
 * - A trusted backend must supply incidents/flow data with source + timestamps.
 * - Route recalculation is delegated to the app's existing routing adapter.
 * - Load after Leaflet and before the app bootstrap.
 */
(function (global) {
  "use strict";

  const DEFAULTS = {
    staleAfterMs: 5 * 60 * 1000,
    rerouteMinDelayMs: 30 * 1000,
    incidentLookAheadMeters: 12000,
    warningDistanceMeters: 2500,
    maxEventAgeMs: 30 * 60 * 1000
  };

  const COLORS = {
    free: "#75d6a1",
    slow: "#f2bb62",
    heavy: "#f07872",
    closed: "#ff3b30"
  };

  const ICONS = {
    accident: "⚠",
    obstacle: "🌳",
    road_closure: "⛔",
    construction: "🚧",
    congestion: "🚗",
    stalled_vehicle: "🚙",
    flooding: "🌊",
    hazard: "⚠",
    unknown: "!"
  };

  const now = () => Date.now();
  const finite = value => Number.isFinite(Number(value));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function distanceMeters(a, b) {
    const rad = value => value * Math.PI / 180;
    const dLat = rad(b.lat - a.lat);
    const dLon = rad(b.lng - a.lng);
    const x = Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function normalizeEvent(event) {
    if (!event || !finite(event.lat) || !finite(event.lng)) return null;
    const observedAt = event.observedAt ? new Date(event.observedAt).getTime() : 0;
    const expiresAt = event.expiresAt ? new Date(event.expiresAt).getTime() : 0;
    return {
      id: String(event.id || event.providerEventId || ""),
      provider: String(event.provider || "unknown"),
      type: String(event.type || "unknown"),
      severity: ["low", "moderate", "high", "critical"].includes(event.severity)
        ? event.severity : "moderate",
      description: String(event.description || "Ocorrência informada"),
      roadName: String(event.roadName || ""),
      direction: String(event.direction || ""),
      lat: Number(event.lat),
      lng: Number(event.lng),
      observedAt: observedAt || null,
      expiresAt: expiresAt || null,
      confidence: finite(event.confidence) ? clamp(Number(event.confidence), 0, 1) : null,
      status: String(event.status || "reported")
    };
  }

  class AuroraTrafficEngine {
    constructor(options) {
      this.options = Object.assign({}, DEFAULTS, options || {});
      this.map = this.options.map || null;
      this.onReroute = this.options.onReroute || null;
      this.onAlert = this.options.onAlert || null;
      this.onState = this.options.onState || null;
      this.events = new Map();
      this.markers = new Map();
      this.routeLayers = [];
      this.lastRerouteAt = 0;
      this.lastRerouteFingerprint = "";
      this.position = null;
      this.route = null;
      this.speedWatchId = null;
      this.speedKmh = null;
      this.speedAccuracy = null;
      this.destroyed = false;
    }

    setMap(map) {
      this.map = map;
      this.renderEvents();
    }

    setRoute(route) {
      // route: { coordinates: [[lat,lng],...], distanceMeters, durationSeconds }
      this.route = route || null;
      this.renderRouteTraffic();
    }

    updateEvents(rawEvents) {
      const timestamp = now();
      const next = new Map();
      (Array.isArray(rawEvents) ? rawEvents : []).forEach(raw => {
        const event = normalizeEvent(raw);
        if (!event || !event.id) return;
        if (event.observedAt && timestamp - event.observedAt > this.options.maxEventAgeMs) return;
        if (event.expiresAt && event.expiresAt <= timestamp) return;
        next.set(event.id, event);
      });
      this.events = next;
      this.renderEvents();
      this.renderRouteTraffic();
      this.evaluateReroute();
      this.emitState();
      return this.getSnapshot();
    }

    setPosition(lat, lng) {
      if (!finite(lat) || !finite(lng)) return;
      this.position = { lat: Number(lat), lng: Number(lng), updatedAt: now() };
      this.evaluateReroute();
      this.emitState();
    }

    startSpeedTracking() {
      if (!navigator.geolocation || this.speedWatchId !== null) return false;
      this.speedWatchId = navigator.geolocation.watchPosition(position => {
        const coords = position.coords || {};
        // GPS speed is metres/second. It is vehicle ground speed, NOT the road's legal limit.
        if (finite(coords.speed) && Number(coords.speed) >= 0) {
          this.speedKmh = Number(coords.speed) * 3.6;
          this.speedAccuracy = finite(coords.accuracy) ? Number(coords.accuracy) : null;
        } else {
          this.speedKmh = null;
        }
        this.setPosition(coords.latitude, coords.longitude);
        this.emitState();
      }, () => {
        this.speedKmh = null;
        this.emitState();
      }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 });
      return true;
    }

    stopSpeedTracking() {
      if (this.speedWatchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(this.speedWatchId);
      }
      this.speedWatchId = null;
    }

    getSnapshot() {
      return {
        speedKmh: this.speedKmh,
        speedAccuracyMeters: this.speedAccuracy,
        position: this.position,
        incidents: Array.from(this.events.values()),
        route: this.route,
        updatedAt: new Date().toISOString()
      };
    }

    getRouteImpact() {
      if (!this.route || !Array.isArray(this.route.coordinates)) return [];
      const points = this.route.coordinates.map(pair => ({ lat: pair[0], lng: pair[1] }));
      return Array.from(this.events.values()).map(event => {
        let nearest = Infinity;
        points.forEach(point => {
          nearest = Math.min(nearest, distanceMeters(point, event));
        });
        return Object.assign({}, event, { distanceToRouteMeters: Math.round(nearest) });
      }).filter(event => event.distanceToRouteMeters <= this.options.incidentLookAheadMeters)
        .sort((a, b) => a.distanceToRouteMeters - b.distanceToRouteMeters);
    }

    evaluateReroute() {
      if (!this.position || !this.route || typeof this.onReroute !== "function") return;
      const relevant = this.getRouteImpact().filter(event =>
        event.distanceToRouteMeters <= this.options.incidentLookAheadMeters &&
        ["high", "critical"].includes(event.severity) &&
        event.status !== "dismissed"
      );
      if (!relevant.length) return;
      const fingerprint = relevant.map(e => e.id).sort().join("|");
      if (fingerprint === this.lastRerouteFingerprint) return;
      if (now() - this.lastRerouteAt < this.options.rerouteMinDelayMs) return;
      this.lastRerouteAt = now();
      this.lastRerouteFingerprint = fingerprint;
      this.onReroute({
        reason: "incident_ahead",
        incidents: relevant,
        currentPosition: this.position,
        currentRoute: this.route
      });
    }

    renderEvents() {
      if (!this.map || !global.L) return;
      this.markers.forEach(marker => marker.remove());
      this.markers.clear();
      this.events.forEach(event => {
        const color = event.severity === "critical" || event.severity === "high"
          ? COLORS.closed : event.severity === "moderate" ? COLORS.slow : COLORS.free;
        const icon = global.L.divIcon({
          className: "aurora-incident-marker",
          html: '<span style="--aurora-alert-color:' + color + '">' +
            (ICONS[event.type] || ICONS.unknown) + '</span>',
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });
        const marker = global.L.marker([event.lat, event.lng], { icon, keyboard: false })
          .bindPopup(
            '<strong>' + this.escape(event.description) + '</strong>' +
            (event.roadName ? '<br>' + this.escape(event.roadName) : '') +
            '<br><small>Fonte: ' + this.escape(event.provider) +
            (event.observedAt ? ' · Atualizado: ' + new Date(event.observedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : '') +
            (event.confidence !== null ? ' · Confiança: ' + Math.round(event.confidence * 100) + '%' : '') +
            '</small>'
          ).addTo(this.map);
        this.markers.set(event.id, marker);
      });
    }

    renderRouteTraffic() {
      if (!this.map || !global.L || !this.route || !Array.isArray(this.route.coordinates)) return;
      this.routeLayers.forEach(layer => layer.remove());
      this.routeLayers = [];
      const impact = this.getRouteImpact();
      const severe = impact.some(e => ["high", "critical"].includes(e.severity));
      const color = severe ? COLORS.heavy : impact.length ? COLORS.slow : COLORS.free;
      const line = global.L.polyline(this.route.coordinates, {
        color, weight: 7, opacity: 0.9, lineCap: "round", lineJoin: "round"
      }).addTo(this.map);
      this.routeLayers.push(line);
    }

    speakIncident(event) {
      if (!event || !("speechSynthesis" in global)) return false;
      const distance = finite(event.distanceToRouteMeters)
        ? Math.max(0, event.distanceToRouteMeters) : null;
      const distanceText = distance === null ? "" :
        (distance >= 1000 ? (distance / 1000).toFixed(1).replace(".", ",") + " quilômetros" :
          Math.round(distance) + " metros") + " à frente. ";
      const text = "Atenção. " + distanceText + event.description + ".";
      global.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      global.speechSynthesis.speak(utterance);
      return true;
    }

    emitState() {
      if (typeof this.onState === "function") this.onState(this.getSnapshot());
      if (typeof this.onAlert === "function") {
        this.getRouteImpact().filter(e =>
          e.distanceToRouteMeters <= this.options.warningDistanceMeters
        ).forEach(e => this.onAlert(e));
      }
    }

    escape(value) {
      return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      })[char]);
    }

    destroy() {
      this.destroyed = true;
      this.stopSpeedTracking();
      this.markers.forEach(marker => marker.remove());
      this.routeLayers.forEach(layer => layer.remove());
      this.markers.clear();
      this.routeLayers = [];
      this.events.clear();
    }
  }

  global.AuroraTrafficEngine = AuroraTrafficEngine;
})(window);

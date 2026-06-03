import mapboxgl from 'mapbox-gl'

// Set Mapbox token
const token = process.env.VITE_MAPBOX_TOKEN
if (token) {
  mapboxgl.accessToken = token
}

class MapService {
  constructor() {
    this.map = null
    this.markers = {}
    this.routes = {}
    this.isInitialized = false
  }

  // Initialize map
  initialize(containerId, options = {}) {
    if (!mapboxgl.accessToken) {
      console.error('Mapbox token not set')
      return null
    }

    if (this.map) {
      return this.map
    }

    const defaultOptions = {
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-73.9, 40.7], // Default to NYC
      zoom: 12,
      ...options,
    }

    this.map = new mapboxgl.Map(defaultOptions)

    this.map.on('load', () => {
      this.isInitialized = true
      console.log('Map loaded and initialized')
    })

    return this.map
  }

  // Add a marker to the map
  addMarker(id, coordinates, options = {}) {
    if (!this.map) {
      console.error('Map not initialized')
      return null
    }

    const element = document.createElement('div')
    element.className = 'map-marker'
    element.style.backgroundImage = `url('${options.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>')'`
    element.style.backgroundSize = 'contain'
    element.style.width = options.width || '32px'
    element.style.height = options.height || '32px'

    const marker = new mapboxgl.Marker(element, { anchor: 'center' })
      .setLngLat(coordinates)
      .addTo(this.map)

    // Add popup if provided
    if (options.popup) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(options.popup)
      marker.setPopup(popup)
    }

    this.markers[id] = { marker, element }
    return marker
  }

  // Update marker position
  updateMarkerPosition(id, coordinates) {
    if (this.markers[id]) {
      this.markers[id].marker.setLngLat(coordinates)
    }
  }

  // Remove marker
  removeMarker(id) {
    if (this.markers[id]) {
      this.markers[id].marker.remove()
      delete this.markers[id]
    }
  }

  // Draw route between two points
  drawRoute(id, coordinates, options = {}) {
    if (!this.map) {
      console.error('Map not initialized')
      return
    }

    const sourceId = `route-${id}`
    const layerId = `route-layer-${id}`

    // Remove existing route if it exists
    if (this.routes[id]) {
      this.removeRoute(id)
    }

    // Add source
    if (!this.map.getSource(sourceId)) {
      this.map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      })
    }

    // Add layer
    this.map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': options.color || '#000',
        'line-width': options.width || 3,
        'line-opacity': options.opacity || 0.8,
      },
    })

    this.routes[id] = { sourceId, layerId }
  }

  // Update route
  updateRoute(id, coordinates) {
    if (this.routes[id]) {
      const sourceId = this.routes[id].sourceId
      this.map.getSource(sourceId).setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
      })
    }
  }

  // Remove route
  removeRoute(id) {
    if (this.routes[id]) {
      const { sourceId, layerId } = this.routes[id]
      this.map.removeLayer(layerId)
      this.map.removeSource(sourceId)
      delete this.routes[id]
    }
  }

  // Fit bounds to show all markers/routes
  fitBounds(bounds, options = {}) {
    if (!this.map) return

    this.map.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      ...options,
    })
  }

  // Center map on coordinates
  centerMap(coordinates, zoom = 12) {
    if (!this.map) return

    this.map.flyTo({
      center: coordinates,
      zoom,
      duration: 2000,
    })
  }

  // Get bounds of all markers
  getMarkersBounds() {
    if (Object.keys(this.markers).length === 0) return null

    const coordinates = Object.values(this.markers).map((m) =>
      m.marker.getLngLat()
    )

    const bounds = coordinates.reduce(
      (bounds, coord) => {
        return bounds.extend(coord)
      },
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    )

    return bounds
  }

  // Animate marker along route
  animateMarker(markerId, routeCoordinates, duration = 10000) {
    const marker = this.markers[markerId]?.marker
    if (!marker) return

    const steps = routeCoordinates.length
    const stepDuration = duration / steps

    let currentStep = 0

    const animate = () => {
      if (currentStep < steps) {
        marker.setLngLat(routeCoordinates[currentStep])
        currentStep++
        setTimeout(animate, stepDuration)
      }
    }

    animate()
  }

  // Add heatmap layer
  addHeatmap(id, data, options = {}) {
    if (!this.map) return

    const sourceId = `heatmap-${id}`
    const layerId = `heatmap-layer-${id}`

    this.map.addSource(sourceId, {
      type: 'geojson',
      data,
    })

    this.map.addLayer({
      id: layerId,
      type: 'heatmap',
      source: sourceId,
      paint: {
        'heatmap-weight': options.weight || ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
        'heatmap-intensity': options.intensity || 1,
        'heatmap-color': options.color || [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(0, 0, 255, 0)',
          0.1,
          'royalblue',
          0.3,
          'cyan',
          0.5,
          'lime',
          0.7,
          'yellow',
          1,
          'red',
        ],
        'heatmap-radius': options.radius || 20,
        'heatmap-opacity': options.opacity || 0.8,
      },
    })
  }

  // Get map instance
  getMap() {
    return this.map
  }

  // Destroy map
  destroy() {
    if (this.map) {
      this.map.remove()
      this.map = null
      this.markers = {}
      this.routes = {}
      this.isInitialized = false
    }
  }
}

// Export singleton instance
export const mapService = new MapService()

export default MapService

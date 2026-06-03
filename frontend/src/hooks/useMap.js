import { useEffect, useState, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'

// Note: Make sure to set VITE_MAPBOX_TOKEN in .env
mapboxgl.accessToken = process.env.VITE_MAPBOX_TOKEN

export function useMap(container, initialOptions = {}) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!container || !process.env.VITE_MAPBOX_TOKEN) {
      setError('Map container or Mapbox token not found')
      setLoading(false)
      return
    }

    try {
      const mapInstance = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-73.9, 40.7],
        zoom: 12,
        ...initialOptions,
      })

      mapInstance.on('load', () => {
        setMap(mapInstance)
        setLoading(false)
      })

      mapRef.current = mapInstance

      return () => {
        mapInstance.remove()
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }, [container, initialOptions])

  const addMarker = useCallback(
    (coordinates, options = {}) => {
      if (!map) return null

      const marker = new mapboxgl.Marker(options)
        .setLngLat(coordinates)
        .addTo(map)

      return marker
    },
    [map]
  )

  const fitBounds = useCallback(
    (bounds, options = {}) => {
      if (!map) return

      map.fitBounds(bounds, {
        padding: 50,
        ...options,
      })
    },
    [map]
  )

  const drawRoute = useCallback(
    (coordinates, options = {}) => {
      if (!map || !map.getSource('route')) {
        map?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates,
            },
          },
        })

        map?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#000',
            'line-width': 3,
          },
          ...options,
        })
      } else {
        map?.getSource('route').setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
        })
      }
    },
    [map]
  )

  const updateMarkerPosition = useCallback(
    (marker, newCoordinates) => {
      if (marker) {
        marker.setLngLat(newCoordinates)
      }
    },
    []
  )

  return {
    map,
    loading,
    error,
    addMarker,
    fitBounds,
    drawRoute,
    updateMarkerPosition,
  }
}

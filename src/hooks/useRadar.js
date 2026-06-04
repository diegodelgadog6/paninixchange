import { useRef, useState } from 'react'

export function useRadar(initialRadius = 5.2) {
  const [radius, setRadius] = useState(initialRadius)

  // TODO: Google Maps integration
  // const mapRef = useRef(null)
  // useEffect(() => {
  //   mapRef.current = new google.maps.Map(element, { center, zoom })
  //   return () => mapRef.current = null
  // }, [])

  return { radius, setRadius }
}

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeCanvas() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current

    // Dimensions
    let width = container.clientWidth
    let height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 8

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Interactive Particles Setup
    const particleCount = 2400
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const initialPositions = new Float32Array(particleCount * 3)

    // Generate procedural botanical spiral cloud
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 36 // spiral factor
      const r = Math.pow(i / particleCount, 0.5) * 5.0 // dispersion radius
      
      // Calculate swirling coordinate
      const x = Math.cos(theta) * r
      const y = (Math.random() - 0.5) * 0.8 + Math.sin(r * 2) * 0.6
      const z = Math.sin(theta) * r

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      initialPositions[i * 3] = x
      initialPositions[i * 3 + 1] = y
      initialPositions[i * 3 + 2] = z

      // Color scheme: Emerald (#10b981), Pale Green (#a7f3d0), Gold (#fbbf24)
      const colorRand = Math.random()
      if (colorRand < 0.5) {
        colors[i * 3] = 0.06     // R
        colors[i * 3 + 1] = 0.72 // G
        colors[i * 3 + 2] = 0.50 // B
      } else if (colorRand < 0.8) {
        colors[i * 3] = 0.65     // R
        colors[i * 3 + 1] = 0.95 // G
        colors[i * 3 + 2] = 0.82 // B
      } else {
        colors[i * 3] = 0.98     // R
        colors[i * 3 + 1] = 0.75 // G
        colors[i * 3 + 2] = 0.14 // B
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Canvas Point texture
    const canvasTexture = document.createElement('canvas')
    canvasTexture.width = 16
    canvasTexture.height = 16
    const ctx = canvasTexture.getContext('2d')
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 16, 16)
    const texture = new THREE.CanvasTexture(canvasTexture)

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // Mouse Parallax movement
    let targetX = 0
    let targetY = 0
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((event.clientX - rect.left) / width) * 2 - 1
      mouseY = -((event.clientY - rect.top) / height) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Window Resize
    const handleResize = () => {
      if (!containerRef.current) return
      width = container.clientWidth
      height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animationFrameId
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const time = clock.getElapsedTime()
      
      // Update particles wave animation
      const posAttr = geometry.attributes.position
      for (let i = 0; i < particleCount; i++) {
        const x = initialPositions[i * 3]
        const z = initialPositions[i * 3 + 2]
        
        // Organic floating animation using sine/cosine combinations
        const dist = Math.sqrt(x * x + z * z)
        posAttr.setY(
          i,
          initialPositions[i * 3 + 1] + 
          Math.sin(time * 1.2 + dist * 1.5) * 0.12 + 
          Math.cos(time * 0.8 + x * 0.5) * 0.08
        )
      }
      posAttr.needsUpdate = true

      // Slow idle rotation
      particleSystem.rotation.y = time * 0.04

      // Lerp mouse interaction
      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05

      particleSystem.rotation.x = targetY * 0.25
      particleSystem.rotation.y += targetX * 0.35

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      
      // Dispose materials & geometry
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full opacity-75" />
    </div>
  )
}

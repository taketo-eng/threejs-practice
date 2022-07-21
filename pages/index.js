import { useEffect, useRef, useState } from 'react'
import * as Three from 'three'
import { toRadian, scalePercent, linear, easeInOut } from 'helpers/common'

export default function Home() {
  let scrollPercent = 0
  const mountRef = useRef(null)
  const [scene] = useState(new Three.Scene())

  useEffect(() => {
    const elem = mountRef.current
    const sizes = {
      width: innerWidth,
      height: innerHeight,
    }

    const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)

    const renderer = new Three.WebGLRenderer({
      antialias: true,
      alpha: true,
    })

    elem.appendChild(renderer.domElement)

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    const boxGeometry = new Three.BoxGeometry(1, 1, 1)
    const boxMaterial = new Three.MeshLambertMaterial({
      color: '#2497f0',
    })
    const box = new Three.Mesh(boxGeometry, boxMaterial)
    box.position.z = -5
    box.rotation.set(0, 0, 0)
    scene.add(box)

    // light
    const ambientLight = new Three.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)
    const pointLight = new Three.PointLight(0xffffff, 0.2)
    pointLight.position.set(1, 2, 3)
    scene.add(pointLight)

    document.body.onscroll = () => {
      /*
       * scrollTop: 画面の上辺からページ最上部までの距離
       * scrollHeight: 全体の高さ
       * clientHiehgt: 画面の高さ
       */
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100
    }

    const animationScripts = [
      {
        start: 0,
        end: 50,
        function() {
          box.position.z = easeInOut(-5, -20, scalePercent(scrollPercent, this.start, this.end))
          const rotationX = linear(toRadian(0), toRadian(20), scalePercent(scrollPercent, this.start, this.end))
          const rotationY = linear(toRadian(0), toRadian(15), scalePercent(scrollPercent, this.start, this.end))
          box.rotation.set(rotationX, rotationY, 0)
        },
      },
      {
        start: 50,
        end: 100,
        function() {
          box.position.z = easeInOut(-20, -5, scalePercent(scrollPercent, this.start, this.end))
          box.position.x = easeInOut(0, 1, scalePercent(scrollPercent, this.start, this.end))
          const rotationX = linear(toRadian(20), toRadian(25), scalePercent(scrollPercent, this.start, this.end))
          const rotationY = linear(toRadian(15), toRadian(45), scalePercent(scrollPercent, this.start, this.end))
          box.rotation.set(rotationX, rotationY, 0)
        },
      },
    ]

    function playAnimation() {
      animationScripts.forEach((animation) => {
        if (scrollPercent >= animation.start && scrollPercent <= animation.end) {
          animation.function(scrollPercent)
        }
      })
    }

    const tick = () => {
      window.requestAnimationFrame(tick)
      playAnimation()
      renderer.render(scene, camera)
    }
    // start animation
    tick()

    // resize scene
    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(window.devicePixelRatio)
    })

    return () => {
      elem.removeChild(renderer.domElement)
    }
  }, [])
  return (
    <>
      <div className="container" ref={mountRef} />
      <main></main>
    </>
  )
}

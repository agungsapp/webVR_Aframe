import React, { useState, useEffect } from 'react';
import 'aframe';
import 'aframe-template-component';
import 'aframe-layout-component';
import 'aframe-event-set-component';
import 'aframe-proxy-event-component';

const VRScene = () => {
  const [currentImage, setCurrentImage] = useState('#top_left');
  const [hotspots, setHotspots] = useState({
    '#top_right': [
      { position: '-9 1 -2', target: '#bottom_center' },
      { position: '0 0 -8', target: '#top_left' },
      { position: '3 0 -8', target: '#top_center' },
    ],
    '#bottom_center': [
      { position: '-8 1 -3', target: '#top_right' },
      { position: '-11 1 4', target: '#top_left' },
      { position: '-10 1 0', target: '#top_center' },
    ],
    '#top_left': [
      { position: '-1 1 8', target: '#top_right' },
      { position: '-9 1 2', target: '#bottom_center' },
      { position: '2 1 6', target: '#top_center' },
    ],
    '#top_center': [
      { position: '-1 1 8', target: '#top_right' },
      { position: '-9 1 0', target: '#bottom_center' },
      { position: '1 0 -8', target: '#top_left' }
    ],
  });

  const handleHotspotClick = (newImage) => {
    const sky = document.querySelector('#image-360');
    sky.emit('fade');
    setTimeout(() => {
      setCurrentImage(newImage);
      sky.emit('fadeback');
    }, 300);
  };

  useEffect(() => {
    const vrButton = document.getElementById('vr-button');
    vrButton.addEventListener('click', () => {
      const sceneEl = document.querySelector('a-scene');
      if (sceneEl) {
        sceneEl.enterVR();
      }
    });
  }, []);

  return (
    <>
      <a-scene vr-mode-ui="enabled: true">
        <a-assets>
          <img id="top_right" src="Left on Table_L.png" />
          <img id="bottom_center" src="behind_L.png" />
          <img id="top_left" src="Right on Door_R.png" />
          <img id="top_center" src="Center on board_L_R.png" />
        </a-assets>

        <a-sky
          id="image-360"
          radius="30"
          src={currentImage}
          animation__fade="property: material.color; type: color; from: #FFF; to: #000; dur: 300; startEvents: fade"
          animation__fadeback="property: material.color; type: color; from: #000; to: #FFF; dur: 300; startEvents: fadeback"
        />

        <a-camera>
          <a-cursor
            id="cursor"
            animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"
            animation__fusing="property: scale; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500"
          />
        </a-camera>

        {hotspots[currentImage].map((hotspot, index) => (
          <a-entity
            key={index}
            geometry="primitive: sphere; radius: 0.2"
            material="color: #FF0000; opacity: 0.8"
            position={hotspot.position}
            look-at="[camera]"
            event-set__mouseenter="_event: mouseenter; material.color: #FFFF00"
            event-set__mouseleave="_event: mouseleave; material.color: #FF0000"
            onClick={() => handleHotspotClick(hotspot.target)}
          >
            <a-animation attribute="scale" from="1 1 1" to="1.2 1.2 1.2" dur="500" direction="alternate" repeat="indefinite"></a-animation>
          </a-entity>
        ))}
      </a-scene>

      <button id="vr-button" style={buttonStyle}>Mode Kamera VR</button>
    </>
  );
};

const buttonStyle = {
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#FFF',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default VRScene;

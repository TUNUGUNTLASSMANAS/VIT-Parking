import React, { useEffect } from 'react';
import './Preloader.css'; // Assuming you save your CSS in Preloader.css

const Preloader = () => {
  useEffect(() => {
    const preloaderTimeout = setTimeout(() => {
      document.querySelector('.preloader').style.display = 'none';
    }, 1000);

    return () => clearTimeout(preloaderTimeout);
  }, []);

  return (
    <div className="preloader">
      <svg height="1000" width="1000" xmlns="http://www.w3.org/2000/svg">
        <text x="625" y="400" className='temp' >VIT</text>
        </svg>
    </div>
  );
};

export default Preloader;

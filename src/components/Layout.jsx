import React, { useState, useEffect } from "react";
import html2canvas from 'html2canvas'
import Welcome from "./Welcome";
import CanvasConfig from "./CanvasConfig";
import CanvasPlaceholder from "./CanvasPlaceholder";
import SearchSection from "./SearchSection";








 export default function Layout () {
   
  const [getStarted, setGetStarted] = React.useState(false)

  const [imageGrid, setImageGrid] = React.useState([])

    // config checkbox
    const [configChecked, setConfigChecked] = React.useState(false)
  
    const handleConfigCheckChange = () => {
      setConfigChecked(!configChecked)
    }

   
      // Columns and rows of Grid
    const [dimension, setDimensions] = useState(4);
   
  
    const handleRowChange = (event) => {
      const value = parseInt(event.target.value, 10);
      setDimensions(value);
    };
  

    // color picker states 
    const [color, setColor] = useState(null);
    const [fontColor, setFontColor] = useState(null);


    // set gap
    const [gap, setGap] = useState(null);

    const handleGapChange = (event) => {
      const value = parseInt(event.target.value, 10);
      setGap(value);
    };

   
     // Maximum number of images
  const [maxImages, setMaxImages] = useState(dimension * dimension);

  useEffect(() => {
    setMaxImages(dimension * dimension);
  }, [dimension]);
  
  const gridTemplate = `repeat(${dimension}, 1fr) / repeat(${dimension}, 1fr)`;

    
   
    
      
      
    
  
    // show list checkboxes
    const [listChecked, setListChecked] = React.useState(false)
  
    const handleListCheckChange = () => {
      setListChecked(!listChecked)
    }
  
  
    
    const handleDownloadImage = () => {
      const element = document.getElementById('print');
      html2canvas(element, {
        allowTaint: true,
        useCORS: true
      }).then(function(canvas) {
       
        canvas.toBlob(function(blob) {
         
          const link = document.createElement('a');
          link.download = 'downloaded-image.jpg';
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 'image/jpeg', 0.9);
      });
    };
    
    
    
  







  const handleRemoveFromImageGrid = (index) => {
    setImageGrid((prevImageGrid) => prevImageGrid.filter((_, i) => i !== index));
  };
  


  
  // handling the drag functionality 
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e, index) => {
    e.preventDefault();
    const startIndex = e.dataTransfer.getData("index");
    if (startIndex !== index) {
      const newOrder = [...imageGrid];
      const movedItem = newOrder.splice(startIndex, 1)[0];
      newOrder.splice(index, 0, movedItem);
      setImageGrid(newOrder);
    }
  };

  const imageGridImg = imageGrid.slice(0, maxImages).map((albumImage, idx) => {
    return (  
      <div className="img-container" key={idx}>
      <img
        key={idx}
        src={albumImage.image}
        alt=""
        aria-label="Click to remove"
        className="canvas-image"
        onDoubleClick={() => handleRemoveFromImageGrid(idx)}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, idx)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, idx)}
      />
      </div>
    );
  });

 // List of albums in the collage 

   const canvasList = imageGrid.slice(0, maxImages).map((album, idx) => {
                return <li key={idx}>{`${album.artist} - ${album.title}`}</li>
   })

// suggested matches 
   
   
  
   
return (
  <div className='container' style={{ backgroundColor: color }}>
    {getStarted ? (
      <div className="sidebar">
        <div className="config-searchBar">
          <label htmlFor="config-checkbox">Show Grid Configuration</label>
          <input
            type="checkbox"
            id="config-checkbox"
            value={configChecked}
            onChange={handleConfigCheckChange}
          />
          {configChecked ? (
            <CanvasConfig
              listChecked={listChecked}
              handleListCheckChange={handleListCheckChange}
              dimension={dimension}
              handleRowChange={handleRowChange}
              gap={gap}
              handleGapChange={handleGapChange}
              fontColor={fontColor}
              setFontColor={setFontColor}
              color={color}
              setColor={setColor}
            />
          ) : null}
          <SearchSection
            imageGrid={imageGrid}
            setImageGrid={setImageGrid}
            handleDownloadImage={handleDownloadImage}
            maxImages={maxImages}
          />
        </div>
      </div>
    ) : null}
    <div id="print" className="print">
      {imageGridImg.length > 0 ? (
        <div
          className="canvas"
          style={{ gridTemplate, backgroundColor: color, gap: gap }}
        >
          {imageGridImg}
        </div>
      ) : (
        <div
          className="welcome-text"
          style={{
            display: imageGridImg.length > 0 ? "none" : "flex",
            width: !getStarted ? "100vw" : "65vw",
          }}
        >
          {getStarted ? (
            <CanvasPlaceholder />
          ) : (
            <Welcome getStarted={getStarted} setGetStarted={setGetStarted} />
          )}
        </div>
      )}
      {listChecked ? (
        <div className="canvas-list" style={{ backgroundColor: color, color: fontColor }}>
          <ul>{canvasList}</ul>
        </div>
      ) : null}
    </div>
  </div>
);

}




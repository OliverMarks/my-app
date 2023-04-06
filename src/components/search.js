import React, { useState, useEffect } from "react";
import html2canvas from 'html2canvas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBorderAll, faFileArrowDown} from '@fortawesome/free-solid-svg-icons'



let suggestedMatches




 export default function Search () {
   
  const [getStarted, setGetStarted] = React.useState(false)

  const handleGetStarted = () => {
    setGetStarted(true)
  }

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
    
    
    







// Search functionality
    
   
    const API_KEY = '1b8d2b8142ed03f9e130a7655529fc7d'
   const [searchMatches, setSearchMatches] = React.useState( [{

    artist: "",
    title: "",
    image: ""
}])

   const [selectedAlbum, setSelectedAlbum] = React.useState( {

        artist: "",
        title: "",
        image: ""
    })

   const [searchInput, setSearchInput] = React.useState("")
   const [imageGrid, setImageGrid] = React.useState([])
    

   
   const fetchAlbumMatches = (searchInput) => {
   
     setSearchMatches([]); 


     fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchInput}&api_key=${API_KEY}&format=json`)
      .then(response => response.json())
      .then(data => {
        const matches = data.results.albummatches.album
        const closestMatch = data.results.albummatches.album[0];
        
        setSearchMatches((prevMatches) => {
            const newMatches = matches.map((match) => ({
              artist: match.artist,
              title: match.name,
              image: match.image[3]["#text"],
            }));

            console.log(newMatches)
    
            return [...prevMatches, ...newMatches];
          });

        setSelectedAlbum( {
            artist: closestMatch.artist,
            title: closestMatch.name,
            image: closestMatch.image[3]['#text']
        });

       
        
        
      })

      .catch(error => console.error(error));
  }
  // adding image to grid
  const addToImageGrid = () => {
    if (imageGrid.length < maxImages) {
      setImageGrid(prev => [
        ...prev,
        {
          artist: selectedAlbum.artist,
          title: selectedAlbum.title,
          image: selectedAlbum.image
        }
      ]);
    } else {
      alert("Grid limit reached. Use grid config to resize grid");
    }
  };

  // clear images
  const clearImageGrid = () => {
    setImageGrid ([]) 
  }
  const handleRemoveFromImageGrid = (index) => {
    setImageGrid((prevImageGrid) => prevImageGrid.filter((_, i) => i !== index));
  };
  
// handle fetching images
   const handleFetchAlbumMatches = (e) => {
    e.preventDefault()
    fetchAlbumMatches(searchInput)
   }

  
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
   suggestedMatches = searchMatches.map((match, index) => (
    <img key={index} src={match.image} alt={match.name} className="searchImage" 
    onClick={() =>
        setSelectedAlbum({
          artist: match.artist,
          title: match.title,
          image: match.image
        })
      } />

  ));
   
  
   
    return (
      
      
      
      <div className='container' style = {{backgroundColor:color}}>

{getStarted ? 
        <div className = "sidebar">

          
        <div className="config-searchBar">
        <form  onSubmit={handleFetchAlbumMatches}>
            
            <label htmlFor="config-checkbox">
            Show Grid Configuation</label>
          <input 
          type="checkbox" 
          id="config-checkbox"
          value={configChecked} 
           onChange = {handleConfigCheckChange}
        />
        {configChecked ? 
            <div className="canvas-config">
        
          <label htmlFor="checkbox">
            Show artist & album list
          <input 
          type="checkbox" 
          id="checkbox"
          value={listChecked} 
           onChange = {handleListCheckChange}
        />
        </label>

          <label htmlFor="grid-dimensions-rows">
            Grid Size (Rows & Columns)
          <input className="num-input"
          type="number" 
          id="grid-dimensions-rows" 
          min={1}
          value={dimension} 
          onChange={handleRowChange} 
          />
          </label>

          <label htmlFor="grid-padding">
            Grid Gap (px)
          <input className="num-input"
          type="number" 
          id="grid-padding" 
          min={1}
          value={gap} 
          onChange={handleGapChange} 
          />
          </label>

          <label htmlFor="bg-color-picker">
            Select background color
            <input 
            className="color-picker"
            type="color" 
            value={color} 
            onChange={e => setColor(e.target.value)}
            id="bg-color-picker" />
          </label>

          <label htmlFor="font-color-picker">
            Select font color
            <input 
            className="color-picker"
            type="color" 
            value={fontColor} 
            onChange={e => setFontColor(e.target.value)} 
            id="font-color-picker"/>
          </label>
          
            

            
         
          
        
      </div>
      :null}

     
            <div className="search-submit">
            <input 
            type="text" 
            placeholder='Search for an album or artist '
            id="albumSearch"
            value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            >
            </input>
            <button className="sidebar-btn">Search</button>
            </div>
        </form>
        
           </div>
          
        <div className="selected-album">
            <div className="titles">
            <h1>{selectedAlbum.title}</h1>
            <h2>{selectedAlbum.artist}</h2>
            </div>
            <img src={selectedAlbum.image} alt="selected album" className='selected-album-cover'></img>

        

        <div className="sidebar-btns">
        <button className="sidebar-btn" onClick={addToImageGrid}>Add to grid</button>
        <button className="sidebar-btn" onClick={clearImageGrid}>Clear all</button>
        <button className="sidebar-btn" type="button" onClick={handleDownloadImage}>Download as jpeg</button>
          </div>

            </div>
        
        <div className="search-image-results">
             {suggestedMatches} 
            
            
        </div> 

        </div>
        
 :null }
            
        <div id="print" className="print">
        
        {imageGridImg.length > 0 ? 
    <div className="canvas"  style={{ gridTemplate, backgroundColor: color, gap:gap  }}>
     {imageGridImg }
    </div> : 
    <div className="welcome-text" style={{display: imageGridImg.length > 0 ? 'none' : 'flex', width: !getStarted ? '100vw' : '65vw'}}>
        {getStarted ?  
        <>
        <h1 className="tips-h1">Top tips</h1>
            <ul className="welcome-ul">
               <li>Can't remember the name of an album? Closest matches to your search will appear below your the selected album.
               Clicking on one of them will make it your active selected cover.</li>
              <li>Use the configuration options to set the size of your collage or toggle a list of your choices.</li>
              <li>Drag and drop covers to rearrange your collage.</li> 
              <li>Double clicking a cover on your collage will remove it or you can clear all your choices from the sidebar.</li>
              <li>Once you're happy download your creation as a jpeg!</li> 
            </ul> 
            </>
            : 
            <>
                <h1 className="welcome-h1">Welcome to the Album Art Collage Maker</h1>
                <h3 className="welcome-h3">Build a collage of your favourite album covers by simply searching for an artist or album.</h3> 
                <div className="icon-container">
                  <div className="icon-section">
                    <h2>Search</h2>
                    <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
                    <p>Search for your favourite Album Covers</p>
                  </div>
                  <div className="icon-section">
                    <h2>Create</h2>
                    <FontAwesomeIcon className="icon" icon={faBorderAll}  />
                    <p>Add them to your custom grid canvas</p>
                  </div>
                  <div className="icon-section">
                    <h2>Download</h2>
                    <FontAwesomeIcon className="icon" icon={faFileArrowDown} />
                    <p>Download your creation and share with friends</p>
                  </div>
                </div>
            </>
        }
        {!getStarted && <button className="welcome-btn" onClick={handleGetStarted}>GET STARTED</button>}
    </div>
}

   
   
    {listChecked ? <div className='canvas-list' style={{ backgroundColor: color,  color: fontColor}}>  
                <ul>
                    {canvasList}
                </ul>  
                    </div>
                            :null}
              </div>

      

        </div>
    )
}




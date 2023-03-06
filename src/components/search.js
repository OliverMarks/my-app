import React, { useState, useEffect } from "react";
import html2canvas from 'html2canvas'



let suggestedMatches


 export default function Search () {
   

    // config checkbox
    const [configChecked, setConfigChecked] = React.useState(false)
  
    const handleConfigCheckChange = () => {
      setConfigChecked(!configChecked)
    }

   
      // Columns and rows of Grid
    const [rows, setRows] = useState(4);
    const [columns, setColumns] = useState(4);
  
    const handleRowChange = (event) => {
      const value = parseInt(event.target.value, 10);
      setRows(value);
    };
  
    const handleColumnChange = (event) => {
      const value = parseInt(event.target.value, 10);
      setColumns(value);
    };

     // Maximum number of images
  const [maxImages, setMaxImages] = useState(rows * columns);

  useEffect(() => {
    setMaxImages(rows * columns);
  }, [rows, columns]);
  
    const gridTemplate = `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`;
  
  
    // show list checkboxes
    const [listChecked, setListChecked] = React.useState(false)
  
    const handleListCheckChange = () => {
      setListChecked(!listChecked)
    }
  
    // download the collage as a png 
    // const handleDownloadImage = async () => {
    //   const element = document.getElementById('print');
    //   const canvas = await html2canvas(element);
    //   const data = canvas.toDataURL('image/png');
    //   const link = document.createElement('a');
    //   link.href = data;
    //   link.download = 'downloaded-image.png';
    
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // };
    
    const handleDownloadImage = () => {
      const element = document.getElementById('print');
      html2canvas(element).then(function(canvas) {
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
      alert("Grid limit reached, use grid config to resize grid");
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
      
      
      
      <div className='container'>

        
        <div className = "sidebar">
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
            Show artist and album list
          <input 
          type="checkbox" 
          id="checkbox"
          value={listChecked} 
           onChange = {handleListCheckChange}
        />
        </label>

          <label htmlFor="grid-dimensions-rows">
            Grid Rows
          <input className="num-input"
          type="number" 
          id="grid-dimensions-rows" 
          min={1}
          value={rows} 
          onChange={handleRowChange} 
          />
          </label>

          <label htmlFor="grid-dimensions-columns">
            Grid Columns
          <input className="num-input"
          type="number" 
          id="grid-dimensions-columns" 
          min={1}
          value={columns} 
          onChange={handleColumnChange} 
          />
            </label>
            

            
         
          
        
      </div>
      :null}
            
            <input 
            type="text" 
            placeholder='Search for an album or artist '
            id="albumSearch"
            value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            >
            </input>
            <button>Search</button>
        </form>

        <div className="selected-album">
            <h1>{selectedAlbum.title}</h1>
            <h2>{selectedAlbum.artist}</h2>
            <img src={selectedAlbum.image} alt="selected album" className='selected-album-cover'></img>

        </div>

        <div className="sidebar-btns">
        <button onClick={addToImageGrid}>Add to collage</button>
        <button onClick={clearImageGrid}>Clear collage</button>
        <button type="button" onClick={handleDownloadImage}>Download Collage as jpeg</button>
          </div>

        
        <div className="search-image-results">
             {suggestedMatches} 
            
            
        </div>

        </div>

            
        <div id="print" className="print">
        
        {imageGridImg.length > 0 ? 
        <div className="canvas"  style={{ gridTemplate }}>
         {imageGridImg}
        </div> : 
        
        <div className="placeholder-text">
            <h1>Welcome to the Album Art Collage Maker</h1>
            <h3>Build a collage of your favourite album covers by simply searching for an artist or album.</h3> 
               <ul className="placeholder-ul">
               <li>Can't remember the name of an album? Closest matches to your search will appear below your the selected album.
               Clicking on one of them will make it your active selected cover.</li>
              <li>Use the configuation options to set the size of your collage or toggle a list of your choices.</li>
              <li>Drag and drop to rearrange your collage.</li> 
              <li>Double clicking a cover on your collage will remove it or you can clear all your choices from the sidebar.</li>
              <li>Once you're happy download your creation as a jpeg.</li>

               </ul>
        </div>
 }
    {listChecked ? <div className='canvas-list'>  
                <ul>
                    {canvasList}
                </ul>  
                    </div>
                            :null}
              </div>

      

        </div>
    )
}




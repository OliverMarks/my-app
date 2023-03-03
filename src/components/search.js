import React, { useState, useEffect } from "react";


let suggestedMatches


 export default function Search () {
   

    // config checkbox
    const [configChecked, setConfigChecked] = React.useState(false)
  
    const handleConfigCheckChange = () => {
      setConfigChecked(!configChecked)
    }

   
      // Columns and rows of Grid
    const [rows, setRows] = useState(5);
    const [columns, setColumns] = useState(5);
  
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
  
  
    // list checkboxes
    const [listChecked, setListChecked] = React.useState(false)
  
    const handleListCheckChange = () => {
      setListChecked(!listChecked)
    }
  
    







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

  const clearImageGrid = () => {
    setImageGrid ([]) 
  }

   const handleFetchAlbumMatches = (e) => {
    e.preventDefault()
    fetchAlbumMatches(searchInput)
   }

   const handleRemoveFromImageGrid = (index) => {
    setImageGrid((prevImageGrid) => prevImageGrid.filter((_, i) => i !== index));
  };
  


    const imageGridImg = imageGrid.slice(0, maxImages).map((albumImage, idx) => {
              return  <img key={idx} src={albumImage.image} alt="" 
              className='canvas-image'
              onClick={() => handleRemoveFromImageGrid(idx)}             
              
              />
   })

   const canvasList = imageGrid.slice(0, maxImages).map((album, idx) => {
                return <li key={idx}>{`${album.artist} - ${album.title}`}</li>
   })


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
            <h3>Build a collage of your favourite albums</h3>
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
            Show artist and album list</label>
          <input 
          type="checkbox" 
          id="checkbox"
          value={listChecked} 
           onChange = {handleListCheckChange}
        />

          <label htmlFor="grid-dimensions-rows">
            Grid Rows</label>
          <input className="num-input"
          type="number" 
          id="grid-dimensions-rows" 
          min={1}
          value={rows} 
          onChange={handleRowChange} 
          />
          <label htmlFor="grid-dimensions-columns">
            Grid Columns</label>
          <input className="num-input"
          type="number" 
          id="grid-dimensions-columns" 
          min={1}
          value={columns} 
          onChange={handleColumnChange} 
          />

         
          
        
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
            <button>Submit</button>
        </form>

        <div className="selected-album">
            <h1>{selectedAlbum.title}</h1>
            <h2>{selectedAlbum.artist}</h2>
            <img src={selectedAlbum.image} alt="selected album" className='selected-album-cover'></img>

        </div>
        <button onClick={addToImageGrid}>Add to collage</button>
        <button onClick={clearImageGrid}>Clear collage</button>
        
        <div className="search-image-results">
             {suggestedMatches} 
            
            
        </div>

        </div>

        <div className="canvas" style={{ gridTemplate }}>
        {imageGridImg}
      </div>

        <div className='canvas-list'>
                {listChecked ?  <ul>
                    {canvasList}
                </ul>:null}
              

        </div>

        </div>
    )
}




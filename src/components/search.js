import React from 'react'


let suggestedMatches

export default function Search () {
   
    
   
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
   const [canvas, setCanvas] = React.useState([])
    
   
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
  
  const addToCanvas = () => {
    setCanvas (prev => 
        [...prev, {artist: selectedAlbum.artist, title: selectedAlbum.title, image:selectedAlbum.image}]
    )
  }

  const clearCanvas = () => {
    setCanvas ([]) 
  }

   const handleFetchAlbumMatches = (e) => {
    e.preventDefault()
    fetchAlbumMatches(searchInput)
   }

   const handleRemoveFromCanvas = (index) => {
    setCanvas((prevCanvas) => prevCanvas.filter((_, i) => i !== index));
  };
  



   const canvasImg = canvas.map((albumImage, idx) => {
              return  <img key={idx} src={albumImage.image} alt="" 
              className='canvas-image'
              onClick={() => handleRemoveFromCanvas(idx)}             
              
              />
   })

   const canvasList = canvas.map((album, idx) => {
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
            <h3>Build a canvas of your favourite albums</h3>
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
        <button onClick={addToCanvas}>Add to canvas</button>
        <button onClick={clearCanvas}>Clear canvas</button>
        
        <div className="search-image-results">
             {suggestedMatches} 
            
            
        </div>

        </div>

        <div className='canvas'>
           {canvasImg}
        </div>

        <div className='canvas-list'>
                <ul>
                    {canvasList}
                </ul>

        </div>

        </div>
    )
}
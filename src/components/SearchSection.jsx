import React from "react"

let suggestedMatches

export default function SearchSection ({imageGrid, setImageGrid, handleDownloadImage, maxImages}) {


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

  
// handle fetching images
   const handleFetchAlbumMatches = (e) => {
    e.preventDefault()
    fetchAlbumMatches(searchInput)
   }

return (
    <>
    <div className="search-submit">
        
    <form  onSubmit={handleFetchAlbumMatches}>

            <input 
            type="text" 
            placeholder='Search for an album or artist '
            id="albumSearch"
            value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            >
            </input>
            <button className="sidebar-btn">Search</button>
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
</>
        
        
)
}
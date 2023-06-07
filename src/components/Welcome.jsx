import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBorderAll, faFileArrowDown} from '@fortawesome/free-solid-svg-icons'

export default function Welcome ({getStarted, setGetStarted}) {
    
    const handleGetStarted = () => {
        setGetStarted(true)
      }

    return (
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
                {!getStarted && <button className="welcome-btn" onClick={handleGetStarted}>GET STARTED</button>}
            </>
    )
}
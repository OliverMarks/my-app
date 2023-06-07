


export default function CanvasConfig ({listChecked, handleListCheckChange, dimension, handleRowChange, gap, handleGapChange, fontColor, setFontColor, color, setColor}) {

    return (
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
    )
}

import { useEffect, useState } from "react";

function App() {
 const [start, setStart] = useState(false)

 const RecordActions = ()=>{
  setStart(!start)
 }
  return (
    <div style={{padding: "25%"}}>
      <h1>One Load Recorder</h1>
      {!start && <button onClick={RecordActions}>Start</button>}
      {start && <button onClick={RecordActions}>Stop</button>}
      
    </div>
  );
}

export default App;

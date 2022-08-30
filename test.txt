import {
	computeAccessibleName,
	computeAccessibleDescription,
} from "dom-accessibility-api";
import { useEffect } from "react";
function App() {
  useEffect(()=>{
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    console.log(vw, vh)
  })
  function action(event)
  {
    
    console.log(getSelectors(event.target))
  }
  function onChange(e)
  { 
    const data = e.target.getBoundingClientRect()
    console.log(data, e)
    console.log(e.clientX - data.x, e.clientY - data.y)
    console.log(e.target)
    console.log(getSelectors(e.target))
  
  }
  function getDomPath(el) {
    var stack = [];
    var accessibility = []
    while ( el.parentNode != null ) {
      var sibCount = 0;
      var sibIndex = 0;
      for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
        var sib = el.parentNode.childNodes[i];
        if ( sib.nodeName == el.nodeName ) {
          if ( sib === el ) {
            sibIndex = sibCount;
          }
          sibCount++;
        }
      }
      if ( el.hasAttribute('id') && el.id != '' ) {
        stack.unshift('#' + el.id);
        accessibility.unshift(el.nodeName.toLowerCase())
      } else if ( sibCount > 1 ) {
        stack.unshift(el.nodeName.toLowerCase() + ':nth-child(' + JSON.parse(sibIndex+1) + ')');
        accessibility.unshift(el.nodeName.toLowerCase() + '[' + JSON.parse(sibIndex+1) + ']')
      } else {
        stack.unshift(el.nodeName.toLowerCase());
        accessibility.unshift(el.nodeName.toLowerCase())
      }
      el = el.parentNode;
    }
  
    return {XPath:accessibility, pPath:stack.slice(1)} // removes the html element
  }
  function getSelectors(target){
    var selectors = []
    if(target.id)
    {
      selectors.push("aria/"+computeAccessibleName(document.getElementById(target.id)))
    }
    var {XPath, pPath} = getDomPath(target);
    selectors.push(pPath.join(' > '))
    let accessbility = computeAccessibleName(document.evaluate("/"+XPath.join("/"), document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
    if(selectors.length <= 1 && accessbility)
    {
      selectors.unshift("aria/"+accessbility)
      
    }
    return selectors
  }
  function getWindowRelativeOffset(parentWindow, elem) {
    var offset = {
        left : 0,
        top : 0
    };

    // relative to the target field's document
    offset.left = elem.getBoundingClientRect().left;
    offset.top = elem.getBoundingClientRect().top;

    // now we will calculate according to the current document, this current
    // document might be same as the document of target field or it may be
    // parent of the document of the target field
    var childWindow = elem.document.frames.window;
    while (childWindow != parentWindow) {
        offset.left = offset.left + childWindow.frameElement.getBoundingClientRect().left;
        offset.top = offset.top + childWindow.frameElement.getBoundingClientRect().top;
        childWindow = childWindow.parent;
    }

    return offset;
};
  return (
    <div>
      <div className="App">
      <button id="data" onClick={(e)=>action(e)}>Record</button>
      <input type={"text"} onChange={(e)=>onChange(e)}></input>
      <button  onClick={(e)=>action(e)}>Stop</button>
      <ul onClick={(e)=>onChange(e)}>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
    </div>
    <div>
    <ul onClick={(e)=>onChange(e)}>
      <li>4</li>
      <li>5</li>
      <li>6</li>
    </ul>
    </div>
    <ul onClick={(e)=>onChange(e)}>
      <li>7</li>
      <li>8</li>
      <li>9</li>
    </ul>
    </div>
  );
}

export default App;

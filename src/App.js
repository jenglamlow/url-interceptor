import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [whitelist, setWhitelist] = useState([])
  const [url, setUrl] = useState("")

  const handleOnSearch = (url, whitelist) => {
    setWhitelist(whitelist)
    setUrl(url)
  }
  return (
    <div>
      <div className="control"><ControlPanel onSearch={handleOnSearch} /></div>
      <div className="content">
        <Content url={url} whitelist={whitelist} />
      </div>
    </div>

  );
}

const ControlPanel = ({ onSearch }) => {
  const whitelistRef = useRef(null)
  const urlRef = useRef(null)

  const search = () => {
    const whitelist = whitelistRef.current.value.split("\n")
    onSearch(urlRef.current.value, whitelist)
  }

  return (
    <div>
      <div className="url-container">
        <div>URL</div>
        <input ref={urlRef} style={{ marginLeft: "10px", width: "40%" }} ></input>
        <button onClick={search} style={{ marginLeft: "10px" }}>Search</button>
      </div>
      <div className="whitelist-container">
        <div>Whitelist</div>
        <textarea ref={whitelistRef} style={{ marginLeft: "10px" }} name="Text1" cols="40" rows="5"></textarea>
      </div>
    </div>
  )
}

const Content = ({ url, whitelist }) => {
  const [content, setContent] = useState(null);

  const createMarkup = () => {
    return { __html: content }
  }

  useEffect(() => {
    axios.get(url).then(
      response => {
        let html = response.data
        whitelist.forEach(item => {
          const escapedItem = item.replace(/\/\//g, "\\/\\/")
          const searchText = new RegExp(`<div class="r"><a href="${escapedItem}`, 'g')
          console.log(searchText)
          const replaceText = `<div class="r" style="background-color:yellow;"><a href="${item}`
          html = html.replace(searchText, replaceText)
        })
        // console.log(response.data)
        setContent(html)
      }
    )
  }, [url, whitelist])
  return <div dangerouslySetInnerHTML={createMarkup()} />
}

export default App;


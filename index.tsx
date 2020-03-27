import React from 'react';
import ReactDOM from 'react-dom';
import Main from "./view/main";
import DynamicView from "./view/dynamicView";

ReactDOM.render(
    <div>
        <Main src={"+ % x y t"}/>
        <Main src={"- % x y t"}/>
        <DynamicView initialSrc={"+ % t x y"}/>
    </div>, document.getElementById('root'));
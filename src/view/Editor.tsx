import Art from "./Art";
import React, {useState} from "react";

export default function Editor(props: { initialSrc: string}) {
    const [src, setSrc] = useState(props.initialSrc);
    return <div className="Editor">
        <Art src={src}/>
        <textarea rows={8} value={src} onChange={(e) => {
            setSrc(e.target.value);
        }
        }/>
    </div>
}
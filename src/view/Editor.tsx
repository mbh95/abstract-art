import {useState} from "react";
import Art from "./Art";

export default function Editor(props: { readonly initialSrc?: string }) {
    const [src, setSrc] = useState(props.initialSrc);

    return <div className="Editor">
        <Art src={src!}/>
        <textarea rows={8} value={src} onChange={(e) => {
            setSrc(e.target.value);
        }
        }/>
    </div>
}

Editor.defaultProps = {
    initialSrc: "rgb x y t",
}
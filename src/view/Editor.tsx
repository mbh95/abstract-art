import Art from "./Art";
import React, {useEffect, useState} from "react";
import {parse} from "../compiler/parser";
import Expression from "../compiler/expression";

export default function Editor(props: { readonly initialSrc?: string }) {
    const [src, setSrc] = useState(props.initialSrc);
    const [parsedExpression, setParsedExpression] = useState<Expression | undefined>(undefined);
    useEffect(() => {
        try {
            setParsedExpression(parse(src!));
        } catch (e) {
            console.log(e);
            setParsedExpression(undefined);
        }
    }, [src]);

    return <div className="Editor">
        <Art expression={parsedExpression}/>
        <textarea rows={8} value={src} onChange={(e) => {
            setSrc(e.target.value);
        }
        }/>
    </div>
}

Editor.defaultProps = {
    initialSrc: "",
}
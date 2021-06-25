import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {nextGeneration, random, selectedPieces, toggleSelected} from "../state/artSlice";
import Art from "./Art";

export default function Gallery(props: {}) {

    const pieces = useSelector(selectedPieces);
    const dispatch = useDispatch();

    const canvases = pieces.map((piece, i) => {
        return <div className={piece.selected ? "Selected" : "Deselected"}
                    onClick={() => dispatch(toggleSelected({index: i}))}>
            <Art src={piece.textSource}/>
        </div>
    });

    return (<div className="Gallery">
            <div className="GalleryHeader" style={{display: "flex"}}>
                <button onClick={() => dispatch(random())}>Random</button>
                <button onClick={() => dispatch(nextGeneration())}>Next generation</button>
            </div>
            <div className="GalleryFlow" style={{display: "flex", flexWrap: "wrap"}}>
                {canvases}

            </div>
        </div>
    );
}
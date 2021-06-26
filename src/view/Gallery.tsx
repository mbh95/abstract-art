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
            <div className="Instructions">
                <div>
                    Select expressions you like by clicking on them. Press "Next generation" to breed the selected
                    expressions together randomly.
                    <br/>
                    If you don't like any of the expressions then press "Random" to get new ones.
                    <br/>
                </div>

            </div>
            <div className="Controls" style={{display: "flex"}}>
                <button onClick={() => dispatch(random())}>Random</button>
                <button onClick={() => dispatch(nextGeneration())}>Next generation</button>
            </div>
            <div className="GalleryFlow" style={{display: "flex", flexWrap: "wrap"}}>
                {canvases}

            </div>
        </div>
    );
}
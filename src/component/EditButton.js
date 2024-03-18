import {useEffect, useState} from "react";
import {selectedStyles} from "../action";

export default function EditButton(props) {
const [tag,setTag] = useState(false)


    return (
        <button
            data-tag = {props.name.toUpperCase()}
            className={`${tag?'bg-gray-300':'bg-white'}  m-1 cursor-pointer hover:bg-gray-200`}
            key={props.cmd}
            onMouseDown={evt => {
                evt.preventDefault();
                selectedStyles(props, props.name);
                setTag(true)
            }}
        >
            {props.component?<props.component t ={"d"}/>:""}
        </button>
    );




}
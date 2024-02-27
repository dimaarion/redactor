import React, {useEffect, useState} from "react";
import Close from "./Close";
import {RichUtils} from "draft-js";

export default function TableParams({setClose, setEditorState, editorState, countTable, setCountTable}){
const [colspan, setColspan] = useState('1');
    function colspanTable(n){
        const selection = editorState.getSelection();
        const blockKey = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey()).getKey();
        let table = document.querySelectorAll('.table')
        table.forEach((el)=>{
            if(el.getAttribute('data-offset-key') === blockKey + '-0-0'){
                el.className = `border table border-solid border-gray-600 p-2 col-span-${n}`;
              //  el.parentElement.innerHTML = "<div class='grid justify-items-stretch'><div class='justify-self-center'>"+ el.parentElement.innerHTML + "</div></div>";
            }
        })
    }

useEffect(()=>{

},[editorState])

    return <>
        <div className={"absolute bg-white z-20 w-1/2 h-[500px] shadow-lg p-5 left-0 right-0 m-auto"}>
            <div>
                <div className={"flex justify-between"}>
                    <div><h1>Всавить таблицу</h1></div>
                    <div onClick={()=>setClose(false)} className={"cursor-pointer"}><Close/></div>
                </div>
                <div className={"flex"}>
                    <div onClick={()=>setCountTable(countTable > 1?(countTable)=>countTable-1:'1')} className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>-</div>
                    <input className={"w-[100px] text-lg self-center flex text-center h-[30px]"} type={"text"} value={countTable} onChange={(e)=>setCountTable(e.target.value)}/>
                    <div onClick={()=>setCountTable((countTable)=>parseInt(countTable) + 1)} className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>+</div>
                    <div onClick={()=>setEditorState(RichUtils.toggleBlockType(editorState, 'table'))} className={"text-lg text-center self-center cursor-pointer bg-gray-200 px-4 py-1 hover:bg-gray-400"}>Ok</div>
                </div>
                <div className={"flex mt-6"}>
                    <div onClick={()=>setColspan(colspan > 1?(colspan)=>colspan-1:'1')} className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>-</div>
                    <input className={"w-[100px] text-lg self-center flex text-center h-[30px]"} type={"text"} value={colspan} onChange={(e)=>setColspan(e.target.value)}/>
                    <div onClick={()=>setColspan((colspan)=>parseInt(colspan) + 1)} className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>+</div>
                    <div onClick={()=>colspanTable(colspan)} className={"text-lg text-center self-center cursor-pointer bg-gray-200 px-4 py-1 hover:bg-gray-400"}>Ok</div>
                </div>
            </div>
        </div>
    </>
}
import React, {useEffect, useState} from "react";
import Close from "./Close";
import Draft, {EditorState, Modifier, RichUtils} from "draft-js";
import {Map} from "immutable";
import Table from "./Table";
import {blockRenderMap} from "../action";

export default function TableParams({setClose, table, setEditorState, editorState, countTable, setCountTable, colspanShow, setColspanShow, setRowspanShow, rowSpanShow}) {
    const [colspan, setColspan] = useState('1');
    const [rowSpan, setRowspan] = useState('1');



    function colspanTable(n,selector) {
        const selection = editorState.getSelection();
        const blockKey = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey()).getKey();
        let table = document.querySelectorAll('.table')
        table.forEach((el) => {
            if (el.getAttribute('data-offset-key') === blockKey + '-0-0') {
                let r  = new RegExp(selector,'g')
                if (el.className.match(r)) {
                    el.className.split(' ').filter((f) => f.match(r)).forEach((cl) => {
                        el.classList.remove(cl);
                    });
                } else {
                    el.classList.add(selector + n);
                }

            }
        })
    }

    useEffect(() => {

    }, [editorState])

    let tableRender = Map({
            'table': {
                element: 'div',
                wrapper: <Table col = {10} />
            }
        }
    )
    const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(tableRender);
    return <>
        <div className={"absolute bg-white z-20 w-1/2 h-[500px] shadow-lg p-5 left-0 right-0 m-auto"}>
            {countTable}
            <div>
                <div className={"flex justify-between"}>
                    <div><h1>Добавить таблицу</h1></div>
                    <div onClick={() => setClose(false)} className={"cursor-pointer"}><Close/></div>
                </div>
                <div className={"flex"}>
                    <div onClick={() => setCountTable(countTable > 1 ? (countTable) => countTable - 1 : '1')}
                         className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>-
                    </div>
                    <input className={"w-[100px] text-lg self-center flex text-center h-[30px]"} type={"text"}
                           value={countTable} onChange={(e) => setCountTable(e.target.value)}/>
                    <div onClick={() => setCountTable((countTable) => parseInt(countTable) + 1)}
                         className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>+
                    </div>
                    <div onClick={() => {
                        const selection = editorState.getSelection();
                        const contentState = editorState.getCurrentContent();

                           // const nms = Modifier.insertText(contentState,selection,'tableRender' + el);
                          //  const ncs = Modifier.setBlockType(nms,selection,'table');
                          //  const es = EditorState.push(editorState, ncs, 'insert-fragment');
                          //  setEditorState(es);


                      // Modifier.replaceWithFragment(contentState,selection,extendedBlockRenderMap)



                      //  if(table === false){
                          //  setEditorState(RichUtils.toggleBlockType(editorState, 'table'));
                       // }

                    }}
                         className={"text-lg text-center self-center cursor-pointer bg-gray-200 px-4 py-1 hover:bg-gray-400"}>Добавить
                    </div>
                </div>
                {colspanShow === false? <div className={"flex mt-6"}>
                    <div onClick={() => setColspan(colspan > 1 ? (colspan) => colspan - 1 : '1')}
                         className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>-
                    </div>
                    <input className={"w-[100px] text-lg self-center flex text-center h-[30px]"} type={"text"}
                           value={colspan} onChange={(e) => setColspan(e.target.value)}/>
                    <div onClick={() => setColspan((colspan) => parseInt(colspan) + 1)}
                         className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>+
                    </div>
                    <div onClick={() => {
                        colspanTable(colspan, 'col-span-');
                        setColspanShow(true)
                    }}
                         className={"text-lg text-center self-center cursor-pointer bg-gray-200 px-4 py-1 hover:bg-gray-400"}>
                        Объединить колонки
                    </div>
                </div>:<div onClick={() => {
                    colspanTable(colspan, 'col-span-');
                    setColspanShow(false);
                }}
                            className={"text-lg text-center mt-4 self-center cursor-pointer bg-gray-200 px-4 py-1 hover:bg-gray-400"}>
                    Разделить колонки
                </div>}
                {rowSpanShow === false? <div className={"flex mt-6"}>
                    <div onClick={() => setRowspan(rowSpan > 1 ? (rowSpan) => rowSpan - 1 : '1')}
                         className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>-
                    </div>
                    <input className={"w-[100px] text-lg self-center flex text-center h-[30px]"} type={"text"}
                           value={rowSpan} onChange={(e) => setRowspan(e.target.value)}/>
                    <div onClick={() => setRowspan((rowSpan) => parseInt(rowSpan) + 1)}
                         className={"text-xl px-4 py-2 bg-gray-100 mx-6 flex self-center hover:bg-gray-200 cursor-pointer"}>+
                    </div>
                    <div onClick={() => {
                        colspanTable(rowSpan, 'row-span-');
                        setRowspanShow(true)
                    }}
                         className={"text-lg text-center self-center cursor-pointer bg-gray-200 px-4 py-1 hover:bg-gray-400"}>
                        Объединить строки
                    </div>
                </div>:<div onClick={() => {
                    colspanTable(rowSpan, 'row-span-');
                    setRowspanShow(false)
                }}
                            className={"text-lg text-center self-center cursor-pointer mt-4 bg-gray-200 px-4 py-1 hover:bg-gray-400"}>
                    Разделить строки
                </div>}
            </div>
        </div>
    </>
}
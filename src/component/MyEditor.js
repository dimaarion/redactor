import {useState, useEffect, useRef} from 'react';
import {EditorState} from 'draft-js';
import {
    Editor,
    getBlockType,
    hasBlockTypeOf,
    blockStyleFn,
    isTextLeftAligned,
    isTextRightAligned,
    isTextCenterAligned,
    isTextJustifyAligned,
    toggleTextAlign,
    getSelectedBlocksMap, toggleH1
} from 'contenido';
import TextLeft from "./TextLeft";
import TextCenter from "./TextCenter";
import TextRight from "./TextRight";
import {arrayCount, BLOCK_TYPES, INLINE_STYLES} from "../action";


export default function MyEditor(){
    const [editorState, setEditorState] = useState(
        EditorState.createEmpty()
    )
    const editorRef = useRef(null);
    const [alignText, setAlignText] = useState("");
    const [blockType, setBlockType] = useState("unstyled");
    const [positionBlock, setPositionBlock] = useState({child: "",parent:""});
    const [fontSize, setFontSize] = useState({name:"font-size",size:'9'});
    const [getBlock, setGetBlock] = useState('div');
    const [active, setActive] = useState({label: '', val: true});

    const DEFAULTBLOCK = [
        {tag:'div',label:'unstyled'},
        {tag:'h1',label:'header-one'}
    ]

    useEffect(() => {

        getSelectedBlocksMap(editorState).forEach((el)=>{
            DEFAULTBLOCK.forEach((bl)=>{
                if(bl.label === el.getType()){
                    setGetBlock(bl.tag)
                }
            })

        })
    }, [editorState])


    return <div className="p-6 m-2">
            <nav className="border">
                <div className="flex justify-left ml-2">
                    <div className={`mr-2 hover:bg-gray-200 p-1 border ${alignText === 'left' ? active : ''}`}>
                        <button type="button" className="flex" onClick={() => setAlignText("left")}>
                            <TextLeft/>
                        </button>
                    </div>
                    <div className={`mr-2 hover:bg-gray-200 p-1 border ${alignText === 'center' ? active : ''}`}>
                        <button type="button" className="flex" onClick={() => setAlignText("center")}>
                            <TextCenter/>
                        </button>
                    </div>
                    <div className={`mr-2 hover:bg-gray-200 p-1 border ${alignText === 'right' ? active : ''}`}>
                        <button type="button" className="flex" onClick={() => setAlignText("right")}>
                            <TextRight/>
                        </button>
                    </div>
                </div>
                <div className="flex p-4 justify-center">
                    {BLOCK_TYPES.map((el) => <div key={el.label}>
                        <button
                            value={el.label}
                            className={`hover:bg-gray-200 border mr-1 w-[50px] ${active.label === el.label && active.val === false?'bg-gray-200':''}`}
                            onClick={(e) => {el.style(editorState, setEditorState);setActive({label:e.target.value,val:el.val(editorState)})}}>
                            {el.label}
                        </button>
                    </div>)}
                    {INLINE_STYLES.map((el) => <div key={el.label}>
                        <button
                            className={`hover:bg-gray-200 border mr-1 w-[50px] ${active}`}
                            value={el.style} onClick={(e) => { }}>
                            {el.label}
                        </button>
                    </div>)}
                </div>
                <div className="flex justify-center ml-2">
                    <div
                        className={`mr-2 hover:bg-gray-200 p-1 border ${active}`}>
                        <button type="button" value={"left"} className="flex"
                                onClick={(e) => { }}>
                            <TextLeft/>
                        </button>
                    </div>
                    <div
                        className={`mr-2 hover:bg-gray-200 p-1 border ${active}`}>
                        <button type="button" className="flex"
                                onClick={(e) => { }}>
                            <TextCenter/>
                        </button>
                    </div>
                    <div
                        className={`mr-2 hover:bg-gray-200 p-1 border ${active}`}>
                        <button type="button" className="flex"
                                onClick={(e) => { }}>
                            <TextRight/>
                        </button>
                    </div>
                    <div className="w-[70px] h-[30px] px-2 border">
                        <select onChange={(e)=>{ }} className="w-full h-full bg-white">
                            {arrayCount(50).map((el) => <option value={el} className="w-[40px]" key={el + "size"}>{el}</option>)}
                        </select>
                    </div>
                </div>
            </nav>
        <Editor
            editorState={editorState}
            onChange={setEditorState}
            blockStyleFn={blockStyleFn}
            editorRef={editorRef}
        />
        {
            [
                {name: 'text-align-left', detector: isTextLeftAligned},
                {name: 'text-align-center', detector: isTextCenterAligned},
                {name: 'text-align-justify', detector: isTextJustifyAligned},
                {name: 'text-align-right', detector: isTextRightAligned},
            ].map((alignment) => (
                <button
                    key={alignment.name}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleTextAlign(editorState, setEditorState, alignment.name)
                    }}
                    style={{color: alignment.detector(editorState) ? 'skyblue' : 'black'}}
                >
                    {alignment.name.replaceAll('-', ' ')}
                </button>
            ))
        }
        </div>

}

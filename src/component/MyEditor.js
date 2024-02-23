import {useEffect, useRef, useState} from "react";
import Draft, {Editor, EditorState, RichUtils} from "draft-js";
import {Map} from "immutable";
import TextRight from "./TextRight";
import TextCenter from "./TextCenter";
import TextLeft from "./TextLeft";
import {
    myBlockStyleFn,
    blockRenderMap,
    INLINE_STYLES,
    BLOCK_TYPES,
    styleMap,
    updateClassElement,
    updateStyleElement,
    arrayCount,
    createObjSize,
    stylesBlock
} from "../action";

export default function MyEditor() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [alignText, setAlignText] = useState("");
    const [blockType, setBlockType] = useState("unstyled");
    const [blockTypeStyle, setBlockTypeStyle] = useState("");
    const [getBlock, setGetBlock] = useState('');
    const [styleBlock, setStyleBlock] = useState({});

    const editor = useRef(null);
    let active = 'bg-gray-200';
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    const currentStyle = editorState.getCurrentInlineStyle();

    useEffect(() => {
        BLOCK_TYPES.forEach((el)=>{
            if(block.getType() === el.style){
                setGetBlock(el.label.toLowerCase())
            }
        })

    }, [editorState])

    function handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    function onBoldClick(e) {
        setEditorState(RichUtils.toggleInlineStyle(editorState, e));
    }

    function toggleBlockType(e) {
        setEditorState(RichUtils.toggleBlockType(editorState, e));
    }


    function styleFn(styles, contentBlock) {
        if (contentBlock.getType() === 'header-one') {
            return {textAlign:'left'}
        }

    }



    const blockRenderMap = Map(styleBlock);


    function myBlockStyleFn(contentBlock) {
        const type = contentBlock.getType();
       switch (type) {
            case 'header-one':
                return 'text-2xl';
            case 'header-two':
                return 'text-xl';
            case 'unordered-list-item':
                return 'list-disc';
            case 'ordered-list-item':
                return 'list-decimal';
            case 'paragraph':
                return 'text-lg';
            case 'unstyled-right':
                return 'text-lg';
            case 'h1-right':
                return 'text-2xl justify-self-end';
            case 'h1-left':
                return 'text-2xl justify-self-start';
            case 'h1-center':
                return 'text-2xl justify-self-center';
            case 'h2-right':
                return 'text-xl justify-self-end';
            case 'h2-left':
                return 'text-xl justify-self-start';
            case 'h2-center':
                return 'text-xl justify-self-center';
           case 'header-three-right':
               return 'justify-self-end';
           case 'header-three-left':
               return 'justify-self-start';
           case 'header-three-center':
               return 'justify-self-center';
            default:
                return 'text-lg'
        }
    }

    const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

    return (<>
        <div className="p-6 m-2">
            {getBlock}
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
                            className={`hover:bg-gray-200 border mr-1 w-[50px] ${el.style === blockType ? active : ''}`}
                            value={el.style} onClick={(e) => {
                            toggleBlockType(e.target.value);
                            setBlockType(e.target.value);

                        }}>
                            {el.label}
                        </button>
                    </div>)}
                    {INLINE_STYLES.map((el) => <div key={el.label}>
                        <button
                            className={`hover:bg-gray-200 border mr-1 w-[50px] ${currentStyle.has(el.style) ? active : ''}`}
                            value={el.style} onClick={(e)=>onBoldClick(e.target.value)}>
                            {el.label}
                        </button>
                    </div>)}
                </div>
                <div className="flex justify-center ml-2">
                    <div
                        className={`mr-2 hover:bg-gray-200 p-1 border ${blockTypeStyle === 'justify-left' ? active : ''}`}>
                        <button type="button" value={"left"} className="flex"
                                onClick={(e) => {
                                    if(getBlock === 'h1'){
                                        toggleBlockType('h1-left');
                                        setStyleBlock({'h1-left':{element:getBlock,wrapper:<div className={"grid place-content-start"}/>}})
                                    }else if(getBlock === 'h2'){
                                        toggleBlockType('h2-left');
                                        setStyleBlock({'h2-left':{element:getBlock,wrapper:<div className={"grid place-content-start"}/>}})
                                    }

                                }} >
                            <TextLeft/>
                        </button>
                    </div>
                    <div
                        className={`mr-2 hover:bg-gray-200 p-1 border ${blockTypeStyle === 'justify-center' ? active : ''}`}>
                        <button type="button" className="flex"
                                onClick={(e) => {
                                    if(getBlock === 'h1'){
                                        toggleBlockType('h1-center');
                                        setStyleBlock({'h1-center':{element:getBlock,wrapper:<div className={"grid place-content-center"}/>}})
                                    }else if(getBlock === 'h2'){
                                        toggleBlockType('h2-center');
                                        setStyleBlock({'h2-center':{element:getBlock,wrapper:<div className={"grid place-content-center"}/>}})
                                    }

                                   // updateStyleElement(block,getBlock,'text-align:center;')
                                }}>
                            <TextCenter/>
                        </button>
                    </div>
                    <div
                        className={`mr-2 hover:bg-gray-200 p-1 border ${blockTypeStyle === 'justify-end' ? active : ''}`}>
                        <button type="button" className="flex"
                                onClick={(e) => {
                                    if(getBlock === 'h1' || getBlock === 'h2'){
                                        toggleBlockType('h1-right');
                                        setStyleBlock({'h1-right':{element:getBlock,wrapper:<div className={"grid place-content-end"}/>}})
                                    }else if(getBlock === 'h2'){
                                        toggleBlockType('h2-right');
                                        setStyleBlock({'h2-right':{element:getBlock,wrapper:<div className={"grid place-content-end"}/>}})
                                    }
                                }}>
                            <TextRight/>
                        </button>
                    </div>
                    <div className="w-[70px] h-[30px] px-2 border">
                        <select className="w-full h-full bg-white">
                            {arrayCount(50).map((el) => <option className="w-[40px]" key={el + "size"}>{el}</option>)}
                        </select>
                    </div>
                </div>
            </nav>
            <Editor
                editorState={editorState}
                customStyleMap={styleMap}
                customStyleFn={styleFn}
                handleKeyCommand={handleKeyCommand}
                blockStyleFn={myBlockStyleFn}
                onChange={setEditorState}
                blockRenderMap={extendedBlockRenderMap}
                textAlignment={alignText}
                placeholder="Enter some text..."


            />
        </div>
    </>);
}
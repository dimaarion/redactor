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
    createObjSize
} from "../action";

export default function MyEditor() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [alignText, setAlignText] = useState("");
    const [blockType, setBlockType] = useState("unstyled");
    const [blockTypeStyle, setBlockTypeStyle] = useState("");
    const [getBlock, setGetBlock] = useState('');

    const editor = useRef(null);
    let active = 'bg-gray-200';
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    const currentStyle = editorState.getCurrentInlineStyle();

    useEffect(() => {

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

    let stylesBlock = {
        'header-one': {
            element: 'h1'
        }, 'header-two': {
            element: 'h2'
        }, 'header-three': {
            element: 'h3'
        }, 'header-four': {
            element: 'h4'
        }, 'header-five': {
            element: 'h5'
        }, 'header-six': {
            element: 'h6'
        }, 'blockquote': {
            element: 'blockquote'
        }, 'unordered-list-item': {
            element: 'li',
            wrapper: <ul></ul>
        }, 'ordered-list-item': {
            element: 'li',
            wrapper: <ol></ol>
        }, 'Code Block': {
            element: 'code-block'
        }, 'paragraph': {
            element: 'div',
            aliasedElements: ['p', 'span'],
        },
        'unstyled': {
            element: 'div',
            aliasedElements: ['span', 'p'],
        },
        'header-one-center':{
            element:'h1',
            wrapper:<div className={"grid justify-items-stretch"}/>
        },
        'header-one-left':{
            element:'h1',
            wrapper:<div className={"grid justify-items-stretch"}/>
        },
        'header-one-right':{
            element:'h1',
            wrapper:<div className={"grid justify-items-stretch"}/>
        },'header-two-center':{
            element:'h2',
            wrapper:<div className={"grid justify-items-stretch"}/>
        },
        'header-two-left':{
            element:'h2',
            wrapper:<div className={"grid justify-items-stretch"}/>
        },
        'header-two-right':{
            element:'h2',
            wrapper:<div className={"grid justify-items-stretch"}/>
        }
    }


    const blockRenderMap = Map(stylesBlock);


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
            case 'header-one-right':
                return 'text-2xl justify-self-end';
            case 'header-one-left':
                return 'text-2xl justify-self-start';
            case 'header-one-center':
                return 'text-2xl justify-self-center';
            case 'header-two-right':
                return 'text-2xl justify-self-end';
            case 'header-two-left':
                return 'text-2xl justify-self-start';
            case 'header-two-center':
                return 'text-2xl justify-self-center';
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
                                    if(block.getType().search(/header-one/g) === 0){
                                        toggleBlockType('header-one-left');
                                    }else if(block.getType().search(/header-two/g) === 0){
                                        toggleBlockType('header-two-left');
                                    }

                                  //  setStyleBlock({'left':{element:getBlock,wrapper:<div className={"grid place-content-left"}/> }})
                                    //updateStyleElement(block,getBlock,'text-align:left;')
                                }} >
                            <TextLeft/>
                        </button>
                    </div>
                    <div
                        className={`mr-2 hover:bg-gray-200 p-1 border ${blockTypeStyle === 'justify-center' ? active : ''}`}>
                        <button type="button" className="flex"
                                onClick={(e) => {
                                    console.log(block.getType().search(/header/g))
                                    if(block.getType().search(/header-one/g) === 0) {
                                        toggleBlockType('header-one-center');
                                    }else if(block.getType().search(/header-two/g) === 0){
                                        toggleBlockType('header-two-center');
                                    }
                                   // setStyleBlock({'center':{element:getBlock,wrapper:<div className={"grid place-content-center"}/>,key:block.getKey() }})
                                   // updateStyleElement(block,getBlock,'text-align:center;')
                                }}>
                            <TextCenter/>
                        </button>
                    </div>
                    <div
                        className={`mr-2 hover:bg-gray-200 p-1 border ${blockTypeStyle === 'justify-end' ? active : ''}`}>
                        <button type="button" className="flex"
                                onClick={(e) => {
                                    if(block.getType().search(/header/g) === 0) {
                                        toggleBlockType('header-one-right');
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
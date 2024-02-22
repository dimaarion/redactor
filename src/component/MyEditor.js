import {useEffect, useRef, useState} from "react";
import Draft, {Editor, EditorState, RichUtils} from "draft-js";
import {Map} from "immutable";
import TextRight from "./TextRight";
import TextCenter from "./TextCenter";
import TextLeft from "./TextLeft";

export default function MyEditor() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [alignText, setAlignText] = useState("left");
    const [blockType, setBlockType] = useState("unstyled");
    const [blockTypeStyle, setBlockTypeStyle] = useState("unstyled");
    const editor = useRef(null);
    let active = 'bg-gray-200';
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    const currentStyle = editorState.getCurrentInlineStyle();
    useEffect(() => {
        setBlockType(block.getType());
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
        setEditorState(RichUtils.toggleInlineStyle(editorState, e.target.value));
    }

    function myBlockStyleFn(contentBlock) {
        const type = contentBlock.getType();
        console.log(type)
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
                return 'text-lg flex justify-end';
            case 'header-one-right':
                return 'text-2xl flex justify-end';
            case 'header-one-left':
                return 'text-2xl flex justify-left';
            case 'header-one-center':
                return 'text-2xl flex justify-center';
            case 'header-two-right':
                return 'text-2xl flex justify-end';
            case 'header-two-left':
                return 'text-2xl flex justify-left';
            case 'header-two-center':
                return 'text-2xl flex justify-center';
            default:
                return 'text-lg'
        }
    }

    function _myBlockStyleFn(test, contentBlock) {
        const type = contentBlock.getType();
        return {style: 'RED', type}
    }

    const blockAlign = Map(
        {
            'header-one-right': {
                element: 'h1'
            }, 'header-one-left': {
                element: 'h1'
            }, 'header-one-center': {
                element: 'h1'
            }, 'header-two-right': {
                element: 'h2'
            }, 'header-two-left': {
                element: 'h2'
            }, 'header-two-center': {
                element: 'h2'
            },
        }
    )


    const blockRenderMap = Map({
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
        }
    });

    const INLINE_STYLES = [
        {label: 'B', style: 'BOLD'},
        {label: 'I', style: 'ITALIC'},
        {label: 'U', style: 'UNDERLINE'},
        {label: 'M', style: 'CODE'},
        {label: 'S', style: 'STRIKETHROUGH'},

    ];


    const BLOCK_TYPES = [
        {label: 'H1', style: 'header-one'},
        {label: 'H2', style: 'header-two'},
        {label: 'H3', style: 'header-three'},
        {label: 'H4', style: 'header-four'},
        {label: 'H5', style: 'header-five'},
        {label: 'H6', style: 'header-six'},
        {label: 'DIV', style: 'blockquote'},
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'},
        {label: 'Code Block', style: 'code-block'},
        {label: 'P', style: 'paragraph'},
    ];

    const styleMap = {
        'STRIKETHROUGH': {
            textDecoration: 'line-through',
        },
        'RED': {
            color: 'red'
        }
    };

    function toggleBlockType(e) {
        setEditorState(RichUtils.toggleBlockType(editorState, e.target.value));
        setBlockTypeStyle(e.target.value);
    }

    const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap, blockAlign);
    return (<>
        <div className="p-6 m-2">
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
                            value={el.style} onClick={toggleBlockType}>
                            {el.label}
                        </button>
                    </div>)}
                    {INLINE_STYLES.map((el) => <div key={el.label}>
                        <button
                            className={`hover:bg-gray-200 border mr-1 w-[50px] ${currentStyle.has(el.style) ? active : ''}`}
                            value={el.style} onClick={onBoldClick}>
                            {el.label}
                        </button>
                    </div>)}
                </div>
                <div className="flex justify-center ml-2">
                    <div className={`mr-2 hover:bg-gray-200 p-1 border ${alignText === 'left' ? active : ''}`}>
                        <button type="button" className="flex" value={block.getType()}
                                onClick={(e) => setEditorState(RichUtils.toggleBlockType(editorState, blockTypeStyle + '-left'))}>
                            <TextLeft/>
                        </button>
                    </div>
                    <div className={`mr-2 hover:bg-gray-200 p-1 border ${alignText === 'center' ? active : ''}`}>
                        <button type="button" className="flex"
                                onClick={(e) => setEditorState(RichUtils.toggleBlockType(editorState, blockTypeStyle + '-center'))}>
                            <TextCenter/>
                        </button>
                    </div>
                    <div className={`mr-2 hover:bg-gray-200 p-1 border ${alignText === 'right' ? active : ''}`}>
                        <button type="button" className="flex"
                                onClick={(e) => setEditorState(RichUtils.toggleBlockType(editorState, blockTypeStyle + '-right'))}>
                            <TextRight/>
                        </button>
                    </div>
                </div>
            </nav>
            <Editor
                editorState={editorState}
                customStyleMap={styleMap}
                //customStyleFn = {_myBlockStyleFn}
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
import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import Draft, {
    Editor,
    EditorState,
    RichUtils,
    Modifier,
    getDefaultKeyBinding,
    CompositeDecorator,
    convertFromRaw,
    convertToRaw
} from 'draft-js';
import '../css/example.css';
import '../css/draft.css';
import '../css/rich-editor.css';
import TextLeft from "./TextLeft";
import {Map} from "immutable";
import TextCenter from "./TextCenter";
import TextRight from "./TextRight";
import {updateStyleElement, blockRenderMap, getBlockStyle, BLOCK_ALIGN, BLOCK_TABLE, rawContent} from "../action";
import AddLink from "./AddLink";
import RemoveLink from "./RemoveLink";
import Table from "./Table";
import TableParams from "./TableParams";

const {useState, useRef, useCallback} = React;


export default function EditorRedactor() {
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );
    const [urlValue, setUrlValue] = useState('');
    const [alignText, setAlignText] = useState('text-left');
    const [tag, setTag] = useState('div')
    const editor = useRef(null);
    const [showURLInput, setShowURLInput] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [countTable, setCountTable] = useState('1');
    const focus = () => {
        if (editor.current) editor.current.focus();
    };

    const onURLChange = (e) => setUrlValue(e.target.value);

    const logState = () => {
        const content = editorState.getCurrentContent();
    };

    function _promptForLink(e) {
        e.preventDefault();
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const startKey = editorState.getSelection().getStartKey();
            const startOffset = editorState.getSelection().getStartOffset();
            const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
            const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

            let url = '';
            if (linkKey) {
                const linkInstance = contentState.getEntity(linkKey);
                url = linkInstance.getData().url;
            }

            setUrlValue(url)
            setShowURLInput(showURLInput ? false : true);

        }
    }


    function _confirmLink(e) {
        e.preventDefault();
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            {url: urlValue}
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity});
        setEditorState(RichUtils.toggleLink(
            newEditorState,
            newEditorState.getSelection(),
            entityKey
        ))
        setUrlValue('')
        setShowURLInput(false)

    }

    function _removeLink(e) {
        e.preventDefault();
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            setEditorState(RichUtils.toggleLink(editorState, selection, null));
        }
    }

    function _onLinkInputKeyDown(e) {
        if (e.which === 13) {
            _confirmLink(e);
        }
    }

    const TokenSpan = (props) => {
        const style = getDecoratedStyle(
            props.contentState.getEntity(props.entityKey).getMutability()
        );
        return (
            <span data-offset-key={props.offsetkey} style={style}>
            {props.children}
          </span>
        );
    };

    const Link = (props) => {
        const {url} = props.contentState.getEntity(props.entityKey).getData();
        return (
            <a href={url} className={"text-blue-500"}>
                {props.children}
            </a>
        );
    };


    const decorator = new CompositeDecorator([
        {
            strategy: getEntityStrategy('IMMUTABLE'),
            component: TokenSpan,
        },
        {
            strategy: getEntityStrategy('MUTABLE'),
            component: Link,
        },
        {
            strategy: getEntityStrategy('SEGMENTED'),
            component: TokenSpan,
        },
        {
            strategy: findLinkEntities,
            component: Link,
        },
    ]);
    const blocks = convertFromRaw(rawContent);
    useEffect(() => {
        setEditorState(EditorState.createWithContent(blocks, decorator))

    }, [])

    const toggleColor = (toggledColor) => _toggleColor(toggledColor);
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    function getEntityStrategy(mutability) {
        return function (contentBlock, callback, contentState) {
            contentBlock.findEntityRanges(
                (character) => {
                    const entityKey = character.getEntity();
                    if (entityKey === null) {
                        return false;
                    }
                    return contentState.getEntity(entityKey).getMutability() === mutability;
                },
                callback
            );
        };
    }

    function findLinkEntities(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
            (character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === 'LINK'
                );
            },
            callback
        );
    }


    function getDecoratedStyle(mutability) {
        switch (mutability) {
            case 'IMMUTABLE':
                return styles.immutable;
            case 'MUTABLE':
                return styles.mutable;
            case 'SEGMENTED':
                return styles.segmented;
            default:
                return null;
        }
    }


    let BL = BLOCK_TYPES.concat(BLOCK_ALIGN, BLOCK_TABLE)
    useEffect(() => {
        BL.forEach((el) => {
            if (blockType === el.style) {
                setTag(el.label.toLowerCase())
            }
        })

    }, [editorState])


    function _toggleColor(toggledColor) {
        const selection = editorState.getSelection();

        // Let's just allow one color at a time. Turn off all active colors.
        const nextContentState = Object.keys(colorStyleMap)
            .reduce((contentState, color) => {
                return Modifier.removeInlineStyle(contentState, selection, color)
            }, editorState.getCurrentContent());

        let nextEditorState = EditorState.push(
            editorState,
            nextContentState,
            'change-inline-style'
        );

        const currentStyle = editorState.getCurrentInlineStyle();

        // Unset style override for current color.
        if (selection.isCollapsed()) {
            nextEditorState = currentStyle.reduce((state, color) => {
                return RichUtils.toggleInlineStyle(state, color);
            }, nextEditorState);
        }

        // If the color is being toggled on, apply it.
        if (!currentStyle.has(toggledColor)) {
            nextEditorState = RichUtils.toggleInlineStyle(
                nextEditorState,
                toggledColor
            );
        }

        setEditorState(nextEditorState);
    }


    const handleKeyCommand = useCallback(
        (command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
                setEditorState(newState);
                return 'handled';
            }
            return 'not-handled';
        },
        [editorState, setEditorState],
    );

    const mapKeyToEditorCommand = useCallback(
        e => {
            switch (e.keyCode) {
                case 9: // TAB
                    const newEditorState = RichUtils.onTab(
                        e,
                        editorState,
                        4 /* maxDepth */,
                    );
                    if (newEditorState !== editorState) {
                        setEditorState(newEditorState);
                    }
                    return null;
            }
            return getDefaultKeyBinding(e);
        },
        [editorState, setEditorState],
    );

    let className = 'RichEditor-editor';
    let contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (
            contentState
                .getBlockMap()
                .first()
                .getType() !== 'unstyled'
        ) {
            className += ' RichEditor-hidePlaceholder';
        }
    }

    let tableRender = Map({
            'table': {
                element: 'div',
                wrapper: <Table col = {countTable} />
            }
        }
    )

    const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap,tableRender);

    let urlInput = <div className={"absolute bg-gray-300 px-3 mt-2 h-[50px] flex hover:text-gray-950 z-20"}>
        <input
            onChange={onURLChange}
            ref={React.createRef()}
            type="text"
            value={urlValue}
            className={"border border-gray-400 rounded w-[300px] h-[20px] mt-3 mr-2"}
            onKeyDown={_onLinkInputKeyDown}
        />
        <button type={"button"} className={"my-3 cursor-pointer"} onMouseDown={_confirmLink}>
            Ok
        </button>
    </div>;


    return (
        <div className="RichEditor-root ">

            <div className={"sticky top-0 bg-white pt-3 z-10"}>
                <BlockStyleControls
                    tag={tag}
                    setAlignText={setAlignText}
                    editorState={editorState}
                    onToggle={blockType => {
                        const newState = RichUtils.toggleBlockType(editorState, blockType);
                        setEditorState(newState);
                    }}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={inlineStyle => {
                        const newState = RichUtils.toggleInlineStyle(
                            editorState,
                            inlineStyle,
                        );
                        setEditorState(newState);
                    }}
                />
                <ColorControls
                    editorState={editorState}
                    onToggle={toggleColor}
                />
            </div>
            <div className={"flex"}>
                <div className={"relative"}>
                    <button type={"button"} className={`bg-gray-${showURLInput ? `200` : `50`} rounded cursor-pointer mr-2 hover:bg-gray-200`}
                            onMouseDown={_promptForLink}>
                        <AddLink/>
                    </button>
                    <button type={"button"} className={`bg-gray-50 cursor-pointer rounded mr-2 hover:bg-gray-200`} onMouseDown={_removeLink}>
                        <RemoveLink/>
                    </button>
                    {showURLInput ? urlInput : ''}
                </div>
                <button type={"button"} onClick={()=>{
                    setShowTable(true);
                    //setEditorState(RichUtils.toggleBlockType(editorState, 'table'))
                }} className={`bg-gray-50 cursor-pointer rounded mr-2 hover:bg-gray-200`}>
                    table
                </button>
                {showTable?<TableParams countTable = {countTable} setCountTable = {setCountTable} setClose={setShowTable} editorState = {editorState} setEditorState = {setEditorState}/>:''}
            </div>


            <div className={className} onClick={focus}>

                <Editor
                    blockStyleFn={getBlockStyle}
                    customStyleMap={Object.assign(styleMap, colorStyleMap)}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={mapKeyToEditorCommand}
                    onChange={setEditorState}
                    blockRenderMap={extendedBlockRenderMap}
                    placeholder="Tell a story..."
                    ref={editor}
                    spellCheck={true}
                />
            </div>
            <input
                onClick={logState}
                style={styles.button}
                type="button"
                value="Log State"
            />
        </div>
    );
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};


function StyleButton({onToggle, active, label, style}) {
    let className = 'RichEditor-styleButton';
    if (active) {
        className += ' RichEditor-activeButton';
    }

    return (
        <span
            className={className}
            onMouseDown={e => {
                e.preventDefault();
                onToggle(style);
            }}>
      {label}
    </span>
    );
}

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
    {label: 'DIV', style: 'unstyled'},

];

function BlockStyleControls({editorState, onToggle, setAlignText, tag}) {
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    const block = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())


    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map(type => (
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
            <button type={"button"} className={"bg-gray-50 cursor-pointer rounded mr-2 hover:bg-gray-200"} onMouseDown={e => {
                e.preventDefault();
                onToggle('left-' + tag);
                setAlignText("justify-self-start")
                updateStyleElement(block, 'span', 'text-align:left;')
            }}
            >
                <TextLeft/>
            </button>
            <button type={"button"} className={"bg-gray-50 cursor-pointer rounded mr-2 hover:bg-gray-200"} onMouseDown={e => {
                e.preventDefault();
                onToggle('center-' + tag);
                setAlignText("justify-self-center")
                updateStyleElement(block, 'span', 'text-align:center;')
            }}
            >
                <TextCenter/>
            </button>
            <button type={"button"} className={"bg-gray-50 cursor-pointer rounded mr-2 hover:bg-gray-200"} onMouseDown={e => {
                e.preventDefault();
                onToggle('right-' + tag);
                setAlignText("justify-self-end");
                updateStyleElement(block, 'span', 'text-align:right;')
            }}
            >
                <TextRight/>
            </button>
        </div>
    );
}

const INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
];

function InlineStyleControls({editorState, onToggle}) {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type => (
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
}

class StyleButtonColor extends React.Component {
    constructor(props) {
        super(props);
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let style;
        if (this.props.active) {
            style = {...styles.styleButton, ...colorStyleMap[this.props.style]};
        } else {
            style = styles.styleButton;
        }

        return (
            <span style={style} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}

var COLORS = [
    {label: 'Red', style: 'red'},
    {label: 'Orange', style: 'orange'},
    {label: 'Yellow', style: 'yellow'},
    {label: 'Green', style: 'green'},
    {label: 'Blue', style: 'blue'},
    {label: 'Indigo', style: 'indigo'},
    {label: 'Violet', style: 'violet'},
];

const ColorControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div style={styles.controls}>
            {COLORS.map(type =>
                <StyleButtonColor
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

// This object provides the styling information for our custom color
// styles.
const colorStyleMap = {
    red: {
        color: 'rgba(255, 0, 0, 1.0)',
    },
    orange: {
        color: 'rgba(255, 127, 0, 1.0)',
    },
    yellow: {
        color: 'rgba(180, 180, 0, 1.0)',
    },
    green: {
        color: 'rgba(0, 180, 0, 1.0)',
    },
    blue: {
        color: 'rgba(0, 0, 255, 1.0)',
    },
    indigo: {
        color: 'rgba(75, 0, 130, 1.0)',
    },
    violet: {
        color: 'rgba(127, 0, 255, 1.0)',
    },
};

const styles = {
    root: {
        fontFamily: '\'Georgia\', serif',
        fontSize: 14,
        padding: 20,
        width: 600,
    },
    editor: {
        borderTop: '1px solid #ddd',
        cursor: 'text',
        fontSize: 16,
        marginTop: 20,
        minHeight: 400,
        paddingTop: 20,
    },
    controls: {
        fontFamily: '\'Helvetica\', sans-serif',
        fontSize: 14,
        marginBottom: 10,
        userSelect: 'none',
    },
    styleButton: {
        color: '#999',
        cursor: 'pointer',
        marginRight: 16,
        padding: '2px 0',
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
    },
    immutable: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: '2px 0',
    },
    mutable: {
        backgroundColor: 'rgba(204, 204, 255, 1.0)',
        padding: '2px 0',
    },
    segmented: {
        backgroundColor: 'rgba(248, 222, 126, 1.0)',
        color: 'red',
        padding: '2px 0',
    },
};

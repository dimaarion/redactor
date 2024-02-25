import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import Draft, {Editor, EditorState, RichUtils, Modifier, getDefaultKeyBinding} from 'draft-js';
import '../css/example.css';
import '../css/draft.css';
import '../css/rich-editor.css';
import TextLeft from "./TextLeft";
import {Map} from "immutable";
import TextCenter from "./TextCenter";
import TextRight from "./TextRight";
import {updateStyleElement,blockRenderMap, getBlockStyle, BLOCK_ALIGN, BLOCK_TABLE} from "../action";

const {useState, useRef, useCallback} = React;
export default function EditorRedactor() {
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );
    const [alignText, setAlignText] = useState('text-left');
    const [tag, setTag] = useState('div')
    const editor = useRef(null);
    const focus = () => {
        if (editor.current) editor.current.focus();
    };
    const toggleColor = (toggledColor) => _toggleColor(toggledColor);
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();



    let BL = BLOCK_TYPES.concat(BLOCK_ALIGN,BLOCK_TABLE)
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



    const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);
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
            <button type={"button"} onMouseDown={e => {
                e.preventDefault();
                onToggle('left-' + tag);
                setAlignText("justify-self-start")
                updateStyleElement(block,'span','text-align:left;')
            }}
            >
                <TextLeft/>
            </button>
            <button type={"button"} onMouseDown={e => {
                e.preventDefault();
                onToggle('center-' + tag);
                setAlignText("justify-self-center")
                updateStyleElement(block,'span','text-align:center;')
            }}
            >
                <TextCenter/>
            </button>
            <button type={"button"} onMouseDown={e => {
                e.preventDefault();
                onToggle('right-' + tag);
                setAlignText("justify-self-end");
                updateStyleElement(block,'span','text-align:right;')
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
};

import {
    convertFromRaw,
    convertToRaw,
    CompositeDecorator,
    Editor,
    ContentState,
    EditorState, convertFromHTML
} from 'draft-js';
import React, {useEffect, useRef} from "react";


export default class HTMLConvertExample extends React.Component {
    constructor(props) {
        super(props);

        const decorator = new CompositeDecorator([
            {
                strategy: findLinkEntities,
                component: Link,
            },
            {
                strategy: findImageEntities,
                component: Image,
            },{
                strategy: findTableEntities,
                component: Table,
            },
        ]);

        const sampleMarkup =
            '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
            '<a href="http://www.facebook.com">Example link</a><br /><br/ >' +
            '<img src="image.png" height="112" width="200" />' +
        '<table><tbody><tr><td>sdv</td><td>sdv</td><td>sdv</td></tr></tbody></table>';

        const blocksFromHTML = convertFromHTML(sampleMarkup);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );

        this.state = {
            editorState: EditorState.createWithContent(
                state,
                decorator,
            ),
        };

        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => this.setState({editorState});
        this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(content));
        };
    }

    render() {
        return (
            <div style={styles.root}>
                <div style={{marginBottom: 10}}>
                    Sample HTML converted into Draft content state
                </div>
                <div style={styles.editor} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        ref="editor"
                    />
                </div>
                <input
                    onClick={this.logState}
                    style={styles.button}
                    type="button"
                    value="Log State"
                />
            </div>
        );
    }
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

const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
        <a href={url} style={styles.link}>
            {props.children}
        </a>
    );
};

const Table = (props) => {
   // const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
        <table>
            <tbody>
            <tr>
                <td>
                    {props.children}
                </td>
            </tr>
            </tbody>

        </table>
    );
};

function findImageEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'IMAGE'
            );
        },
        callback
    );
}

function findTableEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            console.log(contentState)
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'TABLE'
            );
        },
        callback
    );
}

const Image = (props) => {
    const {
        height,
        src,
        width,
    } = props.contentState.getEntity(props.entityKey).getData();

    return (
        <img src={src} height={height} width={width} />
    );
};

const styles = {
    root: {
        fontFamily: '\'Helvetica\', sans-serif',
        padding: 20,
        width: 600,
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10,
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
    },
};
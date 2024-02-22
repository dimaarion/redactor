import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useState,useRef} from "react";
import {Map} from "immutable";
import MyEditor from "./component/MyEditor";

function App() {

    return <MyEditor/>;
}

export default App;

import {useEffect, useRef, useState} from "react";
import React from 'react'
import ContentEditable from 'react-contenteditable'
import sanitizeHtml from "sanitize-html";
import EditButton from "./EditButton"


export default function TextAreaRedactor(){
    const text = useRef('');
const [editor, setEditor] = useState({html:text.current});
    const focus = () => {

    };


 let  sanitizeConf = {
     allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
     allowedAttributes: { a: ["href"] }
 };
    const handleChange = evt => {
        text.current = evt.target.value
        text.current = text.current.replace(/<!--[\s\S]+?-->/gi, '');
        text.current = text.current.replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi, '');
       // content = content.replace(/<(\/?)s>/gi, "<$1strike>");
      //  content = content.replace(/ /gi, ' ');
       // content = content.replace(/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi, function(str, spaces) {
       //     return (spaces.length > 0) ? spaces.replace(/./, " ").slice(Math.floor(spaces.length/2)).split("").join("\u00a0") : '';
     //   });
        text.current = text.current.replace(/lang="EN-US"/g,'');
        text.current = text.current.replace(/style="mso-ansi-language:EN-US"/g,'');
        text.current = text.current.replace(/MsoNormal/g,'text-lg');
        text.current = text.current.replace(/MsoTableGrid/g,'border-collapse border border-slate-400');
        setEditor({html:text.current})
    };

   const sanitize = () => {
        setEditor({ html: sanitizeHtml(text.current, sanitizeConf) });
    };

    useEffect(()=>{
      //  console.log(editor.html)
    },[editor])

    const handleBlur = () => {
      //  console.log(text.current);
    };

    function removeStyle(tag,at){
        document.querySelectorAll(tag).forEach((el)=>{
            if(el.hasAttribute(at)){
                el.removeAttribute(at)
            }

        })
    }

   function setClass(tag,c){
       document.querySelectorAll(tag).forEach((el)=>{
               el.className = c;
       })
   }

   function replaceElement(tag,e){
       document.querySelectorAll(tag).forEach((el)=>{
           el.outerHTML = '<'+ e + ' class="'+ el.className +'" style="'+ el.getAttribute("style") +'">' + el.innerHTML + '</' + e +'>';

       })
   }

   function parentAddClass(tag,c){
       document.querySelectorAll(tag).forEach((el)=>{
           el.parentElement.classList.add(c)
       })
   }

  function appendEl(tag,e){
      document.querySelectorAll(tag).forEach((el)=>{
          el.outerHTML = '<'+ e + ' class="'+ el.className +'" style="'+ el.getAttribute("style") +'">' + el.outerHTML + '</' + e +'>';
      })
  }

    useEffect(()=>{
        appendEl("table","div")
        removeStyle("table","style")
        setClass("table","table-auto w-full")
        parentAddClass("table","overflow-auto")
        removeStyle("tr","style")
        removeStyle("td","style")
        removeStyle("td","width")
        setClass("td","border border-slate-300 p-2")
        setClass("h1","text-3xl")
        replaceElement('table p','div')
        replaceElement('table span','div')
    },[editor])

    return<>
        <EditButton selectedtext = {text.current} sanitizeHtml = {sanitizeHtml} cmd="italic" name="i"/>
        <EditButton cmd="bold" name="b"/>
        <EditButton cmd="formatBlock" arg="h1" name="h1" />
        <ContentEditable onFocus={focus} className={"content-redactor border border-2 border-solid mt-3 border-gray-300"} html={text.current} onBlur={sanitize} onChange={handleChange} />
    </>
}
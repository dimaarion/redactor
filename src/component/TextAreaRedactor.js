import {useEffect, useRef, useState} from "react";
import React from 'react'
import ContentEditable from 'react-contenteditable'
import sanitizeHtml from "sanitize-html";
import EditButton from "./EditButton"


export default function TextAreaRedactor() {
    const text = useRef('');
    const editRef = useRef(null);
    const [editor, setEditor] = useState("");
    const [isBlock, setIsBlock] = useState("div");
    const [count, setCount] = useState(-1);
    const focus = () => {
        return text.current
    };


    let sanitizeConf = {
        allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
        allowedAttributes: {a: ["href"]}
    };
    const handleChange = evt => {
        text.current = evt.target.value
        text.current = text.current.replace(/<!--[\s\S]+?-->/gi, '');
        text.current = text.current.replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi, '');
        text.current = text.current.replace(/<(\/?)s>/gi, "<$1strike>");
        text.current = text.current.replace(/ /gi, ' ');
        text.current = text.current.replace(/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi, function (str, spaces) {
            return (spaces.length > 0) ? spaces.replace(/./, " ").slice(Math.floor(spaces.length / 2)).split("").join("\u00a0") : '';
        });
        text.current = text.current.replace(/lang="EN-US"/g, '');
        text.current = text.current.replace(/style="mso-ansi-language:EN-US"/g, '');
        text.current = text.current.replace(/MsoNormal/g, 'text-lg');
        text.current = text.current.replace(/MsoTableGrid/g, 'border-collapse border border-slate-400');
        setEditor(text.current)
    };

    const sanitize = () => {
        text.current = sanitizeHtml(text.current, sanitizeConf);
    };

    useEffect(() => {
        //  console.log(editor.html)
    }, [editor])

    const handleBlur = () => {
        //  console.log(text.current);
    };

    function removeStyle(tag, at) {
        document.querySelector(".content-redactor").querySelectorAll(tag).forEach((el) => {
            if (el.hasAttribute(at)) {
                el.removeAttribute(at)
            }

        })
    }

    function setClass(tag, c) {
        document.querySelector(".content-redactor").querySelectorAll(tag).forEach((el) => {
            el.className = c;
        })
    }

    function replaceElementAll() {
        document.querySelector(".content-redactor").querySelectorAll("*").forEach((el) => {
            let parentBlock = Array.from(el.parentElement.classList).filter((f) => f === "content-redactor").length;
            if (el.parentElement.tagName === el.tagName && parentBlock === 0) {
                el.parentElement.outerHTML = '<div class="' + el.parentElement.className + '" style="' + el.parentElement.getAttribute("style") + '">' + el.parentElement.innerHTML + '</div>';
            }
            // el.outerHTML = '<'+ e + ' class="'+ el.className +'" style="'+ el.getAttribute("style") +'">' + el.innerHTML + '</' + e +'>';
        })
    }

    function replaceElement(tag, e) {
        document.querySelector(".content-redactor").querySelectorAll(tag).forEach((el) => {
            el.outerHTML = '<' + e + ' class="' + el.className + '" style="' + el.getAttribute("style") + '">' + el.innerHTML + '</' + e + '>';
        })
    }

    function parentAddClass(tag, c) {
        document.querySelector(".content-redactor").querySelectorAll(tag).forEach((el) => {
            el.parentElement.classList.add(c)
        })
    }

    function appendEl(tag, e) {
        document.querySelector(".content-redactor").querySelectorAll(tag).forEach((el) => {
            el.outerHTML = '<' + e + ' class="' + el.className + '" style="' + el.getAttribute("style") + '">' + el.outerHTML + '</' + e + '>';
        })
    }

    function isBlockColor(data = 'DIV'){
        document.querySelector(".content-redactor").addEventListener("click", (e) => {
            document.querySelector("#nav-bar").querySelectorAll("button").forEach((el) => {
                if (e.target.tagName === el.getAttribute("data-tag") || el.getAttribute("data-tag") === data) {
                    el.classList.replace("bg-white", "bg-gray-300")
                } else {
                    el.classList.replace("bg-gray-300", "bg-white")
                }

            })

        })
    }

    useEffect(() => {
        appendEl("table", "div")
        removeStyle("table", "style")
        setClass("table", "table-auto w-full")
        parentAddClass("table", "overflow-auto")
        removeStyle("tr", "style")
        removeStyle("td", "style")
        removeStyle("td", "width")
        setClass("td", "border border-slate-300 p-2")
        setClass("h1", "text-3xl")
        setClass("div", "text-lg")
        replaceElement('table p', 'div')
        replaceElement('table span', 'div')
        replaceElementAll()

    }, [editor])

    useEffect(() => {
        isBlockColor()
    }, [])


    function Italic() {
        return <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 className="bi bi-type-italic" viewBox="0 0 16 16">
                <path
                    d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
            </svg>
        </>
    }

    function Bold() {
        return <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 className="bi bi-type-italic" viewBox="0 0 16 16">
                <path
                    d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
            </svg>
        </>
    }

    function Underline() {
        return <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 className="bi bi-type-underline" viewBox="0 0 16 16">
                <path
                    d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"/>
            </svg>
        </>
    }

    function Strikethrough() {
        return <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 className="bi bi-type-strikethrough" viewBox="0 0 16 16">
                <path
                    d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967"/>
            </svg>
        </>
    }

    function Div() {
        return <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 className="bi bi-type-strikethrough" viewBox="0 0 16 16">
                <text x={0} y={12} fontSize={10} style={{color: "red"}} fill={"#000"}>DIV</text>

            </svg>
        </>
    }

    function H1() {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                    className="bi bi-type-h1" viewBox="0 0 16 16">
            <path
                d="M7.648 13V3H6.3v4.234H1.348V3H0v10h1.348V8.421H6.3V13zM14 13V3h-1.333l-2.381 1.766V6.12L12.6 4.443h.066V13z"/>
        </svg>
    }

    function H2() {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                    className="bi bi-type-h2" viewBox="0 0 16 16">
            <path
                d="M7.495 13V3.201H6.174v4.15H1.32V3.2H0V13h1.32V8.513h4.854V13zm3.174-7.071v-.05c0-.934.66-1.752 1.801-1.752 1.005 0 1.76.639 1.76 1.651 0 .898-.582 1.58-1.12 2.19l-3.69 4.2V13h6.331v-1.149h-4.458v-.079L13.9 8.786c.919-1.048 1.666-1.874 1.666-3.101C15.565 4.149 14.35 3 12.499 3 10.46 3 9.384 4.393 9.384 5.879v.05z"/>
        </svg>
    }

    function H3() {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                    className="bi bi-type-h3" viewBox="0 0 16 16">
            <path
                d="M11.07 8.4h1.049c1.174 0 1.99.69 2.004 1.724s-.802 1.786-2.068 1.779c-1.11-.007-1.905-.605-1.99-1.357h-1.21C8.926 11.91 10.116 13 12.028 13c1.99 0 3.439-1.188 3.404-2.87-.028-1.553-1.287-2.221-2.096-2.313v-.07c.724-.127 1.814-.935 1.772-2.293-.035-1.392-1.21-2.468-3.038-2.454-1.927.007-2.94 1.196-2.981 2.426h1.23c.064-.71.732-1.336 1.744-1.336 1.027 0 1.744.64 1.744 1.568.007.95-.738 1.639-1.744 1.639h-.991V8.4ZM7.495 13V3.201H6.174v4.15H1.32V3.2H0V13h1.32V8.513h4.854V13z"/>
        </svg>
    }

    function H4() {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                    className="bi bi-type-h4" viewBox="0 0 16 16">
            <path
                d="M13.007 3H15v10h-1.29v-2.051H8.854v-1.18C10.1 7.513 11.586 5.256 13.007 3m-2.82 6.777h3.524v-5.62h-.074a95 95 0 0 0-3.45 5.554zM7.495 13V3.201H6.174v4.15H1.32V3.2H0V13h1.32V8.513h4.854V13z"/>
        </svg>
    }

    function H5() {
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                    className="bi bi-type-h5" viewBox="0 0 16 16">
            <path
                d="M9 10.516h1.264c.193.976 1.112 1.364 2.01 1.364 1.005 0 2.067-.782 2.067-2.247 0-1.292-.983-2.082-2.089-2.082-1.012 0-1.658.596-1.924 1.077h-1.12L9.646 3h5.535v1.141h-4.415L10.5 7.28h.072c.201-.316.883-.84 1.967-.84 1.709 0 3.13 1.177 3.13 3.158 0 2.025-1.407 3.403-3.475 3.403-1.809 0-3.1-1.048-3.194-2.484ZM7.495 13V3.201H6.174v4.15H1.32V3.2H0V13h1.32V8.512h4.854V13z"/>
        </svg>
    }

    return <>
        <div id={"nav-bar"} className={"sticky top-0 bg-white z-10"}>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="i"
                        component={Italic}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="b"
                        component={Bold}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="u"
                        component={Underline}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="s"
                        component={Strikethrough}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="div"
                        cl="text-lg"
                        component={Div}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="h1"
                        cl="text-4xl"
                        component={H1}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="h2"
                        cl="text-3xl"
                        component={H2}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="h3"
                        cl="text-2xl"
                        component={H3}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="h4"
                        cl="text-xl"
                        component={H4}/>
            <EditButton selectedtext={text.current} setIsBlock={isBlockColor} replaceElement={replaceElement} name="h5"
                        cl="text-xl"
                        component={H5}/>
        </div>

        <ContentEditable disabled={false} tagName="div" onFocus={focus}
                         className={"content-redactor border border-2 border-solid mt-3 border-gray-300"}
                         html={text.current} onBlur={sanitize} onChange={handleChange}/>
        <textarea
            className="editable"
            value={text.current}
            onChange={handleChange}
            onBlur={sanitize}
        />
    </>
}


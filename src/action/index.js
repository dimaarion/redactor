
import {Map} from "immutable";
import React from "react";
import Table from "../component/Table";

export const INLINE_STYLES = [
    {label: 'B', style: 'BOLD'},
    {label: 'I', style: 'ITALIC'},
    {label: 'U', style: 'UNDERLINE'},
    {label: 'M', style: 'CODE'},
    {label: 'S', style: 'STRIKETHROUGH'},
];


export function createObjSize(n) {
    let o = {}

    arrayCount(n).forEach((el) => {
        o.el = {fontSize: el};
    })
    return o;
}


let size = {
    'FONTSIZE-9': {
        fontSize: 9
    }
}


export const styleMap = Object.assign(size)

export function updateClassElement(block, tag, remove, ...selector) {
    Array.from(document.getElementsByTagName(tag)).forEach((el) => {
        if (el.getAttribute("data-offset-key") === block.getKey() + '-0-0') {
            if (el.hasAttribute('class')) {
                selector.forEach((cl) => {
                    el.classList.add(cl)
                })
                if (remove) {
                    if (Array.isArray(remove)) {
                        remove.forEach((cl) => {
                            el.classList.remove(cl)
                        })
                    } else {
                        el.classList.remove(remove)
                    }

                }

            }
        }
    })
}

export function updateStyleElement(block, tag = false, selector, update = false) {
    Array.from(document.getElementsByTagName(tag ? tag : '*')).forEach((el) => {
        if (el.getAttribute("data-offset-key") === block.getKey() + '-0-0') {
            if (el.hasAttribute('style') && update) {
                el.setAttribute('style', el.getAttribute('style') + selector);
            }
            el.setAttribute('style', selector);
        }
    })
}

export function arrayCount(n,c = 8) {
    let arr = [];
    for (let i = c; i < n; i++) {
        arr[i] = i;
    }
    return arr;
}

export const BLOCK_TYPES = [
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

export const BLOCK_TABLE = [
    {label:'div',style:'table'}
]

export const BLOCK_ALIGN = [
    {label: 'H1', style: 'left-h1'},
    {label: 'H1', style: 'center-h1'},
    {label: 'H1', style: 'right-h1'},
    {label: 'H2', style: 'left-h2'},
    {label: 'H2', style: 'center-h2'},
    {label: 'H2', style: 'right-h2'},
    {label: 'H3', style: 'left-h3'},
    {label: 'H3', style: 'center-h3'},
    {label: 'H3', style: 'right-h3'},
    {label: 'H4', style: 'left-h4'},
    {label: 'H4', style: 'center-h4'},
    {label: 'H4', style: 'right-h4'},
    {label: 'H5', style: 'left-h5'},
    {label: 'H5', style: 'center-h5'},
    {label: 'H5', style: 'right-h5'},
    {label: 'H6', style: 'left-h6'},
    {label: 'H6', style: 'center-h6'},
    {label: 'H6', style: 'right-h6'},
    {label: 'blockquote', style: 'left-blockquote'},
    {label: 'blockquote', style: 'center-blockquote'},
    {label: 'blockquote', style: 'right-blockquote'},
    {label: 'ul', style: 'left-ul'},
    {label: 'ul', style: 'center-ul'},
    {label: 'ul', style: 'right-ul'},
    {label: 'ol', style: 'left-ol'},
    {label: 'ol', style: 'center-ol'},
    {label: 'ol', style: 'right-ol'},
    {label: 'div', style: 'left-div'},
    {label: 'div', style: 'center-div'},
    {label: 'div', style: 'right-div'},
];

export const blockRenderMap = Map({
    'header-one': {
        element: 'h1',
        wrapper: <div className={"grid justify-items-stretch"}/>
    },
    'left-h1': {
        element: 'h1',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'center-h1': {
        element: 'h1',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'right-h1': {
        element: 'h1',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'header-two': {
        element: 'h2',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'left-h2': {
        element: 'h2',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'center-h2': {
        element: 'h2',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'right-h2': {
        element: 'h2',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'left-h3': {
        element: 'h3',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'center-h3': {
        element: 'h3',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'right-h3': {
        element: 'h3',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'left-h4': {
        element: 'h4',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'center-h4': {
        element: 'h4',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'right-h4': {
        element: 'h4',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'left-h5': {
        element: 'h5',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'center-h5': {
        element: 'h5',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'right-h5': {
        element: 'h5',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'left-h6': {
        element: 'h6',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'center-h6': {
        element: 'h6',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'right-h6': {
        element: 'h6',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'left-blockquote': {
        element: 'blockquote',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'center-blockquote': {
        element: 'blockquote',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'right-blockquote': {
        element: 'blockquote',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'unordered-list-item': {
        element: 'li',
        wrapper: <ul className={"grid justify-items-stretch"}/>
    }, 'ordered-list-item': {
        element: 'li',
        wrapper: <ol className={"grid justify-items-stretch"}/>
    }, 'left-ul': {
        element: 'li',
        wrapper: <ul className={"grid justify-items-stretch"}/>
    }, 'center-ul': {
        element: 'li',
        wrapper: <ul className={"grid justify-items-stretch"}/>
    }, 'right-ul': {
        element: 'li',
        wrapper: <ul className={"grid justify-items-stretch"}/>
    }, 'left-ol': {
        element: 'li',
        wrapper: <ul className={"grid justify-items-stretch"}/>
    }, 'center-ol': {
        element: 'li',
        wrapper: <ul className={"grid justify-items-stretch"}/>
    }, 'right-ol': {
        element: 'li',
        wrapper: <ul className={"grid justify-items-stretch"}/>
    },'left-div': {
        element: 'div',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'center-div': {
        element: 'div',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }, 'right-div': {
        element: 'div',
        wrapper: <div className={"grid justify-items-stretch"}/>
    }
});

export function getBlockStyle(block) {
    let textLeft = 'justify-self-start';
    let textCenter = 'justify-self-center';
    let textRight = 'justify-self-end';
    switch (block.getType()) {
        case 'blockquote':
            return 'text-lg RichEditor-blockquote';
        case 'header-one':
            return 'text-3xl font-bold ' + textCenter;
        case 'header-two':
            return 'text-2xl font-bold ' + textCenter;
        case 'header-three':
            return 'text-xl font-bold';
        case 'header-four':
            return 'text-lg font-bold';
        case 'header-five':
            return 'text-lg font-bold';
        case 'header-six':
            return 'text-lg font-bold';
        case 'left-h1':
            return 'text-3xl font-bold ' + textLeft;
        case 'center-h1':
            return 'text-3xl font-bold ' + textCenter;
        case 'right-h1':
            return 'text-3xl font-bold ' + textRight;
        case 'left-h2':
            return 'text-2xl font-bold ' + textLeft;
        case 'center-h2':
            return 'text-2xl font-bold ' + textCenter;
        case 'right-h2':
            return 'text-2xl font-bold ' + textRight;
        case 'left-h3':
            return 'text-xl font-bold ' + textLeft;
        case 'center-h3':
            return 'text-xl font-bold ' + textCenter;
        case 'right-h3':
            return 'text-xl font-bold ' + textRight;
        case 'left-h4':
            return 'text-lg font-bold ' + textLeft;
        case 'center-h4':
            return 'text-lg font-bold ' + textCenter;
        case 'right-h4':
            return 'text-lg font-bold ' + textRight;
        case 'left-h5':
            return 'text-lg font-bold ' + textLeft;
        case 'center-h5':
            return 'text-lg font-bold ' + textCenter;
        case 'right-h5':
            return 'text-lg font-bold ' + textRight;
        case 'left-h6':
            return 'text-lg font-bold ' + textLeft;
        case 'center-h6':
            return 'text-lg font-bold ' + textCenter;
        case 'right-h6':
            return 'text-lg font-bold ' + textRight;
        case 'left-blockquote':
            return 'text-lg font-bold RichEditor-blockquote ' + textLeft;
        case 'center-blockquote':
            return 'text-lg font-bold RichEditor-blockquote ' + textCenter;
        case 'right-blockquote':
            return 'text-lg font-bold RichEditor-blockquote ' + textRight;
        case 'unordered-list-item':
            return 'text-lg list-disc ' + textLeft;
        case 'left-ul':
            return 'text-lg list-disc ' + textLeft;
        case 'center-ul':
            return 'text-lg list-disc ' + textCenter;
        case 'right-ul':
            return 'text-lg list-disc ' + textRight;
        case 'left-ol':
            return 'text-lg list-decimal ' + textLeft;
        case 'center-ol':
            return 'text-lg list-decimal ' + textCenter;
        case 'right-ol':
            return 'text-lg list-decimal ' + textRight;
        case 'left-div':
            return 'text-lg ' + textLeft;
        case 'center-div':
            return 'text-lg ' + textCenter;
        case 'right-div':
            return 'text-lg ' + textRight;
        case 'table':
            return 'border table border-solid border-gray-600 p-2'
        default:
            return 'text-lg';
    }
}


export  const rawContent = {
    blocks: [
        {
            text: (
                'This is an "immutable" entity: Superman. Deleting any ' +
                'characters will delete the entire entity. Adding characters ' +
                'will remove the entity from the range.'
            ),
            type: 'unstyled',
            entityRanges: [{offset: 0, length: 10, key: 'first'}],
        },
        {
            text: '43tt43',
            type: 'unstyled',
        },
        {
            text: (
                'This is a "mutable" entity: Batman. Characters may be added ' +
                'and removed.'
            ),
            type: 'unstyled',
            entityRanges: [{offset: 28, length: 6, key: 'second'}],
        },
        {
            text: '',
            type: 'unstyled',
        },
        {
            text: (
                'This is a "segmented" entity: Green Lantern. Deleting any ' +
                'characters will delete the current "segment" from the range. ' +
                'Adding characters will remove the entire entity from the range.'
            ),
            type: 'unstyled',
            entityRanges: [{offset: 30, length: 13, key: 'third'}],
        },
    ],

    entityMap: {
        first: {
            type: 'TOKEN',
            mutability: 'IMMUTABLE',
        },
        second: {
            type: 'TOKEN',
            mutability: 'MUTABLE',
        },
        third: {
            type: 'TOKEN',
            mutability: 'SEGMENTED',
        },
    },
};


function listItem(ititalTegs, list, subList) {
    let oldteg = document.createElement(list);
    let dataD = "list";

    function att(o, d) {
        return o.setAttribute("class", d);
    }
    function rCild(b, n, l, s) {
        if (b.parentNode) {
            if (b.tagName === "LI" || b.tagName === "OL") {
                b.innerHTML =
                    "<" + l + "><" + s + ">" + b.innerHTML + "</" + s + "></" + l + ">";
            } else {
                b.parentNode.replaceChild(n, b);
                let li = document.body.appendChild(document.createElement(s));
                n.appendChild(li);
                li.innerHTML = b.innerHTML;
            }
        }
    }

    rCild(ititalTegs, oldteg, list, subList);
    att(oldteg, dataD);
}




export function selectedStyles(props, tag = "span", href = false, styles = false) {
    function replaceSelected() {
        let b = document.createElement(tag);

        if (href !== false) {
            b.setAttribute("href", href);
        }
        if (styles !== false) {
            b.setAttribute("style", styles);
        }
        let range = window.getSelection();

        let parentBlock = Array.from(range.anchorNode.parentElement.classList).filter((f) => f === "content-redactor").length;
        if (range.getRangeAt(0).getClientRects().item(0) !== null && range.getRangeAt(0).getClientRects().item(0).width > 0) {
            let documentFragment = range.getRangeAt(0).extractContents();

            if(tag === 'ul'){
                let li = document.createElement("li");
                b.appendChild(li);
                li.appendChild(documentFragment)
            }else {
                b.appendChild(documentFragment);
            }
            range.getRangeAt(0).insertNode(b);
        } else {
            if (parentBlock === 0) {
                let cl = "";
                let st = "";
                document.querySelector(".content-redactor").querySelectorAll("*").forEach((el) => {
                    if (el === range.anchorNode.parentElement) {
                        if (range.anchorNode.parentElement.hasAttribute("class")) {
                            cl = range.anchorNode.parentElement.className;
                        } else {
                            cl = "text-lg"
                        }

                        if(props.cl){
                            cl =  props.cl
                        }


                        if (range.anchorNode.parentElement.hasAttribute("style")) {
                            st = 'style="'+ range.anchorNode.parentElement.getAttribute("style") +'"' ;
                        } else {
                            st = ""
                        }

                        if (range.anchorNode.parentElement.tagName === tag.toUpperCase()) {
                            range.anchorNode.parentElement.outerHTML = '<div class="'+ cl +'">' + range.anchorNode.parentElement.innerHTML + '</div>';
                        } else {
                            if(tag === "ul" || tag === "ol"){
                                listItem(range.anchorNode.parentElement,  tag, 'li')
                               // range.anchorNode.parentElement.outerHTML = '<' + tag + ' class="' + cl + '" '+ st +' ><li>' + range.anchorNode.parentElement.innerHTML + '</li></' + tag + '>';
                            }else {
                                range.anchorNode.parentElement.outerHTML = '<' + tag + ' class="' + cl + '" '+ st +' >' + range.anchorNode.parentElement.innerHTML + '</' + tag + '>';
                            }

                        }

                    }

                });

            }

        }
    }

    if (props.selectedtext) {
        return replaceSelected();
    }
}


export function isBlockColor(){
    document.querySelector(".content-redactor").addEventListener("click", (e) => {
        document.querySelector("#nav-bar").querySelectorAll("button").forEach((el) => {

            if (e.target.tagName === el.getAttribute("data-tag") || e.target.parentElement.tagName === el.getAttribute("data-tag")) {
                el.classList.replace("bg-white", "bg-gray-300")
            } else {
                el.classList.replace("bg-gray-300", "bg-white")
            }
        })

    })
}
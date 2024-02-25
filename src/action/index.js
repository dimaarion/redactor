import {
    isH1,
    isH2,
    isH3,
    isH4,
    isH5,
    isH6,
    toggleH1,
    toggleH2,
    toggleH3,
    toggleH4,
    toggleH5,
    toggleH6,
    isParagraph,
    toggleParagraph,
    isOL,
    isUL,
    toggleOL,
    toggleUL
} from "contenido";
import {Map} from "immutable";
import React from "react";

export const INLINE_STYLES = [
    {label: 'B', style: 'BOLD'},
    {label: 'I', style: 'ITALIC'},
    {label: 'U', style: 'UNDERLINE'},
    {label: 'M', style: 'CODE'},
    {label: 'S', style: 'STRIKETHROUGH'},
];

export const BLOCK_TYPES = [
    {label: 'H1', style: toggleH1, val: isH1},
    {label: 'H2', style: toggleH2, val: isH2},
    {label: 'H3', style: toggleH3, val: isH3},
    {label: 'H4', style: toggleH4, val: isH4},
    {label: 'H5', style: toggleH5, val: isH5},
    {label: 'H6', style: toggleH6, val: isH6},
    {label: 'DIV', style: toggleParagraph, val: isParagraph},
    {label: 'UL', style: toggleUL, val: isUL},
    {label: 'OL', style: toggleOL, val: isOL},
    {label: 'Code Block', style: 'code-block'},
    {label: 'P', style: 'paragraph'},
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

export function arrayCount(n) {
    let arr = [];
    for (let i = 8; i < n; i++) {
        arr[i] = i;
    }
    return arr;
}

export const BLOCK_TABLE = [
    {label:'table',style:'table'}
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
    },
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
        default:
            return 'text-lg';
    }
}

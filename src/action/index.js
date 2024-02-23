import {Map} from "immutable";


export const INLINE_STYLES = [
    {label: 'B', style: 'BOLD'},
    {label: 'I', style: 'ITALIC'},
    {label: 'U', style: 'UNDERLINE'},
    {label: 'M', style: 'CODE'},
    {label: 'S', style: 'STRIKETHROUGH'},
];

export const BLOCK_TYPES = [
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

export function createObjSize(n) {

}


let size = {
    '9': {
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

export function updateStyleElement(block, tag, selector, update = false) {
    Array.from(document.getElementsByTagName(tag)).forEach((el) => {
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

export let stylesBlock = {
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
    },'header-three-center':{
        element:'h3',
        wrapper:<div className={"grid justify-items-stretch"}/>
    },
    'header-three-left':{
        element:'h3',
        wrapper:<div className={"grid justify-items-stretch"}/>
    },
    'header-three-right':{
        element:'h3',
        wrapper:<div className={"grid justify-items-stretch"}/>
    }
}

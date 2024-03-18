import {useEffect} from "react";

export default function EditButton(props) {


    function selectedStyles(props, tag = "span", href = false, styles = false) {
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
                b.appendChild(documentFragment);
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
                                range.anchorNode.parentElement.outerHTML = '<' + tag + ' class="' + cl + '" '+ st +' >' + range.anchorNode.parentElement.innerHTML + '</' + tag + '>';
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

    return (
        <button
            data-tag = {props.name.toUpperCase()}
            className="bg-white m-1 cursor-pointer hover:bg-gray-200"
            key={props.cmd}
            onMouseDown={evt => {
                evt.preventDefault();
                selectedStyles(props, props.name);
                props.setIsBlock('btn',evt)
            }}
        >
            {props.component?<props.component t ={"d"}/>:""}
        </button>
    );




}
(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(4),i=n.n(r),o=(n(14),n(17)),c=n(20),u=n(2),s=n.n(u);n(15);const m={loader:{load:["[tex]/enclose"]},tex:{packages:{"[+]":["enclose"]}}};function d(e,t){return Math.floor(Math.random()*(t-e+1))+e}var p=function(){const[e,t]=Object(a.useState)([]),[n,r]=Object(a.useState)(9),[i,u]=Object(a.useState)(1),[p,b]=Object(a.useState)(3),[g,v]=Object(a.useState)("mixed"),[E,S]=Object(a.useState)(28),[h,f]=Object(a.useState)(140);Object(a.useEffect)(()=>{const e=s.a.get("divisionSettings");if(e)try{const n=JSON.parse(e);n.problemCount&&r(n.problemCount),n.divisorDigits&&u(n.divisorDigits),n.dividendDigits&&b(n.dividendDigits),n.remainderOption&&v(n.remainderOption),n.mathFontSize&&S(n.mathFontSize),n.problemSpacing&&f(n.problemSpacing)}catch(t){console.error("Cookie parse error:",t)}},[]);const C=()=>{const e={problemCount:n,divisorDigits:i,dividendDigits:p,remainderOption:g,mathFontSize:E,problemSpacing:h};s.a.set("divisionSettings",JSON.stringify(e),{expires:365})};return l.a.createElement(o.b,{version:3,config:m},l.a.createElement("div",{className:"container"},l.a.createElement("h1",null,"\u308f\u308a\u7b97\uff08\u7b46\u7b97\uff09\u554f\u984c\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc"),l.a.createElement("div",{className:"controls"},l.a.createElement("label",null,"\u554f\u984c\u6570:",l.a.createElement("input",{type:"number",value:n,onChange:e=>r(Number(e.target.value)),onBlur:C})),l.a.createElement("label",null,"\u5272\u308b\u6570(\u9664\u6570)\u306e\u6841\u6570:",l.a.createElement("input",{type:"number",value:i,onChange:e=>u(Number(e.target.value)),onBlur:C})),l.a.createElement("label",null,"\u5272\u3089\u308c\u308b\u6570(\u88ab\u9664\u6570)\u306e\u6841\u6570:",l.a.createElement("input",{type:"number",value:p,onChange:e=>b(Number(e.target.value)),onBlur:C})),l.a.createElement("label",null,"\u4f59\u308a\u306e\u7a2e\u985e:",l.a.createElement("select",{value:g,onChange:e=>{v(e.target.value),C()}},l.a.createElement("option",{value:"none"},"\u5168\u90e8\u4f59\u308a\u306a\u3057"),l.a.createElement("option",{value:"all"},"\u5168\u90e8\u4f59\u308a\u3042\u308a"),l.a.createElement("option",{value:"mixed"},"\u6df7\u5408"))),l.a.createElement("label",null,"\u6570\u5f0f\u6587\u5b57\u30b5\u30a4\u30ba(px):",l.a.createElement("input",{type:"number",value:E,onChange:e=>S(Number(e.target.value)),onBlur:C})),l.a.createElement("label",null,"\u4e0a\u4e0b\u4f59\u767d(px):",l.a.createElement("input",{type:"number",value:h,onChange:e=>f(Number(e.target.value)),onBlur:C})),l.a.createElement("button",{onClick:()=>{const e=[];for(let t=0;t<n;t++)for(;;){const t=10**(p-1),n=10**p-1,a=d(10**(i-1),10**i-1),l=d(t,n),r=l%a,o=0===r,c=0!==r;let u=!1;switch(g){case"none":o&&(u=!0);break;case"all":c&&(u=!0);break;case"mixed":u=!0;break;default:u=!0}if(u&&0!==a){e.push({dividend:l,divisor:a});break}}t(e),C()}},"\u554f\u984c\u3092\u751f\u6210")),l.a.createElement("div",{className:"problems-grid"},e.map((e,t)=>{const n=String.raw`\require{enclose}${e.divisor} \enclose{longdiv}{${e.dividend}}`;return l.a.createElement("div",{key:t,className:"problem-item",style:{minHeight:h+"px"}},l.a.createElement(c.a,{dynamic:!0,style:{fontSize:E+"px"}},`\\(${n}\\)`))}))))};var b=e=>{e&&e instanceof Function&&n.e(3).then(n.bind(null,21)).then(t=>{let{getCLS:n,getFID:a,getFCP:l,getLCP:r,getTTFB:i}=t;n(e),a(e),l(e),r(e),i(e)})};i.a.createRoot(document.getElementById("root")).render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(p,null))),b()},5:function(e,t,n){e.exports=n(16)}},[[5,1,2]]]);
//# sourceMappingURL=main.9a18bff8.chunk.js.map
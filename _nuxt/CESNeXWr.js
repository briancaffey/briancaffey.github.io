import{_ as i}from"./DYTYnx9X.js";import{r as u,o as d,j as _,w as m,a as t,i as s}from"./CeezjwU5.js";const b={class:"image-carousel"},p={class:"carousel-container"},v=["src"],g={class:"button-container text-center p-4 text-black rounded"},f=["disabled"],x=["disabled"],y={__name:"Carousel",props:{dir:{type:String,default:""},count:{type:Number,default:1}},setup(o){const e=u(1),c=()=>{e.value>1&&e.value--},l=n=>{e.value<n&&e.value++};return(n,a)=>{const r=i;return d(),_(r,null,{default:m(()=>[t("div",b,[t("div",p,[t("img",{src:`/static/three-body-problem/invokeai/${o.dir}/${s(e)}.png`,alt:"Carousel Image",class:"carousel-image"},null,8,v)]),t("div",g,[t("button",{class:"p-2 bg-green-100 rounded",disabled:s(e).value==1,onClick:c}," Previous ",8,f),t("button",{class:"p-2 bg-green-100 rounded",disabled:s(e).value==o.count,onClick:a[0]||(a[0]=h=>l(o.count))}," Next ",8,x)])])]),_:1})}}};export{y as default};
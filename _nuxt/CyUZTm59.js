import{_ as s}from"./BTgishX_.js";import{_,o as a,j as r,w as l,a as o,d as e,t as n,c as u,k as d}from"./DxsVbTEY.js";const m={class:"px-2 text-lg text-white shadow rounded-lg bg-black mx-1 mb-1 uppercase cursor-pointer tag"},i={key:0},g={class:"font-bold"},p={__name:"Tag",props:{tag:{type:String,default:""},count:{type:Number,default:null}},setup(t){return(x,f)=>{const c=s;return a(),r(c,{key:t.tag,to:`/blog/tags/${t.tag}/`},{default:l(()=>[o("div",m,[e(n(t.tag)+" 🏷️ ",1),t.count?(a(),u("span",i,[e("("),o("span",g,n(t.count),1),e(")")])):d("",!0)])]),_:1},8,["to"])}}},h=_(p,[["__scopeId","data-v-eb2063c1"]]);export{h as _};
import{_ as c}from"./BNxJ47nz.js";import{D as m,l as i,m as u,$ as h,J as l,a0 as d,o as g,j as p,i as r,v as f}from"./CeezjwU5.js";const _=m({__name:"ProseImg",props:{src:{type:String,default:""},alt:{type:String,default:""},width:{type:[String,Number],default:void 0},height:{type:[String,Number],default:void 0}},setup(e){const n=i().public.mdc.useNuxtImage?c:"img",t=e,o=u(()=>{var a;if((a=t.src)!=null&&a.startsWith("/")&&!t.src.startsWith("//")){const s=h(l(i().app.baseURL));if(s!=="/"&&!t.src.startsWith(s))return d(s,t.src)}return t.src});return(a,s)=>(g(),p(f(r(n)),{src:r(o),alt:e.alt,width:e.width,height:e.height},null,8,["src","alt","width","height"]))}});export{_ as default};
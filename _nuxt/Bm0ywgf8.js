import{_ as C}from"./CzmcxFEq.js";import{e as h,k as d,c as w,o as $,b as s,d as r,n as _,i as a,w as c,t as u,_ as k,l as I,f,a as b}from"./jzUacxre.js";import{_ as D}from"./B852cEer.js";import{u as y,q as N}from"./C4Sm19mx.js";import"./BW2t5_RG.js";import"./DjIsa8m4.js";import"./rBAQty2o.js";const P={class:"mx-auto text-center"},B=h({__name:"index",props:{paginatedItems:{type:Array,default:()=>[]},nextPage:{type:Boolean,default:!1},pageNo:{type:Number,default:0},allItems:{type:Array,default:()=>[]}},setup(o){const e=o,n=d(()=>e.pageNo===1?"/blog/1":`/blog/${e.pageNo-1}`);return(p,t)=>{const l=C;return $(),w("div",P,[s(l,{to:a(n),class:_(`
        px-2
        py-2
        text-xl
        text-white
        shadow
        rounded-lg
        mx-1
        mt-1
        uppercase
        cursor-pointer
        ${o.pageNo==1?"pagination-disabled":"pagination"}
        `)},{default:c(()=>t[0]||(t[0]=[r("  ← ")])),_:1,__:[0]},8,["to","class"]),t[2]||(t[2]=r("  ")),s(l,{to:`/blog/${o.pageNo}`,class:"px-2 py-2 text-lg text-xl text-white shadow rounded-lg mx-1 mt-1 uppercase cursor-pointer pagination text-center"},{default:c(()=>[r(u(o.pageNo),1)]),_:1},8,["to"]),t[3]||(t[3]=r("  ")),s(l,{to:o.nextPage?`/blog/${o.pageNo+1}`:`/blog/${o.pageNo}`,class:_(`
        px-2
        py-2
        text-lg
        text-xl
        text-white
        shadow
        rounded-lg
        mx-1
        mt-1
        uppercase
        cursor-pointer
        ${o.nextPage?"pagination":"pagination-disabled"}
        `)},{default:c(()=>t[1]||(t[1]=[r("  →  ")])),_:1,__:[1]},8,["to","class"])])}}}),E=Object.assign(k(B,[["__scopeId","data-v-6171f706"]]),{__name:"Pagination"}),S={class:"mx-auto max-w-6xl"},V={class:"text-center text-3xl py-8"},q={class:"mb-8"},G=h({__name:"[number]",async setup(o){let e,n;const p=I(),t=parseInt(p.params.number),{data:l}=([e,n]=f(()=>y("all-articles",()=>N("blog").order("date","ASC").all())),e=await e,n(),e),{data:v}=([e,n]=f(()=>y(p.path,()=>N("blog").order("date","DESC").limit(10).skip(9*(t-1)).all(),"$h52rMERoAm")),e=await e,n(),e),m=d(()=>l.value),i=d(()=>v.value?.filter(g=>!g.draft)||[]);return(g,R)=>{const x=E,A=D;return $(),w("div",S,[b("h1",V,u(g.$t("blog.blogPosts"))+" ("+u(a(m)?.length||0)+") ",1),b("div",q,[s(x,{"paginated-items":a(i)||[],"all-items":a(m)||[],"page-no":a(t),"next-page":(a(i)?.length||0)===10},null,8,["paginated-items","all-items","page-no","next-page"])]),s(A,{articles:a(i)||[]},null,8,["articles"]),s(x,{"paginated-items":a(i)||[],"all-items":a(m)||[],"page-no":a(t),"next-page":(a(i)?.length||0)===10},null,8,["paginated-items","all-items","page-no","next-page"])])}}});export{G as default};

import{_ as k}from"./CAEbC5FA.js";import{_ as A,j as d,c as h,o as w,b as s,d as i,w as m,n as _,h as a,t as u,k as C,e as f,a as b}from"./U2gz5u3s.js";import{_ as I}from"./C2vidfi-.js";import{u as y,q as N}from"./CeeZmN6j.js";import"./o2IDnumT.js";import"./Cz9IHiFo.js";import"./C_-EP1mu.js";const D={class:"mx-auto text-center"},P={__name:"Pagination",props:{paginatedItems:{type:Array,default:()=>[]},nextPage:{type:Boolean,default:!1},pageNo:{type:Number,default:0},allItems:{type:Array,default:()=>[]}},setup(o){const e=o,n=d(()=>e.pageNo===1?"/blog/1":`/blog/${e.pageNo-1}`);return(p,t)=>{const l=k;return w(),h("div",D,[s(l,{to:a(n),class:_(`
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
        `)},{default:m(()=>t[0]||(t[0]=[i("  ← ")])),_:1,__:[0]},8,["to","class"]),t[2]||(t[2]=i("  ")),s(l,{to:`/blog/${o.pageNo}`,class:"px-2 py-2 text-lg text-xl text-white shadow rounded-lg mx-1 mt-1 uppercase cursor-pointer pagination text-center"},{default:m(()=>[i(u(o.pageNo),1)]),_:1},8,["to"]),t[3]||(t[3]=i("  ")),s(l,{to:o.nextPage?`/blog/${o.pageNo+1}`:`/blog/${o.pageNo}`,class:_(`
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
        `)},{default:m(()=>t[1]||(t[1]=[i("  →  ")])),_:1,__:[1]},8,["to","class"])])}}},B=A(P,[["__scopeId","data-v-ea8088c0"]]),S={class:"mx-auto max-w-6xl"},V={class:"text-center text-3xl py-8"},j={class:"mb-8"},U={__name:"[number]",async setup(o){let e,n;const p=C(),t=parseInt(p.params.number),{data:l}=([e,n]=f(()=>y("all-articles",()=>N("blog").order("date","ASC").all())),e=await e,n(),e),{data:$}=([e,n]=f(()=>y(p.path,()=>N("blog").order("date","DESC").limit(10).skip(9*(t-1)).all(),"$yGzjUyl46H")),e=await e,n(),e),c=d(()=>l.value),r=d(()=>$.value?.filter(g=>!g.draft)||[]);return(g,q)=>{const x=B,v=I;return w(),h("div",S,[b("h1",V,u(g.$t("blog.blogPosts"))+" ("+u(a(c)?.length||0)+") ",1),b("div",j,[s(x,{"paginated-items":a(r)||[],"all-items":a(c)||[],"page-no":a(t),"next-page":(a(r)?.length||0)===10},null,8,["paginated-items","all-items","page-no","next-page"])]),s(v,{articles:a(r)||[]},null,8,["articles"]),s(x,{"paginated-items":a(r)||[],"all-items":a(c)||[],"page-no":a(t),"next-page":(a(r)?.length||0)===10},null,8,["paginated-items","all-items","page-no","next-page"])])}}};export{U as default};

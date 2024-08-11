import{_ as $}from"./BJsOfWWR.js";import{_ as N,m as P,o as h,c as b,b as s,w as c,d as i,i as e,n as g,t as m,f as k,g as u,a as x}from"./CCIRddPq.js";import{_ as v}from"./B-VVzCsA.js";import{u as _,q as f}from"./pj1S73wN.js";import"./B9kT37aj.js";import"./Cc6AXBbp.js";import"./BCRIc92F.js";import"./ByMYKtq7.js";const A={class:"mx-auto text-center"},I={__name:"index",props:{paginatedItems:{type:Array,default:()=>[]},nextPage:{type:Boolean,default:!1},pageNo:{type:Number,default:0},allItems:{type:Array,default:()=>[]}},setup(a){const t=a,n=P(()=>t.pageNo===1?"/blog/1":`/blog/${t.pageNo-1}`);return(p,r)=>{const o=$;return h(),b("div",A,[s(o,{to:e(n),class:g(`
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
        ${a.pageNo==1?"pagination-disabled":"pagination"}
        `)},{default:c(()=>[i("  ← ")]),_:1},8,["to","class"]),i("  "),s(o,{to:`/blog/${a.pageNo}`,class:"px-2 py-2 text-lg text-xl text-white shadow rounded-lg mx-1 mt-1 uppercase cursor-pointer pagination text-center"},{default:c(()=>[i(m(a.pageNo),1)]),_:1},8,["to"]),i("  "),s(o,{to:a.nextPage?`/blog/${a.pageNo+1}`:`/blog/${a.pageNo}`,class:g(`
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
        ${a.nextPage?"pagination":"pagination-disabled"}
        `)},{default:c(()=>[i("  →  ")]),_:1},8,["to","class"])])}}},B=N(I,[["__scopeId","data-v-d4fe533e"]]),C={class:"mx-auto max-w-6xl"},V={class:"text-center text-3xl py-8"},q={class:"mb-8"},T={__name:"[number]",async setup(a){let t,n;const p=k(),r=parseInt(p.params.number),{data:o}=([t,n]=u(()=>_("all-articles",()=>f("/").where({draft:{$ne:!0}}).sort({date:-1}).find())),t=await t,n(),t),{data:l}=([t,n]=u(()=>_(p.path,()=>f("/").where({draft:{$ne:!0}}).sort({date:-1}).limit(10).skip(9*(r-1)).find(),"$FAPcPQo7OX")),t=await t,n(),t);return(y,D)=>{const d=B,w=v;return h(),b("div",C,[x("h1",V,m(y.$t("blog.blogPosts"))+" ("+m(e(o).length)+") ",1),x("div",q,[s(d,{"paginated-items":e(l),"all-items":e(o),"page-no":e(r),"next-page":e(l).length===10},null,8,["paginated-items","all-items","page-no","next-page"])]),s(w,{articles:e(l)},null,8,["articles"]),s(d,{"paginated-items":e(l),"all-items":e(o),"page-no":e(r),"next-page":e(l).length===10},null,8,["paginated-items","all-items","page-no","next-page"])])}}};export{T as default};

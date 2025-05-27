import{_ as $}from"./B61UC9q8.js";import{_ as N,m as P,o as h,c as b,b as s,w as c,d as l,i as e,n as g,t as m,f as k,g as u,a as x}from"./kVp9_zCo.js";import{_ as v}from"./DmVM_sKS.js";import{u as _,q as f}from"./CNcmXw64.js";import"./CFB1jKdu.js";import"./D6xgDuX_.js";import"./o1F2bbTs.js";import"./C2vYEXUt.js";import"./ZsAzf9do.js";const A={class:"mx-auto text-center"},I={__name:"index",props:{paginatedItems:{type:Array,default:()=>[]},nextPage:{type:Boolean,default:!1},pageNo:{type:Number,default:0},allItems:{type:Array,default:()=>[]}},setup(a){const t=a,n=P(()=>t.pageNo===1?"/blog/1":`/blog/${t.pageNo-1}`);return(p,r)=>{const o=$;return h(),b("div",A,[s(o,{to:e(n),class:g(`
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
        `)},{default:c(()=>[l("  ← ")]),_:1},8,["to","class"]),l("  "),s(o,{to:`/blog/${a.pageNo}`,class:"px-2 py-2 text-lg text-xl text-white shadow rounded-lg mx-1 mt-1 uppercase cursor-pointer pagination text-center"},{default:c(()=>[l(m(a.pageNo),1)]),_:1},8,["to"]),l("  "),s(o,{to:a.nextPage?`/blog/${a.pageNo+1}`:`/blog/${a.pageNo}`,class:g(`
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
        `)},{default:c(()=>[l("  →  ")]),_:1},8,["to","class"])])}}},B=N(I,[["__scopeId","data-v-ea8088c0"]]),C={class:"mx-auto max-w-6xl"},V={class:"text-center text-3xl py-8"},q={class:"mb-8"},X={__name:"[number]",async setup(a){let t,n;const p=k(),r=parseInt(p.params.number),{data:o}=([t,n]=u(()=>_("all-articles",()=>f("/").where({draft:{$ne:!0}}).sort({date:-1}).find())),t=await t,n(),t),{data:i}=([t,n]=u(()=>_(p.path,()=>f("/").where({draft:{$ne:!0}}).sort({date:-1}).limit(10).skip(9*(r-1)).find(),"$FAPcPQo7OX")),t=await t,n(),t);return(y,D)=>{const d=B,w=v;return h(),b("div",C,[x("h1",V,m(y.$t("blog.blogPosts"))+" ("+m(e(o).length)+") ",1),x("div",q,[s(d,{"paginated-items":e(i),"all-items":e(o),"page-no":e(r),"next-page":e(i).length===10},null,8,["paginated-items","all-items","page-no","next-page"])]),s(w,{articles:e(i)},null,8,["articles"]),s(d,{"paginated-items":e(i),"all-items":e(o),"page-no":e(r),"next-page":e(i).length===10},null,8,["paginated-items","all-items","page-no","next-page"])])}}};export{X as default};

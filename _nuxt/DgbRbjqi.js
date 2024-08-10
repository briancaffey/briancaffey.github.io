import{_ as N}from"./MfMTr877.js";import{_ as $,o as f,c as h,b as o,w as r,d as i,n as d,t as p,f as k,g as m,a as g,i as e}from"./CoIRpROe.js";import{_ as v}from"./DSWFLsjN.js";import{u,q as x}from"./C4m6KaB3.js";import"./CNAKWoz9.js";import"./C2Hg1MeU.js";import"./DlAlqsqu.js";import"./EQY3qjFj.js";const I={props:{paginatedItems:{type:Array,default:()=>[]},nextPage:{type:Boolean,default:!1},pageNo:{type:Number,default:0},allItems:{type:Array,default:()=>[]}},computed:{prevLink(){return this.pageNo===1?"/blog/1":`/blog/${this.pageNo-1}`}}},A={class:"mx-auto text-center"};function B(b,a,t,c,l,s){const n=N;return f(),h("div",A,[o(n,{to:s.prevLink,class:d(`
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
        ${t.pageNo==1?"pagination-disabled":"pagination"}
        `),external:""},{default:r(()=>[i("  ← ")]),_:1},8,["to","class"]),i("  "),o(n,{to:`/blog/${t.pageNo}`,class:"px-2 py-2 text-lg text-xl text-white shadow rounded-lg mx-1 mt-1 uppercase cursor-pointer pagination text-center",external:""},{default:r(()=>[i(p(t.pageNo),1)]),_:1},8,["to"]),i("  "),o(n,{to:t.nextPage?`/blog/${t.pageNo+1}`:`/blog/${t.pageNo}`,class:d(`
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
        ${t.nextPage?"pagination":"pagination-disabled"}
        `),external:""},{default:r(()=>[i("  →  ")]),_:1},8,["to","class"])])}const C=$(I,[["render",B],["__scopeId","data-v-035467f3"]]),P={class:"mx-auto max-w-6xl"},V={class:"text-center text-3xl py-8"},q={class:"mb-8"},G={__name:"[number]",async setup(b){let a,t;const c=k(),l=parseInt(c.params.number),{data:s}=([a,t]=m(()=>u("all-articles",()=>x("/").where({draft:{$ne:!0}}).sort({date:-1}).find())),a=await a,t(),a),{data:n}=([a,t]=m(()=>u("paginated-items",()=>x("/").where({draft:{$ne:!0}}).sort({date:-1}).limit(10).skip(9*(l-1)).find())),a=await a,t(),a);return(y,D)=>{const _=C,w=v;return f(),h("div",P,[g("h1",V,p(y.$t("blog.blogPosts"))+" ("+p(e(s).length)+") ",1),g("div",q,[o(_,{"paginated-items":e(n),"all-items":e(s),"page-no":e(l),"next-page":e(n).length===10},null,8,["paginated-items","all-items","page-no","next-page"])]),o(w,{articles:e(n)},null,8,["articles"]),o(_,{"paginated-items":e(n),"all-items":e(s),"page-no":e(l),"next-page":e(n).length===10},null,8,["paginated-items","all-items","page-no","next-page"])])}}};export{G as default};

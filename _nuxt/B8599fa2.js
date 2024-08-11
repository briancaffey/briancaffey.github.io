import{_ as N}from"./Bxd4mVnV.js";import{_ as $,o as f,c as h,b as n,w as p,d as i,n as d,t as c,f as k,g as m,a as g,i as e}from"./BM76a5Lt.js";import{_ as v}from"./B3qxZM1F.js";import{u,q as x}from"./DBbaiKzn.js";import"./CO0skUns.js";import"./CP6C_v49.js";import"./CH5mcEsD.js";import"./BNUbU7l5.js";const P={props:{paginatedItems:{type:Array,default:()=>[]},nextPage:{type:Boolean,default:!1},pageNo:{type:Number,default:0},allItems:{type:Array,default:()=>[]}},computed:{prevLink(){return this.pageNo===1?"/blog/1":`/blog/${this.pageNo-1}`}}},A={class:"mx-auto text-center"};function I(b,a,t,r,l,s){const o=N;return f(),h("div",A,[n(o,{to:s.prevLink,class:d(`
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
        `)},{default:p(()=>[i("  ← ")]),_:1},8,["to","class"]),i("  "),n(o,{to:`/blog/${t.pageNo}`,class:"px-2 py-2 text-lg text-xl text-white shadow rounded-lg mx-1 mt-1 uppercase cursor-pointer pagination text-center"},{default:p(()=>[i(c(t.pageNo),1)]),_:1},8,["to"]),i("  "),n(o,{to:t.nextPage?`/blog/${t.pageNo+1}`:`/blog/${t.pageNo}`,class:d(`
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
        `)},{default:p(()=>[i("  →  ")]),_:1},8,["to","class"])])}const B=$(P,[["render",I],["__scopeId","data-v-30b0b7f2"]]),C={class:"mx-auto max-w-6xl"},V={class:"text-center text-3xl py-8"},q={class:"mb-8"},T={__name:"[number]",async setup(b){let a,t;const r=k(),l=parseInt(r.params.number),{data:s}=([a,t]=m(()=>u("all-articles",()=>x("/").where({draft:{$ne:!0}}).sort({date:-1}).find())),a=await a,t(),a),{data:o}=([a,t]=m(()=>u(r.path,()=>x("/").where({draft:{$ne:!0}}).sort({date:-1}).limit(10).skip(9*(l-1)).find(),"$FAPcPQo7OX")),a=await a,t(),a);return(y,D)=>{const _=B,w=v;return f(),h("div",C,[g("h1",V,c(y.$t("blog.blogPosts"))+" ("+c(e(s).length)+") ",1),g("div",q,[n(_,{"paginated-items":e(o),"all-items":e(s),"page-no":e(l),"next-page":e(o).length===10},null,8,["paginated-items","all-items","page-no","next-page"])]),n(w,{articles:e(o)},null,8,["articles"]),n(_,{"paginated-items":e(o),"all-items":e(s),"page-no":e(l),"next-page":e(o).length===10},null,8,["paginated-items","all-items","page-no","next-page"])])}}};export{T as default};

(window.webpackJsonp=window.webpackJsonp||[]).push([[28,6,7,20,22],{280:function(t,e,n){"use strict";n.r(e);n(182);var r={props:{tag:{type:String,default:""},count:{type:Number,default:null}}},c=n(7),component=Object(c.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nuxt-link",{key:t.tag,attrs:{to:t.localePath("/blog/tags/"+t.tag+"/")}},[n("div",{staticClass:"\n      px-2\n      text-sm\n      shadow\n      rounded-lg\n      bg-white\n      mx-1\n      mt-1\n      uppercase\n      cursor-pointer\n    "},[t._v("\n    "+t._s(t.tag)+" 🏷️\n    "),t.count?n("span",[t._v("("),n("span",{staticClass:"font-bold"},[t._v(t._s(t.count))]),t._v(")")]):t._e()])])}),[],!1,null,"1bdccd32",null);e.default=component.exports},281:function(t,e,n){"use strict";n.r(e);var r={props:{data:{type:Object,default:function(){return[]}}}},c=n(7),component=Object(c.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"pr-4 rounded"},[n("a",{attrs:{href:t.data.link}},[n("img",{staticClass:"rounded",attrs:{src:"/icons/"+t.data.site+".png",alt:t.data.link,width:"25"}})])])}),[],!1,null,"86c576ca",null);e.default=component.exports},282:function(t,e,n){"use strict";n.r(e);var r={props:{tags:{type:Array,default:function(){return[]}}}},c=n(7),component=Object(c.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"flex flex-wrap -ml-1 py-2"},t._l(t.tags,(function(t){return n("tag",{key:t,attrs:{tag:t}})})),1)}),[],!1,null,"21780fb6",null);e.default=component.exports;installComponents(component,{Tag:n(280).default})},283:function(t,e,n){"use strict";n.r(e);var r={props:{external:{type:Array,default:function(){return[]}}}},c=n(7),component=Object(c.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"flex py-2"},t._l(t.external,(function(e,i){return n("external-link",{key:i,attrs:{data:e}},[t._v("\n    "+t._s(e)+"\n  ")])})),1)}),[],!1,null,"23cbc744",null);e.default=component.exports;installComponents(component,{ExternalLink:n(281).default})},325:function(t,e,n){"use strict";n.r(e);var r=n(2),c=(n(32),{asyncData:function(t){return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,c,article;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.$content,r=t.params,c="".concat(r.year,"/").concat(r.month,"/").concat(r.day,"/").concat(r.slug),e.next=4,n(c).fetch();case 4:return article=e.sent,e.abrupt("return",{article:article});case 6:case"end":return e.stop()}}),e)})))()},data:function(){return{showComments:!1}},methods:{formatDate:function(t){return new Date(t).toLocaleDateString("en",{year:"numeric",month:"long",day:"numeric"})}},head:function(){return{title:this.article.title,meta:[{name:"robots",content:this.article.draft?"noindex":"all"},{property:"og:title",content:this.article.title},{property:"og:description",content:this.article.description},{property:"og:image",content:"https://briancaffey.github.io"+this.article.image},{property:"twitter:card",content:"https://briancaffey.github.io"+this.article.image}]}}}),l=n(7),component=Object(l.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("article",[t.article.image?n("img",{staticClass:"h-64 w-full object-cover",attrs:{src:t.article.image}}):t._e(),t._v(" "),n("div",{staticClass:"mx-auto max-w-5xl px-2 sm:px-4 md:px-4 lg:px-16 mt-2"},[n("h1",{staticClass:"prose text-3xl leading-9"},[t._v("\n      "+t._s(t.article.title)+"\n    ")]),t._v(" "),t.article.tags?n("tags",{attrs:{tags:t.article.tags}}):t._e(),t._v(" "),t.article.external?n("external",{attrs:{external:t.article.external}}):t._e(),t._v(" "),n("p",{staticClass:"blog-date text-gray-500 mb-4"},[t._v("\n      "+t._s(t.$t("common.lastUpdated"))+"\n      "+t._s(t._f("formatDate")(t.article.date,t.$i18n.locale))+"\n    ")]),t._v(" "),t.article.draft?n("div",{staticClass:"p-4 my-4 bg-red-300 rounded"},[t._m(0)]):t._e(),t._v(" "),n("nuxt-content",{staticClass:"markdown",attrs:{document:t.article}}),t._v(" "),n("div",{staticClass:"text-center pb-4 pt-8"},[t.showComments?n("button",{staticClass:"mc-btn rounded py-1 px-2",on:{click:function(e){t.showComments=!1}}},[t._v("\n        Hide Comments\n      ")]):n("button",{staticClass:"mc-btn rounded py-1 px-2",on:{click:function(e){t.showComments=!0}}},[t._v("\n        Show Disqus Comments 💬\n      ")])]),t._v(" "),!0===t.article.comments&&t.showComments?n("disqus",{key:t.$colorMode.preference,attrs:{shortname:"briancaffey",identifier:t.article.disqus_id||t.article.slug}}):t._e(),t._v(" "),n("h1")],1)])}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[n("strong",[t._v("\n          ⚠️ This article is a draft and is not yet complete. ⚠️\n        ")])])}],!1,null,null,null);e.default=component.exports;installComponents(component,{Tags:n(282).default,External:n(283).default})}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[34,3,4,8,9,23,25],{282:function(t,e,n){var content=n(284);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(24).default)("23961490",content,!0,{sourceMap:!1})},283:function(t,e,n){"use strict";n(282)},284:function(t,e,n){var r=n(23)(!1);r.push([t.i,".tag[data-v-d8ade784]{background-color:var(--color-primary);transition:transform .2s}.tag[data-v-d8ade784]:hover{transform:scale(1.05)}",""]),t.exports=r},285:function(t,e,n){"use strict";n.r(e);n(182);var r={props:{tag:{type:String,default:""},count:{type:Number,default:null}}},l=(n(283),n(6)),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nuxt-link",{key:t.tag,attrs:{to:t.localePath("/blog/tags/"+t.tag+"/")}},[n("div",{staticClass:"\n      px-2\n      text-lg\n      text-white\n      shadow\n      rounded-lg\n      bg-black\n      mx-1\n      mb-1\n      uppercase\n      cursor-pointer\n      tag\n    "},[t._v("\n    "+t._s(t.tag)+" 🏷️\n    "),t.count?n("span",[t._v("("),n("span",{staticClass:"font-bold"},[t._v(t._s(t.count))]),t._v(")")]):t._e()])])}),[],!1,null,"d8ade784",null);e.default=component.exports},286:function(t,e,n){"use strict";n.r(e);var r={props:{data:{type:Object,default:function(){return[]}}}},l=n(6),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"pr-4 rounded"},[n("a",{attrs:{href:t.data.link}},[n("img",{staticClass:"rounded",attrs:{src:"/icons/"+t.data.site+".png",alt:t.data.link,width:"25"}})])])}),[],!1,null,"86c576ca",null);e.default=component.exports},287:function(t,e,n){"use strict";n.r(e);var r={props:{tags:{type:Array,default:function(){return[]}}}},l=n(6),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"flex flex-wrap -ml-1 py-2"},t._l(t.tags,(function(t){return n("tag",{key:t,attrs:{tag:t}})})),1)}),[],!1,null,"21780fb6",null);e.default=component.exports;installComponents(component,{Tag:n(285).default})},288:function(t,e,n){"use strict";n.r(e);var r={props:{external:{type:Array,default:function(){return[]}}}},l=n(6),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"flex py-2"},t._l(t.external,(function(e,i){return n("external-link",{key:i,attrs:{data:e}},[t._v("\n    "+t._s(e)+"\n  ")])})),1)}),[],!1,null,"23cbc744",null);e.default=component.exports;installComponents(component,{ExternalLink:n(286).default})},289:function(t,e,n){"use strict";n.r(e);var r={props:{article:{type:Object,default:function(){}}}},l=n(6),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"rounded-lg article-card"},[n("nuxt-link",{attrs:{to:t.localePath(t.article.path)}},[n("div",[t.article.image?n("img",{staticClass:"h-32 w-full object-cover rounded-t-lg",attrs:{src:t.article.image}}):t._e()]),t._v(" "),n("div",{staticClass:"py-4 px-4 sm:px-4"},[n("p",{staticClass:"text-2xl leading-8 pb-2"},[t._v("\n        "+t._s(t.article.title)+"\n      ")]),t._v(" "),n("p",{staticClass:"blog-card-description"},[t._v("\n        "+t._s(t.article.description)+"\n      ")])])]),t._v(" "),n("div",{staticClass:"px-4"},[t.article.tags?n("tags",{attrs:{tags:t.article.tags}}):t._e()],1),t._v(" "),n("div",{staticClass:"px-4"},[t.article.external?n("external",{attrs:{external:t.article.external}}):t._e()],1),t._v(" "),n("div",{staticClass:"blog-date mb-4 px-4 pb-4"},[n("p",[t._v("\n      "+t._s(t.$t("common.lastUpdated"))+"\n      "+t._s(t._f("formatDate")(t.article.date,t.$i18n.locale))+"\n    ")])])],1)}),[],!1,null,"383a8a1f",null);e.default=component.exports;installComponents(component,{Tags:n(287).default,External:n(288).default})},290:function(t,e,n){"use strict";n.r(e);var r={props:{articles:{type:Array,default:function(){return[]}}}},l=n(6),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"lg:px-32 px-2 sm:px-4"},[n("ul",{staticClass:"grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8"},t._l(t.articles,(function(article){return n("blog-card",{key:article.slug,attrs:{article:article}})})),1)])}),[],!1,null,"8b6a8434",null);e.default=component.exports;installComponents(component,{BlogCard:n(289).default})},334:function(t,e,n){"use strict";n.r(e);var r=n(2),l=(n(32),n(14),n(70),{asyncData:function(t){return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,l;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.$content,t.params,e.next=3,n({deep:!0}).only(["title"]).where({draft:{$ne:!0},layout:{$eq:"post"}}).sortBy("date","desc").fetch();case 3:return r=e.sent,e.next=6,n({deep:!0}).only(["title","description","image","slug","author","date","path","tags","external"]).where({draft:{$ne:!0}}).sortBy("date","desc").fetch();case 6:return l=(l=e.sent).filter((function(t){return!t.path.startsWith("/projects/")})),e.abrupt("return",{articles:l,allArticles:r});case 9:case"end":return e.stop()}}),e)})))()},head:function(){return{title:"Brian Caffey's Blog"}}}),c=n(6),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"mx-auto max-w-6xl"},[n("h1",{staticClass:"text-center text-3xl py-8"},[t._v("\n    "+t._s(t.$t("blog.blogPosts"))+" ("+t._s(t.articles.length)+")\n  ")]),t._v(" "),n("blog-list",{attrs:{articles:t.articles}})],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{BlogList:n(290).default})}}]);
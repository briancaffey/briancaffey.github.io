(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{260:function(t,e,r){"use strict";r.r(e);r(165);var n={props:{tag:{type:String,default:""},count:{type:Number,default:null}}},l=r(7),component=Object(l.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("nuxt-link",{key:t.tag,attrs:{to:t.localePath("/blog/tags/"+t.tag+"/")}},[r("div",{staticClass:"px-2 text-sm shadow rounded-lg bg-white mx-1 mt-1 uppercase cursor-pointer"},[t._v("\n    "+t._s(t.tag)+" 🏷️\n    "),t.count?r("span",[t._v("("),r("span",{staticClass:"font-bold"},[t._v(t._s(t.count))]),t._v(")")]):t._e()])])}),[],!1,null,"2b5535c8",null);e.default=component.exports},261:function(t,e,r){"use strict";r.r(e);var n={props:{tags:{type:Array,default:function(){return[]}}}},l=r(7),component=Object(l.a)(n,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flex flex-wrap -ml-1 py-2"},this._l(this.tags,(function(t){return e("tag",{key:t,attrs:{tag:t}})})),1)}),[],!1,null,"1f8089c5",null);e.default=component.exports;installComponents(component,{Tag:r(260).default})},262:function(t,e,r){"use strict";r.r(e);var n={props:{external:{type:Array,default:function(){return[]}}}},l=r(7),component=Object(l.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"flex py-2"},t._l(t.external,(function(e,i){return r("external-link",{key:i,attrs:{data:e}},[t._v(t._s(e))])})),1)}),[],!1,null,"03ec8f2e",null);e.default=component.exports;installComponents(component,{ExternalLink:r(263).default})},263:function(t,e,r){"use strict";r.r(e);var n={props:{data:{type:Object,default:function(){return[]}}}},l=r(7),component=Object(l.a)(n,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"pr-4 rounded"},[e("a",{attrs:{href:this.data.link}},[e("img",{staticClass:"rounded",attrs:{src:"/icons/"+this.data.site+".png",alt:this.data.link,width:"25"}})])])}),[],!1,null,"803c5da4",null);e.default=component.exports},264:function(t,e,r){"use strict";r.r(e);var n={props:{article:{type:Object,default:function(){}}}},l=r(7),component=Object(l.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("li",{staticClass:"rounded article-card"},[r("nuxt-link",{attrs:{to:t.localePath(t.article.path)}},[r("div",[t.article.image?r("img",{staticClass:"h-32 w-full object-cover rounded-t",attrs:{src:t.article.image}}):t._e()]),t._v(" "),r("div",{staticClass:"pt-4 px-4 sm:px-4"},[r("p",{staticClass:"text-2xl leading-8"},[t._v(t._s(t.article.title))]),t._v(" "),r("p",{staticClass:"blog-card-description"},[t._v(t._s(t.article.description))])])]),t._v(" "),r("div",{staticClass:"px-4"},[t.article.tags?r("tags",{attrs:{tags:t.article.tags}}):t._e()],1),t._v(" "),r("div",{staticClass:"px-4"},[t.article.external?r("external",{attrs:{external:t.article.external}}):t._e()],1),t._v(" "),r("div",{staticClass:"blog-date mb-4 px-4 pb-4"},[r("p",[t._v("\n      "+t._s(t.$t("common.lastUpdated"))+"\n      "+t._s(t._f("formatDate")(t.article.date,t.$i18n.locale))+"\n    ")])])],1)}),[],!1,null,"3a38beb4",null);e.default=component.exports;installComponents(component,{Tags:r(261).default,External:r(262).default})},266:function(t,e,r){"use strict";r.r(e);r(28),r(13),r(22),r(11),r(6),r(113);var n=r(5);r(165);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function c(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){Object(n.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var o={props:{articles:{type:Array,default:function(){return[]}},limit:{type:Number,default:1/0}},methods:{mergeArrays:function(t){return[].concat.apply([],t)},counter:function(t){return t.reduce((function(t,e){return c(c({},t),{},Object(n.a)({},e,1+(t[e]||0)))}),{})},tagCounts:function(){return Object.entries(this.counter(this.mergeArrays(this.articles.map((function(t){return t.tags}))))).sort((function(a,b){return b[1]-a[1]}))}}},d=r(7),component=Object(d.a)(o,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flex flex-wrap justify-center"},this._l(this.tagCounts().slice(0,this.limit),(function(t){return e("tag",{key:t[0],attrs:{tag:t[0],count:t[1]}})})),1)}),[],!1,null,"2a0b6c2c",null);e.default=component.exports;installComponents(component,{Tag:r(260).default})},289:function(t,e,r){"use strict";r.r(e);r(68),r(21);var n=r(3),l={asyncData:function(t){return Object(n.a)(regeneratorRuntime.mark((function e(){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.$content,t.params,e.next=3,r({deep:!0}).only(["title","description","image","slug","author","date","path","tags","external"]).where({draft:{$ne:!0}}).sortBy("date","desc").fetch();case 3:return n=(n=e.sent).filter((function(t){return!t.path.startsWith("/projects/")})),e.abrupt("return",{articles:n});case 6:case"end":return e.stop()}}),e)})))()},head:function(){return{title:"Brian Caffey"}}},c=r(7),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"mx-auto max-w-6xl"},[r("div",{staticClass:"px-4 lg:px-32"},[r("div",{staticClass:"sm:p-16 text-center py-4"},[r("div",{staticClass:"p-3 rounded border border-white hero"},[t._v("\n        "+t._s(t.$t("home.welcome"))+"\n      ")])]),t._v(" "),r("div",{staticClass:"grid grid-cols-1 md:grid-cols-2 gap-8"},[r("div",[r("h2",{staticClass:"text-2xl pb-4 text-center"},[t._v(t._s(t.$t("home.blogPost")))]),t._v(" "),r("ul",[r("blog-card",{attrs:{article:t.articles[0]}})],1),t._v(" "),r("div",{staticClass:"pt-8 text-center"},[r("nuxt-link",{staticClass:"p-4 m-4 rounded border btn",attrs:{to:t.localePath("blog")}},[t._v(t._s(t.$t("home.allArticles")))])],1)]),t._v(" "),r("div",[r("h2",{staticClass:"text-2xl pb-4 text-center"},[t._v(t._s(t.$t("home.tags")))]),t._v(" "),r("tag-cloud",{attrs:{articles:t.articles,limit:40}}),t._v(" "),r("div",{staticClass:"pt-8 text-center"},[r("nuxt-link",{staticClass:"p-4 m-4 rounded border btn",attrs:{to:t.localePath("/blog/tags/")}},[t._v(t._s(t.$t("home.allTags")))])],1)],1)])])])}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{BlogCard:r(264).default,TagCloud:r(266).default})}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{247:function(t,e,n){"use strict";var r=n(6),c=n(37),o=n(41),l=n(111),f=n(80),m=n(20),d=n(65).f,h=n(82).f,v=n(16).f,_=n(249).trim,x=r.Number,w=x,y=x.prototype,C="Number"==o(n(81)(y)),N="trim"in String.prototype,I=function(t){var e=f(t,!1);if("string"==typeof e&&e.length>2){var n,r,c,o=(e=N?e.trim():_(e,3)).charCodeAt(0);if(43===o||45===o){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===o){switch(e.charCodeAt(1)){case 66:case 98:r=2,c=49;break;case 79:case 111:r=8,c=55;break;default:return+e}for(var code,l=e.slice(2),i=0,m=l.length;i<m;i++)if((code=l.charCodeAt(i))<48||code>c)return NaN;return parseInt(l,r)}}return+e};if(!x(" 0o1")||!x("0b1")||x("+0x1")){x=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof x&&(C?m((function(){y.valueOf.call(n)})):"Number"!=o(n))?l(new w(I(e)),n,x):I(e)};for(var k,E=n(12)?d(w):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),S=0;E.length>S;S++)c(w,k=E[S])&&!c(x,k)&&v(x,k,h(w,k));x.prototype=y,y.constructor=x,n(22)(r,"Number",x)}},248:function(t,e,n){"use strict";n.r(e);n(247);var r={props:{tag:{type:String,default:""},count:{type:Number,default:null}}},c=n(4),component=Object(c.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nuxt-link",{key:t.tag,attrs:{to:t.localePath("/blog/tags/"+t.tag+"/")}},[n("div",{staticClass:"px-2 text-sm shadow rounded-lg bg-white mx-1 mt-1 uppercase cursor-pointer"},[t._v("\n    "+t._s(t.tag)+" 🏷️\n    "),t.count?n("span",[t._v("("),n("span",{staticClass:"font-bold"},[t._v(t._s(t.count))]),t._v(")")]):t._e()])])}),[],!1,null,"2b5535c8",null);e.default=component.exports},249:function(t,e,n){var r=n(9),c=n(42),o=n(20),l=n(250),f="["+l+"]",m=RegExp("^"+f+f+"*"),d=RegExp(f+f+"*$"),h=function(t,e,n){var c={},f=o((function(){return!!l[t]()||"​"!="​"[t]()})),m=c[t]=f?e(v):l[t];n&&(c[n]=m),r(r.P+r.F*f,"String",c)},v=h.trim=function(t,e){return t=String(c(t)),1&e&&(t=t.replace(m,"")),2&e&&(t=t.replace(d,"")),t};t.exports=h},250:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},251:function(t,e,n){"use strict";n.r(e);var r={props:{tags:{type:Array,default:function(){return[]}}}},c=n(4),component=Object(c.a)(r,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flex flex-wrap -ml-1 py-2"},this._l(this.tags,(function(t){return e("tag",{key:t,attrs:{tag:t}})})),1)}),[],!1,null,"1f8089c5",null);e.default=component.exports;installComponents(component,{Tag:n(248).default})},253:function(t,e,n){var content=n(257);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(47).default)("a1962b66",content,!0,{sourceMap:!1})},256:function(t,e,n){"use strict";var r=n(253);n.n(r).a},257:function(t,e,n){(e=n(46)(!1)).push([t.i,"span[data-v-20afb359]{position:absolute;left:50%;transform:translateX(-50%);text-align:center;top:2px}",""]),t.exports=e},275:function(t,e,n){"use strict";n.r(e);var r={props:{utterance:{type:String,default:"hello"}},methods:{speak:function(){var t=window.speechSynthesis,e=t.getVoices();if(t.speaking)t.cancel();else{var n=new SpeechSynthesisUtterance(this.utterance);n.voice=e[8],speechSynthesis.speak(n)}}}},c=(n(256),n(4)),component=Object(c.a)(r,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"fixed bg-white shadow left-0 bottom-0 rounded-full p-4 m-4 cursor-pointer h-4 w-4",on:{click:this.speak}},[e("span",{staticClass:"text-black"},[this._v(" 🗣 ")])])}),[],!1,null,"20afb359",null);e.default=component.exports},286:function(t,e,n){"use strict";n.r(e);n(21);var r=n(3),c={asyncData:function(t){return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,c,article;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.$content,r=t.params,c="".concat(r.year,"/").concat(r.month,"/").concat(r.day,"/").concat(r.slug),e.next=4,n(c).fetch();case 4:return article=e.sent,e.abrupt("return",{article:article});case 6:case"end":return e.stop()}}),e)})))()},data:function(){return{showComments:!1}},methods:{formatDate:function(t){return new Date(t).toLocaleDateString("en",{year:"numeric",month:"long",day:"numeric"})}},head:function(){return{title:this.article.title,meta:[{property:"og:title",content:this.article.title},{property:"og:description",content:this.article.description},{property:"og:image",content:"https://briancaffey.github.io"+this.article.image}]}}},o=n(4),component=Object(o.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("article",[t.article.image?n("img",{staticClass:"h-64 w-full object-cover",attrs:{src:t.article.image}}):t._e(),t._v(" "),n("div",{staticClass:"mx-auto max-w-5xl px-2 sm:px-4 md:px-4 lg:px-16 mt-2"},[n("h1",{staticClass:"prose text-3xl leading-9"},[t._v(t._s(t.article.title))]),t._v(" "),t.article.tags?n("tags",{attrs:{tags:t.article.tags}}):t._e(),t._v(" "),n("p",{staticClass:"text-gray-500 mb-4"},[t._v("\n      "+t._s(t.$t("common.lastUpdated"))+"\n      "+t._s(t._f("formatDate")(t.article.date,t.$i18n.locale))+"\n    ")]),t._v(" "),n("nuxt-content",{staticClass:"markdown",attrs:{document:t.article}}),t._v(" "),n("Narration",{attrs:{utterance:t.article.raw}}),t._v(" "),n("div",{staticClass:"text-center pb-4 pt-8"},[t.showComments?n("button",{staticClass:"mc-btn rounded py-1 px-2",on:{click:function(e){t.showComments=!1}}},[t._v("\n        Hide Comments\n      ")]):n("button",{staticClass:"mc-btn rounded py-1 px-2",on:{click:function(e){t.showComments=!0}}},[t._v("\n        Show Disqus Comments 💬\n      ")])]),t._v(" "),!0===t.article.comments&&t.showComments?n("disqus",{key:t.$colorMode.preference,attrs:{shortname:"briancaffey",identifier:t.article.disqus_id||t.article.slug}}):t._e(),t._v(" "),n("h1")],1)])}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{Tags:n(251).default,Narration:n(275).default})}}]);
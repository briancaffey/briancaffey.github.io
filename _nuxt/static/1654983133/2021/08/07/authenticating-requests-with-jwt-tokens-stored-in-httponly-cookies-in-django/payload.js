__NUXT_JSONP__("/2021/08/07/authenticating-requests-with-jwt-tokens-stored-in-httponly-cookies-in-django", (function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A){return {data:[{article:{slug:"authenticating-requests-with-jwt-tokens-stored-in-httponly-cookies-in-django",description:"This article describes how you can use JWT tokens in Django applications with decoupled frontend JavaScript applications running the browser in secure way using HttpOnly cookies.",title:"Authenticating requests with JWT tokens stored in HTTPOnly cookies in Django",date:"2021-08-01",tags:["django","vue","jwt","authentication"],toc:[{id:m,depth:k,text:n},{id:o,depth:k,text:p},{id:q,depth:k,text:r},{id:s,depth:3,text:t}],body:{type:"root",children:[{type:a,tag:l,props:{id:m},children:[{type:a,tag:e,props:{href:"#tldr",ariaHidden:f,tabIndex:g},children:[{type:a,tag:h,props:{className:[i,j]},children:[]}]},{type:b,value:n}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:b,value:"If you want to use JWTs to securely authenticate requests to Django REST Framework applications in a decoupled frontend JavaScript application, you can do the following: store the access token in memory and store the refresh token  in an HttpOnly cookie. The refresh token is used to request new access tokens on an regular interval."}]},{type:b,value:c},{type:a,tag:l,props:{id:o},children:[{type:a,tag:e,props:{href:"#some-context",ariaHidden:f,tabIndex:g},children:[{type:a,tag:h,props:{className:[i,j]},children:[]}]},{type:b,value:p}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:b,value:"Django is a web framework based on the Model, Template, View (MTV) paradigm. Django is increasingly used as an API server that is coupled with a Javascript or native frontend application."}]},{type:b,value:c},{type:a,tag:l,props:{id:q},children:[{type:a,tag:e,props:{href:"#jwt-auth-with-httponly-cookies",ariaHidden:f,tabIndex:g},children:[{type:a,tag:h,props:{className:[i,j]},children:[]}]},{type:b,value:r}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:b,value:"Following this guide:"}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:a,tag:e,props:{href:u,rel:[v,w,x],target:y},children:[{type:b,value:u}]}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:b,value:"We can reimplement our JWT authentication setup to be more secure."}]},{type:b,value:c},{type:a,tag:"h3",props:{id:s},children:[{type:a,tag:e,props:{href:"#drf-simple-jwt-modifications",ariaHidden:f,tabIndex:g},children:[{type:a,tag:h,props:{className:[i,j]},children:[]}]},{type:b,value:t}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:b,value:"We need to change the default behavior of the views from DRF simple JWT as described in this issue:"}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:a,tag:e,props:{href:z,rel:[v,w,x],target:y},children:[{type:b,value:z}]}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:a,tag:"img",props:{alt:"png",src:"\u002Fstatic\u002Fjwt-authentication.png"},children:[]}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:b,value:"This diagram shows how authentication data moves between the Django backend and the Vue.js frontend running in the browser."}]},{type:b,value:c},{type:a,tag:d,props:{},children:[{type:a,tag:"em",props:{},children:[{type:b,value:"This article should now be complete complete"}]}]}]},dir:"\u002F2021\u002F08\u002F07",path:"\u002F2021\u002F08\u002F07\u002Fauthenticating-requests-with-jwt-tokens-stored-in-httponly-cookies-in-django",extension:".md",createdAt:A,updatedAt:A,raw:"\n## tl;dr\n\nIf you want to use JWTs to securely authenticate requests to Django REST Framework applications in a decoupled frontend JavaScript application, you can do the following: store the access token in memory and store the refresh token  in an HttpOnly cookie. The refresh token is used to request new access tokens on an regular interval.\n\n## Some context\n\nDjango is a web framework based on the Model, Template, View (MTV) paradigm. Django is increasingly used as an API server that is coupled with a Javascript or native frontend application.\n\n## JWT Auth with HttpOnly Cookies\n\nFollowing this guide:\n\nhttps:\u002F\u002Fhasura.io\u002Fblog\u002Fbest-practices-of-using-jwt-with-graphql\u002F#jwt_security\n\nWe can reimplement our JWT authentication setup to be more secure.\n\n### DRF Simple JWT modifications\n\nWe need to change the default behavior of the views from DRF simple JWT as described in this issue:\n\nhttps:\u002F\u002Fgithub.com\u002Fjazzband\u002Fdjangorestframework-simplejwt\u002Fissues\u002F71\n\n\n![png](\u002Fstatic\u002Fjwt-authentication.png)\n\nThis diagram shows how authentication data moves between the Django backend and the Vue.js frontend running in the browser.\n\n*This article should now be complete complete*\n"}}],fetch:{},mutations:[]}}("element","text","\n","p","a","true",-1,"span","icon","icon-link",2,"h2","tldr","tl;dr","some-context","Some context","jwt-auth-with-httponly-cookies","JWT Auth with HttpOnly Cookies","drf-simple-jwt-modifications","DRF Simple JWT modifications","https:\u002F\u002Fhasura.io\u002Fblog\u002Fbest-practices-of-using-jwt-with-graphql\u002F#jwt_security","nofollow","noopener","noreferrer","_blank","https:\u002F\u002Fgithub.com\u002Fjazzband\u002Fdjangorestframework-simplejwt\u002Fissues\u002F71","2022-06-11T21:30:59.141Z")));
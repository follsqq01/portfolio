import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const base='http://localhost:4174';
const password=readFileSync('.dev.vars','utf8').match(/^ADMIN_PASSWORD=(.+)$/m)[1];
let cookie='';
async function request(path,method='GET',body,author=false,origin=base){
 const r=await fetch(base+path,{method,headers:{Origin:origin,'Content-Type':'application/json',...(author?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});
 const text=await r.text(); let data; try {data=JSON.parse(text);} catch {data={error:text};}
 return {r,data};
}
const {data:initial}=await request('/api/archive');
assert(initial.items.length>0);
assert.equal((await request('/api/archive','POST',{},false)).r.status,401);
assert.equal((await request('/api/archive/session','POST',{password:'incorrect-test-password'})).r.status,401);
const login=await request('/api/archive/session','POST',{password});
assert.equal(login.r.status,200); cookie=login.r.headers.get('set-cookie').split(';')[0];
assert.equal((await request('/api/archive/session','GET',undefined,true)).data.isAdmin,true);
assert.equal((await request('/api/archive','POST',{},true,'https://other.example')).r.status,403);
const payload={titleRu:'TEST archive persistence',categoryId:'objects',revision:initial.revision,image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL9sAAAAASUVORK5CYII='};
const created=await request('/api/archive','POST',payload,true);
assert.equal(created.r.status,200,JSON.stringify(created.data));
const item=created.data.items[0];
try {
 assert.equal((await fetch(base+item.image)).status,200);
 assert.equal((await request('/api/archive')).data.items[0].id,item.id);
 assert.equal((await request('/api/archive','PATCH',{id:item.id,titleRu:'stale',revision:initial.revision},true)).r.status,409);
 const edited=await request('/api/archive','PATCH',{id:item.id,titleRu:'TEST edited',categoryId:'books',noteRu:'Saved for everyone',revision:created.data.revision},true);
 assert.equal(edited.r.status,200,JSON.stringify(edited.data));
 const visitor=(await request('/api/archive')).data;
 assert.equal(visitor.items[0].title.ru,'TEST edited');
 assert.equal(visitor.items[0].image,item.image);
 assert.equal(visitor.items[0].categoryId,'books');
} finally {
 const latest=(await request('/api/archive')).data;
 const deleted=await request('/api/archive','DELETE',{id:item.id,revision:latest.revision},true);
 assert.equal(deleted.r.status,200);
 assert.deepEqual(deleted.data.items,initial.items);
}
assert.equal((await request('/api/archive/session','DELETE',undefined,true)).r.status,200);
console.log('PASS: login, invalid login, unauthorized writes, origin protection, upload, shared reads, editing, revision conflict, delete and logout. Original cards preserved.');

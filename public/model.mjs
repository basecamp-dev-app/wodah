// Wodah screening v1. All coordinates and areas are EPSG:27700 metres.
export function inside([x,y],poly){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){let [xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)hit=!hit}return hit}
export function lineDistance(p,line){let best=Infinity;for(let i=1;i<line.length;i++){const a=line[i-1],b=line[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));best=Math.min(best,Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy))}return best}
export function candidatesAlong(line,spacing){if(!Number.isFinite(spacing)||spacing<10)throw Error('Sampling interval must be at least 10 m.');let length=0;const segments=[];for(let i=1;i<line.length;i++){let d=Math.hypot(line[i][0]-line[i-1][0],line[i][1]-line[i-1][1]);if(d>0){segments.push({a:line[i-1],b:line[i],start:length,length:d});length+=d}}if(length<10)throw Error('Draw a stretch at least 10 m long.');if(Math.floor(length/spacing)+1>40)throw Error('At most 40 candidates. Increase the sampling interval or shorten the stretch.');const out=[];for(let d=0;d<=length;d+=spacing){let s=segments.find(s=>d<=s.start+s.length)||segments.at(-1),t=(d-s.start)/s.length;out.push({id:`G${String(out.length+1).padStart(2,'0')}`,chainage:d,point:[s.a[0]+t*(s.b[0]-s.a[0]),s.a[1]+t*(s.b[1]-s.a[1])],direction:[(s.b[0]-s.a[0])/s.length,(s.b[1]-s.a[1])/s.length]})}return out}
export function connected(grid,seed,level,{mask=false}={}){
 const {width:w,height:h,z,domain,offChannel,resolution:r=1}=grid,n=w*h;
 const seen=new Uint8Array(n),queue=new Int32Array(n),escape=[],parents=mask?new Int32Array(n).fill(-1):null;let routeTarget=-1;let head=0,tail=0,area=0,extraArea=0,geometric=0,studyEdge=false,nodata=false,openEdge=false;
 if(seed<0||seed>=n||!domain[seed]||!Number.isFinite(z[seed]))return {area:0,extraArea:0,geometric:null,studyEdge:false,nodata:true,openEdge:false,escape,mask:mask?seen:undefined};
 if(z[seed]<=level){seen[seed]=1;queue[tail++]=seed}
 while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);area+=r*r;if(offChannel?.[i])extraArea+=r*r;geometric+=(level-z[i])*r*r;
  if(x===0||x===w-1||y===0||y===h-1){openEdge=true;if(routeTarget<0)routeTarget=i;if(escape.length<24&&(escape.length===0||head%13===0))escape.push(i)}
  for(const j of [x>0?i-1:-1,x<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1]){if(j<0)continue;if(!domain[j]){studyEdge=true;if(routeTarget<0)routeTarget=i;if(escape.length<24)escape.push(i);continue}if(!Number.isFinite(z[j])){nodata=true;if(routeTarget<0)routeTarget=i;continue}if(!seen[j]&&z[j]<=level){seen[j]=1;if(parents)parents[j]=i;queue[tail++]=j}}
 }
 let route=[];if(parents&&routeTarget>=0){let i=routeTarget;while(i>=0){route.push(i);i=parents[i]}route.reverse()}
 return {area,extraArea,route,geometric:studyEdge||nodata||openEdge?null:geometric,studyEdge,nodata,openEdge,escape,mask:mask?seen:undefined};
}
export function rank(results,index,error){
 const scenarios=[-error,0,error];
 const ranks=scenarios.map(e=>{const order=results.filter(x=>!x.unavailable).map(x=>({id:x.id,value:x.curves.find(c=>c.error===e)?.levels[index].extraArea??0})).sort((a,b)=>b.value-a.value||a.id.localeCompare(b.id));return Object.fromEntries(order.map(x=>[x.id,1+order.filter(y=>y.value>x.value).length]))});
 return results.map(x=>{const values=scenarios.map(e=>x.curves?.find(c=>c.error===e)?.levels[index].extraArea??0),rs=ranks.map(r=>r[x.id]);return {...x,robustArea:Math.min(...values),areaRange:[Math.min(...values),Math.max(...values)],rankRange:[Math.min(...rs),Math.max(...rs)],nominalRank:rs[1]}}).sort((a,b)=>!!a.unavailable-!!b.unavailable||b.robustArea-a.robustArea||a.id.localeCompare(b.id)).map((x,i,arr)=>({...x,rank:x.unavailable?null:1+arr.filter(y=>!y.unavailable&&y.robustArea>x.robustArea).length}));
}
export const increments=[.25,.5,.75,1,1.5,2];

import {test} from 'node:test';import assert from 'node:assert/strict';
import {connected,candidatesAlong,samplingPlan,maxCandidates,rank} from '../public/model.mjs';
import {osgbProject,osgbUnproject,toBNG,toLatLng} from '../public/projection.mjs';
const grid=(rows)=>({width:rows[0].length,height:rows.length,z:Float32Array.from(rows.flat()),domain:new Uint8Array(rows.flat().length).fill(1),offChannel:new Uint8Array(rows.flat().length).fill(1),resolution:1});
test('known basin: 9 cells at 1m depth, 9m³ geometric void',()=>{let g=grid([[9,9,9,9,9],[9,1,1,1,9],[9,1,1,1,9],[9,1,1,1,9],[9,9,9,9,9]]);const r=connected(g,12,2);assert.equal(r.area,9);assert.equal(r.geometric,9);assert.equal(r.openEdge,false)});
test('disconnected depression excluded, intervening wall respected',()=>{const g=grid([[9,9,9,9,9],[9,0,9,0,9],[9,9,9,9,9]]);assert.equal(connected(g,6,1).area,1)});
test('open escape route invalidates geometric containment',()=>{const g=grid([[9,0,9],[9,0,9],[9,0,9]]);const r=connected(g,4,1);assert.equal(r.openEdge,true);assert.equal(r.geometric,null)});
test('nodata adjacency and study truncation suppress geometry',()=>{const g=grid([[9,9,9],[NaN,0,9],[9,9,9]]);assert.equal(connected(g,4,1).nodata,true);g.z[3]=0;g.domain[3]=0;let r=connected(g,4,1);assert.equal(r.studyEdge,true);assert.equal(r.geometric,null)});
test('area increases monotonically with unchanged seed and domain',()=>{const g=grid([[9,9,9,9],[9,0,1,9],[9,2,3,9],[9,9,9,9]]);let last=0;for(let level=0;level<10;level+=.25){let a=connected(g,5,level).area;assert.ok(a>=last);last=a}});
test('OS published projection example and datum round trip',()=>{const [E,N]=osgbProject(52.657570301933,1.717921580645);assert.ok(Math.abs(E-651409.903)<.02);assert.ok(Math.abs(N-313177.270)<.02);const ll=osgbUnproject(E,N);assert.ok(Math.abs(ll[0]-52.657570301933)<1e-7);for(const p of [[275000,50000],[280000,55000],[277500,52500]]){let q=toBNG(...toLatLng(...p));assert.ok(Math.hypot(q[0]-p[0],q[1]-p[1])<.02)}});
test('candidate distances and bounds; no guessed endpoints',()=>{assert.equal(candidatesAlong([[0,0],[100,0]],25).length,5);assert.deepEqual(candidatesAlong([[0,0],[100,0]],25)[2].point,[50,0]);assert.equal(samplingPlan([[0,0],[975,0]],25).adjusted,false);assert.equal(candidatesAlong([[0,0],[975,0]],25).length,40)});
test('long stretches automatically use a wider interval without changing geometry',()=>{
 const line=[[0,0],[600,0],[600,400]],original=structuredClone(line),plan=samplingPlan(line,25),candidates=candidatesAlong(line,25);
 assert.equal(plan.requestedCount,41);assert.equal(plan.adjusted,true);assert.equal(plan.spacing,30);assert.equal(candidates.length,34);assert.equal(candidates.length,plan.count);
 assert.deepEqual(candidates[20].point,[600,0]);assert.deepEqual(candidates.at(-1).point,[600,390]);assert.equal(candidates.at(-1).chainage,990);assert.deepEqual(line,original);
});
test('sampling stays bounded for long lines, exact limits and fractional intervals',()=>{
 for(const length of [10,975,1000,1014,20000,1400000])for(const spacing of [10,25,25.1,500,1000]){const line=[[0,0],[length,0]],plan=samplingPlan(line,spacing),candidates=candidatesAlong(line,spacing);assert.ok(candidates.length<=maxCandidates);assert.equal(candidates.length,plan.count);assert.ok(plan.spacing>=spacing);assert.ok(candidates.at(-1).chainage<=length);assert.ok(length-candidates.at(-1).chainage<plan.spacing);assert.equal(samplingPlan(line,plan.spacing).adjusted,false)}
 assert.ok(samplingPlan([[0,0],[20000,0]],10).spacing>500);
 assert.throws(()=>candidatesAlong([[0,0],[9,0]],25),/at least 10 m long/);
 for(const spacing of [0,9,NaN,Infinity])assert.throws(()=>samplingPlan([[0,0],[100,0]],spacing),/interval must be at least 10/);
});
test('ranking uses weakest area; shows assumption rank changes and ties',()=>{const r=(id,areas)=>({id,curves:[-0.25,0,.25].map((error,i)=>({error,levels:[{extraArea:areas[i]}]}))});let rows=rank([r('A',[10,100,200]),r('B',[50,80,90])],0,.25);assert.equal(rows[0].id,'B');assert.equal(rows[0].robustArea,50);assert.deepEqual(rows[0].rankRange,[1,2])});

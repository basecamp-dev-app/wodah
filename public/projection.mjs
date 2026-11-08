// Airy 1830 transverse Mercator + EPSG OSGB36/WGS84 seven-parameter Helmert.
// Map display only: ~3–5 m datum uncertainty without OSTN15. No vertical transform.
const rad=Math.PI/180, a=6377563.396,b=6356256.909,F=.9996012717,e2=1-b*b/(a*a),n=(a-b)/(a+b),lat0=49*rad,lon0=-2*rad;
function meridian(p){return b*F*((1+n+5*n*n/4+5*n**3/4)*(p-lat0)-(3*n+3*n*n+21*n**3/8)*Math.sin(p-lat0)*Math.cos(p+lat0)+(15*n*n/8+15*n**3/8)*Math.sin(2*(p-lat0))*Math.cos(2*(p+lat0))-35*n**3/24*Math.sin(3*(p-lat0))*Math.cos(3*(p+lat0)))}
export function osgbProject(lat,lon){let p=lat*rad,l=lon*rad-lon0,s=Math.sin(p),c=Math.cos(p),t=Math.tan(p),v=a*F/Math.sqrt(1-e2*s*s),rho=a*F*(1-e2)/(1-e2*s*s)**1.5,eta=v/rho-1;
return [400000+v*c*l+v/6*c**3*(v/rho-t*t)*l**3+v/120*c**5*(5-18*t*t+t**4+14*eta-58*t*t*eta)*l**5,-100000+meridian(p)+v/2*s*c*l*l+v/24*s*c**3*(5-t*t+9*eta)*l**4+v/720*s*c**5*(61-58*t*t+t**4)*l**6]}
export function osgbUnproject(E,N){let p=lat0,M=0;for(let i=0;i<10;i++){p+=(N+100000-M)/(a*F);M=meridian(p);if(Math.abs(N+100000-M)<1e-8)break}let s=Math.sin(p),c=Math.cos(p),t=Math.tan(p),v=a*F/Math.sqrt(1-e2*s*s),rho=a*F*(1-e2)/(1-e2*s*s)**1.5,eta=v/rho-1,d=E-400000;
return [(p-t/(2*rho*v)*d*d+t/(24*rho*v**3)*(5+3*t*t+eta-9*t*t*eta)*d**4-t/(720*rho*v**5)*(61+90*t*t+45*t**4)*d**6)/rad,(lon0+d/(c*v)-(v/rho+2*t*t)/(6*c*v**3)*d**3+(5+28*t*t+24*t**4)/(120*c*v**5)*d**5-(61+662*t*t+1320*t**4+720*t**6)/(5040*c*v**7)*d**7)/rad]}
function cart(lat,lon,A,B){let p=lat*rad,l=lon*rad,e=1-B*B/(A*A),v=A/Math.sqrt(1-e*Math.sin(p)**2);return [v*Math.cos(p)*Math.cos(l),v*Math.cos(p)*Math.sin(l),v*(1-e)*Math.sin(p)]}
function geo(x,y,z,A,B){let e=1-B*B/(A*A),h=Math.hypot(x,y),p=Math.atan2(z,h*(1-e));for(let i=0;i<12;i++){let v=A/Math.sqrt(1-e*Math.sin(p)**2);p=Math.atan2(z+e*v*Math.sin(p),h)}return [p/rad,Math.atan2(y,x)/rad]}
function helmert([x,y,z],inverse=false){const k=inverse?-1:1,rx=k*.1502*rad/3600,ry=k*.247*rad/3600,rz=k*.8421*rad/3600,s=1-k*20.4894e-6;return [k*446.448+x*s-y*rz+z*ry,-k*125.157+x*rz+y*s-z*rx,k*542.06-x*ry+y*rx+z*s]}
export function toLatLng(E,N){let [p,l]=osgbUnproject(E,N);return geo(...helmert(cart(p,l,a,b)),6378137,6356752.3141)}
export function toBNG(lat,lon){let [p,l]=geo(...helmert(cart(lat,lon,6378137,6356752.3141),true),a,b);return osgbProject(p,l)}

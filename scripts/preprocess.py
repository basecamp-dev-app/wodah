#!/usr/bin/env python3
"""Read-only source preparation. Requires Pillow and numpy. No reprojection or gap filling.
1m cells encoded as unsigned centimetres in R/G PNG channels; 65535 = nodata.
Display overview averages valid 5x5 blocks; analysis always loads native 1m tiles.
"""
import argparse, hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('--out',default='public/terrain');args=p.parse_args()
source=Path(args.source);out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
im=Image.open(source);tags=im.tag_v2
assert im.size==(5000,5000) and im.mode=='F', 'Unexpected dimensions/type: review preprocessor'
assert tags[33550][:2]==(1.,1.) and tags[33922][3:5]==(275000.,55000.),'Unexpected geotransform'
keys=tags[34735];assert any(keys[i]==3072 and keys[i+3]==27700 for i in range(4,len(keys),4)), 'Expected EPSG:27700'
z=np.array(im,dtype=np.float32);valid=np.isfinite(z)&(z!=float(tags[42113]))
assert np.all((z[valid]>=0)&(z[valid]<655.34)), 'Encoding range exceeded'
def encode(arr,path):
    ok=np.isfinite(arr);q=np.where(ok,np.rint(arr*100),65535).astype(np.uint16)
    rgb=np.zeros((*q.shape,3),dtype=np.uint8);rgb[:,:,0]=q>>8;rgb[:,:,1]=q&255
    Image.fromarray(rgb).save(path,optimize=True)
z[~valid]=np.nan
for row in range(10):
    for col in range(10): encode(z[row*500:(row+1)*500,col*500:(col+1)*500],out/f'{col}-{row}.png')
with np.errstate(invalid='ignore'): overview=np.nanmean(z.reshape(1000,5,1000,5),axis=(1,3))
encode(overview,out/'overview.png')
meta={'schema':1,'source':'washwalk.tif','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'width':5000,'height':5000,'bands':1,'dtype':'float32','crs':'EPSG:27700','west':275000,'east':280000,'south':50000,'north':55000,'resolution':1,'tileSize':500,'overviewResolution':5,'min':float(np.nanmin(z)),'max':float(np.nanmax(z)),'nodataCells':int((~valid).sum()),'encoding':'PNG R*256+G, centimetres; 65535 nodata; maximum quantization error 0.005 m','terrainType':'unknown','surveyDate':None,'verticalDatum':None,'horizontalDisplayTransform':'OSGB36/WGS84 7-parameter Helmert; ~3–5 m, not OSTN15','embeddedMetadata':{str(k):str(v) for k,v in tags.items() if k not in [324,325]}}
(out/'metadata.json').write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps({k:v for k,v in meta.items() if k!='embeddedMetadata'},indent=2))

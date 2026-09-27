"""Build the portfolio's original development sample from its editable JSON."""
import json, math, re
from pathlib import Path
from xml.sax.saxutils import escape
from fontTools.ttLib import TTFont as FontToolsFont
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'content/development-sample.json').read_text())
OUT=ROOT/'public/downloads/Prantik-Dutta-Development-Sample.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
TMP=ROOT/'tmp/pdfs';TMP.mkdir(parents=True,exist_ok=True)
for name,file in [('Display','display.woff2'),('Ornate','ornate.woff'),('Mono','mono.woff2')]:
    font=FontToolsFont(ROOT/'public/fonts'/file);font.flavor=None;dst=TMP/(name+'.ttf');font.save(dst)
    pdfmetrics.registerFont(TTFont(name,str(dst)))
W,H=720,960;M=48;CW=W-M*2
PALETTES=[('#101c24','#e8e7d9','#d4e793'),('#eee9db','#182c2c','#a83226'),('#d7e3df','#182e32','#215d87'),('#17211c','#e9ebd9','#c9e290')]
c=canvas.Canvas(str(OUT),pagesize=(W,H));c.setTitle('Why does this shot look fake? | Prantik Dutta | Original development sample');c.setAuthor('Prantik Dutta');c.setSubject('Original concept: research, direction, shoot planning, AI/VFX and team workflow. Proposed production, not completed client work.')
page=0
def plain(s):
    return s.replace('—','-').replace('–','-').replace('‑','-').replace('→',' > ').replace('·',' / ').replace('’',"'")
def color(s):return colors.HexColor(s)
def paragraph(text,x,y,width,font='Helvetica',size=10.8,leading=16,ink=None):
    style=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading,textColor=color(ink or FG),spaceAfter=0)
    p=Paragraph(escape(plain(text)),style);_,height=p.wrap(width,H);p.drawOn(c,x,y-height);return y-height
def base(index,section):
    global BG,FG,ACC,page
    page+=1;BG,FG,ACC=PALETTES[index%len(PALETTES)]
    c.setFillColor(color(BG));c.rect(0,0,W,H,fill=1,stroke=0)
    c.setStrokeColor(color(ACC));c.setLineWidth(.7);c.line(M,H-50,W-M,H-50)
    c.setFillColor(color(FG));c.setFont('Mono',8);c.drawString(M,H-34,'PRANTIK DUTTA / PROJECT DEVELOPMENT');c.drawRightString(W-M,H-34,'SEPTEMBER 2026')
    c.setFont('Mono',7.4);c.drawString(M,31,'ORIGINAL CONCEPT / PROPOSED PRODUCTION');c.drawRightString(W-M,31,f'{page:02d} / 11')
    c.setStrokeColor(color(ACC));c.line(M,50,W-M,50)
    for x,y,sx,sy in [(24,H-24,1,-1),(W-24,H-24,-1,-1),(24,24,1,1),(W-24,24,-1,1)]:
        c.line(x,y,x+8*sx,y);c.line(x,y,x,y+8*sy)
def panel(x,y,w,h,label,kind):
    c.setStrokeColor(color(ACC));c.setFillColor(color(BG));c.setLineWidth(.6);c.rect(x,y,w,h,fill=1,stroke=1)
    c.setFillColor(color(FG));c.setFont('Mono',7);c.drawString(x+9,y+h-15,label)
    cx=x+w*.53;cy=y+h*.5
    # Blocking sketches, not proposed finished frames.
    c.setStrokeColor(color(FG));c.setLineWidth(1)
    if kind in (0,1,3):
        r=15 if kind!=1 else 24;c.circle(cx,cy+16,r,fill=0);c.line(cx,cy+1,cx,cy-23);c.line(cx,cy-5,cx-24,cy-20);c.line(cx,cy-5,cx+28,cy-15)
        c.line(x+14,cy-20,x+w-14,cy-20)
        c.rect(cx+21,cy-20,11,18,stroke=1,fill=0)
        if kind==3:
            c.setDash(3,3);c.line(x+12,y+16,cx-14,cy+10);c.setDash();c.rect(x+8,y+10,18,12,stroke=1,fill=0)
    elif kind==2:
        c.line(x+12,cy-16,x+w-12,cy-16);c.rect(cx,cy-16,22,33,stroke=1,fill=0)
        c.line(cx-40,cy+28,cx-2,cy+8);c.line(cx-2,cy+8,cx+6,cy+2);c.line(cx+6,cy+2,cx+10,cy+13)
        c.setDash(2,2);c.ellipse(cx-9,cy-20,cx+38,cy-11,stroke=1,fill=0);c.setDash()
    elif kind==4:
        for i in range(3):
            c.setStrokeColor(color(ACC if i!=2 else FG));c.line(cx-35+i*20,cy-20,cx-10+i*20,cy+22)
        c.line(x+15,y+23,x+w-15,y+23)
    else:
        for i in range(3):c.rect(x+17+i*9,y+24+i*9,w-60,h-67,stroke=1,fill=0)
    c.setFillColor(color(ACC));c.setFont('Mono',6.7);c.drawString(x+9,y+8,'BLOCKING / NOT A FINISHED SHOT')
def table(headers,rows,y,size=10.2):
    body=ParagraphStyle('cell',fontName='Helvetica',fontSize=size,leading=size*1.44,textColor=color(FG))
    head=ParagraphStyle('head',fontName='Mono',fontSize=8.2,leading=12,textColor=color(ACC))
    bold=ParagraphStyle('bold',parent=body,fontName='Helvetica-Bold')
    data=[[Paragraph(escape(plain(t)),head) for t in headers]]
    data += [[Paragraph(escape(plain(text)),bold if j==0 else body) for j,text in enumerate(row)] for row in rows]
    t=Table(data,colWidths=[CW*.29,CW*.71]);t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),('LINEBELOW',(0,0),(-1,0),.7,color(ACC)),('LINEBELOW',(0,1),(-1,-1),.3,color(ACC))]))
    _,height=t.wrap(CW,H);t.drawOn(c,M,y-height);return y-height-19

base(0,'cover')
y=H-89;y=paragraph('RESEARCH / DIRECTION / SHOOTING / EDITING / AI / VFX / TEAMS',M,y,CW,'Mono',9,15,ACC)
y=paragraph('Why does this\nshot look fake?'.replace('\n',' '),M,y-35,CW*.91,'Display',78,81)-20
y=paragraph('A working development sample.',M,y,CW,'Ornate',28,35)-17
y=paragraph(DATA['intro'],M,y,CW*.85,size=12,leading=19)-26
c.setFillColor(color(ACC));c.rect(M,y-34,CW,34,fill=1,stroke=0);c.setFillColor(color(BG));c.setFont('Mono',10);c.drawString(M+12,y-22,'4-MINUTE FILM / 3 CUTDOWNS / ONE CONTROLLED SETUP')
pw=(CW-24)/3;ph=139;py=y-204
for i,l in enumerate(['01 / REFERENCE','02 / IDENTITY','03 / CONTACT','04 / PERSPECTIVE','05 / MOTION','06 / COMPOSITE']):panel(M+(i%3)*(pw+12),py-(i//3)*(ph+12),pw,ph,l,i)
c.showPage()
for i,s in enumerate(DATA['sections']):
    base(i+1,s['id']);y=H-79
    y=paragraph(s['kicker'],M,y,CW,'Mono',9,14,ACC)-20
    y=paragraph(s['title'],M,y,CW,'Display',44,48)-15
    y=paragraph(s['lead'],M,y,CW,'Ornate',15,21)-22
    # Compact only long working sheets; never reduce readability below 9.5pt.
    size=9.7 if s['id'] in ('shots','team','treatment','ai-vfx') else 10.4
    if s.get('rows'):y=table(s['headers'],s['rows'],y,size)
    for n,p in enumerate(s['points']):
        c.setFillColor(color(ACC));c.setFont('Mono',7.5);c.drawString(M,y-10,f'{n+1:02d}')
        y=paragraph(p,M+24,y,CW-24,size=size,leading=size*1.47)-14
    if s['id']=='sources':
        y-=6
        for source in DATA['sources']:
            start=y;y=paragraph(f"[{source['id']}] {source['title']}",M,y,CW,'Helvetica-Bold',10,15)-5
            y=paragraph(source['url'],M,y,CW,'Helvetica',8,12,ACC)-16
            c.linkURL(source['url'],(M,y,W-M,start),relative=0,thickness=0)
    if y<68:raise RuntimeError(f"Page {page} overflows: {s['id']} ends at {y:.1f}")
    c.showPage()
c.save();print(str(OUT))

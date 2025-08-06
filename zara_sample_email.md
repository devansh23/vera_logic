Delivered-To: dev.devanshchaudhary@gmail.com
Received: by 2002:a17:504:45cc:b0:1c6f:5847:8d6e with SMTP id u12csp5391njh;
        Thu, 28 Nov 2024 07:36:42 -0800 (PST)
X-Google-Smtp-Source: AGHT+IGER0R5l0q0/Dc7XvJE4yqhH0vE1iHtSx+VtybSBlDjVIVv+JstBAKeA7opvhqvtbF72VJY
X-Received: by 2002:a05:620a:4549:b0:7b6:6a3b:53af with SMTP id af79cd13be357-7b67c271d03mr1147634785a.14.1732808202381;
        Thu, 28 Nov 2024 07:36:42 -0800 (PST)
ARC-Seal: i=1; a=rsa-sha256; t=1732808202; cv=none;
        d=google.com; s=arc-20240605;
        b=H01YAMDJnyHyMHX3tziFwP+cdZN+qV6NxdOlbu0ULzTbjxgWjV8XLlVT9HWCrSHgSI
         jMHFWU8COXgBRl67XlXhedmbsh7iJG0womU1IZRmg3n+yV5V9Y77UCl60U1Y4V5dv4kR
         PV1Wkt7xvGCaTNmzk76Cc5r985lv9XHmy1H3rTQSKVlxocrLE03TUCzX9i49PFOQoBMo
         PO8W+QIwi45cq0amGd33CZd2+pd24VAgweXkkMMs8v0fUsphPhTw0YPx64m/qR8uygDp
         aJc6F92QlU9JS85sgRU8t1Dj2zEz62J8FWi85nocBd0t4N0uuDgDu6QT3V4TOZZbLa3T
         b75Q==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605;
        h=importance:content-transfer-encoding:mime-version:subject:to
         :reply-to:from:date:message-id:dkim-signature;
        bh=IT4uad+vl/nb5AlXdgEqsymx5R1lCc4xcJrs/Jj4MR8=;
        fh=PizyrU77yGWa7GD4HbOPVy0/0BGTTBOChYwsjyyrNnY=;
        b=aPZcfvFablHLoQJSuXAsY2tx+BLsWZs0mVsaS1/JqmFzTU8pPlNreZY7OnhIVNBO+F
         aw2YXvlNDXtxgHvgUvTXKRljlfF9IVT6JwTlpH3oOYbBHeOCX3rjCsH1evffeS9dLKNF
         kFgk/YlR3P/CttsQzb9M8E+wvb+ilBWbRziD1aW6ch2s8OI1Y+Lvyy+MYtDgrcpglZjW
         Y2hKCjcDAuHtJB/T5x/JtTLsbqPKu2cPSfp/rtlYoVwfKKQTO34twd1aF8+ryNbdUgJz
         m14aO+TERS4pG/3gP9XAalC4VbMF7bp81MfS+7ILOeRz0SMTGr8d9llw4CZUWN+hsYdW
         wvPg==;
        dara=google.com
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@zara.com header.s=2023111300 header.b=sVzGLMHQ;
       spf=pass (google.com: domain of noreply@zara.com designates 185.93.143.12 as permitted sender) smtp.mailfrom=noreply@zara.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=zara.com
Return-Path: <noreply@zara.com>
Received: from mailwsout-c389.transactional-mail-a.com (mailwsout-c389.transactional-mail-a.com. [185.93.143.12])
        by mx.google.com with ESMTPS id af79cd13be357-7b6849f778dsi192494885a.671.2024.11.28.07.36.42
        for <dev.devanshchaudhary@gmail.com>
        (version=TLS1_3 cipher=TLS_AES_256_GCM_SHA384 bits=256/256);
        Thu, 28 Nov 2024 07:36:42 -0800 (PST)
Received-SPF: pass (google.com: domain of noreply@zara.com designates 185.93.143.12 as permitted sender) client-ip=185.93.143.12;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@zara.com header.s=2023111300 header.b=sVzGLMHQ;
       spf=pass (google.com: domain of noreply@zara.com designates 185.93.143.12 as permitted sender) smtp.mailfrom=noreply@zara.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=zara.com
Received: from mailwsout19.mailws.fraix1.retloc (localhost [127.0.0.1]) by mailwsout19.transactional-mail-a.com (Postfix) with ESMTP id 4XzgQd1rhKz16ZR for <dev.devanshchaudhary@gmail.com>; Thu, 28 Nov 2024 16:36:41 +0100 (CET)
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/simple; d=zara.com; s=2023111300; t=1732808201; bh=GoKG6qpORhO1v8c932A2jmEC/EiSr7lLM1hHwamxnEs=; h=Date:From:Reply-To:To:Subject; b=sVzGLMHQb2URo87Sz8oVWSwBwCekCMhwj91CViF3Z9oTUzd/zJqVh5brj3rT1dLEA
	 jRN0mTHPQJ/bX0VfHCac0Fa5T5vIq+q5q4A6jboe+y6H20lpFb36dKn53FGq2urwbx
	 3EJ+/qtEb0TjIkstT3PuPJ3irOvii/QSeTtmHal66/K+dZr3F+2RzQRkyhzY1mgda5
	 LY5BzM3J1sDjUGPQGs9tn7rxQBUzuseol/TbtgyTn+msh+0GkH+SmReTJ4+3RDzPUP
	 FfLZ1bb7MBawrfX/2aVy7PiumdUL/9ftzF/leXyzKCYt9etVsEZwvwtuCSRtd+5gbw
	 6eSX4HP5kRy2g==
Message-ID: <20241128-153641.23aaa6a6-3205-4aad-993e-a2b7e940b47e#1565db02#93226d19@retarus.com>
Date: Thu, 28 Nov 2024 15:36:41 +0000 (GMT)
From: Zara <noreply@zara.com>
Reply-To: "'noreply'" <noreply@zara.com>
To: dev.devanshchaudhary@gmail.com
Subject: Thank you for your purchase
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: quoted-printable
X-Mailer: Retarus Mail4A
X-Priority: 3
Importance: normal

<!doctype html><html lang=3D"und" dir=3D"auto" xmlns=3D"http://www.w3.org/1=
999/xhtml" xmlns:v=3D"urn:schemas-microsoft-com:vml" xmlns:o=3D"urn:schemas=
-microsoft-com:office:office" style=3D"direction: ltr;"><head><title>ZARA</=
title><!--[if !mso]><!--><meta http-equiv=3D"X-UA-Compatible" content=3D"IE=
=3Dedge"><!--<![endif]--><meta http-equiv=3D"Content-Type" content=3D"text/=
html; charset=3DUTF-8"><meta name=3D"viewport" content=3D"width=3Ddevice-wi=
dth,initial-scale=3D1"><style type=3D"text/css">#outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size=
-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-r=
space:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decora=
tion:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><!--[if lte mso 11]>
    <style type=3D"text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]--><style type=3D"text/css">@media only screen and (min-width:=
480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }</style><style media=3D"screen and (min-width:480px)">.moz-text-html=
 .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><sty=
le type=3D"text/css">@media only screen and (max-width:479px) {
      table.mj-full-width-mobile { width: 100% !important; }
      td.mj-full-width-mobile { width: auto !important; }
    }</style><style type=3D"text/css">@font-face { font-family: "Neue-Helve=
tica"; font-weight: bold; src: url("https://static.zara.net/photos/contents=
/communication/NeueHelveticaforZara-MdCn.eot#iefix"); /* IE9 Compat Modes *=
/ src: local("?"), url("#https://static.zara.net/photos/contents/communicat=
ion/NeueHelveticaforZara-MdCn.eot?#iefix") format("embedded-opentype"), /* =
IE6-IE8 */ url("https://static.zara.net/photos/contents/communication/NeueH=
elveticaforZara-MdCn.woff2.woff2") format("woff2"), /* Super Modern Browser=
s */ url("https://static.zara.net/photos/contents/communication/NeueHelveti=
caforZara-MdCn.woff") format("woff"), /* Pretty Modern Browsers */ url("htt=
ps://static.zara.net/photos/contents/communication/NeueHelveticaforZara-MdC=
n.ttf") format("truetype"), /* Safari, Android, iOS */ url("https://static.=
zara.net/photos/contents/communication/NeueHelveticaforZara-MdCn.svg#{NeueH=
elveticaforZara-MdCn}") format("svg"); /* Legacy iOS */ } @font-face { font=
-family: "Neue-Helvetica"; src: url("https://static.zara.net/photos/content=
s/communication/NeueHelveticaforZara-LtCn.eot#iefix"); /* IE9 Compat Modes =
*/ src: local("?"), url("#https://static.zara.net/photos/contents/communica=
tion/NeueHelveticaforZara-LtCn.eot?#iefix") format("embedded-opentype"), /*=
 IE6-IE8 */ url("https://static.zara.net/photos/contents/communication/Neue=
HelveticaforZara-LtCn.woff2.woff2") format("woff2"), /* Super Modern Browse=
rs */ url("https://static.zara.net/photos/contents/communication/NeueHelvet=
icaforZara-LtCn.woff") format("woff"), /* Pretty Modern Browsers */ url("ht=
tps://static.zara.net/photos/contents/communication/NeueHelveticaforZara-Lt=
Cn.ttf") format("truetype"), /* Safari, Android, iOS */ url("https://static=
.zara.net/photos/contents/communication/NeueHelveticaforZara-LtCn.svg#{Neue=
HelveticaforZara-LtCn}") format("svg"); /* Legacy iOS */ } td.rd-product-co=
l + td.rd-product-col > table.rd-product { margin-left: auto; } .static-con=
tent { display: none; } .Singleton .static-content, _:-webkit-full-screen, =
_::-webkit-full-page-media, _:future, :root .static-content, [class^=3D"app=
le-mail"] .static-content { display: block; } .dynamic-content { display: b=
lock; } .Singleton .dynamic-content, _:-webkit-full-screen, _::-webkit-full=
-page-media, _:future, :root .dynamic-content, [class^=3D"apple-mail"] .dyn=
amic-content { display: none; } .dynamic-content { -webkit-user-select: non=
e; -moz-user-select: none; user-select: none; } /* hide radio element */ .t=
ab { display:none; height:0px; visibility:hidden; } .tab-content { display:=
none; } .title-tab { background-color: #ffffff; padding: 15px 20px 15px 20p=
x; border-bottom: 0.5px solid #cccccc; cursor: pointer; display: block; tex=
t-align: center; text-transform: uppercase; font-size: 16px; } /* change ta=
b to bold */ .tab:checked + label { font-weight: bold; } /* show content */=
 #tab-simple:checked ~ .content-simple, #tabl-detail:checked ~ .content-det=
ails { display:block; } .rd-unit-absolute { max-height: 0; position: relati=
ve; opacity: 0.999; } .rd-unit-position { margin-top: 135%; padding-left: 4=
px; padding-right: 4px; display: inline-block; text-align: center; backgrou=
nd-color: #FFFFFF; font-size: 10px !important; line-height: 21px !important=
; } .rd-unit-right-absolute { text-align: right; } @media only screen and (=
min-width:430px) { .rd-unit-position { margin-top: 139%; } } @media only sc=
reen and (min-width:480px) { .resell-section-double-button .mj-column-per-5=
0:first-of-type { width: 49% !important; max-width: 50%; margin-right: 4px =
!important; } .resell-section-double-button .mj-column-per-50:last-of-type =
{ width: 49% !important; max-width: 50%; margin-left: 4px !important; } .re=
sell-display-button { display: block !important; } .resell-display-button-m=
obile { display: none; } } @media only screen and (max-width:480px) { .rese=
ll-welcome-icon { display: none; } .resell-welcome-icon-mobile { display: b=
lock !important; } .resell-display-button { display: none; } .resell-displa=
y-button-mobile { display: block !important; } }</style></head><body style=
=3D"direction: ltr; word-spacing: normal;"><div style=3D"direction: ltr;" l=
ang=3D"und" dir=3D"auto">                                 <!--[if mso | IE]=
><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" c=
lass=3D"" role=3D"presentation" style=3D"width:535px;" width=3D"535" ><tr><=
td style=3D"line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><!=
[endif]--><div style=3D"direction: ltr; margin: 0px auto; max-width: 535px;=
"><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" =
role=3D"presentation" style=3D"direction: ltr; width: 100%;" width=3D"100%"=
><tbody style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td style=
=3D"direction: ltr; font-size: 0px; padding: 0 5px; text-align: center;" al=
ign=3D"center"><!--[if mso | IE]><table role=3D"presentation" border=3D"0" =
cellpadding=3D"0" cellspacing=3D"0"><tr><td align=3D"left" class=3D"" style=
=3D"vertical-align:top;width:525px;" ><![endif]--><div class=3D"mj-column-p=
er-100 mj-outlook-group-fix" style=3D"font-size: 0px; text-align: left; dir=
ection: ltr; display: inline-block; vertical-align: top; width: 100%;"><tab=
le border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" w=
idth=3D"100%" style=3D"direction: ltr;"><tbody style=3D"direction: ltr;"><t=
r style=3D"direction: ltr;"><td style=3D"direction: ltr; vertical-align: to=
p; padding: 0;" valign=3D"top"><table border=3D"0" cellpadding=3D"0" cellsp=
acing=3D"0" role=3D"presentation" style=3D"direction: ltr;" width=3D"100%">=
<tbody style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td align=3D=
"center" style=3D"direction: ltr; font-size: 0px; padding: 0; padding-top: =
48px; padding-bottom: 43px; word-break: break-word;"><table border=3D"0" ce=
llpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"direction:=
 ltr; border-collapse: collapse; border-spacing: 0px;"><tbody style=3D"dire=
ction: ltr;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr; wid=
th: 149px;" width=3D"149"><a href=3D"https://www.zara.com/in/en?utm_medium=
=3Demail&utm_source=3Dnotification_com&utm_campaign=3DOrderConfirmation&utm=
_content=3Dlogo" target=3D"_blank" style=3D"direction: ltr;"><img alt src=
=3D"http://static.zara.net/photos/contents/apps/logo_Zara_2019.png" style=
=3D"direction: ltr; border: 0; display: block; outline: none; text-decorati=
on: none; height: auto; width: 100%; font-size: 13px;" width=3D"149" height=
=3D"auto"></a></td></tr></tbody></table></td></tr><tr style=3D"direction: l=
tr;"><td align=3D"center" class=3D"rd-title" style=3D"direction: ltr; font-=
size: 0px; padding: 0; word-break: break-word;"><div style=3D"direction: lt=
r; text-transform: uppercase; font-weight: bold; letter-spacing: 0.7px; fon=
t-family: Neue-Helvetica, Helvetica; text-align: center; color: #000000; fo=
nt-size: 22px; line-height: 28px;">Thank you for your purchase</div></td></=
tr><tr style=3D"direction: ltr;"><td align=3D"center" class=3D"rd-section-t=
itle" style=3D"direction: ltr; font-size: 0px; padding: 0; padding-top: 24p=
x; word-break: break-word;"><div style=3D"direction: ltr; text-transform: u=
ppercase; font-weight: bold; letter-spacing: 0.7px; font-family: Neue-Helve=
tica, Helvetica; text-align: center; color: #000000; font-size: 16px; line-=
height: 24px;">Order No. 53964516340</div></td></tr>    <tr style=3D"direct=
ion: ltr;"><td align=3D"left" class=3D"rd-text-info" style=3D"direction: lt=
r; font-size: 0px; padding: 0; padding-top: 24px; word-break: break-word;">=
<div style=3D"direction: ltr; letter-spacing: 0.3px; font-family: Neue-Helv=
etica, Helvetica; text-align: left; color: #000000; font-size: 14px; line-h=
eight: 18px;"><p style=3D"direction: ltr; margin: 13px 0 0;"></p>     <p st=
yle=3D"direction: ltr; margin: 13px 0 0;">We will send you another email wh=
en it is in transit.</p>    </div></td></tr></tbody></table></td></tr></tbo=
dy></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr>=
</tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]-->  <!-=
-[if mso | IE]><table align=3D"center" border=3D"0" cellpadding=3D"0" cells=
pacing=3D"0" class=3D"" role=3D"presentation" style=3D"width:535px;" width=
=3D"535" ><tr><td style=3D"line-height:0px;font-size:0px;mso-line-height-ru=
le:exactly;"><![endif]--><div style=3D"direction: ltr; margin: 0px auto; ma=
x-width: 535px;"><table align=3D"center" border=3D"0" cellpadding=3D"0" cel=
lspacing=3D"0" role=3D"presentation" style=3D"direction: ltr; width: 100%;"=
 width=3D"100%"><tbody style=3D"direction: ltr;"><tr style=3D"direction: lt=
r;"><td style=3D"direction: ltr; font-size: 0px; padding: 0 5px; text-align=
: center;" align=3D"center"><!--[if mso | IE]><table role=3D"presentation" =
border=3D"0" cellpadding=3D"0" cellspacing=3D"0"><tr><td align=3D"left" cla=
ss=3D"" style=3D"vertical-align:top;width:525px;" ><![endif]--><div class=
=3D"mj-column-per-100 mj-outlook-group-fix" style=3D"font-size: 0px; text-a=
lign: left; direction: ltr; display: inline-block; vertical-align: top; wid=
th: 100%;"><table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"=
presentation" width=3D"100%" style=3D"direction: ltr;"><tbody style=3D"dire=
ction: ltr;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr; ver=
tical-align: top; padding: 0; padding-top: 24px;" valign=3D"top"><table bor=
der=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=
=3D"direction: ltr;" width=3D"100%"><tbody style=3D"direction: ltr;">      =
<tr style=3D"direction: ltr;"><td align=3D"left" class=3D"rd-subsection-tex=
t-light" style=3D"direction: ltr; font-size: 0px; padding: 0; padding-botto=
m: 24px; word-break: break-word;"><div style=3D"direction: ltr; text-transf=
orm: uppercase; letter-spacing: 0.8px; font-family: Neue-Helvetica, Helveti=
ca; font-weight: bold; text-align: left; font-size: 13px; line-height: 18px=
; color: #333333;"> You will receive your delivery: </div></td></tr>       =
   <tr style=3D"direction: ltr;"><td align=3D"left" class=3D"rd-subsection-=
title" style=3D"direction: ltr; font-size: 0px; padding: 0; padding-bottom:=
 16px; word-break: break-word;"><div style=3D"direction: ltr; text-transfor=
m: uppercase; letter-spacing: 0.7px; font-family: Neue-Helvetica, Helvetica=
; font-weight: bold; text-align: left; color: #000000; font-size: 14px; lin=
e-height: 18px;">      Tuesday 3 December - Wednesday 4 December  </div></t=
d></tr>  <tr style=3D"direction: ltr;"><td style=3D"direction: ltr; font-si=
ze: 0px; word-break: break-word;"><div style=3D"direction: ltr; height: 16p=
x; line-height: 16px;">&#8202;</div></td></tr>                 <tr style=3D=
"direction: ltr;"><td align=3D"left" class=3D"rd-subsection-text-light" sty=
le=3D"direction: ltr; font-size: 0px; padding: 0; word-break: break-word;">=
<div style=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0.=
8px; font-family: Neue-Helvetica, Helvetica; font-weight: bold; text-align:=
 left; font-size: 13px; line-height: 18px; color: #333333;">   Standard hom=
e delivery   </div></td></tr> <tr style=3D"direction: ltr;"><td align=3D"le=
ft" class=3D"rd-subsection-text" style=3D"direction: ltr; font-size: 0px; p=
adding: 0; word-break: break-word;"><div style=3D"direction: ltr; text-tran=
sform: uppercase; letter-spacing: 0.8px; font-family: Neue-Helvetica, Helve=
tica; text-align: left; color: #000000; font-size: 13px; line-height: 18px;=
"><div style=3D"direction: ltr; text-transform: uppercase; letter-spacing: =
0.8px; font-size: 13px; line-height: 18px;"><div style=3D"direction: ltr; t=
ext-transform: uppercase; letter-spacing: 0.8px; font-size: 13px; line-heig=
ht: 18px;">720, 9th cross road, 10th a main Road, Indiranagar
Velo studio</div></div></div></td></tr><tr style=3D"direction: ltr;"><td al=
ign=3D"left" class=3D"rd-subsection-text" style=3D"direction: ltr; font-siz=
e: 0px; padding: 0; word-break: break-word;"><div style=3D"direction: ltr; =
text-transform: uppercase; letter-spacing: 0.8px; font-family: Neue-Helveti=
ca, Helvetica; text-align: left; color: #000000; font-size: 13px; line-heig=
ht: 18px;"> <div style=3D"direction: ltr; text-transform: uppercase; letter=
-spacing: 0.8px; font-size: 13px; line-height: 18px;"> 560038   Bangalore <=
/div><div style=3D"direction: ltr; text-transform: uppercase; letter-spacin=
g: 0.8px; font-size: 13px; line-height: 18px;">KARNATAKA</div><div style=3D=
"direction: ltr; text-transform: uppercase; letter-spacing: 0.8px; font-siz=
e: 13px; line-height: 18px;">India</div></div></td></tr><tr style=3D"direct=
ion: ltr;"><td align=3D"left" class=3D"rd-subsection-text" style=3D"directi=
on: ltr; font-size: 0px; padding: 0; word-break: break-word;"><div style=3D=
"direction: ltr; text-transform: uppercase; letter-spacing: 0.8px; font-fam=
ily: Neue-Helvetica, Helvetica; text-align: left; color: #000000; font-size=
: 13px; line-height: 18px;"><div style=3D"direction: ltr; text-transform: u=
ppercase; letter-spacing: 0.8px; font-size: 13px; line-height: 18px;"></div=
></div></td></tr><tr style=3D"direction: ltr;"><td align=3D"left" class=3D"=
rd-address-sign-text" style=3D"direction: ltr; font-size: 0px; padding: 0; =
word-break: break-word;"><div style=3D"direction: ltr; font-family: Neue-He=
lvetica, Helvetica; font-size: 14px; line-height: 18px; text-align: left; c=
olor: #000000;"></div></td></tr></tbody></table></td></tr></tbody></table><=
/div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></ta=
ble></div><!--[if mso | IE]></td></tr></table><![endif]-->  <!--[if mso | I=
E]><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0"=
 class=3D"" role=3D"presentation" style=3D"width:535px;" width=3D"535" ><tr=
><td style=3D"line-height:0px;font-size:0px;mso-line-height-rule:exactly;">=
<![endif]--><div style=3D"direction: ltr; margin: 0px auto; max-width: 535p=
x;"><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0=
" role=3D"presentation" style=3D"direction: ltr; width: 100%;" width=3D"100=
%"><tbody style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td style=
=3D"direction: ltr; font-size: 0px; padding: 0 5px; text-align: center;" al=
ign=3D"center"><!--[if mso | IE]><table role=3D"presentation" border=3D"0" =
cellpadding=3D"0" cellspacing=3D"0"><tr><td align=3D"left" class=3D"" style=
=3D"vertical-align:top;width:525px;" ><![endif]--><div class=3D"mj-column-p=
er-100 mj-outlook-group-fix" style=3D"font-size: 0px; text-align: left; dir=
ection: ltr; display: inline-block; vertical-align: top; width: 100%;"><tab=
le border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" w=
idth=3D"100%" style=3D"direction: ltr;"><tbody style=3D"direction: ltr;"><t=
r style=3D"direction: ltr;"><td style=3D"direction: ltr; vertical-align: to=
p; padding: 0;" valign=3D"top"><table border=3D"0" cellpadding=3D"0" cellsp=
acing=3D"0" role=3D"presentation" style=3D"direction: ltr;" width=3D"100%">=
<tbody style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td align=3D=
"center" class=3D"rd-order-detail-btn" style=3D"direction: ltr; word-break:=
 break-word; padding: 15px 0 20px; font-size: 14px;"><table border=3D"0" ce=
llpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"direction:=
 ltr; border-collapse: separate; width: 100%; line-height: 100%;" width=3D"=
100%"><tbody style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td al=
ign=3D"center" bgcolor=3D"#000000" role=3D"presentation" style=3D"direction=
: ltr; border: 1px solid #FFFFFF; border-radius: 3px; cursor: auto; mso-pad=
ding-alt: 10px 25px; background: #000000;" valign=3D"middle"><a href=3D"htt=
ps://www.zara.com/in/en/user/order/53964516340?utm_medium=3Demail&utm_sourc=
e=3Dnotification_com&utm_campaign=3DOrderConfirmation&utm_content=3Dorder_d=
etail_button" style=3D"direction: ltr; display: inline-block; background: #=
000000; color: #FFFFFF; font-family: Neue-Helvetica, Helvetica; font-size: =
13px; font-weight: bold; line-height: 120%; margin: 0; text-decoration: non=
e; text-transform: uppercase; padding: 10px 25px; mso-padding-alt: 0px; bor=
der-radius: 3px;" target=3D"_blank">Order tracking</a></td></tr></tbody></t=
able></td></tr><tr style=3D"direction: ltr;"><td align=3D"left" class=3D"rd=
-text-info" style=3D"direction: ltr; font-size: 0px; padding: 0; word-break=
: break-word;"><div style=3D"direction: ltr; letter-spacing: 0.3px; font-fa=
mily: Neue-Helvetica, Helvetica; text-align: left; color: #000000; font-siz=
e: 14px; line-height: 18px;"></div></td></tr></tbody></table></td></tr></tb=
ody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr=
></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--> <!-=
-[if mso | IE]><table align=3D"center" border=3D"0" cellpadding=3D"0" cells=
pacing=3D"0" class=3D"" role=3D"presentation" style=3D"width:535px;" width=
=3D"535" ><tr><td style=3D"line-height:0px;font-size:0px;mso-line-height-ru=
le:exactly;"><![endif]--><div style=3D"direction: ltr; margin: 0px auto; ma=
x-width: 535px;"><table align=3D"center" border=3D"0" cellpadding=3D"0" cel=
lspacing=3D"0" role=3D"presentation" style=3D"direction: ltr; width: 100%;"=
 width=3D"100%"><tbody style=3D"direction: ltr;"><tr style=3D"direction: lt=
r;"><td style=3D"direction: ltr; font-size: 0px; padding: 0 5px; text-align=
: center;" align=3D"center"><!--[if mso | IE]><table role=3D"presentation" =
border=3D"0" cellpadding=3D"0" cellspacing=3D"0"><tr><td align=3D"left" cla=
ss=3D"" style=3D"vertical-align:top;width:525px;" ><![endif]--><div class=
=3D"mj-column-per-100 mj-outlook-group-fix" style=3D"font-size: 0px; text-a=
lign: left; direction: ltr; display: inline-block; vertical-align: top; wid=
th: 100%;"><table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"=
presentation" width=3D"100%" style=3D"direction: ltr;"><tbody style=3D"dire=
ction: ltr;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr; ver=
tical-align: top; padding: 0; padding-top: 40px;" valign=3D"top"><table bor=
der=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=
=3D"direction: ltr;" width=3D"100%"><tbody style=3D"direction: ltr;"> <tr s=
tyle=3D"direction: ltr;"><td align=3D"left" class=3D"rd-subsection-text" st=
yle=3D"direction: ltr; font-size: 0px; padding: 0; word-break: break-word;"=
><div style=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0=
.8px; font-family: Neue-Helvetica, Helvetica; text-align: left; color: #000=
000; font-size: 13px; line-height: 18px;"><div class=3D"rd-light-font" styl=
e=3D"direction: ltr; color: #666666; text-transform: uppercase; letter-spac=
ing: 0.8px; font-size: 13px; line-height: 18px;">     7   items  </div></di=
v></td></tr>              <tr style=3D"direction: ltr;"><td align=3D"left" =
style=3D"direction: ltr; font-size: 0px; padding: 16px 0 0; word-break: bre=
ak-word;"><table cellpadding=3D"0" cellspacing=3D"0" width=3D"100%" border=
=3D"0" style=3D"direction: ltr; color: #000000; font-family: Neue-Helvetica=
, Helvetica; font-size: 13px; line-height: 22px; table-layout: auto; width:=
 100%; border: none;"><tr style=3D"direction: ltr;"><td style=3D"direction:=
 ltr;"><table table-layout=3D"fixed" style=3D"direction: ltr;">  </table><t=
able table-layout=3D"fixed" style=3D"direction: ltr;">   <tr class=3D"rd-pr=
oduct-row" style=3D"direction: ltr;"> <td style=3D"direction: ltr; vertical=
-align: top; padding-bottom: 24px;" class=3D"rd-product-col" valign=3D"top"=
><table class=3D"rd-product" style=3D"direction: ltr; width: 85%; max-width=
: 230px;" width=3D"85%"><tr style=3D"direction: ltr;"><td style=3D"directio=
n: ltr; width: 100%; max-width: 230px; padding: 0;" class=3D"rd-subsection-=
text" width=3D"100%"><table style=3D"direction: ltr;"><tr style=3D"directio=
n: ltr;"><td style=3D"direction: ltr; width: 100%; max-width: 230px; paddin=
g: 0 0 8px;" width=3D"100%"><img padding=3D"0" class=3D"rd-product-img" wid=
th=3D"225" src=3D"https://static.zara.net/photos//2024/I/0/2/p/8574/400/707=
/2/8574400707_1_1_1.jpg?ts=3D1724398713635" style=3D"direction: ltr; max-wi=
dth: 230px; width: 100%; height: auto;" height=3D"auto"></td></tr></table> =
 <div style=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0=
.8px; font-size: 13px; line-height: 18px;">OVERSHIRT WITH POCKETS</div><div=
 style=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0.8px;=
 color: #666666; font-size: 13px; line-height: 18px;">camel 0/8574/400/707/=
04</div><div style=3D"direction: ltr; text-transform: uppercase; letter-spa=
cing: 0.8px; padding-top: 16px; font-size: 13px; line-height: 18px;">    1 =
 unit      / =E2=82=B9 3,330.00   </div><div style=3D"direction: ltr; text-=
transform: uppercase; letter-spacing: 0.8px; font-size: 13px; line-height: =
18px;">L</div>    </td></tr></table></td>   <td style=3D"direction: ltr; ve=
rtical-align: top; padding-bottom: 24px;" class=3D"rd-product-col" valign=
=3D"top"><table class=3D"rd-product" style=3D"direction: ltr; width: 85%; m=
ax-width: 230px;" width=3D"85%"><tr style=3D"direction: ltr;"><td style=3D"=
direction: ltr; width: 100%; max-width: 230px; padding: 0;" class=3D"rd-sub=
section-text" width=3D"100%"><table style=3D"direction: ltr;"><tr style=3D"=
direction: ltr;"><td style=3D"direction: ltr; width: 100%; max-width: 230px=
; padding: 0 0 8px;" width=3D"100%"><img padding=3D"0" class=3D"rd-product-=
img" width=3D"225" src=3D"https://static.zara.net/photos//2024/I/0/2/p/4048=
/310/427/2/4048310427_1_1_1.jpg?ts=3D1727436117024" style=3D"direction: ltr=
; max-width: 230px; width: 100%; height: auto;" height=3D"auto"></td></tr><=
/table>  <div style=3D"direction: ltr; text-transform: uppercase; letter-sp=
acing: 0.8px; font-size: 13px; line-height: 18px;">STRAIGHT-LEG JEANS</div>=
<div style=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0.=
8px; color: #666666; font-size: 13px; line-height: 18px;">Mid-blue 0/4048/3=
10/427/42</div><div style=3D"direction: ltr; text-transform: uppercase; let=
ter-spacing: 0.8px; padding-top: 16px; font-size: 13px; line-height: 18px;"=
>    1  unit      / =E2=82=B9 3,550.00   </div><div style=3D"direction: ltr=
; text-transform: uppercase; letter-spacing: 0.8px; font-size: 13px; line-h=
eight: 18px;">EU 42 (UK 32)</div>    </td></tr></table></td>   </tr><tr cla=
ss=3D"rd-product-row" style=3D"direction: ltr;"> <td style=3D"direction: lt=
r; vertical-align: top; padding-bottom: 24px;" class=3D"rd-product-col" val=
ign=3D"top"><table class=3D"rd-product" style=3D"direction: ltr; width: 85%=
; max-width: 230px;" width=3D"85%"><tr style=3D"direction: ltr;"><td style=
=3D"direction: ltr; width: 100%; max-width: 230px; padding: 0;" class=3D"rd=
-subsection-text" width=3D"100%"><table style=3D"direction: ltr;"><tr style=
=3D"direction: ltr;"><td style=3D"direction: ltr; width: 100%; max-width: 2=
30px; padding: 0 0 8px;" width=3D"100%"><img padding=3D"0" class=3D"rd-prod=
uct-img" width=3D"225" src=3D"https://static.zara.net/photos//2024/I/0/2/p/=
3918/707/501/2/3918707501_1_1_1.jpg?ts=3D1729075221439" style=3D"direction:=
 ltr; max-width: 230px; width: 100%; height: auto;" height=3D"auto"></td></=
tr></table>  <div style=3D"direction: ltr; text-transform: uppercase; lette=
r-spacing: 0.8px; font-size: 13px; line-height: 18px;">COMFORT PADDED OVERS=
HIRT</div><div style=3D"direction: ltr; text-transform: uppercase; letter-s=
pacing: 0.8px; color: #666666; font-size: 13px; line-height: 18px;">Bottle =
green 0/3918/707/501/04</div><div style=3D"direction: ltr; text-transform: =
uppercase; letter-spacing: 0.8px; padding-top: 16px; font-size: 13px; line-=
height: 18px;">    1  unit      / =E2=82=B9 3,570.00   </div><div style=3D"=
direction: ltr; text-transform: uppercase; letter-spacing: 0.8px; font-size=
: 13px; line-height: 18px;">L</div>    </td></tr></table></td>   <td style=
=3D"direction: ltr; vertical-align: top; padding-bottom: 24px;" class=3D"rd=
-product-col" valign=3D"top"><table class=3D"rd-product" style=3D"direction=
: ltr; width: 85%; max-width: 230px;" width=3D"85%"><tr style=3D"direction:=
 ltr;"><td style=3D"direction: ltr; width: 100%; max-width: 230px; padding:=
 0;" class=3D"rd-subsection-text" width=3D"100%"><table style=3D"direction:=
 ltr;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr; width: 10=
0%; max-width: 230px; padding: 0 0 8px;" width=3D"100%"><img padding=3D"0" =
class=3D"rd-product-img" width=3D"225" src=3D"https://static.zara.net/photo=
s//2024/I/0/1/p/4201/570/800/2/4201570800_1_1_1.jpg?ts=3D1715328802790" sty=
le=3D"direction: ltr; max-width: 230px; width: 100%; height: auto;" height=
=3D"auto"></td></tr></table>  <div style=3D"direction: ltr; text-transform:=
 uppercase; letter-spacing: 0.8px; font-size: 13px; line-height: 18px;">TEX=
TURED STRETCH SHIRT</div><div style=3D"direction: ltr; text-transform: uppe=
rcase; letter-spacing: 0.8px; color: #666666; font-size: 13px; line-height:=
 18px;">Black 0/4201/570/800/03</div><div style=3D"direction: ltr; text-tra=
nsform: uppercase; letter-spacing: 0.8px; padding-top: 16px; font-size: 13p=
x; line-height: 18px;">    1  unit      / =E2=82=B9 2,130.00   </div><div s=
tyle=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0.8px; f=
ont-size: 13px; line-height: 18px;">M</div>    </td></tr></table></td>   </=
tr><tr class=3D"rd-product-row" style=3D"direction: ltr;"> <td style=3D"dir=
ection: ltr; vertical-align: top; padding-bottom: 24px;" class=3D"rd-produc=
t-col" valign=3D"top"><table class=3D"rd-product" style=3D"direction: ltr; =
width: 85%; max-width: 230px;" width=3D"85%"><tr style=3D"direction: ltr;">=
<td style=3D"direction: ltr; width: 100%; max-width: 230px; padding: 0;" cl=
ass=3D"rd-subsection-text" width=3D"100%"><table style=3D"direction: ltr;">=
<tr style=3D"direction: ltr;"><td style=3D"direction: ltr; width: 100%; max=
-width: 230px; padding: 0 0 8px;" width=3D"100%"><img padding=3D"0" class=
=3D"rd-product-img" width=3D"225" src=3D"https://static.zara.net/photos//20=
24/I/0/1/p/3284/330/517/2/3284330517_1_1_1.jpg?ts=3D1727193661764" style=3D=
"direction: ltr; max-width: 230px; width: 100%; height: auto;" height=3D"au=
to"></td></tr></table>  <div style=3D"direction: ltr; text-transform: upper=
case; letter-spacing: 0.8px; font-size: 13px; line-height: 18px;">PURL KNIT=
 SWEATER</div><div style=3D"direction: ltr; text-transform: uppercase; lett=
er-spacing: 0.8px; color: #666666; font-size: 13px; line-height: 18px;">oli=
ve green 0/3284/330/517/04</div><div style=3D"direction: ltr; text-transfor=
m: uppercase; letter-spacing: 0.8px; padding-top: 16px; font-size: 13px; li=
ne-height: 18px;">    1  unit      / =E2=82=B9 2,130.00   </div><div style=
=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0.8px; font-=
size: 13px; line-height: 18px;">L</div>    </td></tr></table></td>   <td st=
yle=3D"direction: ltr; vertical-align: top; padding-bottom: 24px;" class=3D=
"rd-product-col" valign=3D"top"><table class=3D"rd-product" style=3D"direct=
ion: ltr; width: 85%; max-width: 230px;" width=3D"85%"><tr style=3D"directi=
on: ltr;"><td style=3D"direction: ltr; width: 100%; max-width: 230px; paddi=
ng: 0;" class=3D"rd-subsection-text" width=3D"100%"><table style=3D"directi=
on: ltr;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr; width:=
 100%; max-width: 230px; padding: 0 0 8px;" width=3D"100%"><img padding=3D"=
0" class=3D"rd-product-img" width=3D"225" src=3D"https://static.zara.net/ph=
otos//2024/I/0/2/p/0706/025/712/2/0706025712_1_1_1.jpg?ts=3D1723796653773" =
style=3D"direction: ltr; max-width: 230px; width: 100%; height: auto;" heig=
ht=3D"auto"></td></tr></table>  <div style=3D"direction: ltr; text-transfor=
m: uppercase; letter-spacing: 0.8px; font-size: 13px; line-height: 18px;">B=
OXY FIT OVERSHIRT</div><div style=3D"direction: ltr; text-transform: upperc=
ase; letter-spacing: 0.8px; color: #666666; font-size: 13px; line-height: 1=
8px;">Ecru 0/0706/025/712/04</div><div style=3D"direction: ltr; text-transf=
orm: uppercase; letter-spacing: 0.8px; padding-top: 16px; font-size: 13px; =
line-height: 18px;">    1  unit      / =E2=82=B9 3,570.00   </div><div styl=
e=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0.8px; font=
-size: 13px; line-height: 18px;">L</div>    </td></tr></table></td>   </tr>=
<tr class=3D"rd-product-row" style=3D"direction: ltr;"> <td style=3D"direct=
ion: ltr; vertical-align: top; padding-bottom: 24px;" class=3D"rd-product-c=
ol" valign=3D"top"><table class=3D"rd-product" style=3D"direction: ltr; wid=
th: 85%; max-width: 230px;" width=3D"85%"><tr style=3D"direction: ltr;"><td=
 style=3D"direction: ltr; width: 100%; max-width: 230px; padding: 0;" class=
=3D"rd-subsection-text" width=3D"100%"><table style=3D"direction: ltr;"><tr=
 style=3D"direction: ltr;"><td style=3D"direction: ltr; width: 100%; max-wi=
dth: 230px; padding: 0 0 8px;" width=3D"100%"><img padding=3D"0" class=3D"r=
d-product-img" width=3D"225" src=3D"https://static.zara.net/photos//2024/I/=
0/2/p/6917/309/806/2/6917309806_1_1_1.jpg?ts=3D1723130934367" style=3D"dire=
ction: ltr; max-width: 230px; width: 100%; height: auto;" height=3D"auto"><=
/td></tr></table>  <div style=3D"direction: ltr; text-transform: uppercase;=
 letter-spacing: 0.8px; font-size: 13px; line-height: 18px;">CROPPED DENIM =
OVERSHIRT</div><div style=3D"direction: ltr; text-transform: uppercase; let=
ter-spacing: 0.8px; color: #666666; font-size: 13px; line-height: 18px;">St=
one 0/6917/309/806/04</div><div style=3D"direction: ltr; text-transform: up=
percase; letter-spacing: 0.8px; padding-top: 16px; font-size: 13px; line-he=
ight: 18px;">    1  unit      / =E2=82=B9 2,970.00   </div><div style=3D"di=
rection: ltr; text-transform: uppercase; letter-spacing: 0.8px; font-size: =
13px; line-height: 18px;">L</div>    </td></tr></table></td>   <td style=3D=
"direction: ltr; vertical-align: top; padding-bottom: 24px;" class=3D"rd-pr=
oduct-col" valign=3D"top"></td></tr></table></td></tr></table></td></tr> </=
tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr><=
/table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td><=
/tr></table><![endif]-->    <!--[if mso | IE]><table align=3D"center" borde=
r=3D"0" cellpadding=3D"0" cellspacing=3D"0" class=3D"" role=3D"presentation=
" style=3D"width:535px;" width=3D"535" ><tr><td style=3D"line-height:0px;fo=
nt-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style=3D"direct=
ion: ltr; margin: 0px auto; max-width: 535px;"><table align=3D"center" bord=
er=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D=
"direction: ltr; width: 100%;" width=3D"100%"><tbody style=3D"direction: lt=
r;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr; font-size: 0=
px; padding: 0 5px; text-align: center;" align=3D"center"><!--[if mso | IE]=
><table role=3D"presentation" border=3D"0" cellpadding=3D"0" cellspacing=3D=
"0"><tr><td align=3D"left" class=3D"" style=3D"vertical-align:top;width:525=
px;" ><![endif]--><div class=3D"mj-column-per-100 mj-outlook-group-fix" sty=
le=3D"font-size: 0px; text-align: left; direction: ltr; display: inline-blo=
ck; vertical-align: top; width: 100%;"><table border=3D"0" cellpadding=3D"0=
" cellspacing=3D"0" role=3D"presentation" width=3D"100%" style=3D"direction=
: ltr;"><tbody style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td =
style=3D"direction: ltr; vertical-align: top; padding: 8px 0 0 0;" valign=
=3D"top"><table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"pr=
esentation" style=3D"direction: ltr;" width=3D"100%"><tbody style=3D"direct=
ion: ltr;"><tr style=3D"direction: ltr;"><td align=3D"center" style=3D"dire=
ction: ltr; font-size: 0px; padding: 0; padding-bottom: 40px; word-break: b=
reak-word;"><p style=3D"direction: ltr; border-top: solid 1px #dddddd; font=
-size: 1px; margin: 0px auto; width: 100%;"></p><!--[if mso | IE]><table al=
ign=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" style=3D"bo=
rder-top:solid 1px #dddddd;font-size:1px;margin:0px auto;width:525px;" role=
=3D"presentation" width=3D"525px" ><tr><td style=3D"height:0;line-height:0;=
"> &nbsp;
</td></tr></table><![endif]--></td></tr><tr style=3D"direction: ltr;"><td a=
lign=3D"left" class=3D"rd-section-title" style=3D"direction: ltr; font-size=
: 0px; padding: 0; word-break: break-word;"><div style=3D"direction: ltr; t=
ext-transform: uppercase; font-weight: bold; letter-spacing: 0.7px; font-fa=
mily: Neue-Helvetica, Helvetica; text-align: left; color: #000000; font-siz=
e: 16px; line-height: 24px;"> Payment method </div></td></tr></tbody></tabl=
e></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![en=
dif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table>=
<![endif]-->    <!--[if mso | IE]><table align=3D"center" border=3D"0" cell=
padding=3D"0" cellspacing=3D"0" class=3D"" role=3D"presentation" style=3D"w=
idth:535px;" width=3D"535" ><tr><td style=3D"line-height:0px;font-size:0px;=
mso-line-height-rule:exactly;"><![endif]--><div style=3D"direction: ltr; ma=
rgin: 0px auto; max-width: 535px;"><table align=3D"center" border=3D"0" cel=
lpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"direction: =
ltr; width: 100%;" width=3D"100%"><tbody style=3D"direction: ltr;"><tr styl=
e=3D"direction: ltr;"><td style=3D"direction: ltr; font-size: 0px; padding:=
 0 5px; padding-bottom: 20px; padding-top: 16px; text-align: center;" align=
=3D"center"><!--[if mso | IE]><table role=3D"presentation" border=3D"0" cel=
lpadding=3D"0" cellspacing=3D"0"><tr><td align=3D"left" class=3D"" style=3D=
"vertical-align:top;width:525px;" ><![endif]--><div class=3D"mj-column-per-=
100 mj-outlook-group-fix" style=3D"font-size: 0px; text-align: left; direct=
ion: ltr; display: inline-block; vertical-align: top; width: 100%;"><table =
border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" widt=
h=3D"100%" style=3D"direction: ltr;"><tbody style=3D"direction: ltr;"><tr s=
tyle=3D"direction: ltr;"><td style=3D"direction: ltr; vertical-align: top; =
padding: 0;" valign=3D"top"><table border=3D"0" cellpadding=3D"0" cellspaci=
ng=3D"0" role=3D"presentation" style=3D"direction: ltr;" width=3D"100%"><tb=
ody style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td align=3D"le=
ft" style=3D"direction: ltr; font-size: 0px; padding: 0; word-break: break-=
word;"><table cellpadding=3D"0" cellspacing=3D"0" width=3D"100%" border=3D"=
0" style=3D"direction: ltr; color: #000000; font-family: Neue-Helvetica, He=
lvetica; font-size: 13px; line-height: 22px; table-layout: auto; width: 100=
%; border: none;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr=
; width: 60px;" width=3D"60"> <table style=3D"direction: ltr;"><tr style=3D=
"direction: ltr;"><td style=3D"direction: ltr;"><img width=3D"60" padding-l=
eft=3D"10px" src=3D"https://sttc-stage-zaraphr.inditex.com/photos/contents/=
apps/Background.jpg" style=3D"direction: ltr; width: 60px; height: auto;" h=
eight=3D"auto"></td></tr></table></td><td style=3D"direction: ltr; padding-=
left: 16px;" class=3D"rd-text-info-small"><div style=3D"direction: ltr; tex=
t-transform: uppercase; letter-spacing: 0.8px; text-align: left; font-size:=
 11px; line-height: 16px;">Devansh Chaudhary</div>  <div style=3D"direction=
: ltr; text-transform: uppercase; letter-spacing: 0.8px; text-align: left; =
font-size: 11px; line-height: 16px;"> VISA </div>  <div style=3D"direction:=
 ltr; text-transform: uppercase; letter-spacing: 0.8px; text-align: left; f=
ont-size: 11px; line-height: 16px;">**** **** **** 0066</div>    <div style=
=3D"direction: ltr; text-transform: uppercase; letter-spacing: 0.8px; text-=
align: left; font-size: 11px; line-height: 16px;">Total =E2=82=B9 21,250.00=
</div> </td></tr></table></td></tr></tbody></table></td></tr></tbody></tabl=
e></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody><=
/table></div><!--[if mso | IE]></td></tr></table><![endif]-->        <!--[i=
f mso | IE]><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspac=
ing=3D"0" class=3D"" role=3D"presentation" style=3D"width:535px;" width=3D"=
535" ><tr><td style=3D"line-height:0px;font-size:0px;mso-line-height-rule:e=
xactly;"><![endif]--><div style=3D"direction: ltr; margin: 0px auto; max-wi=
dth: 535px;"><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspa=
cing=3D"0" role=3D"presentation" style=3D"direction: ltr; width: 100%;" wid=
th=3D"100%"><tbody style=3D"direction: ltr;"><tr style=3D"direction: ltr;">=
<td style=3D"direction: ltr; font-size: 0px; padding: 0 5px; text-align: ce=
nter;" align=3D"center"><!--[if mso | IE]><table role=3D"presentation" bord=
er=3D"0" cellpadding=3D"0" cellspacing=3D"0"><tr><td align=3D"left" class=
=3D"" style=3D"vertical-align:top;width:525px;" ><![endif]--><div class=3D"=
mj-column-per-100 mj-outlook-group-fix" style=3D"font-size: 0px; text-align=
: left; direction: ltr; display: inline-block; vertical-align: top; width: =
100%;"><table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"pres=
entation" width=3D"100%" style=3D"direction: ltr;"><tbody style=3D"directio=
n: ltr;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr; vertica=
l-align: top; padding: 8px 0 0 0;" valign=3D"top"><table border=3D"0" cellp=
adding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"direction: lt=
r;" width=3D"100%"><tbody style=3D"direction: ltr;"><tr style=3D"direction:=
 ltr;"><td align=3D"center" style=3D"direction: ltr; font-size: 0px; paddin=
g: 0; padding-bottom: 40px; word-break: break-word;"><p style=3D"direction:=
 ltr; border-top: solid 1px #dddddd; font-size: 1px; margin: 0px auto; widt=
h: 100%;"></p><!--[if mso | IE]><table align=3D"center" border=3D"0" cellpa=
dding=3D"0" cellspacing=3D"0" style=3D"border-top:solid 1px #dddddd;font-si=
ze:1px;margin:0px auto;width:525px;" role=3D"presentation" width=3D"525px" =
><tr><td style=3D"height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]--></td></tr><tr style=3D"direction: ltr;"><td a=
lign=3D"left" class=3D"rd-section-title" style=3D"direction: ltr; font-size=
: 0px; padding: 0; padding-bottom: 16px; word-break: break-word;"><div styl=
e=3D"direction: ltr; text-transform: uppercase; font-weight: bold; letter-s=
pacing: 0.7px; font-family: Neue-Helvetica, Helvetica; text-align: left; co=
lor: #000000; font-size: 16px; line-height: 24px;">Breakdown</div></td></tr=
><tr style=3D"direction: ltr;"><td align=3D"left" class=3D"rd-payment-table=
" style=3D"direction: ltr; font-size: 0px; word-break: break-word; padding:=
 0px;"><table cellpadding=3D"0" cellspacing=3D"0" width=3D"100%" border=3D"=
0" style=3D"direction: ltr; letter-spacing: 0.7px; text-transform: uppercas=
e; color: #000000; font-family: Neue-Helvetica, Helvetica; table-layout: au=
to; width: 100%; border: none; font-size: 13px; line-height: 18px;"> <tr cl=
ass=3D"rd-light-font" style=3D"direction: ltr; color: #666666;"><td style=
=3D"direction: ltr; padding-bottom: 4px; min-width: 100px;">7   items </td>=
<td class=3D"rd-payment-price" style=3D"direction: ltr; padding-bottom: 4px=
; min-width: 100px; text-align: right; word-break: break-word;" align=3D"ri=
ght">=E2=82=B9 21,250.00</td></tr> <tr class=3D"rd-light-font" style=3D"dir=
ection: ltr; color: #666666;"><td style=3D"direction: ltr; padding-bottom: =
4px; min-width: 100px;">Shipping costs</td><td class=3D"rd-payment-price" s=
tyle=3D"direction: ltr; padding-bottom: 4px; min-width: 100px; text-align: =
right; word-break: break-word;" align=3D"right">=E2=82=B9 290.00</td></tr> =
   <tr class=3D"rd-light-font" style=3D"direction: ltr; color: #666666;"><t=
d style=3D"direction: ltr; padding-bottom: 4px; min-width: 100px;">Shipping=
 cost discount</td><td class=3D"rd-payment-price" style=3D"direction: ltr; =
padding-bottom: 4px; min-width: 100px; text-align: right; word-break: break=
-word;" align=3D"right">-=E2=82=B9 290.00</td></tr>               <tr class=
=3D"rd-payment-total rd-black-font" style=3D"direction: ltr; font-weight: b=
old; color: #000000;"><td style=3D"direction: ltr; padding-bottom: 4px; min=
-width: 100px;">Total</td> <td class=3D"rd-payment-price" style=3D"directio=
n: ltr; padding-bottom: 4px; min-width: 100px; text-align: right; word-brea=
k: break-word;" align=3D"right">=E2=82=B9 21,250.00</td></tr> <tr style=3D"=
direction: ltr;"><td colspan=3D"2" style=3D"direction: ltr; padding-bottom:=
 4px; min-width: 100px;"><span class=3D"rd-payment-include-tax-label-left" =
style=3D"direction: ltr; color: #666666; letter-spacing: 0.3px; text-transf=
orm: none; font-size: 12px; line-height: 18px; text-align: left;">*Taxes in=
cluded</span></td></tr></table></td></tr></tbody></table></td></tr></tbody>=
</table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></t=
body></table></div><!--[if mso | IE]></td></tr></table><![endif]-->      <!=
--[if mso | IE]><table align=3D"center" border=3D"0" cellpadding=3D"0" cell=
spacing=3D"0" class=3D"" role=3D"presentation" style=3D"width:535px;" width=
=3D"535" ><tr><td style=3D"line-height:0px;font-size:0px;mso-line-height-ru=
le:exactly;"><![endif]--><div style=3D"direction: ltr; margin: 0px auto; ma=
x-width: 535px;"><table align=3D"center" border=3D"0" cellpadding=3D"0" cel=
lspacing=3D"0" role=3D"presentation" style=3D"direction: ltr; width: 100%;"=
 width=3D"100%"><tbody style=3D"direction: ltr;"><tr style=3D"direction: lt=
r;"><td style=3D"direction: ltr; font-size: 0px; padding: 0 5px; text-align=
: center;" align=3D"center"><!--[if mso | IE]><table role=3D"presentation" =
border=3D"0" cellpadding=3D"0" cellspacing=3D"0"><tr><td align=3D"left" cla=
ss=3D"" style=3D"vertical-align:top;width:525px;" ><![endif]--><div class=
=3D"mj-column-per-100 mj-outlook-group-fix" style=3D"font-size: 0px; text-a=
lign: left; direction: ltr; display: inline-block; vertical-align: top; wid=
th: 100%;"><table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"=
presentation" width=3D"100%" style=3D"direction: ltr;"><tbody style=3D"dire=
ction: ltr;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr; ver=
tical-align: top; padding: 72px 0 100px;" valign=3D"top"><table border=3D"0=
" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"direct=
ion: ltr;" width=3D"100%"><tbody style=3D"direction: ltr;">  <tr style=3D"d=
irection: ltr;"><td align=3D"left" class=3D"rd-footer-link" style=3D"direct=
ion: ltr; font-size: 0px; padding: 0; word-break: break-word;"><div style=
=3D"direction: ltr; margin-bottom: 12px; font-family: Neue-Helvetica, Helve=
tica; font-size: 14px; line-height: 18px; text-align: left; color: #000000;=
"><a href=3D"https://www.zara.com/in/en/help?utm_medium=3Demail&utm_source=
=3Dnotification_com&utm_campaign=3DOrderConfirmation&utm_content=3Dhelp_pag=
e" style=3D"direction: ltr; color: #000000; text-transform: uppercase; font=
-weight: bold; line-height: 18px; letter-spacing: 0.7px; text-decoration: n=
one; font-size: 13px;">Help</a></div></td></tr> <tr style=3D"direction: ltr=
;"><td align=3D"left" class=3D"rd-footer-link" style=3D"direction: ltr; fon=
t-size: 0px; padding: 0; word-break: break-word;"><div style=3D"direction: =
ltr; margin-bottom: 12px; font-family: Neue-Helvetica, Helvetica; font-size=
: 14px; line-height: 18px; text-align: left; color: #000000;"><a href=3D"ht=
tps://static.zara.net/static//pdfs/IN/terms-and-conditions/terms-and-condit=
ions-en_IN-20241112.pdf" style=3D"direction: ltr; color: #000000; text-tran=
sform: uppercase; font-weight: bold; line-height: 18px; letter-spacing: 0.7=
px; text-decoration: none; font-size: 13px;">Purchase conditions</a></div><=
/td></tr>   <tr style=3D"direction: ltr;"><td align=3D"left" class=3D"rd-fo=
oter-link" style=3D"direction: ltr; font-size: 0px; padding: 0; word-break:=
 break-word;"><div style=3D"direction: ltr; margin-bottom: 12px; font-famil=
y: Neue-Helvetica, Helvetica; font-size: 14px; line-height: 18px; text-alig=
n: left; color: #000000;"><a href=3D"https://static.zara.net/static//pdfs/I=
N/privacy-policy/privacy-policy-en_IN-20240117.pdf" style=3D"direction: ltr=
; color: #000000; text-transform: uppercase; font-weight: bold; line-height=
: 18px; letter-spacing: 0.7px; text-decoration: none; font-size: 13px;">Pri=
vacy policy</a></div></td></tr><tr style=3D"direction: ltr;"><td align=3D"l=
eft" class=3D"rd-footer-rrsss-link" style=3D"direction: ltr; font-size: 0px=
; padding: 28px 0 0; word-break: break-word;"><table cellpadding=3D"0" cell=
spacing=3D"0" width=3D"100%" border=3D"0" style=3D"direction: ltr; color: #=
000000; font-family: Neue-Helvetica, Helvetica; font-size: 13px; line-heigh=
t: 0; table-layout: auto; width: 100%; border: none;"><tr style=3D"directio=
n: ltr;"> <td style=3D"direction: ltr;"><table class=3D"rd-footer-rrsss-lin=
k" style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td style=3D"dir=
ection: ltr;"><a href=3D"https://www.instagram.com/zara" target=3D"_blank" =
style=3D"direction: ltr; color: #000; text-transform: uppercase; font-weigh=
t: bold; letter-spacing: 0.7px; line-height: 16px; text-decoration: none; f=
ont-size: 8px;">Instagram</a></td></tr></table></td><td style=3D"direction:=
 ltr;"><table class=3D"rd-footer-rrsss-link" style=3D"direction: ltr;"><tr =
style=3D"direction: ltr;"><td style=3D"direction: ltr;"><a href=3D"https://=
es-es.facebook.com/Zara" target=3D"_blank" style=3D"direction: ltr; color: =
#000; text-transform: uppercase; font-weight: bold; letter-spacing: 0.7px; =
line-height: 16px; text-decoration: none; font-size: 8px;">Facebook</a></td=
></tr></table></td><td style=3D"direction: ltr;"><table class=3D"rd-footer-=
rrsss-link" style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td sty=
le=3D"direction: ltr;"><a href=3D"https://twitter.com/zaraes?s=3D20" target=
=3D"_blank" style=3D"direction: ltr; color: #000; text-transform: uppercase=
; font-weight: bold; letter-spacing: 0.7px; line-height: 16px; text-decorat=
ion: none; font-size: 8px;">Twitter</a></td></tr></table></td><td style=3D"=
direction: ltr;"><table class=3D"rd-footer-rrsss-link" style=3D"direction: =
ltr;"><tr style=3D"direction: ltr;"><td style=3D"direction: ltr;"><a href=
=3D"https://www.pinterest.es/zaraofficial/" target=3D"_blank" style=3D"dire=
ction: ltr; color: #000; text-transform: uppercase; font-weight: bold; lett=
er-spacing: 0.7px; line-height: 16px; text-decoration: none; font-size: 8px=
;">Pinterest</a></td></tr></table></td><td style=3D"direction: ltr;"><table=
 class=3D"rd-footer-rrsss-link" style=3D"direction: ltr;"><tr style=3D"dire=
ction: ltr;"><td style=3D"direction: ltr;"><a href=3D"https://www.youtube.c=
om/user/zara" target=3D"_blank" style=3D"direction: ltr; color: #000; text-=
transform: uppercase; font-weight: bold; letter-spacing: 0.7px; line-height=
: 16px; text-decoration: none; font-size: 8px;">Youtube</a></td></tr></tabl=
e></td><td style=3D"direction: ltr;"><table class=3D"rd-footer-rrsss-link" =
style=3D"direction: ltr;"><tr style=3D"direction: ltr;"><td style=3D"direct=
ion: ltr;"><a href=3D"https://open.spotify.com/user/r6ivwuv0ebk346hhxo446pb=
fv?si=3D9db6dbfe82de4a1d" target=3D"_blank" style=3D"direction: ltr; color:=
 #000; text-transform: uppercase; font-weight: bold; letter-spacing: 0.7px;=
 line-height: 16px; text-decoration: none; font-size: 8px;">Spotify</a></td=
></tr></table></td></tr></table></td></tr><tr style=3D"direction: ltr;"><td=
 align=3D"left" class=3D"rd-dowload-app" style=3D"direction: ltr; font-size=
: 0px; padding: 0; padding-top: 8px; word-break: break-word;"><div style=3D=
"direction: ltr; text-transform: uppercase; text-decoration: none; letter-s=
pacing: 0.7px; font-family: Neue-Helvetica, Helvetica; font-weight: bold; t=
ext-align: left; color: #000000; font-size: 11px; line-height: 18px;"><a hr=
ef=3D"https://www.zara.com/static/go/marketplaces.html" target=3D"_blank" s=
tyle=3D"direction: ltr; color: #000000; text-transform: uppercase; text-dec=
oration: none; letter-spacing: 0.7px; font-size: 11px; line-height: 18px;">=
Download our app</a></div></td></tr><tr style=3D"direction: ltr;"><td align=
=3D"left" class=3D"rd-footer-legal-message" style=3D"direction: ltr; font-s=
ize: 0px; padding: 0; padding-top: 16px; word-break: break-word;"><div styl=
e=3D"direction: ltr; letter-spacing: 0.3px; text-transform: none; font-fami=
ly: Neue-Helvetica, Helvetica; color: #000000; text-align: left; font-size:=
 14px; line-height: 18px;"></div></td></tr></tbody></table></td></tr></tbod=
y></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr><=
/tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div>=
<img src=3D"https://track-mail-de1.transactional-mail-a.com/v1/img?t=3DeyJr=
aWQiOiJ2MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJzdWIiOiJtNGEyLm90IiwidmV=
yIjoxLCJkc3QiOiJodHRwOi8vaHR0cC10by1rYWZrYS5tNGEuZnJhaXgxLnJldGxvYy9yZXN0L3=
YxL3RvcGljcy9ldmVudHMtdHJhY2tpbmciLCJleHAiOjE3MzU0MDAyMDEsImV0bCI6MTczMzY3M=
jIwMSwiaWF0IjoxNzMyODA4MjAxLCJqdGkiOiJXa1J1dWwiLCJjaWQiOiIyM2FhYTZhNi0zMjA1=
LTRhYWQtOTkzZS1hMmI3ZTk0MGI0N2UjMTU2NWRiMDIjOTMyMjZkMTkifQ.OXOICU69o3_0NRrw=
Y-6JiLejQ66h8p54U55wZvh_KjQ&d=3DeyJhbGciOiJBMTI4S1ciLCJ6aXAiOiJERUYiLCJraWQ=
iOiJ2MSIsImVuYyI6IkExMjhDQkMtSFMyNTYifQ.gF2L4_bMM247wvGLCdy_oI4G8u8AKZ8vd-j=
jxCBHEh7BWOvdbcHWKA.BghNaE5sDGluWwJsM8vSdw.axpPHe85STvvHCskZ3z8kBj3YpuWwic_=
ACLXFm6Eq4jFZIjSoz0kav_-9WI7LEzFf50sjcLKVB1k1FBajXsoPMoCoeF9RewTq7hQOH2GCNn=
hD26OwSJfpqpd7VqpxOeeghT8oCyOMs_2hLOZoNzymYxAyNzFJvxEub04h_5NocgPhDNevvwMbV=
wi_O_H3wNd1OXA7PWeWHdelcsv5wP3xBQX53-pto2EBbBcOLGLMaq9JEHkha6aaP7IWlTgpuooo=
3V7TQji3TE14i5FgosHGYvF6qmOjXgv8PivmBCJYNRb42qLhEf9fUafeb4AuiPup0BXJzGQLzz_=
Xq3O4DvkxyVTTe7wHhkuqI2ZWCC6LMmqT2TPHtx98R_THDa2RfM4zWikfYXQGexz1cYVd7QVPeM=
w4icMttrfjQGPvKdczU9gNrzjuMtKQVy4bUVoIaSwfsHai1jvuua-Fdi88hDTd2j5T9Yd4vAj8R=
SmtEyYyDtpXKyqFAy0kS2VC-UI41vurU3227jqxP5HF7LYcA3Yo5oyAXxqUleqPwsWQiNJVacu8=
aLwKLvaiHGl5hfaF49I6zMr5NhD6H9l27P_KnNbueOHIznLBheKDEde8eoE0yTFvhHFr_eKZdgt=
F6U8-9DOCL6lbTrLyYeB7xu-wScgf5safpX9Cq30ytbHn-W5Xr0nsU4YgYBk4HxJmhh98Ge9iSL=
2vGhRs8LSldDgaZFeErb9dsAhRiklppR02BNf9Rk.IWfBBwRV39iZ64AatyrV-w" style=3D"b=
order: none; padding: 0; margin: 0; min-height: 0; min-width: 0; background=
:none;  height: 0; width: 0 " height=3D"1" width=3D"1"/></body></html>
Delivered-To: dev.devanshchaudhary@gmail.com
Received: by 2002:a05:640c:2bcb:b0:1f9:49a4:9fd1 with SMTP id w11csp38356eit;
        Tue, 23 Apr 2024 10:59:15 -0700 (PDT)
X-Google-Smtp-Source: AGHT+IEj7enk40+yBUOPNvn0bru3znve5B1/xgn/YjqJK8Ty1e1w5ftR0Nd9XYSLGwGD34OOPB2T
X-Received: by 2002:a05:6358:f981:b0:183:55a6:b22c with SMTP id kw1-20020a056358f98100b0018355a6b22cmr3753rwb.2.1713895155214;
        Tue, 23 Apr 2024 10:59:15 -0700 (PDT)
ARC-Seal: i=1; a=rsa-sha256; t=1713895155; cv=none;
        d=google.com; s=arc-20160816;
        b=rKELwPTABUISySg94ek6A8efpfgeVBGtBBC5TKU3H8UE9s4mhCR6VkKRFO4yvnV7pr
         yDq/7GPxIwJWg2q22D7wV8jcS97OYtHPp2gS5Jxr0/5/sDhtedLqQHsJUV/aky7q4Crg
         PfZFuupe/wjJzdEb/ew7lHGCqnroCs5ntZylxjwM/f82r1rViyQ29v+2e4eMskGfJK3h
         lhqWIFhKxICaJ3naEkzUvTQhtAlLhspK5Y/UfYi0IFVKQDLXNUnhTK+4C05MyFL3khAj
         Uyfz2LHqwOzFgRfiBOSi5U8L3Oj32Szxt6cvrfoBI6PdkqaOjZsC0JKVKdDpU8Ufttey
         tEJw==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;
        h=to:subject:message-id:mime-version:from:date
         :content-transfer-encoding:dkim-signature:dkim-signature;
        bh=g+Rhv33pNpGo1SHFMHOWHIdSeOlAH4KutEDoOg420j8=;
        fh=PizyrU77yGWa7GD4HbOPVy0/0BGTTBOChYwsjyyrNnY=;
        b=riaI8UvsUw5CSPEEuZFh+F6/Vahd0y8NqNhWUk0evHGT28eAGsaEWkCrZfiRoeugB2
         lEQirpRVvuKQhYHz3EoN0tSq1K5JZnqcL3vyqdpOR7hXsYuVUNksa1qRo6VNF2aBtsS+
         v1gS+MyErumG0sr3qC9+/g/SuCyvSUE49YnVXDUPGm+JVVaBwOtbKp7S4vKp4teDwg+k
         HBuUTws/vI+EQErBzUYgsGFqesIMJUE/v6HAlm1Cm2712Wi37NvmspF/kWLvCaQ881EU
         Ah5YzhCGW5BcDSHYgFNZnmTW5SflokIpPNsuyUKP7e7gFD5FVevYFq8qjlnm7L/AytBc
         J0PA==;
        dara=google.com
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@myntra.com header.s=s1 header.b=CMYIqegB;
       dkim=pass header.i=@sendgrid.info header.s=smtpapi header.b=xQfWfFm8;
       spf=pass (google.com: domain of bounces+15953209-0f12-dev.devanshchaudhary=gmail.com@em6215.myntra.com designates 192.254.126.210 as permitted sender) smtp.mailfrom="bounces+15953209-0f12-dev.devanshchaudhary=gmail.com@em6215.myntra.com";
       dmarc=pass (p=QUARANTINE sp=QUARANTINE dis=NONE) header.from=myntra.com
Return-Path: <bounces+15953209-0f12-dev.devanshchaudhary=gmail.com@em6215.myntra.com>
Received: from o5.sg.myntra.com (o5.sg.myntra.com. [192.254.126.210])
        by mx.google.com with ESMTPS id s31-20020a05622a1a9f00b004378f7ce0b8si12927845qtc.637.2024.04.23.10.59.14
        for <dev.devanshchaudhary@gmail.com>
        (version=TLS1_3 cipher=TLS_AES_128_GCM_SHA256 bits=128/128);
        Tue, 23 Apr 2024 10:59:15 -0700 (PDT)
Received-SPF: pass (google.com: domain of bounces+15953209-0f12-dev.devanshchaudhary=gmail.com@em6215.myntra.com designates 192.254.126.210 as permitted sender) client-ip=192.254.126.210;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@myntra.com header.s=s1 header.b=CMYIqegB;
       dkim=pass header.i=@sendgrid.info header.s=smtpapi header.b=xQfWfFm8;
       spf=pass (google.com: domain of bounces+15953209-0f12-dev.devanshchaudhary=gmail.com@em6215.myntra.com designates 192.254.126.210 as permitted sender) smtp.mailfrom="bounces+15953209-0f12-dev.devanshchaudhary=gmail.com@em6215.myntra.com";
       dmarc=pass (p=QUARANTINE sp=QUARANTINE dis=NONE) header.from=myntra.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=myntra.com; h=content-transfer-encoding:content-type:from:mime-version:subject: x-feedback-id:to:cc:content-type:from:subject:to; s=s1; bh=g+Rhv33pNpGo1SHFMHOWHIdSeOlAH4KutEDoOg420j8=; b=CMYIqegBuJbO/HEQKi31O7g3dc+JGsoZdDvTuv2LBRE9EurQ1GEQCYLrc7VUpJP+PTNI BVrAmtMHUpPCooqfm/yD45/r6isr+rMOZwXkD+DAo5X30b3Kh4hs3wA47jqxDlMfAK2d7F pI0cvigYCJYIiTsiiVrbODENdT2BYYvTcV25KOVBlqKvsxkdDwg8aA9cbUllMvYNVknZuE 2oJJNh/D35y0LySbG2XBkZaanBhfDyzvegRPqaBATaZprQ94C1J1dEexvHxcuGa/5UQhiQ sie2eycyhD2puxdLuUj9pO/XcCbNJZHoXWRck7hCYQSM3mVb1Dmm1oX+V+1rkDdA==
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=sendgrid.info; h=content-transfer-encoding:content-type:from:mime-version:subject: x-feedback-id:to:cc:content-type:from:subject:to; s=smtpapi; bh=g+Rhv33pNpGo1SHFMHOWHIdSeOlAH4KutEDoOg420j8=; b=xQfWfFm8UCLpZlXhXW68S2oFMn481S5eM+tjAoRTMl/Ac8OI3oQlI62lipzF1fnGAJ9L UNBhVeqlYyrFNoK4IkOfp+ynjImZ56OmnuSFp1SSYA7l9Kk+BGe4B0cH3yvaJTRpCWgPBG mBqx2bTlLZCdfm7x3HPKqazl15j7Dq8fU=
Received: by filterdrecv-7456586cb6-5c9vn with SMTP id filterdrecv-7456586cb6-5c9vn-1-6627F6F1-2
        2024-04-23 17:59:13.170888327 +0000 UTC m=+936580.602450265
Received: from MTU5NTMyMDk (unknown) by geopod-ismtpd-8 (SG) with HTTP id qESDGSkRRcOG81i5QwwA1w Tue, 23 Apr 2024 17:59:12.918 +0000 (UTC)
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset=us-ascii
Date: Tue, 23 Apr 2024 17:59:13 +0000 (UTC)
From: Myntra Updates <updates@myntra.com>
Mime-Version: 1.0
Message-ID: <qESDGSkRRcOG81i5QwwA1w@geopod-ismtpd-8>
Subject: Your Myntra Order Confirmation. Please share your feedback
X-Feedback-ID: 15953209:SG
X-SG-EID: u001.i2j32JwSJirl5KLFMiCGsFtzIvTjtM3zUGZLD/SkC3FejqXum+XrHX/hQ0FqpOL4oGHbDzVMwkdwLyFVjbu4erufzPbwkRIcb2eq6H5+An96qhKT2S5cvKE4yMZA3Nl88T38SuuN3MWa+ftDLUsaB+O0vdf7wJ5WguIBTI/4VWRnAJ/dWqDDpcDUy8tdgJmZiFMi1VqgPlmviMwf3QpVudMM6OsqlYTB7gHVRuhJp7ZZkTfvIlJ0TZHmc1OTKbkj6fCq3+rJQipRmBBex5DnIw==
X-SG-ID: u001.SdBcvi+Evd/bQef8eZF3Bp3/RuJ6C/WZTP3oD6czaB6QX8bPZV+uclFKs4mA82BM31R/6eM+qKYpgz3uBgazAVXQYArSi31TZo1xfNS7y/teJ/UJMa573lsL2uWOhTgcSv9lBpRAtLoUtRt/0lL4ob1ARGq4PkUV2v4HaOO/5UWtdOGgF/hkaq01DqrTRwVjtgxSb/eml3LMjSOqIquVCsKf4VkAx6xP0GYO6uSP0qAC/4KAQNQsg4d4lbsWVIpf
To: dev.devanshchaudhary@gmail.com
X-Entity-ID: u001.vDvRQj/s3uHkr8bxixDw1g==

<!DOCTYPE html>
<html>

<head>
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1.0">
    <meta http-equiv=3D"Content-Type" content=3D"text/html;
 charset=3Dutf-8">
    <link
        href=3D"https://fonts.googleapis.com/css?family=3DLato:400,900|Open=
+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=3Dswap"
        rel=3D"stylesheet">
    <link type=3D"text/css" href=3D"http://fonts.googleapis.com/css?family=
=3DLato:400,700">
    <style type=3D"text/css" data-hse-inline-css=3D"true">
        body {
            font-family: 'Lato', sans-serif !important;

        }

        @media only screen and (min-width: 720px) {
            .mainInner {
                max-width: 720px !important;

            }
        }

        @media only screen and (max-width: 480px) {
            .statusContainer {
                padding: 0px 20px 15px 20px !important;

            }

            .roseContainer {
                border-radius: 1px !important;

                padding: 20px !important;

                width: calc(100% - 40px) !important;

            }
        }

        @media only screen and (min-width: 480px) {
            .cornerBorder {
                border: solid 1px #bfc0c6 !important;

                padding-top: 12px !important;

            }
        }

        @media only screen and (max-width: 420px) {
            .impHeading {
                font-size: 15px !important;

                line-height: 14px;

                padding-top: 12px;

                padding-left: 16px;

            }

            .bodyText {
                font-size: 12px !important;

                line-height: 17px;

                padding-left: 16px;

            }

            .sealBroken {
                width: 60px !important;

                height: 60px !important;

                padding-top: 12px;

                padding-right: 16px;

                padding-left: 0px;

            }

            #noReturnHeading {
                font-size: 22px;
            }

            #noReturnBody {
                font-size: 12px;
            }
        }

        @media only screen and (min-width: 420px) {
            .impHeading {
                font-size: 25px !important;

                line-height: 28px;

                padding-top: 30px;

                padding-left: 30px;

            }

            .bodyText {
                font-size: 16px !important;

                line-height: 22px;

                padding-left: 30px;

            }

            .sealBroken {
                width: 120px !important;

                height: 120px !important;

                padding-top: 30px;

                padding-right: 30px;

                padding-left: 90px;

            }

            #noReturnHeading {
                font-size: 25px;
            }

            #noReturnBody {
                font-size: 16px;
            }
        }
    </style>
</head>

<body style=3D"margin: 0;
 padding: 0;
 color: #7e818c;
background-color: #ffff;">
    <table width=3D"100%" style=3D"width: 100%;">
        <tbody>
            <tr style=3D"margin: 0;
 padding: 0;
">
                <td style=3D"padding: 0;
 float: none;
 margin: 0 auto;
 width: 100%;
 " width=3D"100%">
                    <table class=3D"mainInner cornerBorder" style=3D"float:=
 none;
 margin: 0 auto;
 width: 100%;
" width=3D"100%">
                                                                        <he=
ad>
  <style>
    .intoArea {
      margin-top: 0;
      padding: 0 40px 0 40px;
    }

    .helloUser{
      margin-top: 0;
    }

    @media only screen and (max-width: 600px) {
      .intoArea {
        margin-top: 0 !important;
        padding: 0 40px 0 40px;
      }
      .headerBar {
        width: calc(100% - (40px*2));
      }
      .helloUser {
        margin-top: 0 !important;
        font-size: 18px !important;
      }
    }

    @media only screen and (max-width: 480px) {
      .intoArea {
        margin-top: 0;
        padding: 0 20px 0 20px !important;
      }
    }

    @media only screen and (max-width: 320px) {
      .helloUser {
        margin-top: 0 !important;
      }
    }

  </style>
</head>

<tr>
  <td>
    <table class=3D"intoArea" style=3D"text-align: center; width: 100%;">
                  <tr>
        <td class=3D"headerBar">
          <a id=3D"TemplateHeaderUrl">
            <img id=3D"TemplateHeaderImage" src=3D"https://assets.myntasset=
s.com/assets/images/retaillabs/2020/2/26/e968ea56-dd82-4064-a251-3205a4e014=
ec1582731412042-order-confirmed.png"  style=3D" width: 100%; object-fit: co=
ntain;">
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <div class=3D"helloUser" style=3D"font-size: 30px; font-family: '=
Lato', sans-serif;margin-top: 20px; color: #282c3f; font-stretch: normal; f=
ont-style: normal; line-height: normal; letter-spacing: normal;">
            Hello
                          <span id=3D"ReceiverName" style=3D"font-weight: b=
old;">Devansh Chaudhary!</span>
                      </div>
        </td>
      </tr>
    </table>
  </td>
</tr>
                        <tr style=3D"margin: 0;
 padding: 0;
">
                            <td class=3D"statusContainer" style=3D"margin: =
0;
padding: 0px 40px 20px 40px;
 width: calc(100% - (40px*2));
" width=3D"calc(100% - (40*2))">
                                <table style=3D"border-collapse: collapse;
 border-spacing: 0px;
margin-top: 20px;
 width: 100%">
                                   =20
                                    <head>=20
    <style> @media only screen and (max-width: 640px) { .statusText { font-=
size: 20px !important; } .trackOrder { font-size: 12px !important; } .mExpr=
essDeliveryLogo { margin-top: 0.2em !important; } .deliveryByClassName { fo=
nt-size: 12px !important; } .subStatusText { opacity: 0.8 !important; margi=
n-top: 10px !important; color: white !important; font-size: 12px !important=
; line-height: 1.42 !important; } .subStatusText span { padding-left: 5px !=
important; opacity: 0.6 !important; font-size: 10px !important; } .statusCT=
A { padding: 0px 20px 0px 14px !important; font-size: 12px !important; line=
-height: 21px !important; cursor: pointer !important; margin-top: 12px !imp=
ortant; } .statusCTA #MyOrderLinkId{ font-size: 13px !important; font-weigh=
t:bold !important; } .deliveryInfo { font-size: 12px !important; font-size:=
 14px !important; padding-top: 12px !important; padding-bottom: 12px !impor=
tant; padding-left: 0px !important; } .statusGreen { padding: 20px 20px 20p=
x 20px !important; } .statusCurrentRight { padding-top: 5px !important; } .=
whiteLogo { width: 20px !important; padding-top: 7px !important; margin-rig=
ht: 12px !important; } .whiteLogo img { width: 20px !important } .deliveryI=
nfoDot { width: 8px !important; margin-right: 18px !important; margin-left:=
 26px !important; } } @media only screen and (max-width: 320px) { .statusCT=
A { padding: 0px 20px 0px 14px !important; font-size: 12px !important; line=
-height: 21px !important; cursor: pointer !important; margin-top: 12px !imp=
ortant; margin-bottom: 5px; } .statusCTA #MyOrderLinkId{ font-size: 13px !i=
mportant; font-weight:bold !important; } .statusGreen { padding: 10px 10px =
10px 10px !important; } } </style> </head>


<tr style=3D"margin: 0; padding: 0;">
    <td style=3D"margin: 0; padding: 0; border-spacing: 0;">
        <table style=3D"border-collapse: collapse; border-spacing: 0px; mar=
gin:0 auto;" width=3D"100%">
            <tr style=3D"margin: 0; padding: 0;">
                <td class=3D"statusGreen" width=3D"calc(100% - (30*2))"
                    style=3D"margin: 0; padding: 30px; width: calc(100% - (=
30px*2)); padding-top: 20px; background-color: #03a685; color: white;"
                    bgcolor=3D"#03a685">
                    <table style=3D"border-collapse: collapse;" width=3D"10=
0%">
                        <tr style=3D"margin: 0; padding: 0;">
                            <td valign=3D"top" class=3D"statusCurrentLeft" =
style=3D"margin: 0; padding: 0;">
                                <div class=3D"whiteLogo" style=3D"margin: 0=
;padding-top: 5px;width: 30px;margin-right: 20px">
                                    <img style=3D"width:30px;object-fit: co=
ntain;"
                                         src=3D"https://assets.myntassets.c=
om/assets/images/retaillabs/2020/2/10/3d5e9899-76a9-4e38-abf5-6c43e04691481=
581334473847-ic_rad_chk_white-3x.png">
                                </div>
                            </td>
                            <td valign=3D"top" class=3D"statusCurrentRight"=
 style=3D"margin: 0; padding: 0;">

                                <table style=3D"border-collapse:collapse" w=
idth=3D"100%">
                                    <tbody>
                                    <tr style=3D"margin:0;padding:0">
                                        <td style=3D"padding: 0% 3% 0% 0%" =
colspan=3D"2">
                                            <p class=3D"statusText"
                                               style=3D"margin: 0; font-fam=
ily: 'Lato', sans-serif; color: white; padding: 0; float: left; width: 100%=
; font-size: 32px; line-height: normal;">
                                                Sit Back And Relax. Your=20
                                                 Order Is <strong style=3D"=
font-family: 'Lato', sans-serif !important; letter-spacing:0.5px;font-weigh=
t:bold">Confirmed</strong> <span id=3D"PacketCreationTimeId" style=3D"font-=
weight: bold; font-family: 'Lato', sans-serif; padding-left: 5px; opacity: =
0.6; font-size: 12px;"> on                                                 =
Tue, 23 Apr</span>
                                            </p>
                                        </td>
                                    </tr>
                                                                           =
                                                     <tr style=3D"margin:0;=
padding:0">
                                                <td style=3D"padding: 0% 3%=
 0% 0%" colspan=3D"2">
                                                    <p class=3D"subStatusTe=
xt"
                                                       style=3D"line-height=
: 1.38; color:#ffffff;padding: 0; float: left; width: 100%; font-size: 16px=
; opacity: 0.9; font-family: 'Lato', sans-serif; margin-top: 10px;">
                                                        We know you can't w=
ait to get your hands on it. Our team is working hard while ensuring highes=
t safety standards in these tough times. Deliveries may take longer than us=
ual, we are trying our best to deliver it soon.
                                                    </p>
                                                </td>
                                            </tr>
                                                                           =
                                             <tr style=3D"margin:0;padding:=
0">
                                        <td style=3D"padding: 0% 3% 0% 0%" =
colspan=3D"1">
                                            <a class=3D"statusCTA"
                                               style=3D"width:200px;text-al=
ign:center;text-decoration: none;cursor: pointer; float: left; background: =
white; padding: 10px 30px 12px 24px; margin-top: 15px; border-radius: 4px; =
text-transform: uppercase; font-family: 'Lato', sans-serif; font-size: 4px;=
 line-height: 4px;" href=3Dhttps://url41.myntra.com/ls/click?upn=3Du001.m49=
8z1bBGRky-2Baulj243wPOVpFt2QWkmyADismRuv9dYf-2BmZjlDFceNdrLzvhaea0PzPyg-2FB=
aZrPhDJEKUhHIu-2FFdSxX6EZt1OujbO6Tl416RVDxHs4x7hK5No4s8w7lDHWO_ckDpsQMvFFlg=
DZMiyrNr-2Fv3X9tlD6BKNWZYXmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5KVq4SZh=
dFccVC6XXWoB-2FPnRkbNuYc5gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FPWqnv7l=
2AsndMwq-2FZQX8-2BGANaCj3rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7aXfnhz=
eSw6p3MidEe4Kd8wRpvyVRql4eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5lzLGstz92A=
Q1TH604ex8flF-2Bg15Mg2nttnAdn76Q0r18MnrMrXCgsMGQMxDlhDr4DKBYZLLsvf5tmkDGPl-=
2BP1taUhiAh9BaddNWnHp9BxfLXbbbGcEApTg744ekWtiud5JpSzyGOaoV-2B-2FFCdV1bzvli-=
2FWWqMUGK-2B-2FXTw0LaJ-2BWtj9oFFAGIfKmdomfxP95BYeA-3D-3D>
                                                                           =
                         <p id=3D"MyOrderLinkId" class=3D"trackOrder"
                                                       target=3D"_blank"
                                                       style=3D"letter-spac=
ing: 0.44px; font-family: 'Lato', sans-serif; font-weight: bold; font-size:=
 16px; color: black;">
                                                        VIEW ORDER DETAILS
                                                    </p>
                                                                           =
                 </a>
                                        </td>
                                                                           =
 </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr style=3D"margin: 0; padding: 0;">
                <td style=3D"margin: 0; padding: 0;" width=3D"calc(100% - 2=
px)">
                    <table style=3D"border-collapse: collapse;border: 1px s=
olid rgba(40, 44, 63, 0.15); border-top: 0;"
                           width=3D"100%">
                        <tr style=3D"margin: 0; padding: 0;">
                                                            <td class=3D"st=
atusCurrentLeft" style=3D"padding: 0; margin-right: 20px; position: relativ=
e;" width=3D"30">
                                    <img class=3D"deliveryInfoDot" src=3D"h=
ttps://myntracrm.myntassets.com/crm-assets/email/icons/dot_3x.png" style=3D=
"width: 12px; margin-left: 39px; margin-top: 4px; margin-right: 29px; objec=
t-fit: contain;">
                                </td>
                                <td style=3D"margin: 0; padding: 0; width: =
92%;" width=3D"92%">
                                    <p class=3D"deliveryInfo" id=3D"statusN=
extCustomerPromiseTime"
                                       style=3D"padding: 0; color:#3e4152;f=
ont-weight: bold; width: 100%; font-size: 22px;">
                                        <span style=3D"font-family: 'Lato',=
 sans-serif;color: #000000; line-height: normal;">
                                                                           =
                                                         Delivery by
                                                                           =
             <span id=3D"CustomerPromiseTimeId" class=3D"deliveryByClassNam=
e"
                                                  style=3D"font-family: 'La=
to', sans-serif; color: #03a685; font-size: 22px; font-weight: bold;">
                                                Sat,=20
27th
 Apr
                                            </span>
                                                                           =
         </span>
                                    </p>
                                </td>
                                                    </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>
                                   =20




                                                               =20

                                        <head>
        <style>
            @media only screen and (max-width:640px) {
                .statusLightGreen {
                    padding: 40px 40px 0px 20px !important;
                }
                .notLikelyblock {
                    font-size: 9px !important;
                }
                .highLikeBlock {
                    font-size: 9px !important;
                }
                .helpUsImproveId {
                    font-size: 18px !important;
                    height: 22px !important;
                    font-family: 'Lato', sans-serif !important;
                    font-weight: bold !important;
                    padding-top: 12px !important;
                    margin-bottom: 8px !important;
                }
                .helpUsImproveBtns a {
                    color: #ffffff !important;
                    text-align: center !important;
                    border-radius: 50% !important;
                    font-size: 14px !important;
                    font-weight: 900 !important;
                    height: 30px !important;
                    width: 30px !important;
                    display: table-cell;
                    text-align: center;
                    vertical-align: middle;
                    line-height: 30px !important;
                }
                .btnSection {
                    padding: 0% 2% 0% 2% !important;
                }
                .arrowSection {
                    width: 88% !important;
                    padding: 0% 2% 0% 2% !important;
                }
                .helpUsImproveContainer {
                    padding: 12px 16px 16px 16px !important;
                }
                .questionBlock {
                    font-size: 12px !important;
                    font-family: 'Lato', sans-serif !important;
                    padding-top: 0px !important;
                    line-height: 1.42 !important;
                    margin-top: 0 !important;
                }
                .questionGapTD {
                    width: 10% !important;
                }
                .questionMainTD {
                    width: 80% !important;
                }
                .helpUsImproveBtns {
                    width: 18% !important;
                }
                .notLikelyblock span {
                    margin-left: 8% !important;
                }
                .highLikeBlock span {
                    margin-right: 8% !important;
                }
            }
   =20
            @media only screen and (max-width: 540px) {
                .arrowSection {
                    width: 90% !important;
                }
            }
   =20
            @media only screen and (max-width: 480px) {
                .questionGapTD {
                    width: 1% !important;
                }
                .questionMainTD {
                    width: 90% !important;
                }
                .arrowSection {
                    width: 90% !important;
                }
                .notLikelyblock span {
                    margin-left: 8% !important;
                }
                .highLikeBlock span {
                    margin-right: 14% !important;
                }
            }
   =20
            @media only screen and (max-width: 320px) {
                .statusLightGreen {
                    padding: 10px 10px 0px 10px !important;
                }
                .arrowSection {
                    width: 94% !important;
                }
                .notLikelyblock span {
                    margin-left: 8% !important;
                }
                .highLikeBlock span {
                    margin-right: 8% !important;
                }
            }
        </style>
    </head>
        <tr style=3D"margin: 0; padding: 0;">
        <td class=3D"statusLightGreen" style=3D"margin: 0; padding: 30px; w=
idth: calc(100% - (40px*2)); padding-top: 20px; display: contents; font-siz=
e: 18px;"
            width=3D"calc(100% - (30*2))">
            <div style=3D"margin: 0; padding-top: 30px; max-width: 840px !i=
mportant;">
                <table class=3D"helpUsImproveContainer" style=3D"background=
-color: #e1f2f1;     padding: 24px 20px 0px 40px;">
                    <tr style=3D"width:100%;  margin:0px 4% 0px 2%; ">
                            <td style=3D"width:90%;  margin:0px 4% 0px 2%; =
">
                                <p class=3D"helpUsImproveId" style=3D"margi=
n: 0; padding: 0px 0px 25px 0px; float: left; width: 100%; font-size: 30px;=
 font-weight: bold; font-stretch: normal; font-style: normal; line-height: =
1.33; letter-spacing: normal; color: #03a685; font-family: 'Lato',sans-seri=
f;">
                                    Please Share Your Experience</p>
   =20
                                <p id=3D"MFBNpsQuestionId" class=3D"questio=
nBlock" style=3D"padding: 0; float: left; width: 100%; font-size: 16px; fon=
t-weight: normal; font-stretch: normal; font-style: normal; line-height: 1.=
44; letter-spacing: normal; color: #535766; font-family: 'Lato',sans-serif;=
">
                                    Based on your purchase experience on th=
e Myntra app/website, how likely are you to recommend Myntra to your friend=
s and family ?</p>
                            </td>
                        </tr>
                    <tr style=3D"width:100%;  margin:5px auto; font-size: 1=
4px;  font-weight: bold;  padding: 0 10px; text-align:center; ">
                        <td>
                            <table width=3D"100%" class=3D"btnSection">
                                <tr>
                                    <td width=3D"80%" class=3D"questionMain=
TD">
                                        <div class=3D"btnSection" style=3D"=
width: 100%;padding: 0%;text-align: center;">
   =20
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                        <div class=3D"helpUsImproveBtns" style=3D"float: le=
ft;     padding: 1%;     text-align: center;     width: 16%;">
                                                    <a id=3D"MFBLINK-1"
                                                       style=3D"display: ta=
ble-cell; text-align:center; vertical-align: middle;  width:59px;height:39p=
x;font-size:25px;line-height: 59px;  border-radius: 35px;  color: #fff;  ba=
ckground-color: #F16565;  text-decoration: none; "
                                                       href=3D"https://url4=
1.myntra.com/ls/click?upn=3Du001.m498z1bBGRky-2Baulj243wPOVpFt2QWkmyADismRu=
v9dUT-2Bx7qaE49WR8ySgXuLBQ7NErz5-2FjzAHWXmP9LRMFU2eKT0nnuM3VFEpCIWM4WZBWaQ9=
aC1rROpYis4g1oJh5d-2FnS-2BSVA4Q3ExqWZe1idBAUy1-2B-2FOZhh8Dv733g7hxDd9JE8WaW=
8ourz9P9vsEPIKlqBq79-2BrOzPSfvLiZ0jxog-3D-3Dp496_ckDpsQMvFFlgDZMiyrNr-2Fv3X=
9tlD6BKNWZYXmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5KVq4SZhdFccVC6XXWoB-2=
FPnRkbNuYc5gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FPWqnv7l2AsndMwq-2FZQX=
8-2BGANaCj3rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7aXfnhzeSw6p3MidEe4Kd=
8wRpvyVRql4eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5l273DlEhJf7J-2FgGlkx8S-2=
BC0HDiwtPyAZyjqs2xP3vWkX1UWCO8gwdy-2BZMmw1a3hq0HuJ5INQ-2B3nvZlRHjMBDtiRF8wN=
wTzLBHrkYjQw20-2BurtInGrlo-2Bvm1c4ztDjisZpgX8AD8ZJOgX5A9qWkDIaRqhMMpXnkjEXz=
lcqhYqOSK845QKO6s1bUUJR3cFZoKH4w-3D-3D">1</a>
                                                </div>
                                                                           =
                                                                           =
                                                                           =
                                                           <div class=3D"he=
lpUsImproveBtns" style=3D"float: left;     padding: 1%;     text-align: cen=
ter;     width: 16%;">
                                                    <a id=3D"MFBLINK-2"
                                                       style=3D"display: ta=
ble-cell; text-align:center; vertical-align: middle;  width:59px;height:39p=
x;font-size:25px;line-height: 59px;  border-radius: 35px;  color: #fff;  ba=
ckground-color: #F16565;  text-decoration: none; "
                                                       href=3D"https://url4=
1.myntra.com/ls/click?upn=3Du001.m498z1bBGRky-2Baulj243wPOVpFt2QWkmyADismRu=
v9dUT-2Bx7qaE49WR8ySgXuLBQ7NErz5-2FjzAHWXmP9LRMFU2eKT0nnuM3VFEpCIWM4WZBWaQ9=
aC1rROpYis4g1oJh5d-2FnS-2BSVA4Q3ExqWZe1idBAUy1-2B-2FOZhh8Dv733g7hxDd9JE8WaW=
8ourz9P9vsEPIKyksYqdYxRdzt-2Bl3yWn1Gow-3D-3D9ztR_ckDpsQMvFFlgDZMiyrNr-2Fv3X=
9tlD6BKNWZYXmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5KVq4SZhdFccVC6XXWoB-2=
FPnRkbNuYc5gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FPWqnv7l2AsndMwq-2FZQX=
8-2BGANaCj3rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7aXfnhzeSw6p3MidEe4Kd=
8wRpvyVRql4eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5l7w0UXbpGbbY7HJ8NsrIh-2B=
D7JQJRjoHxCypHvHRDbjBdW1VFzbZPyTIi2sJQvzjzYAFfXjYMsVOu0ZMsUZwiW6xha3vTM5ykU=
B1ANNokdMy4h8W0CPi8JKcjRDnfg3-2FG95HkqTWJClHFPULeuN9tmbTiQ1pvZAXkaBaPKXRlim=
-2F61zmC4nN5loiahUT4we29qQ-3D-3D">2</a>
                                                </div>
                                                                           =
                                                                           =
                                                                           =
                                                           <div class=3D"he=
lpUsImproveBtns" style=3D"float: left;     padding: 1%;     text-align: cen=
ter;     width: 16%;">
                                                    <a id=3D"MFBLINK-3"
                                                       style=3D"display: ta=
ble-cell; text-align:center; vertical-align: middle;  width:59px;height:39p=
x;font-size:25px;line-height: 59px;  border-radius: 35px;  color: #fff;  ba=
ckground-color: #F16565;  text-decoration: none; "
                                                       href=3D"https://url4=
1.myntra.com/ls/click?upn=3Du001.m498z1bBGRky-2Baulj243wPOVpFt2QWkmyADismRu=
v9dUT-2Bx7qaE49WR8ySgXuLBQ7NErz5-2FjzAHWXmP9LRMFU2eKT0nnuM3VFEpCIWM4WZBWaQ9=
aC1rROpYis4g1oJh5d-2FnS-2BSVA4Q3ExqWZe1idBAUy1-2B-2FOZhh8Dv733g7hxDd9JE8WaW=
8ourz9P9vsEPIK2txN1aMVDnKczeERlGTZ0w-3D-3Df3Fl_ckDpsQMvFFlgDZMiyrNr-2Fv3X9t=
lD6BKNWZYXmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5KVq4SZhdFccVC6XXWoB-2FP=
nRkbNuYc5gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FPWqnv7l2AsndMwq-2FZQX8-=
2BGANaCj3rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7aXfnhzeSw6p3MidEe4Kd8w=
RpvyVRql4eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5l-2BwdJ4e5mJeiCpVDSLj8EjX5=
WSGVUIkdld-2BJsESkeEa8nUbylWubDzNAHlPNQzuogX3oGJhpDHw0KnSGiE45GPzvNdaHGmNQM=
0B5gnMw9KgBlxrKiM-2BB7EOPOgBpZ79sZB2rAL89iEWmOxZ5nbsQ-2FFWj0Pw3Jsh5p9pyDo-2=
F93Iu5a3A3ccfhpVD1H2CA3cuV-2BQ-3D-3D">3</a>
                                                </div>
                                                                           =
                                                                           =
                                                                           =
                                                           <div class=3D"he=
lpUsImproveBtns" style=3D"float: left;     padding: 1%;     text-align: cen=
ter;     width: 16%;">
                                                    <a id=3D"MFBLINK-4"
                                                       style=3D"display: ta=
ble-cell; text-align:center; vertical-align: middle;  width:59px;height:39p=
x;font-size:25px;line-height: 59px;  border-radius: 35px;  color: #fff;  ba=
ckground-color: #F5A623;  text-decoration: none; "
                                                       href=3D"https://url4=
1.myntra.com/ls/click?upn=3Du001.m498z1bBGRky-2Baulj243wPOVpFt2QWkmyADismRu=
v9dUT-2Bx7qaE49WR8ySgXuLBQ7NErz5-2FjzAHWXmP9LRMFU2eKT0nnuM3VFEpCIWM4WZBWaQ9=
aC1rROpYis4g1oJh5d-2FnS-2BSVA4Q3ExqWZe1idBAUy1-2B-2FOZhh8Dv733g7hxDd9JE8WaW=
8ourz9P9vsEPIKsBokrpsmGxda8-2B3Zd5H99w-3D-3DVmCU_ckDpsQMvFFlgDZMiyrNr-2Fv3X=
9tlD6BKNWZYXmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5KVq4SZhdFccVC6XXWoB-2=
FPnRkbNuYc5gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FPWqnv7l2AsndMwq-2FZQX=
8-2BGANaCj3rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7aXfnhzeSw6p3MidEe4Kd=
8wRpvyVRql4eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5l7WcE-2BASCUzKKxJ1D4iDcm=
xPIvr9Jy6maJiV4ZrQBeCWvIzhGVaQPlcI6jrBPC3-2Befeg-2BVodtSOvh0MeHRmXOrcUkIKjV=
9aJiW5rWtcHLV4-2F94whoRrIi8ow-2BRTWRk0zJUJSpDmO6kyRoiiAsc7XSmtM7VxFqZ8uES-2=
BBmOJqH14JVUFnl-2BgfashSB-2Bc-2BeTTRoQ-3D-3D">4</a>
                                                </div>
                                                                           =
                                                                           =
                                                                           =
                                                           <div class=3D"he=
lpUsImproveBtns" style=3D"float: left;     padding: 1%;     text-align: cen=
ter;     width: 16%;">
                                                    <a id=3D"MFBLINK-5"
                                                       style=3D"display: ta=
ble-cell; text-align:center; vertical-align: middle;  width:59px;height:39p=
x;font-size:25px;line-height: 59px;  border-radius: 35px;  color: #fff;  ba=
ckground-color: #0AC6A0;  text-decoration: none; "
                                                       href=3D"https://url4=
1.myntra.com/ls/click?upn=3Du001.m498z1bBGRky-2Baulj243wPOVpFt2QWkmyADismRu=
v9dUT-2Bx7qaE49WR8ySgXuLBQ7NErz5-2FjzAHWXmP9LRMFU2eKT0nnuM3VFEpCIWM4WZBWaQ9=
aC1rROpYis4g1oJh5d-2FnS-2BSVA4Q3ExqWZe1idBAUy1-2B-2FOZhh8Dv733g7hxDd9JE8WaW=
8ourz9P9vsEPIKfX3EYPIx-2B-2FytqmpbTso1xA-3D-3D0DeM_ckDpsQMvFFlgDZMiyrNr-2Fv=
3X9tlD6BKNWZYXmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5KVq4SZhdFccVC6XXWoB=
-2FPnRkbNuYc5gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FPWqnv7l2AsndMwq-2FZ=
QX8-2BGANaCj3rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7aXfnhzeSw6p3MidEe4=
Kd8wRpvyVRql4eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5lwl-2Bq5coF6JRX4wkTRqo=
Fv0MtMvDjo68ulRzqmMEmn7H1CtmmUlOfB9MlnBKlqT9EFMslyKr6dQiKbOupkwzBxIxhzDsicZ=
dhzBY8bKDuS6Xx5KtLdYkWXCAq2aOs9fVtBK-2FTGXlrnuK-2ByiHl6UCbMVS42VY5K2U8PSNX1=
zqfiTRuuYeqjQGQPP5trm-2Bzk-2B-2FCA-3D-3D">5</a>
                                                </div>
                                               =20
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table width=3D"100%" class=3D"btnSection">
                                <tr>
                                    <td width=3D"100%" class=3D"questionMai=
nTD">
                                        <div class=3D"arrowSection" style=
=3D"width: 80%;padding: 0%;text-align: left;margin-left: 2%;">
                                            <fieldset style=3D" display:tab=
le;    border: 0;  border-top: 1px solid #AAA;  text-align: right;  padding=
: 0;   ">
                                                <legend style=3D" border: s=
olid;  border-width: 4px 0 4px 15px;  border-color: transparent #AAA">
                                                </legend>
                                            </fieldset>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table width=3D"100%" class=3D"btnSection">
                                <tr>
                                    <td width=3D"100%" class=3D"questionMai=
nTD">
                                        <table width=3D"100%">
                                            <tr id=3D"ratingId" style=3D" w=
idth:100%; clear:both; text-align:center; padding:0px; font-style: italic; =
color:#AAA;  font-weight: 100">
                                                <td width=3D"50%" class=3D"=
notLikelyblock" style=3D" text-align: left;   font-family: 'Lato', sans-ser=
if; font-size: 11px; font-weight: normal; font-stretch: normal; font-style:=
 normal; line-height: 1.3; letter-spacing: normal; color: #535766;">
                                                    <span style=3D"margin-l=
eft:5%">Not at all likely</span>
                                                </td>
                                                <td width=3D"50%" class=3D"=
highLikeBlock" style=3D" text-align: right;   font-family: 'Lato', sans-ser=
if; font-size: 11px; font-weight: normal; font-stretch: normal; font-style:=
 normal; line-height: 1.3; letter-spacing: normal; color: #535766;">
   =20
                                                    <span style=3D"margin-r=
ight:28%">Highly likely</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        </tr>
                </table>
            </div>
        </td>
    </tr>
                                                                    </table=
>
                            </td>
                        </tr>
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
   <tr style=3D"margin: 0;
padding:0;
">
                            <td style=3D"padding: 0;
float:none;
margin:0 auto;
width:100%;
" width=3D"100%">
                                <table class=3D"mainInner" style=3D"float: =
none;
margin:0 auto;
width:100%;
" width=3D"100%">
                                    <tr style=3D"margin: 0;
 padding: 0;
">
                                        <td class=3D"roseContainer" style=
=3D"margin: 0;
 padding: 30px 40px 20px 40px ;
background-color: #f5f5f6 !important;
 width: calc(100% - (40px*2));
 border-radius: 8px;
" width=3D"calc(100% - (40*2))">
                                            <table width=3D"100%">

                                                                           =
                     <head>
    <style type=3D"text/css" data-hse-inline-css=3D"true">
        @media only screen and (max-width:640px) {
            .packetOrderTitle {
                font-size: 18px !important;
            }
            .orderPackId{
                font-size: 13px !important;
            }
            .receiveOrderId {
                font-size: 10px !important;
                letter-spacing: 0.3px !important;
            }
            .packetOrderIdContainer {
                padding: 20px !important;
                width: 100%;
                background-color: white;
                border-radius: 8px;
                margin-top: 20px;
                font-size: 17px;
                line-height: 23px;
                color: #7e818c;
                border: solid 0.5px rgba(190, 71, 164, 0.11);
                background-repeat: no-repeat;
                background-size: 32px;
                background-position: right 16px top 16px;
            }

        }
    </style>
</head>
<tr style=3D"margin: 0; padding: 0;">
    <td class=3D"packetOrderIdContainer" style=3D"padding: 20px; background=
-color: white; border-radius: 8px; font-size: 17px; line-height: 23px; colo=
r: #7e818c; margin: 0; border-bottom-left-radius: 0; border-bottom-right-ra=
dius: 0; border-bottom: solid 0.5px #eaeaec;" >
        <div class=3D"packetOrderTitle" style=3D"font-family: 'Lato', sans-=
serif !important;
            font-size: 25px ;color:#282c3f;
            margin-bottom: 14px;">Quick Details</div>
        <ul class=3D"propertyList" style=3D"margin: 0; padding: 0; float: l=
eft; width: 100%; list-style: none; line-height: normal;">
            <li class=3D"receiveOrderId" style=3D"font-family: 'Lato', sans=
-serif !important; margin: 0; padding: 0; float: left; width: 100%; font-si=
ze: 13px; color: #94969f !important; letter-spacing: 0.39px;">Your order ID=
</li>
            <li id=3D"OrderId" class=3D"orderPackId" style=3D"padding: 0; f=
loat: left; width: 100%; font-size: 18px; font-family: 'Lato', sans-serif; =
color: #282c3f !important; margin: 0px;">1265773-4949155-8485803</li>
        </ul>
    </td>
</tr>
                                                <head>
    <style type=3D"text/css" data-hse-inline-css=3D"true">
        .productListContainer {
            margin-bottom: 20px;
            border-bottom: solid 0.5px #eaeaec;
        }

        .productListContainerLastItem, .productListContainerLastBeforeItem =
{
        }

        .productList {
            margin-top:-17px;
            margin: 0;
        }

        .productListMExpress {
            margin-top:-17px;
            margin: 0;
        }

        @media only screen and (max-width:640px) {
            .productListContainer, .productListContainerLastBeforeItem{
                width: 100% !important;
                margin-bottom: 20px;
                border-bottom: solid 1px #eaeaec;
            }

            .productListContainerLastItem {
                width: 100% !important;
            }

            .productListContainer .productListItemImage {
                height: 100px !important;
                width: 74.8px !important;
            }

            .productListContainerLastBeforeItem .productListItemImage {
                height: 100px !important;
                width: 74.8px !important;
            }

            .productListContainerLastItem .productListItemImage {
                height: 100px !important;
                width: 74.8px !important;
            }

            .productList {
                margin-top: 17px;
                margin-left: 12px !important;
                width: calc(100% - 108px) !important;
            }

            .productList li {
                font-size: 12px !important;
                font-weight: 300 !important;
                letter-spacing: 0.22px !important;
                line-height: 1.33 !important;
            }

            .productListMExpress {
                margin-top: 0 !important;
                margin-left: 12px !important;
                width: calc(100% - 108px) !important;
            }

            .productListMExpress li {
                font-size: 12px !important;
                font-weight: 300 !important;
                letter-spacing: 0.22px !important;
                line-height: 1.33 !important;
            }

            .mExpressItemLogo {
                height: 1.2em !important;
                margin-bottom: 5px !important;
            }

            .nonMExpressItemLogo {
                height: 0 !important;
            }

            .nonMExpressItemList {
                margin-top: 0 !important;
            }

            .brandName {
                margin-bottom: 0 !important;
                margin-top: 0 !important;
                font-size: 13px !important;
                width: 100% !important;
                max-width: 100% !important;
            }

            .solidGrey {
                height: 17px !important;
                font-size: 11px !important;
                width: 100% !important;
                max-width: 100% !important;
            }

            .priceSectionBlock {
                font-size: 13px !important;
            }

            .originalPriceBlock {
                font-size: 10px !important;
                color: #a9abb3 !important;
            }

            .savedPriceBlock {
                font-size: 12px !important;
            }

            .noDiscountBlock{
                height: 0 !important;
            }

            .soldBySection .itemExpirySection{
                font-size: 9px !important;
                letter-spacing: 0.16px !important;
                width: 100% !important;
            }

            .tryAndBuyText {
                font-size: 12px !important;
            }

            .tryAndBuyTextHidden {
                font-size: 0 !important;
                height: 0 !important;
            }
        }
    </style>
</head>

<tr style=3D"margin: 0; padding: 0;">
    <td style=3D"margin: 0; background-color: white; font-size: 17px; line-=
height: 23px; color: #7e818c; padding: 24px 20px 0 20px; border-radius: 0 0=
 8px 8px;">
        <ul class=3D"productListContainerList" style=3D"margin: 0; padding:=
 0; float: left; width: 100%; list-style: none; line-height: normal;">

           =20
                                                           =20
                                                                           =
                            =20
                                                                           =
                            =20
                                                                           =
                            =20
                                                                           =
                    =20
                       =20
                                                               =20
               =20

                               =20
                               =20
                <li class=3DproductListContainer style=3D"font-family: 'Lat=
o', sans-serif !important; margin: 0; padding: 0; float: left; width: 50%; =
padding-bottom: 20px;">
                <img class=3D"productListItemImage" id=3DItemImageUrl-98837=
99319 src=3D"http://assets.myntassets.com/h_480,q_95,w_360/v1/assets/images=
/25827204/2024/2/8/350c4031-5b65-40ad-8a08-4c6e4b48b89d1707366337315-WROGN-=
Men-Shirts-3251707366336830-1.jpg" style=3D"margin-top: 17px;float: left; b=
order-radius: 5px; height: auto; width: 105px; margin-right: 20px;" width=
=3D"105">
                <ul class=3DproductList style=3D"padding:0; float: left; li=
st-style: none; width: 57%; color: #535766; font-family: 'Lato', sans-serif=
!important;">

                   =20
                   =20
 =09=09   =20
                    <li id=3DItemProductDescription-9883799319 style=3D"mar=
gin:0;font-weight:bold;padding:0;float:left;width:100%;font-family:'Lato',s=
ans-serif!important;color:#282c3f!important;letter-spacing:0.29px">
                   =20
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                =20

                    <p id=3DItemProductBrandName-9883799319 class=3D"brandN=
ame" style=3D" margin-bottom:0;font-weight:bold;font-size:16px;font-family:=
'Lato',sans-serif!important;display:inline-block;white-space:nowrap;overflo=
w:hidden!important;text-overflow:ellipsis;max-width:100%">WROGN</p>
                    <span id=3DItemProductName-9883799319 class=3D"solidGre=
y" style=3D"font-size:14px; font-weight:normal; color:#535766 !important;fo=
nt-family:'Lato',sans-serif!important;display:inline-block;max-width:100%;m=
argin-top: 2px;"> Cuban Collar Casual Shirt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&n=
bsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </li>
                    <li class=3D"sizeAndQuantity" style=3D"margin: 0; paddi=
ng: 0; float: left; width: 100%; font-family: 'Lato', sans-serif !important=
; font-size: 16px; margin-top: 10px; color: #282c3f; letter-spacing: 0.29px=
;">
                                                Size<span class=3D"sizeCoun=
t" id=3DItemSize-9883799319 style=3D"font-weight: bold;"> 44</span>
                        | Qty<span id=3DItemQuantity-9883799319 style=3D"fo=
nt-weight: bold;"> 1</span>
                    </li>
                    <li class=3D"priceSectionBlock" style=3D"margin: 0;padd=
ing: 0;float: left;width: 100%;font-size: 16px;
                                        font-family: 'Lato', sans-serif !im=
portant;margin-top: 10px;color: #282c3f;font-weight: bold !important;">
                        <span id=3DItemTotal-9883799319> &#8377;1401.00 </s=
pan>
                                                    <span class=3D"original=
PriceBlock" id=3DItemPrice-9883799319 style=3D"font-family: 'Lato', sans-se=
rif !important; font-size: 13px; color: #a9abb3 !important; font-weight: no=
rmal; letter-spacing: normal; text-decoration: line-through;">
                            &#8377;2499.00
                            </span>
                                            </li>

                                       =20
                    <li class=3DsavedPriceBlock style=3D"font-family: 'Lato=
', sans-serif !important;float: left; width: 100%; border: none; margin: 0;=
 padding: 0; font-size: 16px; color: #535766;; margin-top: 2px;">
                                                    <span>Saved </span>
                            <span id=3DItemDiscount-9883799319 style=3D"col=
or: #03a685;font-weight: bold;">
                            &#8377;1098.00
                            </span>
                                            </li>
                   =20
                </ul>
                                                    <div class=3D"soldBySec=
tion" id=3DItemSellerName-9883799319
                            style=3D" font-family: 'Lato', sans-serif !impo=
rtant; float: left; font-size: 14px; width:100%; margin-top:12px; color: #7=
e818c; clear: both; float: left;white-space: nowrap;overflow: hidden !impor=
tant;text-overflow: ellipsis;">
                    Sold by: Flashstar Commerce</div>
                                                </li>
           =20
                                                               =20
               =20

                               =20
                               =20
                <li class=3DproductListContainer style=3D"font-family: 'Lat=
o', sans-serif !important; margin: 0; padding: 0; float: left; width: 50%; =
padding-bottom: 20px;">
                <img class=3D"productListItemImage" id=3DItemImageUrl-98837=
99321 src=3D"http://assets.myntassets.com/h_480,q_95,w_360/v1/assets/images=
/22776358/2023/5/5/57a25038-4ea0-4ea3-b1ac-fd9eaf904db71683282192273-Blackb=
errys-Men-Shirts-1331683282191794-1.jpg" style=3D"margin-top: 17px;float: l=
eft; border-radius: 5px; height: auto; width: 105px; margin-right: 20px;" w=
idth=3D"105">
                <ul class=3DproductList style=3D"padding:0; float: left; li=
st-style: none; width: 57%; color: #535766; font-family: 'Lato', sans-serif=
!important;">

                   =20
                   =20
 =09=09   =20
                    <li id=3DItemProductDescription-9883799321 style=3D"mar=
gin:0;font-weight:bold;padding:0;float:left;width:100%;font-family:'Lato',s=
ans-serif!important;color:#282c3f!important;letter-spacing:0.29px">
                   =20
                                                                           =
    =20

                    <p id=3DItemProductBrandName-9883799321 class=3D"brandN=
ame" style=3D" margin-bottom:0;font-weight:bold;font-size:16px;font-family:=
'Lato',sans-serif!important;display:inline-block;white-space:nowrap;overflo=
w:hidden!important;text-overflow:ellipsis;max-width:100%">Blackberrys</p>
                    <span id=3DItemProductName-9883799321 class=3D"solidGre=
y" style=3D"font-size:14px; font-weight:normal; color:#535766 !important;fo=
nt-family:'Lato',sans-serif!important;display:inline-block;max-width:100%;m=
argin-top: 2px;"> Pure Cotton India Slim Fit Casual Shirt...</span>
                    </li>
                    <li class=3D"sizeAndQuantity" style=3D"margin: 0; paddi=
ng: 0; float: left; width: 100%; font-family: 'Lato', sans-serif !important=
; font-size: 16px; margin-top: 10px; color: #282c3f; letter-spacing: 0.29px=
;">
                                                Size<span class=3D"sizeCoun=
t" id=3DItemSize-9883799321 style=3D"font-weight: bold;"> 42</span>
                        | Qty<span id=3DItemQuantity-9883799321 style=3D"fo=
nt-weight: bold;"> 1</span>
                    </li>
                    <li class=3D"priceSectionBlock" style=3D"margin: 0;padd=
ing: 0;float: left;width: 100%;font-size: 16px;
                                        font-family: 'Lato', sans-serif !im=
portant;margin-top: 10px;color: #282c3f;font-weight: bold !important;">
                        <span id=3DItemTotal-9883799321> &#8377;1436.00 </s=
pan>
                                                    <span class=3D"original=
PriceBlock" id=3DItemPrice-9883799321 style=3D"font-family: 'Lato', sans-se=
rif !important; font-size: 13px; color: #a9abb3 !important; font-weight: no=
rmal; letter-spacing: normal; text-decoration: line-through;">
                            &#8377;2195.00
                            </span>
                                            </li>

                                       =20
                    <li class=3DsavedPriceBlock style=3D"font-family: 'Lato=
', sans-serif !important;float: left; width: 100%; border: none; margin: 0;=
 padding: 0; font-size: 16px; color: #535766;; margin-top: 2px;">
                                                    <span>Saved </span>
                            <span id=3DItemDiscount-9883799321 style=3D"col=
or: #03a685;font-weight: bold;">
                            &#8377;759.00
                            </span>
                                            </li>
                   =20
                </ul>
                                                    <div class=3D"soldBySec=
tion" id=3DItemSellerName-9883799321
                            style=3D" font-family: 'Lato', sans-serif !impo=
rtant; float: left; font-size: 14px; width:100%; margin-top:12px; color: #7=
e818c; clear: both; float: left;white-space: nowrap;overflow: hidden !impor=
tant;text-overflow: ellipsis;">
                    Sold by: Flashstar Commerce</div>
                                                </li>
           =20
                                                               =20
               =20

                                               =20
                               =20
                <li class=3DproductListContainerLastBeforeItem style=3D"fon=
t-family: 'Lato', sans-serif !important; margin: 0; padding: 0; float: left=
; width: 50%; padding-bottom: 20px;">
                <img class=3D"productListItemImage" id=3DItemImageUrl-98837=
99315 src=3D"http://assets.myntassets.com/h_480,q_95,w_360/v1/assets/images=
/25827786/2024/2/1/a623967a-9e15-4d69-a08c-910eece017771706788351024-WROGN-=
Men-Jeans-861706788350555-1.jpg" style=3D"margin-top: 17px;float: left; bor=
der-radius: 5px; height: auto; width: 105px; margin-right: 20px;" width=3D"=
105">
                <ul class=3DproductList style=3D"padding:0; float: left; li=
st-style: none; width: 57%; color: #535766; font-family: 'Lato', sans-serif=
!important;">

                   =20
                   =20
 =09=09   =20
                    <li id=3DItemProductDescription-9883799315 style=3D"mar=
gin:0;font-weight:bold;padding:0;float:left;width:100%;font-family:'Lato',s=
ans-serif!important;color:#282c3f!important;letter-spacing:0.29px">
                   =20
                                                                           =
    =20

                    <p id=3DItemProductBrandName-9883799315 class=3D"brandN=
ame" style=3D" margin-bottom:0;font-weight:bold;font-size:16px;font-family:=
'Lato',sans-serif!important;display:inline-block;white-space:nowrap;overflo=
w:hidden!important;text-overflow:ellipsis;max-width:100%">WROGN</p>
                    <span id=3DItemProductName-9883799315 class=3D"solidGre=
y" style=3D"font-size:14px; font-weight:normal; color:#535766 !important;fo=
nt-family:'Lato',sans-serif!important;display:inline-block;max-width:100%;m=
argin-top: 2px;"> Men Light Fade Cargo Fit Stretchable Je...</span>
                    </li>
                    <li class=3D"sizeAndQuantity" style=3D"margin: 0; paddi=
ng: 0; float: left; width: 100%; font-family: 'Lato', sans-serif !important=
; font-size: 16px; margin-top: 10px; color: #282c3f; letter-spacing: 0.29px=
;">
                                                Size<span class=3D"sizeCoun=
t" id=3DItemSize-9883799315 style=3D"font-weight: bold;"> 34</span>
                        | Qty<span id=3DItemQuantity-9883799315 style=3D"fo=
nt-weight: bold;"> 1</span>
                    </li>
                    <li class=3D"priceSectionBlock" style=3D"margin: 0;padd=
ing: 0;float: left;width: 100%;font-size: 16px;
                                        font-family: 'Lato', sans-serif !im=
portant;margin-top: 10px;color: #282c3f;font-weight: bold !important;">
                        <span id=3DItemTotal-9883799315> &#8377;1569.00 </s=
pan>
                                                    <span class=3D"original=
PriceBlock" id=3DItemPrice-9883799315 style=3D"font-family: 'Lato', sans-se=
rif !important; font-size: 13px; color: #a9abb3 !important; font-weight: no=
rmal; letter-spacing: normal; text-decoration: line-through;">
                            &#8377;2799.00
                            </span>
                                            </li>

                                       =20
                    <li class=3DsavedPriceBlock style=3D"font-family: 'Lato=
', sans-serif !important;float: left; width: 100%; border: none; margin: 0;=
 padding: 0; font-size: 16px; color: #535766;; margin-top: 2px;">
                                                    <span>Saved </span>
                            <span id=3DItemDiscount-9883799315 style=3D"col=
or: #03a685;font-weight: bold;">
                            &#8377;1230.00
                            </span>
                                            </li>
                   =20
                </ul>
                                                    <div class=3D"soldBySec=
tion" id=3DItemSellerName-9883799315
                            style=3D" font-family: 'Lato', sans-serif !impo=
rtant; float: left; font-size: 14px; width:100%; margin-top:12px; color: #7=
e818c; clear: both; float: left;white-space: nowrap;overflow: hidden !impor=
tant;text-overflow: ellipsis;">
                    Sold by: Flashstar Commerce</div>
                                                </li>
           =20
                                                               =20
               =20

                                               =20
                               =20
                <li class=3DproductListContainerLastItem style=3D"font-fami=
ly: 'Lato', sans-serif !important; margin: 0; padding: 0; float: left; widt=
h: 50%; padding-bottom: 20px;">
                <img class=3D"productListItemImage" id=3DItemImageUrl-98837=
99317 src=3D"http://assets.myntassets.com/h_480,q_95,w_360/v1/assets/images=
/26898624/2024/2/27/1e8546b8-7549-4bf3-a0df-b5be2abab6221709013295428-WROGN=
-Men-Shirts-6021709013294936-1.jpg" style=3D"margin-top: 17px;float: left; =
border-radius: 5px; height: auto; width: 105px; margin-right: 20px;" width=
=3D"105">
                <ul class=3DproductList style=3D"padding:0; float: left; li=
st-style: none; width: 57%; color: #535766; font-family: 'Lato', sans-serif=
!important;">

                   =20
                   =20
 =09=09   =20
                    <li id=3DItemProductDescription-9883799317 style=3D"mar=
gin:0;font-weight:bold;padding:0;float:left;width:100%;font-family:'Lato',s=
ans-serif!important;color:#282c3f!important;letter-spacing:0.29px">
                   =20
                                                                           =
    =20

                    <p id=3DItemProductBrandName-9883799317 class=3D"brandN=
ame" style=3D" margin-bottom:0;font-weight:bold;font-size:16px;font-family:=
'Lato',sans-serif!important;display:inline-block;white-space:nowrap;overflo=
w:hidden!important;text-overflow:ellipsis;max-width:100%">WROGN</p>
                    <span id=3DItemProductName-9883799317 class=3D"solidGre=
y" style=3D"font-size:14px; font-weight:normal; color:#535766 !important;fo=
nt-family:'Lato',sans-serif!important;display:inline-block;max-width:100%;m=
argin-top: 2px;"> Pure Cotton Self Design Textured Seersu...</span>
                    </li>
                    <li class=3D"sizeAndQuantity" style=3D"margin: 0; paddi=
ng: 0; float: left; width: 100%; font-family: 'Lato', sans-serif !important=
; font-size: 16px; margin-top: 10px; color: #282c3f; letter-spacing: 0.29px=
;">
                                                Size<span class=3D"sizeCoun=
t" id=3DItemSize-9883799317 style=3D"font-weight: bold;"> 42</span>
                        | Qty<span id=3DItemQuantity-9883799317 style=3D"fo=
nt-weight: bold;"> 1</span>
                    </li>
                    <li class=3D"priceSectionBlock" style=3D"margin: 0;padd=
ing: 0;float: left;width: 100%;font-size: 16px;
                                        font-family: 'Lato', sans-serif !im=
portant;margin-top: 10px;color: #282c3f;font-weight: bold !important;">
                        <span id=3DItemTotal-9883799317> &#8377;1345.00 </s=
pan>
                                                    <span class=3D"original=
PriceBlock" id=3DItemPrice-9883799317 style=3D"font-family: 'Lato', sans-se=
rif !important; font-size: 13px; color: #a9abb3 !important; font-weight: no=
rmal; letter-spacing: normal; text-decoration: line-through;">
                            &#8377;2399.00
                            </span>
                                            </li>

                                       =20
                    <li class=3DsavedPriceBlock style=3D"font-family: 'Lato=
', sans-serif !important;float: left; width: 100%; border: none; margin: 0;=
 padding: 0; font-size: 16px; color: #535766;; margin-top: 2px;">
                                                    <span>Saved </span>
                            <span id=3DItemDiscount-9883799317 style=3D"col=
or: #03a685;font-weight: bold;">
                            &#8377;1054.00
                            </span>
                                            </li>
                   =20
                </ul>
                                                    <div class=3D"soldBySec=
tion" id=3DItemSellerName-9883799317
                            style=3D" font-family: 'Lato', sans-serif !impo=
rtant; float: left; font-size: 14px; width:100%; margin-top:12px; color: #7=
e818c; clear: both; float: left;white-space: nowrap;overflow: hidden !impor=
tant;text-overflow: ellipsis;">
                    Sold by: Flashstar Commerce</div>
                                                </li>
                    </ul>
    </td>
</tr>
                                               =20
                                                <tr style=3D"margin: 0;
 padding: 0;
">
                                                    <td class=3D"horizontal=
Row" height=3D"20px" style=3D"margin: 0;
 padding: 0;
"></td>
                                                </tr>

                                                <head>
    <style>
        @media only screen and (max-width:640px) {
            .pricBreakupList li {
                font-size: 12px !important;
                line-height: 1.83 !important;
            }
            .halfCol {
                width: inherit;
                display: block !important;
                margin-bottom: 20px !important;
            }
            .widgetTitle {
                margin-bottom: 14px;
                color: #282c3f;
                font-size: 18px !important;
                height: 22px !important;
            }
            .priceBreakAmount ul li {
                width: 50% !important;
                float: left !important;
            }
            .pricBreakupList li:first-child,
            .pricBreakupList li:nth-child(2) {
                font-size: 18px;
            }
            .total_Refund_Amt {
                font-size: 16px !important;
                color: #3e4152 !important;
            }
            .pricBreakupList img {
                width: 28px !important;
                margin-left: 5px;
                margin-top: 6px;
            }
            .pricBreakupList #PlatformCharge-shipping{
                width:70% !important;
            }
            .pricBreakupList #PlatformChargeAmount-shipping{
                width:30% !important;
            }

            .pricBreakupList #ShippingFreeNameId{
                width:70% !important;
            }
            .pricBreakupList #ShippingFreeAmountId{
                width:30% !important;
            }
        }
        @media only screen and (max-width:480px) {
            .pricBreakupList li {
                font-size: 11px !important;
            }

        }

        @media only screen and (max-width:360px) {
            .pricBreakupList li {
                font-size: 10px !important;
            }

        }

    </style>
</head>
<tr style=3D"margin: 0; padding: 0;">
    <td style=3D"margin: 0; padding: 0;">
        <table style=3D"border-collapse: collapse;width:100%">
            <tr style=3D"margin: 0; padding: 0;">
                <td class=3D"halfCol" style=3D"margin: 0; padding: 20px; ba=
ckground-color: white; border-radius: 8px; font-size: 17px; line-height: 23=
px; color: #7e818c;">
                    <table style=3D"border-collapse: collapse; width: 100%;=
">
                        <tr style=3D"margin: 0; padding: 0;">
                            <td style=3D"margin: 0; padding: 0; width: 100%=
;"> <span class=3D"widgetTitle" style=3D"font-family: 'Lato',sans-serif !im=
portant; color: #282c3f; font-size: 25px;">
                                Price breakup     </span>
                            <div class=3D"priceBreakAmount" style=3D"margin=
: 0 auto;">
                            <ul class=3D"pricBreakupList" style=3D"margin: =
0; padding: 0; float: left; width: 100%; list-style: none; font-family: 'La=
to',sans-serif; font-size: 15px; color: #7e818c;  padding-bottom: 15px; mar=
gin-top: 20px;">
                                                               =20
                                                                           =
                                                                           =
                                                                           =
          =20
                                                                           =
            =20
                                                                           =
                                                                           =
                                                                           =
                                                          =20
                                                                           =
            =20
                                                                           =
                                                                           =
                                                                           =
                                                          =20
                                                                           =
            =20
                                                                           =
                                                                           =
                                                                           =
                                                          =20
                                                                           =
            =20
                                                                           =
                                        =20
=09
                                   =20
                                    <li class=3D"priceBreakupLeft" style=3D=
"font-family: 'Lato',sans-serif;font-size: 14px;line-height: 1.79;letter-sp=
acing: normal;color: #7e818c;float: left;margin: 0;width: 50%;">
                                        <div id=3DTotalMrpNameId>MRP</div>
                                    </li>
                                    <li class=3D"priceBreakupLeft" style=3D=
"font-family: 'Lato',sans-serif;font-size: 14px;line-height: 1.79;font-weig=
ht: bold;letter-spacing: normal;color: #282c3f;float: left;width: 50%;margi=
n: 0;text-align: right;">
                                        <div id=3DTotalMrpAmountId>&#8377;9=
892.00</div>
                                    </li>
                                                                       =20
                                    <li class=3D"priceBreakupLeft" style=3D=
"font-family:'Lato',sans-serif;font-size: 14px;line-height: 1.79;letter-spa=
cing: normal;color: #7e818c;float: left;margin: 0;width: 50%;">
                                        <div id=3DTotalDiscountNameId>Disco=
unt</div>
                                    </li>

                                    <li style=3D"font-family: 'Lato',sans-s=
erif;font-size: 14px;line-height: 1.79;font-weight: bold;letter-spacing: no=
rmal;color: #282c3f;float: left;width: 50%;margin: 0;text-align: right;">
                                        <div id=3DTotalDiscountAmountId>- &=
#8377;3739.00</div>
                                    </li>

                                   =20
                                    <li style=3D"font-family: 'Lato',sans-s=
erif;font-size: 14px;line-height: 1.79;letter-spacing: normal;color: #7e818=
c;float: left;width: 50%;margin: 0;border-top: 1px solid #eaeaec;border-bot=
tom: 1px solid #eaeaec;padding: 5px 0px;margin-top: 11px;">
                                        <div id=3DDiscountedPriceNameId>Dis=
counted Price</div>
                                    </li>
                                    <li style=3D"font-family: 'Lato',sans-s=
erif;font-size: 14px;line-height: 1.79;font-weight: bold;letter-spacing: no=
rmal;color: #282c3f;float: left;width: 50%;margin: 0;text-align: right;bord=
er-top: 1px solid #eaeaec;border-bottom: 1px solid #eaeaec;padding: 5px 0px=
;margin-top: 11px;" id=3D"discountedPrice">
                                                                           =
     <div id=3DDiscountedPriceAmountId>&#8377;6153.00</div>
                                    </li>
                                    =09=09=09

=09=09=09=09                   =20
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                        <li id=3DDiscount-coupon style=3D"f=
ont-family: 'Lato',sans-serif;font-size: 14px; line-height: 1.79;letter-spa=
cing: normal;color: #7e818c;float: left;width: 50%;margin: 0;">
                                             Coupon Discount
                                                                           =
             </li>
                                            <li id=3DDiscountAmount-coupon =
style=3D"font-family: 'Lato',sans-serif;font-size: 14px;line-height: 1.79;f=
ont-weight: bold;letter-spacing: normal;color:#14958f;float: left;width: 50=
%;margin: 0;text-align: right;"> - &#8377;402.00 </li>=20
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                 =20

                                   =20
                                                                           =
                                                                           =
                                                                           =
                                                                           =
            =20
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
               =20
                                                                           =
        <li id=3DPlatformCharge-Platform Fee style=3D"font-family: 'Lato',s=
ans-serif;font-size: 14px;line-height: 1.79;letter-spacing: normal;color: #=
7e818c;float: left; margin: 0;width: 50%;"> Platform Fee </li>
                                            <li id=3DPlatformChargeAmount-P=
latform Fee style=3D"font-family: 'Lato',sans-serif;font-size: 14px;line-he=
ight: 1.79;font-weight: bold;letter-spacing: normal;color: #282c3f;float: l=
eft;width: 50%;margin: 0;text-align: right;"> &#8377;20.00</li>
                                                                           =
=20

=09=09=09=09
=09=09=09=09                                    <ul class=3D"pricBreakupLis=
t" style=3D"margin: 0; padding: 0; float: left; width: 100%; list-style: no=
ne; font-family: 'Lato',sans-serif; font-size: 15px; color: #7e818c;  paddi=
ng-bottom: 0px; border-top: 1px solid #eaeaec;">
                                        <li style=3D"font-family: 'Lato',sa=
ns-serif;font-size: 14px;line-height: 1.79;letter-spacing: normal;font-styl=
e: normal;font-weight: bold;color: #202124;float: left;width: 50%;margin: 0=
;border-top: 1px solid #eaeaec;padding-top: 5px;">
                                            <div id=3DTotalAmountNameId>Tot=
al Amount</div>
                                        </li>
                                        <li id=3D"BillingTotalAmount" style=
=3D"font-family: 'Lato',sans-serif;font-size: 18px;line-height: 1.79;font-w=
eight: bold;letter-spacing: normal;color: #282c3f;float: left;width: 50%;ma=
rgin: 0;text-align: right;padding-top: 5px;">
                                            <div id=3DTotalAmountValueId>
                                               &#8377;5771.00
                                            </div>
                                        </li>
                                    </ul>

                                                           =20
                                </ul>
                                </div>
                                   =20
                                    <ul class=3D"pricBreakupList" style=3D"=
margin: 0; padding: 0; float: left; width: 100%; list-style: none; font-fam=
ily: 'Lato',sans-serif; font-size: 15px; color: #7e818c;  padding-bottom: 1=
5px; border-top: 1px solid #eaeaec;">
                                        <li style=3D"font-family: 'Lato',sa=
ns-serif;font-size: 14px;line-height: 1.79;letter-spacing: normal;font-styl=
e: normal;font-weight: bold;color: #282c3f;float: left;width: 50%;margin: 0=
;border-top: 1px solid #eaeaec;padding-top: 5px;">
                                            <div id=3DTotalAmountNameId>Net=
 Paid</div>
                                        </li>
                                        <li id=3D"BillingTotalAmount" style=
=3D"font-family: 'Lato',sans-serif;font-size: 18px;line-height: 1.79;font-w=
eight: bold;letter-spacing: normal;color: #282c3f;float: left;width: 50%;ma=
rgin: 0;text-align: right;padding-top: 5px;">
                                            <div id=3DTotalAmountValueId>
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                                                                           =
                               &#8377;5771.00
                                                                           =
                 </div>
                                        </li>
                                                                           =
                                            =20
                                        <li style=3D"margin-bottom: 5px;fon=
t-size: 15px;float: left;margin: 0;width: 100%;">
                                            <p style=3D"margin: 0; padding:=
 0; float: left; width: 100%; font-family: 'Lato',sans-serif;  font-weight:=
 normal; font-stretch: normal; font-style: normal; line-height: normal; let=
ter-spacing: normal; color: #535766;"> You saved  <span id=3DFinalDiscountV=
alueId style=3D"color: #03a685">&#8377;4141.00</span> on this order.
                                            </p>
                                        </li>
                                                                           =
 </ul>
                                    <head>
    <style>
        @media only screen and (min-width: 640px) {
            .colOrderContainer {
                display: table;
                width: 100%;
            }
            .orderPaymentModeSection {
                display: table-cell;
                width: 49%;
                padding: 16px;
                min-height: auto;
            }
        }
        @media only screen and (max-width:640px) {
            .orderPaymentModeSection {
                width: 100% !important;
                margin-top: 15px !important;
                font-size: 13px !important;
                min-height: 52px !important;
            }


            .myntraCreditPaymentModeSection {
                width: 90% !important;
                margin-top: 15px !important;
                font-size: 13px !important;
                min-height: 52px !important;
                padding-right: 10% !important;
                margin-left: 2% !important;
            }

            .orderPaymentModeImg {
                padding :5% !important;
                width: 50px !important;
                padding-bottom: 7% !important;
            }

            .myntraCreditPaymentModeImg {
                padding : 2% 5% 2% 5% !important;
                width: 30px !important;
            }

            .paymentModeText {
                margin-top: 2% !important;
                width:90% !important;
            }

     .paymentModeDopeText {
                margin-top: 6% !important;
                width:90% !important;
            }=20

            .myntraCreditPaymentModeText {
                margin-top: 2% !important;
                width:90% !important;
                font-size: 15px;
            }
        }

        @media only screen and (max-width: 320px){

            .orderPaymentModeImg {
                padding: 5% !important;
                width: 50px !important;
                padding-bottom: 20% !important;
            }

            .myntraCreditPaymentModeImg {
                padding : 2% 5% 2% 5% !important;
                width: 30px !important;
            }

     .paymentModeDopeText {
                margin-top: 3% !important;
                width:90% !important;
            }=20
        }
    </style>
</head>



    <div class=3D"colOrderContainer">
       =20
                       =20
           =20
                                                                           =
                                             <div class=3D"orderPaymentMode=
Section" style=3D"float: left; width: 100%; margin: 0; padding: 0; border: =
none; background-color: #f5f5f6;min-height: 51px; list-style: none; font-we=
ight:bold; font-family: 'Lato',sans-serif; font-size: 17px; color: #535766;=
 padding: 0px; margin-top: 0px;">
                                                                           =
                                                                           =
                                                                           =
      =20
                                <img id=3DPaymentModeImageIconId class=3D"o=
rderPaymentModeImg" style=3D"padding: 3%;float: left;object-fit: contain;pa=
dding-bottom: 5%;" width=3D"50" src=3Dhttps://myntracrm.myntassets.com/crm-=
assets/email/icons/visa_3x.png>


                                <div class=3D"paymentModeText" style=3D"pad=
ding: 0%;margin-top: 3%;">Paid by
                                   =20
                                                                           =
                                             <span style=3D"text-transform:=
 uppercase;font-size: 15px;" id=3DPaymentOptionBankNameId>ICICI</span>
                                                                           =
                                    =20
                                    <span id=3D"PaymentOptionNameId">Credit=
 Card</span>
                                   =20
                                                                           =
 ending in <span id=3DLastFourDigitsNumberId>  6004 </span>
                                                                    </div>
                                                    </div>
                                                                           =
                                                                           =
                                                                 =20
           =20
                        </div>
                                                                           =
  </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>
                                                                           =
                        =20
   =20
   =20
       =20

           =20

   =20
                                           =20

    <head> <style> @media only screen and (max-width: 640px) { .onlyDesktop=
 { display: none !important; } .halfWidgetsCollectionTable { display: table=
; margin: 0px 0 !important; } .halfWidgetsCollectionTableStudio { display: =
table; margin: 0px 0 !important; margin-top: 10px !important; } .halfWidget=
sCollectionTableCell { margin-top: 10px; width: 100% !important; display: b=
lock !important; } .widgetContainerInfoPlatform { padding: 15px 20px 30px 2=
0px !important; position: inherit !important; width: calc(100% - (20px*2)) =
!important; background-size: 24px !important; background-position: right 16=
px top 12px !important; } .widgetContainerInfo { padding: 20px 20px 20px 20=
px !important; position: inherit !important; width: calc(100% - (20px*2)) !=
important; background-size: 24px !important; background-position: right 16p=
x top 12px !important; } .invoicePad { padding: 15px 20px 50px 20px !import=
ant; } .widgetContainerInfoReturnCancel { padding: 15px 20px 20px 20px !imp=
ortant; position: inherit !important; background-size: 24px !important; bac=
kground-position: right 16px top 12px !important; } .informationTitle { fon=
t-size: 18px !important; margin-bottom: 4px !important; } .informationSubTi=
tle { font-size: 12px !important; line-height: 1.42 !important; letter-spac=
ing: 0.22px !important; } .earnedPoints { line-height: normal !important; f=
ont-size: 12px !important; margin-top: 0px !important; } .myntraPoint { fon=
t-size: 9px !important; margin-top: 15px !important; } .downloadInvoice { f=
ont-size: 13px !important; width: 100% !important; height: 12px !important;=
 } .downloadInvoiceAvailableDate { font-size: 10px !important; width: 100% =
!important; margin-left: 5px !important; margin-top: 3px !important; } .fle=
xRow { position: inherit !important; } .imgInvoiceDounload { height: 10px !=
important; } .onlyForMobile { display: table !important; } .onlyForDesktop =
{ display: none !important; } .return_deliveryInfoDot { margin-left: 0 !imp=
ortant; margin-right: 18px !important; } .downloadInvoiceAvailableDateForPl=
atform { font-size: 8px!important; width: 70%!important; margin-left: 5px!i=
mportant; } } @media only screen and (max-width: 480px) { .downloadInvoiceA=
vailableDateForPlatform { font-size: 8px!important; width: 70%!important; m=
argin-left: 5px!important; } } </style> </head>

    <tr style=3D"margin: 0; padding: 0;">
        <td style=3D"margin: 0; padding: 0;">
            <div class=3D"halfWidgetsCollection">
                <div class=3D"halfWidgetsCollectionTable" style=3D"display:=
 table;margin: 20px 0; width: 100%;">
                                                                           =
                                     <div class=3D"halfWidgetsCollectionTab=
leCell" id=3D"AddressBlockId" style=3D" vertical-align: top; display: table=
-cell; width: 50%; background-repeat: no-repeat; background-size: 32px; bac=
kground-position: right 16px top 16px; background-image: url(assets/icons/i=
c_core_helpCenter.svg); border: solid 0.5px rgba(190, 147, 71, 0.11); borde=
r-radius: 4px; background-color: #ffffff;">
                            <div class=3D"widgetContainerInfo" style=3D"mar=
gin: 0; font-size: 17px; line-height: 23px; padding: 20px 20px 20px 20px; c=
olor: #282c3f;">
                                <p class=3D"informationTitle" style=3D"marg=
in: 0;  padding: 0; width: 100%; font-family: 'Lato', sans-serif; color: #2=
82c3f; font-size: 25px; margin-bottom: 16px; font-weight: normal; font-stre=
tch: normal; font-style: normal; line-height: normal; letter-spacing: norma=
l;">
                                    Delivering at</p>=20
                                <div class=3D"informationSubTitle" style=3D=
"margin: 0 0 0 0; padding: 0 0 0 0; width: 100%; font-family: 'Lato', sans-=
serif; font-size: 16px; line-height: 1.38; letter-spacing: 0.29px; color: #=
7e818c; font-weight: normal; font-stretch: normal; font-style: normal;">
                                                                           =
 <span id=3D"ReceiverName"><strong style=3D" font-weight: bold; color: #3e4=
152;">Devansh Chaudhary</strong>,</span>
                                                                           =
                                 <span id=3D"AddressId">720, 9th Cross Road=
, 10th A Main, Indiranagar</span>,
                                                                           =
 <span id=3D"LocalityId">Indiranagar  (Bangalore)</span>,
                                                                        <sp=
an id=3D"CityId">Bengaluru</span>,
                                    <span id=3D"StateId">Karnataka</span>
                                    <span id=3D"ZipcodeId">560038</span>
                                                                    </div>
                                                            </div>
                        </div>
                   =20
                   =20
                   =20

                                       =20
                                            <div class=3D"halfWidgetsCollec=
tionTableCell onlyDesktop"
                             style=3D"background-color: transparent; width:=
 0; padding: 0 10px;display: table-cell;">
                        </div>
                        <div class=3D"halfWidgetsCollectionTableCell" id=3D=
"MyntraInsiderBlockId"
                             style=3D"display: table-cell; width: 50%; back=
ground-repeat: no-repeat; background-size: 32px; background-position: right=
 16px top 16px; background-image: url(assets/icons/ic_core_helpCenter.svg);=
 border: solid 0.5px rgba(190, 147, 71, 0.11); border-radius: 4px; backgrou=
nd-color: #fff5e1;">
                            <div class=3D"widgetContainerInfo"
                                 style=3D"margin: 0; font-size: 17px; line-=
height: 23px; color: #7e818c; padding: 20px 20px 20px 20px;">
                                <p class=3D"informationTitle"
                                   style=3D"margin: 0; padding: 0; width: 1=
00%; font-family: 'Lato', sans-serif; font-size: 25px; margin-bottom: 16px;=
 font-weight: normal; font-stretch: normal; font-style: normal; line-height=
: normal; letter-spacing: normal; color: #be9347;">
                                    Myntra Insider
                                    <span style=3D"float:right;">
                                    <img src=3D"https://assets.myntassets.c=
om/assets/images/retaillabs/2021/8/16/ab9d2d54-ae28-4194-85e7-5b3f0258ad491=
629102729570-Insider-Stroke-crown.png"
                                         style=3D"width: 28px; object-fit: =
contain;">
                                </span>
                                </p>
                                <p class=3D"earnedPoints"
                                   style=3D"margin: 0; padding: 0; width: 1=
00%; font-family: 'Lato', sans-serif; font-size: 16px; font-weight: normal;=
 font-stretch: normal; font-style: normal; line-height: 1.38; letter-spacin=
g: normal; color: #535766;">
                                    You have earned                        =
            <img src=3D"https://assets.myntassets.com/assets/images/retaill=
abs/2021/8/16/71ac718c-335e-4d31-a5dd-2cec9b082a561629110130469-Rectangle-3=
x.png" align=3D"top"
                                         style=3D"width: 17px; height: 16px=
; object-fit: fill;padding:2px 2px 0px 0px;"><strong
                                            style=3D"margin: 0; padding: 0;=
 font-family: 'Lato', sans-serif; font-weight: bold; color: #3e4152;"
                                            id=3D"MyntraInsiderPointId">58*=
 SuperCoins</strong>
                                                                    for thi=
s order. </p>
                                <p class=3D"myntraPoint"
                                   style=3D"margin: 0; padding: 0; width: 1=
00%; font-family: 'Lato', sans-serif; font-size: 12px; font-weight: normal;=
 font-stretch: normal; font-style: normal; line-height: 1.33; letter-spacin=
g: normal; color: #7e818c; margin-top: 16px;">
                                                                           =
 * These SuperCoins will get added into your Insider account after the retu=
rn / exchange period of the products.
                                                                    </p>
                            </div>
                        </div>
                   =20
                   =20
                   =20

                   =20

                                    </div>
       =20


   =20
<head> <style> @media only screen and (max-width: 640px) {.studioIcon{ marg=
in-left: 20px !important; } .studioFirstPost{ display: table-row !important=
; } .studioFirstPostBlock{ width: 330px !important; margin-left: 8px !impor=
tant; } .studioSecondPost{ display: table-row !important; width: 50% !impor=
tant; height: 200px !important; } .studioSecondPostBlock{ height: 180px !im=
portant; width: 170px !important; margin-left: 4px !important; } .studioSec=
ondPostBlockTable{ margin-top: 125px !important; } .studioSecondPostImage{ =
height: 35px !important; width: 45px !important; } .studioSecondPostDes{ wi=
dth: 180px !important; } .studioLinkBlock{ display: table-cell !important; =
} .studioLinkBlockTableDiv{ height: 180px !important; width: 330px !importa=
nt; margin-top: 5px !important; padding-top: 0px !important;} .studioLinkBl=
ockTable{ width: 100px !important; margin-left:15px !important; margin-top:=
0 !important; } .studioLinkImageColumn{ width: 25px !important; } .studioLi=
nkImage{ height: 25px !important; width: 25px !important; margin: 22px 0px =
0px 100px !important; } .studioLinkDes{ margin: 0px 0px 0px 60px !important=
; width: 180px  !important;}}</style> </head>




           =20
<div class=3D"halfWidgetsCollectionTable" style=3D"display: table;margin: 2=
0px 0; width: 100%;">
    <div class=3D"halfWidgetsCollectionTableStudio" style=3D" vertical-alig=
n: top; width: 100%; background-repeat: no-repeat; background-size: 32px; b=
ackground-position: right 16px top 16px; background-image: url(assets/icons=
/ic_core_helpCenter.svg); border: solid 0.5px rgba(190, 147, 71, 0.11); bor=
der-radius: 4px; margin-bottom: 10px;background-color: white;">
        <div style=3D"width: 100%;">
            <div class=3D"widgetContainerInfo" style=3D"margin: 0; font-siz=
e: 17px; line-height: 23px; padding: 20px 20px 0 20px; color: #282c3f;">
                <p class=3D"informationTitle" style=3D"margin: 0; padding: =
0; width: 100%; font-family: 'Lato', sans-serif; color: #282c3f; font-size:=
 25px; margin-bottom: 16px; font-weight: normal; font-stretch: normal; font=
-style: normal; line-height: normal; letter-spacing: normal;"> Inspiration =
From Myntra Studio<span class=3D"studioIcon" style=3D"float:right;margin-le=
ft: 200px"> <img src=3D"https://assets.myntassets.com/assets/images/retaill=
abs/2021/11/23/96a782a0-2583-4064-a3cd-3c66cd6dcb6d1637674872024-studio_log=
o_icon_desk-3x.png" style=3D"width: 28px; object-fit: contain;"/> </span></=
p>
            </div>
        </div>
        <div style=3D"width: 100%;display: table">
            <div style=3D"width: 40%; display: table-cell; vertical-align: =
top;" class=3D"studioFirstPost" >
                <a href=3D"https://url41.myntra.com/ls/click?upn=3Du001.m49=
8z1bBGRky-2Baulj243wPOVpFt2QWkmyADismRuv9fe-2F9CCnvmK1S92Lf1oguTgreyJrXe4Pm=
G2-2BfSZs27aeyN3y10TnKNoZStSrFgDig-2FXakID-2BtC5UHpisR0IU-2B8LT4456ytGfCupU=
7ss449Ynakru1E2ZagTF6J5iylyCNA-3D-9CN_ckDpsQMvFFlgDZMiyrNr-2Fv3X9tlD6BKNWZY=
XmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5KVq4SZhdFccVC6XXWoB-2FPnRkbNuYc5=
gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FPWqnv7l2AsndMwq-2FZQX8-2BGANaCj3=
rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7aXfnhzeSw6p3MidEe4Kd8wRpvyVRql4=
eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5lyKWGLzTQ58BMWyuGB5m9seqePOWI-2B2Ou=
GOXVowfAq11wtVz2kWYA3jScdkRkDoke8hHn4P776KTcKmYdMu8YuhqoKwPsy0KL2OgHiiVvUCj=
bpr64d98RS3L56LwQZOTUgVWQJVJALsu6gGh6Ecmq5TvJPD0zzgoRwpe-2FwZ7a0iiGFGggWVMa=
fb81V2i6jTwIQ-3D-3D" style=3D"text-decoration: none;">
                    <div class=3D"studioFirstPostBlock" style=3D"background=
-image:url(https://assets.myntassets.com/assets/images/2024/4/16/592ff7aa-2=
f88-46c9-a2ff-1dcfbf6956741713259124378-Kunal-16-C--2-.jpg); background-rep=
eat: no-repeat;background-size: 100% 100%;background-size: cover; backgroun=
d-position: center 0px; height: 395px;width: 350px; margin-left: 10px; bord=
er: 5px solid white; border-radius: 3%;">
                        <table width=3D"160px" style=3D"margin-top: 330px;m=
argin-left: 5px;">
                            <tr>
                                <td>
                                    <img src=3Dhttps://assets.myntassets.co=
m/assets/images/2023/5/5/70bce317-77d2-422b-ad2d-bf4f37985fe91683265740997-=
croppedImage-1683265548632.jpg style=3D"position: relative; height: 40px; w=
idth: 50px;border-radius: 50%"/>
                                </td>
                                <td>
                                    <p style=3D"font-family: 'Lato', sans-s=
erif;font-size: 13px;color: white;color:#ffffff;line-height: 1.2;text-align=
: left;"><span style=3D"font-weight: bold">Kunal Rajpal</span><br><span sty=
le=3D"font-size: 11px;">542 followers</span></p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </a>

                <div style=3D"width: 350px;height:45px;font-size: 13px;marg=
in: 0px 0px 10px 20px;overflow: hidden">
                    <p style=3D"color: #000000;font-family: 'Lato', sans-se=
rif;line-height: 1.2;max-height:45px;">Add a touch of laid-back charm to yo=
ur wardrobe with our Crochet Casual Shirt. Effortlessly stylish and perfect=
 for any occasion. Available now on Myntra. <b>#menfashion</b> <b>#mencasua=
lwear</b> <b>#boohoomanmen</b> <b>#freakinsmen</b> <b>#menshirt</b> <b>#men=
jeans</b> <b>#whitemen</b> <b>#solidmen</b></p>
                </div></div>
            <div style=3D"display: table;">

                <div class=3D"studioSecondPost"  style=3D"display: table-ce=
ll; width: 50%; height: 280px;vertical-align: top;">
                                        <div class=3D"studioLinkBlock" styl=
e=3D"width: 50%;display: contents;vertical-align: top;">
                        <a href=3D"www.myntra.com/studio/home?utm_campaign=
=3Dstudio_home_order_confirmed&utm_source=3Dtransaction" style=3D"text-deco=
ration: none">
                            <div class=3D"studioLinkBlockTableDiv" style=3D=
" width: 50%; height: 300px;width: 220px; background-color: #ffebf0;border-=
radius: 6px;position: relative;margin-top: 0px;margin-left: 10px;padding-to=
p: 100px">

                                <table class=3D"studioLinkBlockTable" style=
=3D"background-color: #ffebf0;width: 200px; border-collapse: collapse;margi=
n-left:5px;margin-top:0px;vertical-align: top;">

                                    <tr style=3D"background-color: #ffebf0;=
">
                                        <td class=3D"studioLinkImageColumn"=
 style=3D"background-color: #ffebf0; width: 20px;"><img class=3D"studioLink=
Image" src=3D"https://assets.myntassets.com/assets/images/retaillabs/2021/1=
1/23/96a782a0-2583-4064-a3cd-3c66cd6dcb6d1637674872024-studio_logo_icon_des=
k-3x.png" style=3D"height: 30px;width: 30px; margin-top: 20px;margin: 20px =
2px 0px 60px;"/></td>
                                        <td><p style=3D"font-family: 'Lato'=
, sans-serif;text-align: left;line-height: 0.5;color: #000000;font-size: 25=
px;margin-top: 45px;">Studio</p></td>
                                    </tr>
                                    <tr>
                                        <td colspan=3D"2"><p class=3D"studi=
oLinkDes" style=3D"font-family: 'Lato', sans-serif;text-align: center;line-=
height: 1.2;color: #000000;font-size: 13px;color: #3d4152;margin: 0px 5px 0=
px 25px;">See more such inspirational stuff on Myntra Studio</p></td>
                                    </tr>

                                </table>

                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
       =20

               =20
                                    <div class=3D"onlyDesktop" style=3D"wid=
th: calc(100% - 4px); margin: 0 2px; border-bottom: 1px solid #ddd;">
                    </div>
               =20

                                                                   =20
               =20






               =20
                <div class=3D"halfWidgetsCollectionTable" style=3D"display:=
 table;margin: 20px 0; width: 100%;">
                                       =20
                                                                <div class=
=3D"halfWidgetsCollectionTableCell" id=3D"WhatNextBlockId"
                             style=3D"display: table-cell; width: 50%; back=
ground-repeat: no-repeat; background-size: 32px; background-position: right=
 16px top 16px; background-image: url(assets/icons/ic_core_helpCenter.svg);=
 border: solid 0.5px rgba(190, 147, 71, 0.11); border-radius: 4px; font-siz=
e: 17px; line-height: 23px; color: #7e818c; background-color: #ffffff;">
                            <div class=3D"widgetContainerInfo" style=3D"mar=
gin: 0; padding: 20px 20px 20px 20px;">
                                                                <p class=3D=
"informationTitle"
                                   style=3D"margin: 0; padding: 0; width: 1=
00%; font-family: 'Lato', sans-serif; color: #282c3f; font-size: 25px; marg=
in-bottom: 16px; font-weight: normal; font-stretch: normal; font-style: nor=
mal; line-height: normal; letter-spacing: normal;">
                                    What's next?</p>
                                <p class=3D"informationSubTitle"
                                   style=3D"margin: 0; padding: 0; width: 1=
00%; font-family: 'Lato', sans-serif; font-size: 16px; line-height: 1.38; l=
etter-spacing: 0.29px; font-weight: normal; font-stretch: normal; font-styl=
e: normal; color: #3e4152;">
                                                                           =
                                             We will send you a confirmatio=
n once your order is prepped and ready to ship.
                                                                           =
                                 </p>
                            </div>
                        </div>
                        <div class=3D"halfWidgetsCollectionTableCell onlyDe=
sktop"
                             style=3D"background-color: transparent; width:=
 0; padding: 0 10px;display: table-cell;"></div>
                   =20
                                                                    <div cl=
ass=3D"halfWidgetsCollectionTableCell" id=3D"MyntraQueryBlockId"
                             style=3D"display: table-cell; width: 50%; padd=
ing: 0; background-repeat: no-repeat; background-size: 32px; background-pos=
ition: right 16px top 16px; background-image: url(assets/icons/ic_core_help=
Center.svg); border: solid 0.5px rgba(190, 147, 71, 0.11); border-radius: 4=
px; font-size: 17px; line-height: 23px; color: #7e818c; background-color: #=
ffffff;">
                            <div class=3D"widgetContainerInfo" style=3D"mar=
gin: 0; padding: 20px 20px 20px 20px;">
                                <p class=3D"informationTitle"
                                   style=3D"margin: 0; padding: 0; width: 1=
00%; font-family: 'Lato', sans-serif; color: #282c3f; font-size: 25px; marg=
in-bottom: 16px; font-weight: normal; font-stretch: normal; font-style: nor=
mal; line-height: normal; letter-spacing: normal;">
                                    Need help?
                                    <span style=3D"float:right;">
                                    <img src=3D"https://assets.myntassets.c=
om/assets/images/retaillabs/2020/1/20/da74851c-d9e3-4757-bc7d-c2b23d45c3db1=
579503393833-ic_core_helpCenter-3x.png"
                                         style=3D"width: 28px; object-fit: =
contain;">
                                </span>
                                </p>
                                <p class=3D"informationSubTitle"
                                   style=3D"margin: 0; padding: 0; width: 1=
00%; font-family: 'Lato', sans-serif; font-size: 16px; line-height: 1.38; l=
etter-spacing: 0.29px; font-weight: normal; font-stretch: normal; font-styl=
e: normal; color: #3e4152;">
                                    For queries, or any assistance
                                    <a id=3D"ContactUsLinkId" href=3Dhttps:=
//url41.myntra.com/ls/click?upn=3Du001.m498z1bBGRky-2Baulj243wPOVpFt2QWkmyA=
DismRuv9evg6FLI-2FbMTT0RjLbKD-2FnGVbJAjZe4mD07PisdRS-2Bfwg-3D-3DddD3_ckDpsQ=
MvFFlgDZMiyrNr-2Fv3X9tlD6BKNWZYXmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5K=
Vq4SZhdFccVC6XXWoB-2FPnRkbNuYc5gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FP=
Wqnv7l2AsndMwq-2FZQX8-2BGANaCj3rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7=
aXfnhzeSw6p3MidEe4Kd8wRpvyVRql4eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5l4mQ=
-2BL0AcVjiovUh7s2a4s9-2F8alzAwndhpjC1wlYEXYuqqtEL49x4-2Fc-2BUk-2B-2B-2Fg3ia=
2ttcaBtOpenoVSqdoSmJPpjwqaTGSuRLT6PYhC-2FdptN2kgIwYx3vqd-2BvZUpxdmvi8jJgGAs=
khVzXlvjKtY-2B9xfK71BpG7Rdsf1YcFIbxujuviySB7wQ2lLYzsFbZ74CnQ-3D-3D
                                            style=3D" color: #ff3f6c; text-=
decoration: none; background-color: transparent; -webkit-text-decoration-sk=
ip: objects;">contact&nbsp;us</a>
                                </p>
                            </div>
                        </div>
                                    </div>

               =20

            </div>
        </td>
    </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                                                <head>
    <style>
        .footerImg {
            border-radius: 8px !important;
        }

        @media only screen and (max-width: 640px) {
            .myntraLogoContainer {
                padding-top: 18px !important;
                padding-bottom: 16px !important;
            }

            .footerImg {
                border-radius: 4px !important;
            }

            img.myntraLogo {
                height: 40px !important;
            }
        }

        @media only screen and (max-width: 480px) {
            .footerContainer {
                width: 100% !important;
                padding: 20px !important;
            }
        }
    </style>
</head>
<tr style=3D"margin: 0;padding:0;">
    <td style=3D"padding: 0;float:none;margin:0 auto;width:100%;" width=3D"=
100%">
        <table class=3D"mainInner" style=3D"float: none;margin:0 auto;width=
:100%;" width=3D"100%">
            <tr style=3D"margin: 0; padding: 0;">
                <td class=3D"footerContainer" width=3D"calc(100% - (40*2))"
                    style=3D"margin: 0; padding: 40px; width: calc(100% - (=
40px*2));">
                    <table width=3D"100%">
                                                                           =
 <tr style=3D"margin: 0; padding: 0;">
                                <td style=3D"margin: 0; padding: 0;">
                                                                           =
 <a id=3D"TemplateFooterUrl" href=3D"https://url41.myntra.com/ls/click?upn=
=3Du001.m498z1bBGRky-2Baulj243wI-2BwRaHlzQVDFDcajWaU0xQ-3DeFMT_ckDpsQMvFFlg=
DZMiyrNr-2Fv3X9tlD6BKNWZYXmmBTMJT-2B9C6n92-2B5QbP9xAx0LFk-2BZ4eSqbM5KVq4SZh=
dFccVC6XXWoB-2FPnRkbNuYc5gqCg4fqM-2BBYC0ctZxZYch-2BfiWJu1aRvKafsz-2FPWqnv7l=
2AsndMwq-2FZQX8-2BGANaCj3rOZT3dn-2BeeyTkZQi7RSGE5n-2BBnj5K73MuyVSUet7aXfnhz=
eSw6p3MidEe4Kd8wRpvyVRql4eLIOb9J3AnHVsmDdBecKPAf-2F3I7zbrlDmnK0I5ly5dYlRQp1=
MxIq6bRKEmH11YfgEK-2B2Znd8pO1tORQYR88rL4ral2LqkejLreBBE2jxr-2BcYzn6OGB7Z9xV=
tb1cIzZG9VZOaOgL1ZRKeitcglvViZOVS4JMUnkYhrSBGP3U8HJbngTjzUfSYEhXmKitX-2F8GL=
94s0hmKp-2FiyxNMbLVl6K1rDOoNgnW9-2F36wpL4VjQ-3D-3D" target=3D"_blank">
                                            <img id=3D"TemplateFooterImage"=
 class=3D"footerImg" src=3D"https://assets.myntassets.com/assets/images/ret=
aillabs/2021/3/30/4ddf847c-3e89-4615-b89a-3e82b84621641617111996318-Myntra-=
Footer-Strip_640x148.7px.jpg" alt=3D"myntra" style=3D"float: left; border-r=
adius: 8px; width: 100%; ">
                                        </a>
                                                                    </td>
                            </tr>
                                                <tr style=3D"margin: 0; pad=
ding: 0;">
                            <td class=3D"myntraLogoContainer" bgcolor=3D"wh=
ite" align=3D"center" style=3D"margin: 0; padding: 20px 30px 24px 30px; tex=
t-align: center;">
                                <img class=3D"myntraLogo" id=3D"MyntraLogo"=
 src=3D"https://assets.myntassets.com/assets/images/retaillabs/2021/1/29/05=
5b4c40-78b7-4050-8fb1-6fd972d4b9991611911755667-myntra-logo_3x.png"
                                     width=3D"34" style=3D"width: 34px; flo=
at: none; margin-bottom: -13px; object-fit: contain;">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>

                                            </table>
                </td>
            </tr>
        </tbody>
    </table>
<img src=3D"https://url41.myntra.com/wf/open?upn=3Du001.ztZXt29zX9tJ0D6lCvL=
QkWYMjs9wsEaoPzc-2BfDZvmca9l2EokZ7UB9LUSfS66Eb-2FA68Ikbxy5dXIQUoIPrlHzsC-2F=
DhzYrDNSdyrpoVnlPc2-2BCU5DGy0Oy8BK5pxpsAI-2FVJKzSz6lKtFIIhZNCNEV8qXWlQTWfUU=
C9vfqTARNuOChos-2BBr-2F-2Fc5sPaUxj-2FGas97JXvmbUKUoKv-2FD7x4IasPuT4OO5a6GxN=
sT1fLSPwwQq26RCuhREMKYOFEvvSdSJi4bNd6u88vlCFFKSZsGLA1aeLbfbXjFQqpeLgskuZvru=
Shl1EDq-2B-2B6F-2F-2BjzXAtkKDKfZr8TwRzur3VctV4hb3vKT-2FSg-2F78A50ltlZgmOonC=
1z7-2Fu2R31ikENj7hFWURT4-2BufecmfaVqskEOCHaYTJkqAOzRzqcLXo7W78m7oBfBZ4eJjK1=
OgbBmpo5eKLA1AgkqyWL5VLCxeO8tYLNdZonA-3D-3D" alt=3D"" width=3D"1" height=3D=
"1" border=3D"0" style=3D"height:1px !important;width:1px !important;border=
-width:0 !important;margin-top:0 !important;margin-bottom:0 !important;marg=
in-right:0 !important;margin-left:0 !important;padding-top:0 !important;pad=
ding-bottom:0 !important;padding-right:0 !important;padding-left:0 !importa=
nt;"/></body>

</html>
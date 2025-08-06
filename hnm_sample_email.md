Delivered-To: dev.devanshchaudhary@gmail.com
Received: by 2002:a17:504:6542:b0:1c6f:5847:8d6e with SMTP id q2csp11380825njf;
        Mon, 6 Jan 2025 03:07:37 -0800 (PST)
X-Google-Smtp-Source: AGHT+IGmdwqGWGyhbo6wPfZyUvtIVzUHWT7bP+dS9VdFQz1+JD40oL9LX0C1Y/Z75yI66xbPQq3G
X-Received: by 2002:a05:6000:402c:b0:385:e9c0:c069 with SMTP id ffacd0b85a97d-38a22408f78mr43471337f8f.57.1736161656826;
        Mon, 06 Jan 2025 03:07:36 -0800 (PST)
ARC-Seal: i=1; a=rsa-sha256; t=1736161656; cv=none;
        d=google.com; s=arc-20240605;
        b=izyx3HxB7h/QSflMr4laEdXGEneUtrapW/GHk9B8DsP5SHR/L6Nh3dPJ0zdECt1Fwn
         N/eqlL9BcI1h1fc/BUMPmTvLMglgEoucZ9Z9MN8iy6sSkyTgoOsaMGtINiDNfyIkttyd
         hKeo11HF0A1kGTuSYXv5yA7xTHYzNjNAQUpUqH/SmJl74bWDBUOaukcCNMKv0BK01bYp
         4FmkT0cLZ14OhHzYBkg1mZ83uU6e47Fow2qTj5GzAY3Ikgo5RYW51MSrm19wdDnOgEk7
         HcM1bmaClW255yi5HbKkOllwGR3DysaA3hsHNcUmqcR09LBg6Sf/xzFQ+hbL+aeqpiez
         J/hg==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605;
        h=feedback-id:mime-version:date:message-id:subject:reply-to:to:from
         :list-unsubscribe-post:list-unsubscribe:dkim-signature
         :dkim-signature;
        bh=HVE74ik8LVNy4ZnXHJ2bWFR1MypC+OrlZWAs8Qj2Vf8=;
        fh=PizyrU77yGWa7GD4HbOPVy0/0BGTTBOChYwsjyyrNnY=;
        b=V0rQPyVCpzer/qjds+jsIjciIEetixAXos4/KdpPyILVdbvV6sK0Am81QHk71p8EQ0
         WBqVjuzUqkvncrnXEg2KEgznDNCLQmy5J9MW9p/chI1oEkivXr+FpTMuphlsOvOjHR6H
         NbJKffodYqmNdPM0cnYlbEnilRu5AA4+UKips7qBEVKuWD1KalmmE3mINNHa9IQegE/w
         FnYUfU2o25+P4Jmtu/lTqPFo9h374kLWxE+Cql+7BA3/31SGKQve8WLKF3FGHGw+XzeV
         8Yp1zvAMxMgd6Ajojma07fw5IIZ/vpbKBe3YyHbnZNVZJ/MEx7vxmptfCr93RCYSUhtS
         cHCw==;
        dara=google.com
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@delivery.hm.com header.s=ra5ouf5ie2ucblp6u3rxl7mb5szwcjuj header.b=yAhWQeW9;
       dkim=pass header.i=@amazonses.com header.s=uku4taia5b5tsbglxyj6zym32efj7xqv header.b=YtpLMvT1;
       spf=pass (google.com: domain of 010201943b4c7e0c-18bb5fdf-40a1-4a9a-964d-0d3f984b6227-000000@parcel-mail.delivery.hm.com designates 54.240.90.129 as permitted sender) smtp.mailfrom=010201943b4c7e0c-18bb5fdf-40a1-4a9a-964d-0d3f984b6227-000000@parcel-mail.delivery.hm.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=delivery.hm.com
Return-Path: <010201943b4c7e0c-18bb5fdf-40a1-4a9a-964d-0d3f984b6227-000000@parcel-mail.delivery.hm.com>
Received: from a90-129.smtp-out.eu-west-1.amazonses.com (a90-129.smtp-out.eu-west-1.amazonses.com. [54.240.90.129])
        by mx.google.com with ESMTPS id 5b1f17b1804b1-4366127c605si243990745e9.112.2025.01.06.03.07.36
        for <dev.devanshchaudhary@gmail.com>
        (version=TLS1_3 cipher=TLS_AES_128_GCM_SHA256 bits=128/128);
        Mon, 06 Jan 2025 03:07:36 -0800 (PST)
Received-SPF: pass (google.com: domain of 010201943b4c7e0c-18bb5fdf-40a1-4a9a-964d-0d3f984b6227-000000@parcel-mail.delivery.hm.com designates 54.240.90.129 as permitted sender) client-ip=54.240.90.129;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@delivery.hm.com header.s=ra5ouf5ie2ucblp6u3rxl7mb5szwcjuj header.b=yAhWQeW9;
       dkim=pass header.i=@amazonses.com header.s=uku4taia5b5tsbglxyj6zym32efj7xqv header.b=YtpLMvT1;
       spf=pass (google.com: domain of 010201943b4c7e0c-18bb5fdf-40a1-4a9a-964d-0d3f984b6227-000000@parcel-mail.delivery.hm.com designates 54.240.90.129 as permitted sender) smtp.mailfrom=010201943b4c7e0c-18bb5fdf-40a1-4a9a-964d-0d3f984b6227-000000@parcel-mail.delivery.hm.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=delivery.hm.com
DKIM-Signature: v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple; s=ra5ouf5ie2ucblp6u3rxl7mb5szwcjuj; d=delivery.hm.com; t=1736161656; h=Content-Type:List-Unsubscribe:List-Unsubscribe-Post:From:To:Reply-To:Subject:Message-ID:Date:MIME-Version; bh=NfcwpXq6FsjwVBLhQ4AZG+TJfbfsyegcnLduqL/azEc=; b=yAhWQeW9S857ECzK3XefBpWY5bN0VBG4f2wtmEi28Vansh3bO24WkBMCimiGQpxk gB9C43lwJ77lZdqkZR8VJwIIcAhDfsf5uIOlMgzFVe9CzhRVBvSM5abcCtl6aj4gYzr 2Wc6gNUqJbv5el5krOmTh2vAlj/eTkvu7BJTGwhMJnQAj7GsbxzJmRaKCSO5nXKa5Fi 7bgcsVrDGIcaRYClxY+JM7TgqKhWZ5m3w8dsqhCeivI0U/ZJ20658EqZyW7Bilm4aVo QiqWSJ4cMPCDTDudOaU3v2LPDYPRl16aZoHLeMaeWZopGqxnNdrRWCjDGqSdenHN+Rs nS50XkDVLg==
DKIM-Signature: v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple; s=uku4taia5b5tsbglxyj6zym32efj7xqv; d=amazonses.com; t=1736161656; h=Content-Type:List-Unsubscribe:List-Unsubscribe-Post:From:To:Reply-To:Subject:Message-ID:Date:MIME-Version:Feedback-ID; bh=NfcwpXq6FsjwVBLhQ4AZG+TJfbfsyegcnLduqL/azEc=; b=YtpLMvT1ivtaQkIIUUwDJyB0OT9GyF5MmYNy1s0ynxHb5Y+Z4zW8uQYKMCaycVEQ 6668MCCpr2tc+fhXGo4b1aWBUpeRFHr4m61YmFTaW/X+IRvKl4aG1I+HmDE/dmvFGK5 vIei5lmAyttLgII0lVviEdY0jq2zKCf0m/8eHPKc=
Content-Type: multipart/alternative; boundary="--_NmP-def274620c30b2cb-Part_1"
List-Unsubscribe: <https://api.parcellab.com/unsubscribe/email-header?emailId=677bb97866f5071081aebe61&code=41d37c4efb44463ea3e8d45249ed18a8-c66aee3fe971f06b773493d6e40f7a643a93334f56b903a259046ec97bd7ccfb977054271144>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
From: "H&M" <In@delivery.hm.com>
To: dev.devanshchaudhary@gmail.com
Reply-To: "H&M" <noreply0.cs.in@hm.com>
Subject: 🚚 Your order is on its way
Message-ID: <010201943b4c7e0c-18bb5fdf-40a1-4a9a-964d-0d3f984b6227-000000@eu-west-1.amazonses.com>
Date: Mon, 6 Jan 2025 11:07:36 +0000
MIME-Version: 1.0
Feedback-ID: ::1.eu-west-1.HofO8Vr86qU5jkKw0Z4rSPrv1sXCv4G6Y49cnwykQdc=:AmazonSES
X-SES-Outgoing: 2025.01.06-54.240.90.129

----_NmP-def274620c30b2cb-Part_1
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: quoted-printable

 You can track your order using the tracking link below or log in to 'My Ac=
count' (https://www2.hm.com/en_in/account?&utm_source=3Dtransactional&utm_m=
edium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_cam=
paign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Daccount=
) to check delivery status. Your receipt will be sent in a separate email.=
=20

Track my order (https://hm.delivery-status.com/in/en/?orderNo=3D39772745802=
&&utm_source=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c697=
e23b0dDispatchConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_IN=
E2700X007212&utm_content=3Dtrackntrace&show_articleList=3Dyes&selectedTrack=
ingNo=3D75899196623&s=3DRbwF4GQvg7&oxm_em=3DparcelLab)=20

Part of order #3=E2=80=8C977=E2=80=8C274=E2=80=8C580=E2=80=8C2=20

Delivered by H&M=20
Note: Your order has been split into multiple packages that are being shipp=
ed separately.

See order details for more information.=20

=C2=A0

Dispatched items=20

(https://www2.hm.com/en_in/productpage.1244516002.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Loose Fit Cotton jersey top

=E2=82=B9 809.10=C2=A0=C2=A0=E2=82=B9 899.00

Art. No.1244516002013

ColorCream

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 809.10
Complete the look (https://www2.hm.com/en_in/productpage.1244516002.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1268777001.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Regular Fit Textured shirt

=E2=82=B9 1,349.10=C2=A0=C2=A0=E2=82=B9 1,499.00

Art. No.1268777001013

ColorNavy blue

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 1,349.10
Complete the look (https://www2.hm.com/en_in/productpage.1268777001.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1223188001.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Regular Fit Hole-patterned polo shirt

=E2=82=B9 1,349.10=C2=A0=C2=A0=E2=82=B9 1,499.00

Art. No.1223188001013

ColorCream

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 1,349.10
Complete the look (https://www2.hm.com/en_in/productpage.1223188001.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1238287002.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Regular Fit Textured resort shirt

=E2=82=B9 899.10=C2=A0=C2=A0=E2=82=B9 999.00

Art. No.1238287002013

ColorNavy blue

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 899.10
Complete the look (https://www2.hm.com/en_in/productpage.1238287002.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1245365002.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Slim Fit Textured-knit polo shirt

=E2=82=B9 1,214.10=C2=A0=C2=A0=E2=82=B9 1,349.00

Art. No.1245365002013

ColorWhite

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 1,214.10
Complete the look (https://www2.hm.com/en_in/productpage.1245365002.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1238990002.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Regular Fit Rib-knit resort shirt

=E2=82=B9 1,457.10=C2=A0=C2=A0=E2=82=B9 1,619.00

Art. No.1238990002013

ColorNavy blue

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 1,457.10
Complete the look (https://www2.hm.com/en_in/productpage.1238990002.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1219626004.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Slim Fit Dressy joggers

=E2=82=B9 1,700.10=C2=A0=C2=A0=E2=82=B9 1,889.00

Art. No.1219626004011

ColorBlack

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 1,700.10
Complete the look (https://www2.hm.com/en_in/productpage.1219626004.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1225159002.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Regular Fit Waffled shirt

=E2=82=B9 899.10=C2=A0=C2=A0=E2=82=B9 999.00

Art. No.1225159002013

ColorWhite

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 899.10
Complete the look (https://www2.hm.com/en_in/productpage.1225159002.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1249530004.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Regular Fit Waffled T-shirt

=E2=82=B9 467.65=C2=A0=C2=A0=E2=82=B9 519.61

Art. No.1249530004013

ColorDark grey

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 467.65
Complete the look (https://www2.hm.com/en_in/productpage.1249530004.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1212615001.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Loose Fit Shirt

=E2=82=B9 1,583.10=C2=A0=C2=A0=E2=82=B9 1,759.00

Art. No.1212615001013

ColorCream/Dragon Deli

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 1,583.10
Complete the look (https://www2.hm.com/en_in/productpage.1212615001.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.0967955081.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Loose Fit Printed T-shirt

=E2=82=B9 467.10=C2=A0=C2=A0=E2=82=B9 519.00

Art. No.0967955081013

ColorWhite/Valencia

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 467.10
Complete the look (https://www2.hm.com/en_in/productpage.0967955081.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

(https://www2.hm.com/en_in/productpage.1207932001.html?&utm_source=3Dtransa=
ctional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirm=
ation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_cont=
ent=3Dpd_image) Regular Fit Knitted T-shirt

=E2=82=B9 809.10=C2=A0=C2=A0=E2=82=B9 899.00

Art. No.1207932001013

ColorLight beige

SizeL

Quantity1

Total =C2=A0=C2=A0=C2=A0=E2=82=B9 809.10
Complete the look (https://www2.hm.com/en_in/productpage.1207932001.html?ut=
m_source=3Dtransactional&utm_medium=3Demail&utm_campaign=3Ddispatch_confirm=
ation_PLPOC_pi_E2700X007212&utm_content=3Dstylewith&utm_term=3Dany#product-=
reco-swg)

Order number=20

39772745802 (https://hm.delivery-status.com/in/en/?orderNo=3D39772745802&&u=
tm_source=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23=
b0dDispatchConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE27=
00X007212&utm_content=3Dtrackntrace&show_articleList=3Dyes&selectedTracking=
No=3D75899196623&s=3DRbwF4GQvg7&oxm_em=3DparcelLab)=20

Order date=20

01/05/2025=20

Mode of Payment=20

Card=20

Tracking number=20

75899196623=20

Delivered with=20

Blue Dart=20

Delivery Address=20

Devansh Chaudhary

9th Cross Road

10th A Main Road

Indiranagar

720

560038

Bengaluru Karnataka

India=20

YOUR DETAILS=20

Devansh Chaudhary

de=E2=80=8Cv.d=E2=80=8Ceva=E2=80=8Cnsh=E2=80=8Ccha=E2=80=8Cudh=E2=80=8Cary=
=E2=80=8C@gm=E2=80=8Cail=E2=80=8C.co=E2=80=8Cm

+91=E2=80=8C992=E2=80=8C901=E2=80=8C168=E2=80=8C9=20

=C2=A0=20

Hello Member! Have you checked our new arrivals yet?=20

Don't keep waiting the latest trends just dropped in!=20

Shop Now (https://www2.hm.com/en_in/index.html?&utm_source=3Dtransactional&=
utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&ut=
m_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dme=
mber) Find a Store (https://www2.hm.com/en_in/customer-service/shopping-at-=
hm/store-locator.html?&utm_source=3Dtransactional&utm_medium=3Demail&utm_id=
=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campaign=3Ddispatch_con=
firmation_PLPOC_pi_INE2700X007212&utm_content=3Dmember)=20

(https://www2.hm.com/en_in/customer-service/shippinganddelivery.html?utm_so=
urce=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDi=
spatchConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X00=
7212&utm_content=3Dshippinganddelivery)=20

Delivery (https://www2.hm.com/en_in/customer-service/shippinganddelivery.ht=
ml?utm_source=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c69=
7e23b0dDispatchConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_I=
NE2700X007212&utm_content=3Dshippinganddelivery)=20

(https://www2.hm.com/en_in/customer-service/payments-info.html?utm_source=
=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispat=
chConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212=
&utm_content=3Dpayments)=20

Payment (https://www2.hm.com/en_in/customer-service/payments-info.html?utm_=
source=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0d=
DispatchConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X=
007212&utm_content=3Dpayments)=20

(https://www2.hm.com/en_in/customer-service/returns.html?utm_source=3Dtrans=
actional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfir=
mation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_con=
tent=3Dreturns)=20

Returns (https://www2.hm.com/en_in/customer-service/returns.html?utm_source=
=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispat=
chConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212=
&utm_content=3Dreturns)=20

(https://www2.hm.com/en_in/customer-service/contact.html?utm_source=3Dtrans=
actional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfir=
mation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_con=
tent=3Dcustomerservice)=20

Contact

(https://www2.hm.com/en_in/customer-service/contact.html?utm_source=3Dtrans=
actional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfir=
mation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_con=
tent=3Dcustomerservice)=20

(https://www2.hm.com/en_in/women.html?&utm_source=3Dtransactional&utm_mediu=
m=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campaig=
n=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dfooter)=20

Women (https://www2.hm.com/en_in/women.html?&utm_source=3Dtransactional&utm=
_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_c=
ampaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dfoote=
r)=20

(https://www2.hm.com/en_in/men.html?&utm_source=3Dtransactional&utm_medium=
=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campaign=
=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dfooter)=20

Men (https://www2.hm.com/en_in/men.html?&utm_source=3Dtransactional&utm_med=
ium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campa=
ign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dfooter)=
=20

(https://www2.hm.com/en_in/kids.html?&utm_source=3Dtransactional&utm_medium=
=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campaign=
=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dfooter)=20

Kids (https://www2.hm.com/en_in/kids.html?&utm_source=3Dtransactional&utm_m=
edium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_cam=
paign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dfooter)=
=20

(https://www2.hm.com/en_in/home.html?&utm_source=3Dtransactional&utm_medium=
=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campaign=
=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dfooter)=20

H&M Home (https://www2.hm.com/en_in/home.html?&utm_source=3Dtransactional&u=
tm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm=
_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dfoo=
ter)=20

(https://www2.hm.com/en_in/index.html?utm_source=3Dtransactional&utm_medium=
=3Demail&utm_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campaign=
=3Ddispatch_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dhm_logo)=20

Return Policy (https://www2.hm.com/en_in/customer-service/returns.html?utm_=
source=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c697e23b0d=
DispatchConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi_INE2700X=
007212&utm_content=3Dfooter) | Privacy Notice | Terms & Conditions (https:/=
/www2.hm.com/en_in/customer-service/legal-and-privacy/terms-and-conditions.=
html?utm_source=3Dtransactional&utm_medium=3Demail&utm_id=3D677aeb32884042c=
697e23b0dDispatchConfirmation&utm_campaign=3Ddispatch_confirmation_PLPOC_pi=
_INE2700X007212&utm_content=3Dfooter)=20

H&M Hennes & Mauritz Retail Pvt. Ltd. Ind,

District Centre Saket D-3

A-Wing, 2nd Floor

Delhi, 110017

Registered Number:CIN- U74140DL2013FTC262231
----_NmP-def274620c30b2cb-Part_1
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: quoted-printable

<html xmlns=3D"http://www.w3.org/1999/xhtml" xmlns:v=3D"urn:schemas-microso=
ft-com:vml" xmlns:o=3D"urn:schemas-microsoft-com:office:office"><head>
    <!--[if !mso]><!-- -->
    <meta http-equiv=3D"X-UA-Compatible" content=3D"IE=3Dedge">
    <!--<![endif]-->
    <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8=
">
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1">
    <style type=3D"text/css">
        #outlook a {
            padding: 0;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }

        a:active {
            color: #FE0000 !important;
        }

        a:link {
            text-decoration: none !important;
        }

        a.underl {
            text-decoration: underline !important;
        }
    </style>
    <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
    <!--[if lte mso 11]>
        <style type=3D"text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
    <!--[if !mso]><!-->
    <link href=3D"https://parcel-cdn.delivery.hm.com/img/mail/parcelLab_Inc=
_Fm9I45JOpW9yvkzb/HM_hosted_fonts.css" rel=3D"stylesheet" type=3D"text/css"=
>
    <style type=3D"text/css">
        @import url(https://s1-cdn.hm.com/global/hm-fonts/3.0.11/css/fonts.=
css);
    </style>

    <!--<![endif]-->
    <style type=3D"text/css">
        @media only screen and (min-width:480px) {
            .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
            }

            .mj-column-per-35 {
                width: 35% !important;
                max-width: 35%;
            }

            .mj-column-per-65 {
                width: 65% !important;
                max-width: 65%;
            }

            .mj-column-per-50 {
                width: 50% !important;
                max-width: 50%;
            }

        }
    </style>
    <style type=3D"text/css">
        @media only screen and (max-width:480px) {
            table.mj-full-width-mobile {
                width: 100% !important;
            }

            td.mj-full-width-mobile {
                width: auto !important;
            }

            .pr10 {
                padding-right: 10px !important;
            }

            .fl {
                display:block !important; width:100% !important;
            }

            .ptb15 {
                padding-top: 15px!important; padding-bottom: 15px!important=
;
            }

            .fs13 {
                font-size: 13px!important;
            }

            .lom {
                text-align: left !important;
            }

            .cut-text {
                text-overflow: ellipsis!important;
                overflow: hidden!important;
                max-width: 135px!important;
                white-space: nowrap!important;
            } /* It converts the last letters to 3 dots to avoid the 2nd li=
ne in mobile view */

            .image {
                width: 100% !important;
                height: auto !important;
            } /* makes images resizable(responsive) */


        }
    </style>

    <!-- DO NOT REMOVE: This is auto-generated by parcelLab to show a previ=
ew -->
    <script type=3D"application/ld+json">

<div itemscope itemtype=3D"http://schema.org/ParcelDelivery">
  <div itemprop=3D"carrier" itemscope itemtype=3D"http://schema.org/Organiz=
ation">
    <meta itemprop=3D"name" content=3D"Blue Dart" />
  </div>
  <meta itemprop=3D"trackingNumber" content=3D"75899196623" />
  <link itemprop=3D"trackingUrl" href=3D"https://hm.delivery-status.com/in/=
en/?orderNo=3D39772745802&&utm_source=3Dtransactional&utm_medium=3Demail&ut=
m_id=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campaign=3Ddispatch=
_confirmation_PLPOC_pi_INE2700X007212&utm_content=3Dtrackntrace&show_articl=
eList=3Dyes&selectedTrackingNo=3D75899196623&s=3DRbwF4GQvg7&oxm_em=3Dparcel=
Lab" />
  <div itemprop=3D"potentialAction" itemscope itemtype=3D"http://schema.org=
/TrackAction">
    <link itemprop=3D"url" href=3D"https://hm.delivery-status.com/in/en/?or=
derNo=3D39772745802&&utm_source=3Dtransactional&utm_medium=3Demail&utm_id=
=3D677aeb32884042c697e23b0dDispatchConfirmation&utm_campaign=3Ddispatch_con=
firmation_PLPOC_pi_INE2700X007212&utm_content=3Dtrackntrace&show_articleLis=
t=3Dyes&selectedTrackingNo=3D75899196623&s=3DRbwF4GQvg7&oxm_em=3DparcelLab"=
 />
  </div>
  <div itemprop=3D"hasDeliveryMethod" itemscope itemtype=3D"http://schema.o=
rg/ParcelService">
    <meta itemprop=3D"name" content=3D"http://schema.org/ParcelService" />
  </div>
  <div itemprop=3D"partOfOrder" itemscope itemtype=3D"http://schema.org/Ord=
er">
    <meta itemprop=3D"orderNumber" content=3D"39772745802" />
    <link itemprop=3D"orderStatus" href=3D"http://schema.org/OrderInTransit=
" />
  </div>
</div>
</script>

<style type=3D"text/css">
.plOnlyMobile { max-height: 0px !important; font-size: 0 !important; line-h=
eight: 0 !important; display: none !important; mso-hide: all; }
@media only screen and (max-device-width: 480px) {
  .plOnlyMobile { max-height: none !important; font-size: 12px !important; =
display: block !important; }
  .plOnlyDesktop { display: none !important; }
}
</style>
</head>

<body style=3D"background-color:#FAF9F8;">

    <!-- DO NOT REMOVE: This is auto-generated by parcelLab to show a previ=
ew -->
    <div style=3D"display:none;font-size:1px;color:#ffffff;line-height:1px;=
max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
Thank you for shopping at H&amp;M - your order has been shipped!     </div>

    <div style=3D"background-color:#FAF9F8;">
        <!--[if mso | IE]>
      <table
         align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" =
class=3D"" style=3D"width:652px;" width=3D"652"
      >
        <tr>
          <td style=3D"line-height:0px;font-size:0px;mso-line-height-rule:e=
xactly;">
      <![endif]-->
        <div style=3D"margin:0px auto;max-width:652px;">
            <table role=3D"presentation" style=3D"width:100%;" cellspacing=
=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:0;=
text-align:center;">
                            <!--[if mso | IE]>
                  <table role=3D"presentation" border=3D"0" cellpadding=3D"=
0" cellspacing=3D"0">

        <tr>

            <td
               class=3D"" style=3D"vertical-align:top;width:652px;"
            >
          <![endif]-->
                            <div class=3D"mj-column-per-100 mj-outlook-grou=
p-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-=
block;vertical-align:top;width:100%;">
                                <table role=3D"presentation" width=3D"100%"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"vertical-align:top=
;padding-top:40px;">
                                                <table role=3D"presentation=
" style=3D"" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0=
">
                                                    <tbody>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px; padding-bottom:32px;word-break:break-word;" =
align=3D"center">
                                                                <table role=
=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px;" ce=
llspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                    <tbody>
                                                                        <tr=
>
                                                                           =
 <td style=3D"width:64px;">
                                                                           =
     <a target=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/click/=
677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxM=
DgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9pbmRleC5odG1sP3V0=
bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1dG1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzdhZWIzMjg=
4NDA0MmM2OTdlMjNiMGREaXNwYXRjaENvbmZpcm1hdGlvbiZ1dG1fY2FtcGFpZ249ZGlzcGF0Y2=
hfY29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDBYMDA3MjEyJnV0bV9jb250ZW50PWhtX2xvZ=
28mdXRtX3Rlcm09YW55In0%3D&amp;sig=3D73334c00f03e767662cbcb09442d9d06c80763b=
083e04c9a23fc1a1eddf983fd">

                                                                           =
         <img alt=3D"H&amp;M" src=3D"https://parcel-cdn.delivery.hm.com/img=
/mail/hm/hmlogo.png" style=3D"border:0;display:block;outline:none;text-deco=
ration:none;height:auto;width:100%;font-size:13px;" width=3D"64" height=3D"=
auto">

                                                                           =
     </a>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                    </tbody=
>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:10px;word-brea=
k:break-word;" align=3D"center">
                                                                <div style=
=3D"font-family:'HM Serif Regular', 'Georgia Regular', serif;font-size:28px=
;line-height:36px;text-align:center;color:#222222;">
                                                                    Your or=
der is on its way</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-break=
:break-word;" align=3D"left">
                                                                <div style=
=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-ser=
if; font-weight: 400;font-size:13px;line-height:20px;text-align:center;colo=
r:#222222;">

<!-- Product Recommendation Default Tag -->
=09=09=09<p style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel =
Regular', sans-serif; font-weight:400; color: #222; font-size: 13px;">You c=
an track your order using the tracking link below or log in to <a style=3D"=
text-decoration: underline !important; color: #222222;" target=3D"_blank" h=
ref=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/fo=
rward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0=
cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9hY2NvdW50P3V0bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ=
1dG1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzdhZWIzMjg4NDA0MmM2OTdlMjNiMGREaXNwYXRjaE=
NvbmZpcm1hdGlvbiZ1dG1fY2FtcGFpZ249ZGlzcGF0Y2hfY29uZmlybWF0aW9uX1BMUE9DX3BpX=
0lORTI3MDBYMDA3MjEyJnV0bV9jb250ZW50PWFjY291bnQmdXRtX3Rlcm09YW55In0%3D&amp;s=
ig=3D6a847866e8dcd92f7fd7821ed797ba10eaad3137a9bdf9fa4f50d856366d62a3"><u>'=
My Account'</u></a> to check delivery status. Your receipt will be sent in =
a separate email.</p>
=09=09                                                                </div=
>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
            </td>

        </tr>

                  </table>
                <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->



    <!--[if mso | IE]>
          <table
             align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D=
"0" class=3D"" style=3D"width:652px;" width=3D"652"
          >
            <tr>
              <td style=3D"line-height:0px;font-size:0px;mso-line-height-ru=
le:exactly;">
          <![endif]-->
    <div style=3D"margin:0px auto;max-width:652px;">
        <table role=3D"presentation" style=3D"width:100%;" cellspacing=3D"0=
" cellpadding=3D"0" border=3D"0" align=3D"center">
            <tbody>
                <tr>
                    <td style=3D"direction:ltr;font-size:0px;padding:20px 0=
;padding-bottom:24px;padding-top:34px;text-align:center;">
                        <!--[if mso | IE]>
                      <table role=3D"presentation" border=3D"0" cellpadding=
=3D"0" cellspacing=3D"0">

            <tr>

                <td
                   class=3D"" style=3D"vertical-align:top;width:652px;"
                >
              <![endif]-->
                        <div class=3D"mj-column-per-100 mj-outlook-group-fi=
x" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-bloc=
k;vertical-align:top;width:100%;">
                            <table role=3D"presentation" style=3D"vertical-=
align:top;" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0"=
>
                                <tbody>
                                    <tr>
                                        <td vertical-align=3D"middle" style=
=3D"font-size:0px;padding:10px 25px;word-break:break-word;" align=3D"center=
">
                                            <table role=3D"presentation" st=
yle=3D"border-collapse:separate;width:240px;line-height:100%;" cellspacing=
=3D"0" cellpadding=3D"0" border=3D"0">
                                                <tbody>
                                                    <tr>
                                                        <td role=3D"present=
ation" style=3D"border:none;border-radius:0;cursor:auto;mso-padding-alt:10p=
x 25px;background:#222222;" valign=3D"middle" bgcolor=3D"#222222" align=3D"=
center"> <a target=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/cl=
ick/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1M=
DcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly9obS5kZWxpdmVyeS1zdGF0dXMuY29tL2luL2Vu=
Lz9vcmRlck5vPTM5NzcyNzQ1ODAyJiZ1dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl=
1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGlzcGF0Y2hDb25maXJtYX=
Rpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwW=
DAwNzIxMiZ1dG1fY29udGVudD10cmFja250cmFjZSZzaG93X2FydGljbGVMaXN0PXllcyZzZWxl=
Y3RlZFRyYWNraW5nTm89NzU4OTkxOTY2MjMmcz1SYndGNEdRdmc3Jm94bV9lbT1wYXJjZWxMYWI=
ifQ%3D%3D&amp;sig=3D9f95e8709954bb5b893bbb822404d2c58260135eef85d476cb84ab0=
34cf3cc3f" style=3D"display:inline-block;width:190px;background:#222222;col=
or:#ffffff;font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', s=
ans-serif; font-weight: 400;font-size:13px;font-weight:600;line-height:20px=
;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-pa=
dding-alt:0px;border-radius:0;">
Track my order                                                            <=
/a> </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]>
                </td>

            </tr>

                      </table>
                    <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          <![endif]-->



    <!--ORDER SPLIT BOX STARTS HERE-->
    <!--[if mso | IE]>
              <table align=3D"center" border=3D"0" cellpadding=3D"0" cellsp=
acing=3D"0" class=3D"" style=3D"width:652px;" width=3D"652">
                <tr>
                  <td style=3D"line-height:0px;font-size:0px;mso-line-heigh=
t-rule:exactly;">
              <![endif]-->
    <div style=3D"background:#ffffff;background-color:#ffffff;margin:0px au=
to;max-width:652px;">
        <table role=3D"presentation" style=3D"background:#ffffff;background=
-color:#ffffff;width:100%;" cellspacing=3D"0" cellpadding=3D"0" border=3D"0=
" align=3D"center">
            <tbody>
                <tr>
                    <td style=3D"border-bottom:12px solid #fff;direction:lt=
r;font-size:0px;padding:5px 0;padding-left:30px;padding-right:30px;text-ali=
gn:center;">

                        <!--[if mso | IE]>
                          <table role=3D"presentation" border=3D"0" cellpad=
ding=3D"0" cellspacing=3D"0"><tr><td class=3D"" style=3D"vertical-align:top=
;width:652px;;">
                        <![endif]-->
                        <div class=3D"mj-column-per-100 mj-outlook-group-fi=
x" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-bloc=
k;vertical-align:top;width:100%;">
                            <table role=3D"presentation" style=3D"border-co=
llapse:collapse;border-spacing:0px;" cellspacing=3D"0" cellpadding=3D"0" wi=
dth=3D"100%" border=3D"0" align=3D"center">
                                <tbody>

                                    <tr>

                                        <td align=3D"center" valign=3D"top"=
 style=3D"vertical-align: top;padding-top:18px;">
                                            <table cellpadding=3D"0" cellsp=
acing=3D"0" border=3D"0" width=3D"100%">
                                                <tbody><tr>

                                                    <td width=3D"25" align=
=3D"left" valign=3D"top" style=3D"vertical-align: top;font-size:0px;padding=
:10px 25px;padding-top:16px;padding-bottom:0; padding-right: 5px; word-brea=
k:break-word;">
                                                        <table cellpadding=
=3D"0" cellspacing=3D"0" border=3D"0">
                                                            <tbody><tr>
                                                                <td align=
=3D"center" style=3D"padding-right: 10px;"><img src=3D"https://parcel-cdn.d=
elivery.hm.com/img/mail/hmsweden/box1.png" width=3D"25" border=3D"0" style=
=3D" width:25px; vertical-align:top;">
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                    </td>

                                                    <td align=3D"left" vali=
gn=3D"top" style=3D"vertical-align: top;border-collapse:collapse;padding:10=
px 25px;padding-top:4px;padding-bottom:4px; padding-left:5px; word-break:br=
eak-word;">
                                                        <p style=3D"font-fa=
mily:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-we=
ight: 400;font-size:13px;">
                                                            <b>Part of orde=
r #3=E2=80=8C977=E2=80=8C274=E2=80=8C580=E2=80=8C2</b>
                                                            <br>
                                                            Delivered by <b=
>H&amp;M</b>
                                                        </p>
                                                        <p style=3D"font-fa=
mily:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-we=
ight: 400;font-size:13px;">
                                                            <font style=3D"=
color:#C9002E; font-weight: bold;">Note:  </font>
                                                            Your order has =
been split into multiple packages that are being shipped separately.<br>See=
 order details for more information.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody></table>
                                        </td>

                                    </tr>


                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table>
                        <![endif]-->
                    </td>
                </tr>


            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
                    </td>
                  </tr>
                </table>
                <![endif]-->

    <p style=3D"margin:3px; line-height:0;">&nbsp;</p>

    <!--END OF ORDER SPLIT BOX-->



        <!-- Articles table begins -->




    <!--[if mso | IE]>
                  <table
                     align=3D"center" border=3D"0" cellpadding=3D"0" cellsp=
acing=3D"0" class=3D"" style=3D"width:652px;" width=3D"652"
                  >
                    <tr>
                      <td style=3D"line-height:0px;font-size:0px;mso-line-h=
eight-rule:exactly;">
                  <![endif]-->
    <div style=3D"margin:0px auto;max-width:652px;">
        <table role=3D"presentation" style=3D"width:100%;" cellspacing=3D"0=
" cellpadding=3D"0" border=3D"0" align=3D"center">
            <tbody>
                <tr>
                    <td style=3D"direction:ltr;font-size:0px;padding:20px 0=
;padding-top:0;text-align:center;">
                        <!--[if mso | IE]>
                                <table role=3D"presentation" border=3D"0" c=
ellpadding=3D"0" cellspacing=3D"0">

                      <tr>

                          <td
                             class=3D"" style=3D"vertical-align:top;width:6=
52px;"
                          >
                        <![endif]-->
                        <div class=3D"mj-column-per-100 mj-outlook-group-fi=
x" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-bloc=
k;vertical-align:top;width:100%;">
                            <table role=3D"presentation" width=3D"100%" cel=
lspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                <tbody>
                                    <tr>
                                        <td style=3D"vertical-align:top;pad=
ding-top:0;">
                                            <table role=3D"presentation" st=
yle=3D"" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                <tbody>

                                                    <tr>
                                                        <td style=3D"font-s=
ize:0px;padding:10px 25px;padding-top:10px;padding-bottom:4px;word-break:br=
eak-word;" align=3D"left">
                                                            <div style=3D"f=
ont-family:'HM Sans', 'Avenir Next Medium', 'Corbel Bold', sans-serif; font=
-weight:600;font-size:16px;line-height:150%;text-align:center;color:#222222=
; font-weight:600;">
                                                                        Dis=
patched items
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]>
                          </td>

                      </tr>

                                </table>
                              <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
                        </td>
                      </tr>
                    </table>
                    <![endif]-->
    <!--[if mso | IE]>
                  <table
                     align=3D"center" border=3D"0" cellpadding=3D"0" cellsp=
acing=3D"0" class=3D"" style=3D"width:652px;" width=3D"652"
                  >
                    <tr>
                      <td style=3D"line-height:0px;font-size:0px;mso-line-h=
eight-rule:exactly;">
                  <![endif]-->
    <div style=3D"margin:0px auto;max-width:652px;">
        <table role=3D"presentation" style=3D"width:100%;" cellspacing=3D"0=
" cellpadding=3D"0" border=3D"0" align=3D"center">
            <tbody>
                <tr>
                    <td style=3D"direction:ltr;font-size:0px;padding:0;text=
-align:center;">
                        <!--[if mso | IE]>
                                <table role=3D"presentation" border=3D"0" c=
ellpadding=3D"0" cellspacing=3D"0">

                      <tr>

                          <td
                             class=3D"" style=3D"vertical-align:top;width:6=
52px;"
                          >
                        <![endif]-->
                        <div class=3D"mj-column-per-100 mj-outlook-group-fi=
x" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-bloc=
k;vertical-align:top;width:100%;">
                            <table role=3D"presentation" width=3D"100%" cel=
lspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                <tbody>
                                    <tr>
                                        <td style=3D"vertical-align:top;pad=
ding-top:0;">
                                            <table role=3D"presentation" st=
yle=3D"" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                <tbody>
                                                    <tr>
                                                        <td style=3D"font-s=
ize:0px;padding:0;padding-top:4px;padding-bottom:4px;word-break:break-word;=
" align=3D"left">
                                                            <div style=3D"f=
ont-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; f=
ont-weight: 400;font-size:13px;line-height:20px;text-align:center;color:#22=
2222;">
<table width=3D"100%" border=3D"0" cellspacing=3D"0" cellpadding=3D"0"><tbo=
dy><tr><td align=3D"center"><table width=3D"100%" border=3D"0" cellspacing=
=3D"0" cellpadding=3D"0"><tbody><tr><td align=3D"center" style=3D"-webkit-b=
order-radius: 3px; -moz-border-radius: 3px;border-radius: 3px;"><table widt=
h=3D"100%" border=3D"0" cellspacing=3D"0" cellpadding=3D"0"><tbody><tr styl=
e=3D"background-color:#FFFFFF;" class=3D"pl-articles-table-row"><td><table =
role=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" widt=
h=3D"100%"><tbody><tr><th class=3D"fl" style=3D"vertical-align:top;"><table=
 role=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" wid=
th=3D"100%"><tbody><tr><td width=3D"140" style=3D"padding: 0; width: 140px;=
 text-align: left; border-bottom: 0; padding-right:10px;"><a href=3D"https:=
//parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3Dey=
JlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyL=
mhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjQ0NTE2MDAyLmh0bWw%2FdXRtX3NvdXJjZT10cm=
Fuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM=
2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRp=
b25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm0=
9YW55In0%3D&amp;sig=3De2e142d21c0e3200e8c59e0cb2cb5cd017040a21be5edb08c36aa=
bace77f4810" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Nex=
t Medium', 'Corbel Regular', sans-serif; font-weight:400; color: #222; font=
-size: 13px;"> <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=
=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px;"><t=
body><tr><td width=3D"140" style=3D"width:140px;text-align:left;" align=3D"=
left"><img height=3D"auto" src=3D"https://assets.hm.com/articles/1244516002=
?assetType=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;auth=3DE4798F6=
E4A" style=3D"border:0;display:block;outline:none;text-decoration:none;heig=
ht:auto;width:100%; text-align:left; padding:0; margin:0;" width=3D"140"></=
td></tr></tbody></table></a></td><td align=3D"left" style=3D"padding: 10px =
20px 10px 10px; border-bottom: 0; vertical-align:middle; font-family: 'HM S=
ans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;"=
 class=3D"fl pr10"><!-- added fl and align:left--><span style=3D"font-famil=
y: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weig=
ht:400; color: #222; font-size: 13px;"> <a href=3D"https://parcel-api.deliv=
ery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3=
YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9=
wcm9kdWN0cGFnZS4xMjQ0NTE2MDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0=
bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29=
uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU=
5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;si=
g=3De2e142d21c0e3200e8c59e0cb2cb5cd017040a21be5edb08c36aabace77f4810" targe=
t=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel=
 Regular', sans-serif; font-weight:400; color: #222; font-size: 13px;"><fon=
t style=3D"color:#222222;text-decoration:none;font-size:13px; font-family: =
'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:=
400; text-decoration: none;">Loose Fit Cotton jersey top</font><br><font st=
yle=3D"color:#222222;text-decoration:none;font-size:13px;"><font style=3D"c=
olor: #CE2129; font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium'=
, 'Corbel Regular', sans-serif; font-weight:400;"><font style=3D"font-weigh=
t: 600">=E2=82=B9</font> 809.10</font>&nbsp;&nbsp;<font style=3D"color: #22=
2222; font-size: 11px;"><s style=3D"font-size:11px;"><font style=3D"font-we=
ight: 600">=E2=82=B9</font> 899.00</s></font></font><br><br style=3D"line-h=
eight:10px"><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0"><tbody>=
<tr><td width=3D"100" style=3D"width: 100px;"><font style=3D"color:#707070;=
text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next M=
edium', 'Corbel Regular', sans-serif; font-weight:400;">Art. No.</font></td=
><td><font style=3D"color:#222222;text-decoration:none;font-size:13px; font=
-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; fon=
t-weight:400;">1244516002013</font></td></tr><tr><td><font style=3D"color:#=
707070;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir=
 Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">Color</font>=
</td><td class=3D"cut-text"><font style=3D"color:#222222;text-decoration:no=
ne;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Re=
gular', sans-serif; font-weight:400;">Cream</font></td></tr><tr><td><font s=
tyle=3D"color:#707070;text-decoration:none;font-size:13px; font-family: 'HM=
 Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400=
;">Size</font></td><td><font style=3D"color:#222222;text-decoration:none;fo=
nt-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular=
', sans-serif; font-weight:400;">L</font></td></tr><tr><td><font style=3D"c=
olor:#707070;text-decoration:none;font-size:13px; font-family: 'HM Sans', '=
Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">Quanti=
ty</font></td><td><font style=3D"color:#222222;text-decoration:none;font-si=
ze:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sa=
ns-serif; font-weight:400;">1</font></td></tr></tbody></table><p style=3D"c=
olor:#222222;text-decoration:none;text-align:right;padding:0; margin:0;font=
-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular',=
 sans-serif; font-weight:400;" class=3D"lom">Total &nbsp;&nbsp;&nbsp;<font =
style=3D"font-weight: 600">=E2=82=B9</font> 809.10</p></a><p style=3D"text-=
align:left;padding:0; margin:0;font-size:13px;"><a href=3D"https://parcel-a=
pi.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElk=
IjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9=
lbl9pbi9wcm9kdWN0cGFnZS4xMjQ0NTE2MDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlv=
bmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3B=
hdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0=
NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3=
D&amp;sig=3De2e142d21c0e3200e8c59e0cb2cb5cd017040a21be5edb08c36aabace77f481=
0" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium',=
 'Corbel Regular', sans-serif; font-weight:400; color: #222; font-size: 13p=
x;"></a><a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071=
081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwi=
dXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjQ0NTE2MDAyLmh=
0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBh=
aWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnR=
lbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&amp;sig=3Da=
a5678d8227b24e777758ab6c780a490ad970b982ca9ae309d13823aadb2febe"><font styl=
e=3D"color:#222222;font-size:13px; font-family: 'HM Sans', 'Avenir Next Med=
ium', 'Corbel Regular', sans-serif; font-weight:400;"><b><u>Complete the lo=
ok</u></b></font></a></p></span></td></tr></tbody></table></th></tr></tbody=
></table></td></tr><!-- spacer --><tr><td><table cellpadding=3D"0" cellspac=
ing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td height=3D"15"><div></d=
iv></td></tr></tbody></table></td></tr><tr style=3D"background-color:#FFFFF=
F;" class=3D"pl-articles-table-row"><td><table role=3D"presentation" cellpa=
dding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><th cl=
ass=3D"fl" style=3D"vertical-align:top;"><table role=3D"presentation" cellp=
adding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td w=
idth=3D"140" style=3D"padding: 0; width: 140px; text-align: left; border-bo=
ttom: 0; padding-right:10px;"><a href=3D"https://parcel-api.delivery.hm.com=
/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2Nm=
Y1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0c=
GFnZS4xMjY4Nzc3MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW=
09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0a=
W9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgw=
MDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Dbc1759=
7bcd483a2899fd76f9bdfba310d49cc597d10cc56aa1a4958d6e9993ad" target=3D"_blan=
k" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular',=
 sans-serif; font-weight:400; color: #222; font-size: 13px;"> <table border=
=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"b=
order-collapse:collapse;border-spacing:0px;"><tbody><tr><td width=3D"140" s=
tyle=3D"width:140px;text-align:left;" align=3D"left"><img height=3D"auto" s=
rc=3D"https://assets.hm.com/articles/1268777001?assetType=3DDESCRIPTIVESTIL=
LLIFE&amp;rendition=3Dmedium&amp;auth=3D4F869F4C74" style=3D"border:0;displ=
ay:block;outline:none;text-decoration:none;height:auto;width:100%; text-ali=
gn:left; padding:0; margin:0;" width=3D"140"></td></tr></tbody></table></a>=
</td><td align=3D"left" style=3D"padding: 10px 20px 10px 10px; border-botto=
m: 0; vertical-align:middle; font-family: 'HM Sans', 'Avenir Next Medium', =
'Corbel Regular', sans-serif; font-weight:400;" class=3D"fl pr10"><!-- adde=
d fl and align:left--><span style=3D"font-family: 'HM Sans', 'Avenir Next M=
edium', 'Corbel Regular', sans-serif; font-weight:400; color: #222; font-si=
ze: 13px;"> <a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f=
5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYx=
IiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjY4Nzc3MDA=
xLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lk=
PTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWl=
nbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2Nvbn=
RlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Dbc17597bcd483a2899fd76f9=
bdfba310d49cc597d10cc56aa1a4958d6e9993ad" target=3D"_blank" style=3D"font-f=
amily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-=
weight:400; color: #222; font-size: 13px;"><font style=3D"color:#222222;tex=
t-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medi=
um', 'Corbel Regular', sans-serif; font-weight:400; text-decoration: none;"=
>Regular Fit Textured shirt</font><br><font style=3D"color:#222222;text-dec=
oration:none;font-size:13px;"><font style=3D"color: #CE2129; font-size:13px=
; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-seri=
f; font-weight:400;"><font style=3D"font-weight: 600">=E2=82=B9</font> 1,34=
9.10</font>&nbsp;&nbsp;<font style=3D"color: #222222; font-size: 11px;"><s =
style=3D"font-size:11px;"><font style=3D"font-weight: 600">=E2=82=B9</font>=
 1,499.00</s></font></font><br><br style=3D"line-height:10px"><table cellpa=
dding=3D"0" cellspacing=3D"0" border=3D"0"><tbody><tr><td width=3D"100" sty=
le=3D"width: 100px;"><font style=3D"color:#707070;text-decoration:none;font=
-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular',=
 sans-serif; font-weight:400;">Art. No.</font></td><td><font style=3D"color=
:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Aven=
ir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">1268777001=
013</font></td></tr><tr><td><font style=3D"color:#707070;text-decoration:no=
ne;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Re=
gular', sans-serif; font-weight:400;">Color</font></td><td class=3D"cut-tex=
t"><font style=3D"color:#222222;text-decoration:none;font-size:13px; font-f=
amily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-=
weight:400;">Navy blue</font></td></tr><tr><td><font style=3D"color:#707070=
;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next =
Medium', 'Corbel Regular', sans-serif; font-weight:400;">Size</font></td><t=
d><font style=3D"color:#222222;text-decoration:none;font-size:13px; font-fa=
mily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-w=
eight:400;">L</font></td></tr><tr><td><font style=3D"color:#707070;text-dec=
oration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', =
'Corbel Regular', sans-serif; font-weight:400;">Quantity</font></td><td><fo=
nt style=3D"color:#222222;text-decoration:none;font-size:13px; font-family:=
 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight=
:400;">1</font></td></tr></tbody></table><p style=3D"color:#222222;text-dec=
oration:none;text-align:right;padding:0; margin:0;font-size:13px; font-fami=
ly: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-wei=
ght:400;" class=3D"lom">Total &nbsp;&nbsp;&nbsp;<font style=3D"font-weight:=
 600">=E2=82=B9</font> 1,349.10</p></a><p style=3D"text-align:left;padding:=
0; margin:0;font-size:13px;"><a href=3D"https://parcel-api.delivery.hm.com/=
click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY=
1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cG=
FnZS4xMjY4Nzc3MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW0=
9ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW=
9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwM=
DcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Dbc17597=
bcd483a2899fd76f9bdfba310d49cc597d10cc56aa1a4958d6e9993ad" target=3D"_blank=
" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', =
sans-serif; font-weight:400; color: #222; font-size: 13px;"></a><a href=3D"=
https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?t=
o=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly9=
3d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjY4Nzc3MDAxLmh0bWw%2FdXRtX3NvdXJj=
ZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPWRpc3BhdGNoX2N=
vbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJn=
V0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&amp;sig=3D8d57ae6eed1abe7e7b9d=
985f5cbabbd13b92350d15dc75af555cb4a4cb1e3567"><font style=3D"color:#222222;=
font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regul=
ar', sans-serif; font-weight:400;"><b><u>Complete the look</u></b></font></=
a></p></span></td></tr></tbody></table></th></tr></tbody></table></td></tr>=
<!-- spacer --><tr><td><table cellpadding=3D"0" cellspacing=3D"0" border=3D=
"0" width=3D"100%"><tbody><tr><td height=3D"15"><div></div></td></tr></tbod=
y></table></td></tr><tr style=3D"background-color:#FFFFFF;" class=3D"pl-art=
icles-table-row"><td><table role=3D"presentation" cellpadding=3D"0" cellspa=
cing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><th class=3D"fl" style=3D=
"vertical-align:top;"><table role=3D"presentation" cellpadding=3D"0" cellsp=
acing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td width=3D"140" style=
=3D"padding: 0; width: 140px; text-align: left; border-bottom: 0; padding-r=
ight:10px;"><a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f=
5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYx=
IiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjIzMTg4MDA=
xLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lk=
PTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWl=
nbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2Nvbn=
RlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D2e717e2da20125cfaca415b9=
45f343b5edd43811373e4236590b0404c149fac8" target=3D"_blank" style=3D"font-f=
amily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-=
weight:400; color: #222; font-size: 13px;"> <table border=3D"0" cellpadding=
=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"border-collapse:col=
lapse;border-spacing:0px;"><tbody><tr><td width=3D"140" style=3D"width:140p=
x;text-align:left;" align=3D"left"><img height=3D"auto" src=3D"https://asse=
ts.hm.com/articles/1223188001?assetType=3DDESCRIPTIVESTILLLIFE&amp;renditio=
n=3Dmedium&amp;auth=3DE348B580AD" style=3D"border:0;display:block;outline:n=
one;text-decoration:none;height:auto;width:100%; text-align:left; padding:0=
; margin:0;" width=3D"140"></td></tr></tbody></table></a></td><td align=3D"=
left" style=3D"padding: 10px 20px 10px 10px; border-bottom: 0; vertical-ali=
gn:middle; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', =
sans-serif; font-weight:400;" class=3D"fl pr10"><!-- added fl and align:lef=
t--><span style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Re=
gular', sans-serif; font-weight:400; color: #222; font-size: 13px;"> <a hre=
f=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forw=
ard?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cH=
M6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjIzMTg4MDAxLmh0bWw%2FdXRtX3N=
vdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MD=
QyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb=
25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2Um=
dXRtX3Rlcm09YW55In0%3D&amp;sig=3D2e717e2da20125cfaca415b945f343b5edd4381137=
3e4236590b0404c149fac8" target=3D"_blank" style=3D"font-family: 'HM Sans', =
'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; color:=
 #222; font-size: 13px;"><font style=3D"color:#222222;text-decoration:none;=
font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regul=
ar', sans-serif; font-weight:400; text-decoration: none;">Regular Fit Hole-=
patterned polo shirt</font><br><font style=3D"color:#222222;text-decoration=
:none;font-size:13px;"><font style=3D"color: #CE2129; font-size:13px; font-=
family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font=
-weight:400;"><font style=3D"font-weight: 600">=E2=82=B9</font> 1,349.10</f=
ont>&nbsp;&nbsp;<font style=3D"color: #222222; font-size: 11px;"><s style=
=3D"font-size:11px;"><font style=3D"font-weight: 600">=E2=82=B9</font> 1,49=
9.00</s></font></font><br><br style=3D"line-height:10px"><table cellpadding=
=3D"0" cellspacing=3D"0" border=3D"0"><tbody><tr><td width=3D"100" style=3D=
"width: 100px;"><font style=3D"color:#707070;text-decoration:none;font-size=
:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans=
-serif; font-weight:400;">Art. No.</font></td><td><font style=3D"color:#222=
222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Ne=
xt Medium', 'Corbel Regular', sans-serif; font-weight:400;">1223188001013</=
font></td></tr><tr><td><font style=3D"color:#707070;text-decoration:none;fo=
nt-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular=
', sans-serif; font-weight:400;">Color</font></td><td class=3D"cut-text"><f=
ont style=3D"color:#222222;text-decoration:none;font-size:13px; font-family=
: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weigh=
t:400;">Cream</font></td></tr><tr><td><font style=3D"color:#707070;text-dec=
oration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', =
'Corbel Regular', sans-serif; font-weight:400;">Size</font></td><td><font s=
tyle=3D"color:#222222;text-decoration:none;font-size:13px; font-family: 'HM=
 Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400=
;">L</font></td></tr><tr><td><font style=3D"color:#707070;text-decoration:n=
one;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel R=
egular', sans-serif; font-weight:400;">Quantity</font></td><td><font style=
=3D"color:#222222;text-decoration:none;font-size:13px; font-family: 'HM San=
s', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">1=
</font></td></tr></tbody></table><p style=3D"color:#222222;text-decoration:=
none;text-align:right;padding:0; margin:0;font-size:13px; font-family: 'HM =
Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;=
" class=3D"lom">Total &nbsp;&nbsp;&nbsp;<font style=3D"font-weight: 600">=
=E2=82=B9</font> 1,349.10</p></a><p style=3D"text-align:left;padding:0; mar=
gin:0;font-size:13px;"><a href=3D"https://parcel-api.delivery.hm.com/click/=
677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxM=
DgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4x=
MjIzMTg4MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1ha=
WwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0=
bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTI=
mdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D2e717e2da2012=
5cfaca415b945f343b5edd43811373e4236590b0404c149fac8" target=3D"_blank" styl=
e=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-s=
erif; font-weight:400; color: #222; font-size: 13px;"></a><a href=3D"https:=
//parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3Dey=
JlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyL=
mhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjIzMTg4MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cm=
Fuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpc=
m1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90=
ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&amp;sig=3D535f58b02772c8d0151fa0b591=
0db80b5b7abf9c8a6169e1168fda0536e1c088"><font style=3D"color:#222222;font-s=
ize:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', s=
ans-serif; font-weight:400;"><b><u>Complete the look</u></b></font></a></p>=
</span></td></tr></tbody></table></th></tr></tbody></table></td></tr><!-- s=
pacer --><tr><td><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0" wi=
dth=3D"100%"><tbody><tr><td height=3D"15"><div></div></td></tr></tbody></ta=
ble></td></tr><tr style=3D"background-color:#FFFFFF;" class=3D"pl-articles-=
table-row"><td><table role=3D"presentation" cellpadding=3D"0" cellspacing=
=3D"0" border=3D"0" width=3D"100%"><tbody><tr><th class=3D"fl" style=3D"ver=
tical-align:top;"><table role=3D"presentation" cellpadding=3D"0" cellspacin=
g=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td width=3D"140" style=3D"p=
adding: 0; width: 140px; text-align: left; border-bottom: 0; padding-right:=
10px;"><a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f50710=
81aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwid=
XJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjM4Mjg3MDAyLmh0=
bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N=
2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1k=
aXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ=
9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Debd3ca554a108a4763e82a17caec0=
53c7d6ed8aaa2c0f5f5d84f3d35662ac34b" target=3D"_blank" style=3D"font-family=
: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weigh=
t:400; color: #222; font-size: 13px;"> <table border=3D"0" cellpadding=3D"0=
" cellspacing=3D"0" role=3D"presentation" style=3D"border-collapse:collapse=
;border-spacing:0px;"><tbody><tr><td width=3D"140" style=3D"width:140px;tex=
t-align:left;" align=3D"left"><img height=3D"auto" src=3D"https://assets.hm=
.com/articles/1238287002?assetType=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dm=
edium&amp;auth=3DDC33DBC29E" style=3D"border:0;display:block;outline:none;t=
ext-decoration:none;height:auto;width:100%; text-align:left; padding:0; mar=
gin:0;" width=3D"140"></td></tr></tbody></table></a></td><td align=3D"left"=
 style=3D"padding: 10px 20px 10px 10px; border-bottom: 0; vertical-align:mi=
ddle; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-=
serif; font-weight:400;" class=3D"fl pr10"><!-- added fl and align:left--><=
span style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular=
', sans-serif; font-weight:400; color: #222; font-size: 13px;"> <a href=3D"=
https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?t=
o=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly9=
3d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjM4Mjg3MDAyLmh0bWw%2FdXRtX3NvdXJj=
ZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY=
5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maX=
JtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX=
3Rlcm09YW55In0%3D&amp;sig=3Debd3ca554a108a4763e82a17caec053c7d6ed8aaa2c0f5f=
5d84f3d35662ac34b" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Aven=
ir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; color: #222=
; font-size: 13px;"><font style=3D"color:#222222;text-decoration:none;font-=
size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', =
sans-serif; font-weight:400; text-decoration: none;">Regular Fit Textured r=
esort shirt</font><br><font style=3D"color:#222222;text-decoration:none;fon=
t-size:13px;"><font style=3D"color: #CE2129; font-size:13px; font-family: '=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:4=
00;"><font style=3D"font-weight: 600">=E2=82=B9</font> 899.10</font>&nbsp;&=
nbsp;<font style=3D"color: #222222; font-size: 11px;"><s style=3D"font-size=
:11px;"><font style=3D"font-weight: 600">=E2=82=B9</font> 999.00</s></font>=
</font><br><br style=3D"line-height:10px"><table cellpadding=3D"0" cellspac=
ing=3D"0" border=3D"0"><tbody><tr><td width=3D"100" style=3D"width: 100px;"=
><font style=3D"color:#707070;text-decoration:none;font-size:13px; font-fam=
ily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-we=
ight:400;">Art. No.</font></td><td><font style=3D"color:#222222;text-decora=
tion:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Co=
rbel Regular', sans-serif; font-weight:400;">1238287002013</font></td></tr>=
<tr><td><font style=3D"color:#707070;text-decoration:none;font-size:13px; f=
ont-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; =
font-weight:400;">Color</font></td><td class=3D"cut-text"><font style=3D"co=
lor:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'A=
venir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">Navy bl=
ue</font></td></tr><tr><td><font style=3D"color:#707070;text-decoration:non=
e;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Reg=
ular', sans-serif; font-weight:400;">Size</font></td><td><font style=3D"col=
or:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Av=
enir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">L</font>=
</td></tr><tr><td><font style=3D"color:#707070;text-decoration:none;font-si=
ze:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sa=
ns-serif; font-weight:400;">Quantity</font></td><td><font style=3D"color:#2=
22222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir =
Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">1</font></td>=
</tr></tbody></table><p style=3D"color:#222222;text-decoration:none;text-al=
ign:right;padding:0; margin:0;font-size:13px; font-family: 'HM Sans', 'Aven=
ir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;" class=3D"l=
om">Total &nbsp;&nbsp;&nbsp;<font style=3D"font-weight: 600">=E2=82=B9</fon=
t> 899.10</p></a><p style=3D"text-align:left;padding:0; margin:0;font-size:=
13px;"><a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f50710=
81aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwid=
XJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjM4Mjg3MDAyLmh0=
bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N=
2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1k=
aXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ=
9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Debd3ca554a108a4763e82a17caec0=
53c7d6ed8aaa2c0f5f5d84f3d35662ac34b" target=3D"_blank" style=3D"font-family=
: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weigh=
t:400; color: #222; font-size: 13px;"></a><a href=3D"https://parcel-api.del=
ivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNj=
c3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pb=
i9wcm9kdWN0cGFnZS4xMjM4Mjg3MDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJn=
V0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ=
19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9k=
dWN0LXJlY28tc3dnIn0%3D&amp;sig=3D8ebb02722e247acc93d1800e299bc4f03d8ad8f862=
f05987dc72abc5f7ed5db4"><font style=3D"color:#222222;font-size:13px; font-f=
amily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-=
weight:400;"><b><u>Complete the look</u></b></font></a></p></span></td></tr=
></tbody></table></th></tr></tbody></table></td></tr><!-- spacer --><tr><td=
><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tb=
ody><tr><td height=3D"15"><div></div></td></tr></tbody></table></td></tr><t=
r style=3D"background-color:#FFFFFF;" class=3D"pl-articles-table-row"><td><=
table role=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0=
" width=3D"100%"><tbody><tr><th class=3D"fl" style=3D"vertical-align:top;">=
<table role=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"=
0" width=3D"100%"><tbody><tr><td width=3D"140" style=3D"padding: 0; width: =
140px; text-align: left; border-bottom: 0; padding-right:10px;"><a href=3D"=
https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?t=
o=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly9=
3d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjQ1MzY1MDAyLmh0bWw%2FdXRtX3NvdXJj=
ZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY=
5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maX=
JtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX=
3Rlcm09YW55In0%3D&amp;sig=3D586ec09fbc352034f69ce3bf95cdf004377c2b5f81081c9=
1fff38260b7ba7558" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Aven=
ir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; color: #222=
; font-size: 13px;"> <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0=
" role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0p=
x;"><tbody><tr><td width=3D"140" style=3D"width:140px;text-align:left;" ali=
gn=3D"left"><img height=3D"auto" src=3D"https://assets.hm.com/articles/1245=
365002?assetType=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;auth=3D5=
DA7F9EA0E" style=3D"border:0;display:block;outline:none;text-decoration:non=
e;height:auto;width:100%; text-align:left; padding:0; margin:0;" width=3D"1=
40"></td></tr></tbody></table></a></td><td align=3D"left" style=3D"padding:=
 10px 20px 10px 10px; border-bottom: 0; vertical-align:middle; font-family:=
 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight=
:400;" class=3D"fl pr10"><!-- added fl and align:left--><span style=3D"font=
-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; fon=
t-weight:400; color: #222; font-size: 13px;"> <a href=3D"https://parcel-api=
.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIj=
oiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lb=
l9pbi9wcm9kdWN0cGFnZS4xMjQ1MzY1MDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbm=
FsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3Bhd=
GNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0Nf=
cGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&=
amp;sig=3D586ec09fbc352034f69ce3bf95cdf004377c2b5f81081c91fff38260b7ba7558"=
 target=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', '=
Corbel Regular', sans-serif; font-weight:400; color: #222; font-size: 13px;=
"><font style=3D"color:#222222;text-decoration:none;font-size:13px; font-fa=
mily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-w=
eight:400; text-decoration: none;">Slim Fit Textured-knit polo shirt</font>=
<br><font style=3D"color:#222222;text-decoration:none;font-size:13px;"><fon=
t style=3D"color: #CE2129; font-size:13px; font-family: 'HM Sans', 'Avenir =
Next Medium', 'Corbel Regular', sans-serif; font-weight:400;"><font style=
=3D"font-weight: 600">=E2=82=B9</font> 1,214.10</font>&nbsp;&nbsp;<font sty=
le=3D"color: #222222; font-size: 11px;"><s style=3D"font-size:11px;"><font =
style=3D"font-weight: 600">=E2=82=B9</font> 1,349.00</s></font></font><br><=
br style=3D"line-height:10px"><table cellpadding=3D"0" cellspacing=3D"0" bo=
rder=3D"0"><tbody><tr><td width=3D"100" style=3D"width: 100px;"><font style=
=3D"color:#707070;text-decoration:none;font-size:13px; font-family: 'HM San=
s', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">A=
rt. No.</font></td><td><font style=3D"color:#222222;text-decoration:none;fo=
nt-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular=
', sans-serif; font-weight:400;">1245365002013</font></td></tr><tr><td><fon=
t style=3D"color:#707070;text-decoration:none;font-size:13px; font-family: =
'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:=
400;">Color</font></td><td class=3D"cut-text"><font style=3D"color:#222222;=
text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next M=
edium', 'Corbel Regular', sans-serif; font-weight:400;">White</font></td></=
tr><tr><td><font style=3D"color:#707070;text-decoration:none;font-size:13px=
; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-seri=
f; font-weight:400;">Size</font></td><td><font style=3D"color:#222222;text-=
decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium=
', 'Corbel Regular', sans-serif; font-weight:400;">L</font></td></tr><tr><t=
d><font style=3D"color:#707070;text-decoration:none;font-size:13px; font-fa=
mily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-w=
eight:400;">Quantity</font></td><td><font style=3D"color:#222222;text-decor=
ation:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'C=
orbel Regular', sans-serif; font-weight:400;">1</font></td></tr></tbody></t=
able><p style=3D"color:#222222;text-decoration:none;text-align:right;paddin=
g:0; margin:0;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium',=
 'Corbel Regular', sans-serif; font-weight:400;" class=3D"lom">Total &nbsp;=
&nbsp;&nbsp;<font style=3D"font-weight: 600">=E2=82=B9</font> 1,214.10</p><=
/a><p style=3D"text-align:left;padding:0; margin:0;font-size:13px;"><a href=
=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forwa=
rd?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM=
6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjQ1MzY1MDAyLmh0bWw%2FdXRtX3Nv=
dXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQ=
yYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb2=
5maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2Umd=
XRtX3Rlcm09YW55In0%3D&amp;sig=3D586ec09fbc352034f69ce3bf95cdf004377c2b5f810=
81c91fff38260b7ba7558" target=3D"_blank" style=3D"font-family: 'HM Sans', '=
Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; color: =
#222; font-size: 13px;"></a><a href=3D"https://parcel-api.delivery.hm.com/c=
lick/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1=
MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGF=
nZS4xMjQ1MzY1MDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09=
ZW1haWwmdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFg=
wMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3=
dnIn0%3D&amp;sig=3Dcb3331b29b81194c79ce9ec2b788a7a0eda9186b540c1436e05d273e=
1f50dc21"><font style=3D"color:#222222;font-size:13px; font-family: 'HM San=
s', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;"><=
b><u>Complete the look</u></b></font></a></p></span></td></tr></tbody></tab=
le></th></tr></tbody></table></td></tr><!-- spacer --><tr><td><table cellpa=
dding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td he=
ight=3D"15"><div></div></td></tr></tbody></table></td></tr><tr style=3D"bac=
kground-color:#FFFFFF;" class=3D"pl-articles-table-row"><td><table role=3D"=
presentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100=
%"><tbody><tr><th class=3D"fl" style=3D"vertical-align:top;"><table role=3D=
"presentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"10=
0%"><tbody><tr><td width=3D"140" style=3D"padding: 0; width: 140px; text-al=
ign: left; border-bottom: 0; padding-right:10px;"><a href=3D"https://parcel=
-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbE=
lkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvb=
S9lbl9pbi9wcm9kdWN0cGFnZS4xMjM4OTkwMDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdG=
lvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc=
3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQ=
T0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0=
%3D&amp;sig=3Df0a6eb77a19d57c5f7053d25f204b9832cb5a0b4552795724e1e4d03b7229=
2c8" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium=
', 'Corbel Regular', sans-serif; font-weight:400; color: #222; font-size: 1=
3px;"> <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"pres=
entation" style=3D"border-collapse:collapse;border-spacing:0px;"><tbody><tr=
><td width=3D"140" style=3D"width:140px;text-align:left;" align=3D"left"><i=
mg height=3D"auto" src=3D"https://assets.hm.com/articles/1238990002?assetTy=
pe=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;auth=3D9924035EAC" sty=
le=3D"border:0;display:block;outline:none;text-decoration:none;height:auto;=
width:100%; text-align:left; padding:0; margin:0;" width=3D"140"></td></tr>=
</tbody></table></a></td><td align=3D"left" style=3D"padding: 10px 20px 10p=
x 10px; border-bottom: 0; vertical-align:middle; font-family: 'HM Sans', 'A=
venir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;" class=
=3D"fl pr10"><!-- added fl and align:left--><span style=3D"font-family: 'HM=
 Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400=
; color: #222; font-size: 13px;"> <a href=3D"https://parcel-api.delivery.hm=
.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nz=
g2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kd=
WN0cGFnZS4xMjM4OTkwMDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZW=
RpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlyb=
WF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcw=
MFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Df0=
a6eb77a19d57c5f7053d25f204b9832cb5a0b4552795724e1e4d03b72292c8" target=3D"_=
blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regul=
ar', sans-serif; font-weight:400; color: #222; font-size: 13px;"><font styl=
e=3D"color:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sa=
ns', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; t=
ext-decoration: none;">Regular Fit Rib-knit resort shirt</font><br><font st=
yle=3D"color:#222222;text-decoration:none;font-size:13px;"><font style=3D"c=
olor: #CE2129; font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium'=
, 'Corbel Regular', sans-serif; font-weight:400;"><font style=3D"font-weigh=
t: 600">=E2=82=B9</font> 1,457.10</font>&nbsp;&nbsp;<font style=3D"color: #=
222222; font-size: 11px;"><s style=3D"font-size:11px;"><font style=3D"font-=
weight: 600">=E2=82=B9</font> 1,619.00</s></font></font><br><br style=3D"li=
ne-height:10px"><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0"><tb=
ody><tr><td width=3D"100" style=3D"width: 100px;"><font style=3D"color:#707=
070;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Ne=
xt Medium', 'Corbel Regular', sans-serif; font-weight:400;">Art. No.</font>=
</td><td><font style=3D"color:#222222;text-decoration:none;font-size:13px; =
font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif;=
 font-weight:400;">1238990002013</font></td></tr><tr><td><font style=3D"col=
or:#707070;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Av=
enir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">Color</f=
ont></td><td class=3D"cut-text"><font style=3D"color:#222222;text-decoratio=
n:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbe=
l Regular', sans-serif; font-weight:400;">Navy blue</font></td></tr><tr><td=
><font style=3D"color:#707070;text-decoration:none;font-size:13px; font-fam=
ily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-we=
ight:400;">Size</font></td><td><font style=3D"color:#222222;text-decoration=
:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel=
 Regular', sans-serif; font-weight:400;">L</font></td></tr><tr><td><font st=
yle=3D"color:#707070;text-decoration:none;font-size:13px; font-family: 'HM =
Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;=
">Quantity</font></td><td><font style=3D"color:#222222;text-decoration:none=
;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regu=
lar', sans-serif; font-weight:400;">1</font></td></tr></tbody></table><p st=
yle=3D"color:#222222;text-decoration:none;text-align:right;padding:0; margi=
n:0;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel R=
egular', sans-serif; font-weight:400;" class=3D"lom">Total &nbsp;&nbsp;&nbs=
p;<font style=3D"font-weight: 600">=E2=82=B9</font> 1,457.10</p></a><p styl=
e=3D"text-align:left;padding:0; margin:0;font-size:13px;"><a href=3D"https:=
//parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3Dey=
JlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyL=
mhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjM4OTkwMDAyLmh0bWw%2FdXRtX3NvdXJjZT10cm=
Fuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM=
2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRp=
b25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm0=
9YW55In0%3D&amp;sig=3Df0a6eb77a19d57c5f7053d25f204b9832cb5a0b4552795724e1e4=
d03b72292c8" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Nex=
t Medium', 'Corbel Regular', sans-serif; font-weight:400; color: #222; font=
-size: 13px;"></a><a href=3D"https://parcel-api.delivery.hm.com/click/677bb=
97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYW=
ViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjM4O=
TkwMDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdX=
RtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImd=
XRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&a=
mp;sig=3Dfffc277ce7619f18d68b89aa044ac5be67ebbd04baff31284912b247616fe61c">=
<font style=3D"color:#222222;font-size:13px; font-family: 'HM Sans', 'Aveni=
r Next Medium', 'Corbel Regular', sans-serif; font-weight:400;"><b><u>Compl=
ete the look</u></b></font></a></p></span></td></tr></tbody></table></th></=
tr></tbody></table></td></tr><!-- spacer --><tr><td><table cellpadding=3D"0=
" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td height=3D"15=
"><div></div></td></tr></tbody></table></td></tr><tr style=3D"background-co=
lor:#FFFFFF;" class=3D"pl-articles-table-row"><td><table role=3D"presentati=
on" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody>=
<tr><th class=3D"fl" style=3D"vertical-align:top;"><table role=3D"presentat=
ion" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody=
><tr><td width=3D"140" style=3D"padding: 0; width: 140px; text-align: left;=
 border-bottom: 0; padding-right:10px;"><a href=3D"https://parcel-api.deliv=
ery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3=
YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9=
wcm9kdWN0cGFnZS4xMjE5NjI2MDA0Lmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0=
bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29=
uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU=
5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;si=
g=3D18e3d27dc96d8b59b8b900fccc4ff9d67105e94f126c0b2ec45509c7e4888e4f" targe=
t=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel=
 Regular', sans-serif; font-weight:400; color: #222; font-size: 13px;"> <ta=
ble border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" =
style=3D"border-collapse:collapse;border-spacing:0px;"><tbody><tr><td width=
=3D"140" style=3D"width:140px;text-align:left;" align=3D"left"><img height=
=3D"auto" src=3D"https://assets.hm.com/articles/1219626004?assetType=3DDESC=
RIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;auth=3DC41FC2D556" style=3D"bor=
der:0;display:block;outline:none;text-decoration:none;height:auto;width:100=
%; text-align:left; padding:0; margin:0;" width=3D"140"></td></tr></tbody><=
/table></a></td><td align=3D"left" style=3D"padding: 10px 20px 10px 10px; b=
order-bottom: 0; vertical-align:middle; font-family: 'HM Sans', 'Avenir Nex=
t Medium', 'Corbel Regular', sans-serif; font-weight:400;" class=3D"fl pr10=
"><!-- added fl and align:left--><span style=3D"font-family: 'HM Sans', 'Av=
enir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; color: #2=
22; font-size: 13px;"> <a href=3D"https://parcel-api.delivery.hm.com/click/=
677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxM=
DgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4x=
MjE5NjI2MDA0Lmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1ha=
WwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0=
bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTI=
mdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D18e3d27dc96d8=
b59b8b900fccc4ff9d67105e94f126c0b2ec45509c7e4888e4f" target=3D"_blank" styl=
e=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-s=
erif; font-weight:400; color: #222; font-size: 13px;"><font style=3D"color:=
#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Aveni=
r Next Medium', 'Corbel Regular', sans-serif; font-weight:400; text-decorat=
ion: none;">Slim Fit Dressy joggers</font><br><font style=3D"color:#222222;=
text-decoration:none;font-size:13px;"><font style=3D"color: #CE2129; font-s=
ize:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', s=
ans-serif; font-weight:400;"><font style=3D"font-weight: 600">=E2=82=B9</fo=
nt> 1,700.10</font>&nbsp;&nbsp;<font style=3D"color: #222222; font-size: 11=
px;"><s style=3D"font-size:11px;"><font style=3D"font-weight: 600">=E2=82=
=B9</font> 1,889.00</s></font></font><br><br style=3D"line-height:10px"><ta=
ble cellpadding=3D"0" cellspacing=3D"0" border=3D"0"><tbody><tr><td width=
=3D"100" style=3D"width: 100px;"><font style=3D"color:#707070;text-decorati=
on:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corb=
el Regular', sans-serif; font-weight:400;">Art. No.</font></td><td><font st=
yle=3D"color:#222222;text-decoration:none;font-size:13px; font-family: 'HM =
Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;=
">1219626004011</font></td></tr><tr><td><font style=3D"color:#707070;text-d=
ecoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium'=
, 'Corbel Regular', sans-serif; font-weight:400;">Color</font></td><td clas=
s=3D"cut-text"><font style=3D"color:#222222;text-decoration:none;font-size:=
13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-=
serif; font-weight:400;">Black</font></td></tr><tr><td><font style=3D"color=
:#707070;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Aven=
ir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">Size</font=
></td><td><font style=3D"color:#222222;text-decoration:none;font-size:13px;=
 font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif=
; font-weight:400;">L</font></td></tr><tr><td><font style=3D"color:#707070;=
text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next M=
edium', 'Corbel Regular', sans-serif; font-weight:400;">Quantity</font></td=
><td><font style=3D"color:#222222;text-decoration:none;font-size:13px; font=
-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; fon=
t-weight:400;">1</font></td></tr></tbody></table><p style=3D"color:#222222;=
text-decoration:none;text-align:right;padding:0; margin:0;font-size:13px; f=
ont-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; =
font-weight:400;" class=3D"lom">Total &nbsp;&nbsp;&nbsp;<font style=3D"font=
-weight: 600">=E2=82=B9</font> 1,700.10</p></a><p style=3D"text-align:left;=
padding:0; margin:0;font-size:13px;"><a href=3D"https://parcel-api.delivery=
.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI=
5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm=
9kdWN0cGFnZS4xMjE5NjI2MDA0Lmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9=
tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZm=
lybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FM=
jcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=
=3D18e3d27dc96d8b59b8b900fccc4ff9d67105e94f126c0b2ec45509c7e4888e4f" target=
=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel =
Regular', sans-serif; font-weight:400; color: #222; font-size: 13px;"></a><=
a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61=
/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoia=
HR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjE5NjI2MDA0Lmh0bWw%2FdX=
RtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPWRpc=
3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5=
bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&amp;sig=3D56dfe7987b=
97506b6f4409abc2edb547fd3b2876f06b2bcfd7d691b14de18168"><font style=3D"colo=
r:#222222;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Co=
rbel Regular', sans-serif; font-weight:400;"><b><u>Complete the look</u></b=
></font></a></p></span></td></tr></tbody></table></th></tr></tbody></table>=
</td></tr><!-- spacer --><tr><td><table cellpadding=3D"0" cellspacing=3D"0"=
 border=3D"0" width=3D"100%"><tbody><tr><td height=3D"15"><div></div></td><=
/tr></tbody></table></td></tr><tr style=3D"background-color:#FFFFFF;" class=
=3D"pl-articles-table-row"><td><table role=3D"presentation" cellpadding=3D"=
0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><th class=3D"fl=
" style=3D"vertical-align:top;"><table role=3D"presentation" cellpadding=3D=
"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td width=3D"1=
40" style=3D"padding: 0; width: 140px; text-align: left; border-bottom: 0; =
padding-right:10px;"><a href=3D"https://parcel-api.delivery.hm.com/click/67=
7bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDg=
xYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMj=
I1MTU5MDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWw=
mdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV=
9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImd=
XRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Daa9ffd79f614ed9=
4c11084f13001fee87661c0893578be9090fae42ff0a6856b" target=3D"_blank" style=
=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-se=
rif; font-weight:400; color: #222; font-size: 13px;"> <table border=3D"0" c=
ellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"border-co=
llapse:collapse;border-spacing:0px;"><tbody><tr><td width=3D"140" style=3D"=
width:140px;text-align:left;" align=3D"left"><img height=3D"auto" src=3D"ht=
tps://assets.hm.com/articles/1225159002?assetType=3DDESCRIPTIVESTILLLIFE&am=
p;rendition=3Dmedium&amp;auth=3D86A8E522CE" style=3D"border:0;display:block=
;outline:none;text-decoration:none;height:auto;width:100%; text-align:left;=
 padding:0; margin:0;" width=3D"140"></td></tr></tbody></table></a></td><td=
 align=3D"left" style=3D"padding: 10px 20px 10px 10px; border-bottom: 0; ve=
rtical-align:middle; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel =
Regular', sans-serif; font-weight:400;" class=3D"fl pr10"><!-- added fl and=
 align:left--><span style=3D"font-family: 'HM Sans', 'Avenir Next Medium', =
'Corbel Regular', sans-serif; font-weight:400; color: #222; font-size: 13px=
;"> <a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071081a=
ebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJs=
IjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI1MTU5MDAyLmh0bWw=
%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2Fl=
YjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXN=
wYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cG=
RfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Daa9ffd79f614ed94c11084f13001fee8=
7661c0893578be9090fae42ff0a6856b" target=3D"_blank" style=3D"font-family: '=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:4=
00; color: #222; font-size: 13px;"><font style=3D"color:#222222;text-decora=
tion:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Co=
rbel Regular', sans-serif; font-weight:400; text-decoration: none;">Regular=
 Fit Waffled shirt</font><br><font style=3D"color:#222222;text-decoration:n=
one;font-size:13px;"><font style=3D"color: #CE2129; font-size:13px; font-fa=
mily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-w=
eight:400;"><font style=3D"font-weight: 600">=E2=82=B9</font> 899.10</font>=
&nbsp;&nbsp;<font style=3D"color: #222222; font-size: 11px;"><s style=3D"fo=
nt-size:11px;"><font style=3D"font-weight: 600">=E2=82=B9</font> 999.00</s>=
</font></font><br><br style=3D"line-height:10px"><table cellpadding=3D"0" c=
ellspacing=3D"0" border=3D"0"><tbody><tr><td width=3D"100" style=3D"width: =
100px;"><font style=3D"color:#707070;text-decoration:none;font-size:13px; f=
ont-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; =
font-weight:400;">Art. No.</font></td><td><font style=3D"color:#222222;text=
-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Mediu=
m', 'Corbel Regular', sans-serif; font-weight:400;">1225159002013</font></t=
d></tr><tr><td><font style=3D"color:#707070;text-decoration:none;font-size:=
13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-=
serif; font-weight:400;">Color</font></td><td class=3D"cut-text"><font styl=
e=3D"color:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sa=
ns', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">=
White</font></td></tr><tr><td><font style=3D"color:#707070;text-decoration:=
none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel =
Regular', sans-serif; font-weight:400;">Size</font></td><td><font style=3D"=
color:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', =
'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">L</fo=
nt></td></tr><tr><td><font style=3D"color:#707070;text-decoration:none;font=
-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular',=
 sans-serif; font-weight:400;">Quantity</font></td><td><font style=3D"color=
:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Aven=
ir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">1</font></=
td></tr></tbody></table><p style=3D"color:#222222;text-decoration:none;text=
-align:right;padding:0; margin:0;font-size:13px; font-family: 'HM Sans', 'A=
venir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;" class=
=3D"lom">Total &nbsp;&nbsp;&nbsp;<font style=3D"font-weight: 600">=E2=82=B9=
</font> 899.10</p></a><p style=3D"text-align:left;padding:0; margin:0;font-=
size:13px;"><a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f=
5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYx=
IiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI1MTU5MDA=
yLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lk=
PTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWl=
nbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2Nvbn=
RlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Daa9ffd79f614ed94c11084f1=
3001fee87661c0893578be9090fae42ff0a6856b" target=3D"_blank" style=3D"font-f=
amily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-=
weight:400; color: #222; font-size: 13px;"></a><a href=3D"https://parcel-ap=
i.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkI=
joiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9l=
bl9pbi9wcm9kdWN0cGFnZS4xMjI1MTU5MDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvb=
mFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9Q=
TFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSN=
wcm9kdWN0LXJlY28tc3dnIn0%3D&amp;sig=3Dde17c60a6eda04a1689d41eb1940d13d0f814=
1daed5464c9c4fab72af5914980"><font style=3D"color:#222222;font-size:13px; f=
ont-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; =
font-weight:400;"><b><u>Complete the look</u></b></font></a></p></span></td=
></tr></tbody></table></th></tr></tbody></table></td></tr><!-- spacer --><t=
r><td><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%=
"><tbody><tr><td height=3D"15"><div></div></td></tr></tbody></table></td></=
tr><tr style=3D"background-color:#FFFFFF;" class=3D"pl-articles-table-row">=
<td><table role=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" border=
=3D"0" width=3D"100%"><tbody><tr><th class=3D"fl" style=3D"vertical-align:t=
op;"><table role=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" borde=
r=3D"0" width=3D"100%"><tbody><tr><td width=3D"140" style=3D"padding: 0; wi=
dth: 140px; text-align: left; border-bottom: 0; padding-right:10px;"><a hre=
f=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forw=
ard?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cH=
M6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjQ5NTMwMDA0Lmh0bWw%2FdXRtX3N=
vdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MD=
QyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb=
25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2Um=
dXRtX3Rlcm09YW55In0%3D&amp;sig=3Dbd62211c64e765d2d6ae31bfa811673631db9af02d=
4976e4430d9c17407e7f51" target=3D"_blank" style=3D"font-family: 'HM Sans', =
'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; color:=
 #222; font-size: 13px;"> <table border=3D"0" cellpadding=3D"0" cellspacing=
=3D"0" role=3D"presentation" style=3D"border-collapse:collapse;border-spaci=
ng:0px;"><tbody><tr><td width=3D"140" style=3D"width:140px;text-align:left;=
" align=3D"left"><img height=3D"auto" src=3D"https://assets.hm.com/articles=
/1249530004?assetType=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;aut=
h=3D7C150E4D62" style=3D"border:0;display:block;outline:none;text-decoratio=
n:none;height:auto;width:100%; text-align:left; padding:0; margin:0;" width=
=3D"140"></td></tr></tbody></table></a></td><td align=3D"left" style=3D"pad=
ding: 10px 20px 10px 10px; border-bottom: 0; vertical-align:middle; font-fa=
mily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-w=
eight:400;" class=3D"fl pr10"><!-- added fl and align:left--><span style=3D=
"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif=
; font-weight:400; color: #222; font-size: 13px;"> <a href=3D"https://parce=
l-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpb=
ElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNv=
bS9lbl9pbi9wcm9kdWN0cGFnZS4xMjQ5NTMwMDA0Lmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2Fjd=
GlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERp=
c3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUEx=
QT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In=
0%3D&amp;sig=3Dbd62211c64e765d2d6ae31bfa811673631db9af02d4976e4430d9c17407e=
7f51" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Mediu=
m', 'Corbel Regular', sans-serif; font-weight:400; color: #222; font-size: =
13px;"><font style=3D"color:#222222;text-decoration:none;font-size:13px; fo=
nt-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; f=
ont-weight:400; text-decoration: none;">Regular Fit Waffled T-shirt</font><=
br><font style=3D"color:#222222;text-decoration:none;font-size:13px;"><font=
 style=3D"color: #CE2129; font-size:13px; font-family: 'HM Sans', 'Avenir N=
ext Medium', 'Corbel Regular', sans-serif; font-weight:400;"><font style=3D=
"font-weight: 600">=E2=82=B9</font> 467.65</font>&nbsp;&nbsp;<font style=3D=
"color: #222222; font-size: 11px;"><s style=3D"font-size:11px;"><font style=
=3D"font-weight: 600">=E2=82=B9</font> 519.61</s></font></font><br><br styl=
e=3D"line-height:10px"><table cellpadding=3D"0" cellspacing=3D"0" border=3D=
"0"><tbody><tr><td width=3D"100" style=3D"width: 100px;"><font style=3D"col=
or:#707070;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Av=
enir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">Art. No.=
</font></td><td><font style=3D"color:#222222;text-decoration:none;font-size=
:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans=
-serif; font-weight:400;">1249530004013</font></td></tr><tr><td><font style=
=3D"color:#707070;text-decoration:none;font-size:13px; font-family: 'HM San=
s', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">C=
olor</font></td><td class=3D"cut-text"><font style=3D"color:#222222;text-de=
coration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium',=
 'Corbel Regular', sans-serif; font-weight:400;">Dark grey</font></td></tr>=
<tr><td><font style=3D"color:#707070;text-decoration:none;font-size:13px; f=
ont-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; =
font-weight:400;">Size</font></td><td><font style=3D"color:#222222;text-dec=
oration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', =
'Corbel Regular', sans-serif; font-weight:400;">L</font></td></tr><tr><td><=
font style=3D"color:#707070;text-decoration:none;font-size:13px; font-famil=
y: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weig=
ht:400;">Quantity</font></td><td><font style=3D"color:#222222;text-decorati=
on:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corb=
el Regular', sans-serif; font-weight:400;">1</font></td></tr></tbody></tabl=
e><p style=3D"color:#222222;text-decoration:none;text-align:right;padding:0=
; margin:0;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'C=
orbel Regular', sans-serif; font-weight:400;" class=3D"lom">Total &nbsp;&nb=
sp;&nbsp;<font style=3D"font-weight: 600">=E2=82=B9</font> 467.65</p></a><p=
 style=3D"text-align:left;padding:0; margin:0;font-size:13px;"><a href=3D"h=
ttps://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=
=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93=
d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjQ5NTMwMDA0Lmh0bWw%2FdXRtX3NvdXJjZ=
T10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5=
N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJ=
tYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3=
Rlcm09YW55In0%3D&amp;sig=3Dbd62211c64e765d2d6ae31bfa811673631db9af02d4976e4=
430d9c17407e7f51" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Aveni=
r Next Medium', 'Corbel Regular', sans-serif; font-weight:400; color: #222;=
 font-size: 13px;"></a><a href=3D"https://parcel-api.delivery.hm.com/click/=
677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxM=
DgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4x=
MjQ5NTMwMDA0Lmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1ha=
WwmdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcy=
MTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0=
%3D&amp;sig=3Ddcb567efb2498bde22e7c7b9b85d357cd6ea48921d0e7f9b11ae7c567a3f3=
e60"><font style=3D"color:#222222;font-size:13px; font-family: 'HM Sans', '=
Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;"><b><u>=
Complete the look</u></b></font></a></p></span></td></tr></tbody></table></=
th></tr></tbody></table></td></tr><!-- spacer --><tr><td><table cellpadding=
=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td height=
=3D"15"><div></div></td></tr></tbody></table></td></tr><tr style=3D"backgro=
und-color:#FFFFFF;" class=3D"pl-articles-table-row"><td><table role=3D"pres=
entation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><=
tbody><tr><th class=3D"fl" style=3D"vertical-align:top;"><table role=3D"pre=
sentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%">=
<tbody><tr><td width=3D"140" style=3D"padding: 0; width: 140px; text-align:=
 left; border-bottom: 0; padding-right:10px;"><a href=3D"https://parcel-api=
.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIj=
oiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lb=
l9pbi9wcm9kdWN0cGFnZS4xMjEyNjE1MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbm=
FsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3Bhd=
GNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0Nf=
cGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&=
amp;sig=3Daaaab4d3a7662223b7af1bea9d53ba527cc94148ecd0605cdba2e3637285c5d1"=
 target=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', '=
Corbel Regular', sans-serif; font-weight:400; color: #222; font-size: 13px;=
"> <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presenta=
tion" style=3D"border-collapse:collapse;border-spacing:0px;"><tbody><tr><td=
 width=3D"140" style=3D"width:140px;text-align:left;" align=3D"left"><img h=
eight=3D"auto" src=3D"https://assets.hm.com/articles/1212615001?assetType=
=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;auth=3DC7F7510EC0" style=
=3D"border:0;display:block;outline:none;text-decoration:none;height:auto;wi=
dth:100%; text-align:left; padding:0; margin:0;" width=3D"140"></td></tr></=
tbody></table></a></td><td align=3D"left" style=3D"padding: 10px 20px 10px =
10px; border-bottom: 0; vertical-align:middle; font-family: 'HM Sans', 'Ave=
nir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;" class=3D"=
fl pr10"><!-- added fl and align:left--><span style=3D"font-family: 'HM San=
s', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; co=
lor: #222; font-size: 13px;"> <a href=3D"https://parcel-api.delivery.hm.com=
/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2Nm=
Y1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0c=
GFnZS4xMjEyNjE1MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW=
09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0a=
W9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgw=
MDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Daaaab4=
d3a7662223b7af1bea9d53ba527cc94148ecd0605cdba2e3637285c5d1" target=3D"_blan=
k" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular',=
 sans-serif; font-weight:400; color: #222; font-size: 13px;"><font style=3D=
"color:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans',=
 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; text-=
decoration: none;">Loose Fit Shirt</font><br><font style=3D"color:#222222;t=
ext-decoration:none;font-size:13px;"><font style=3D"color: #CE2129; font-si=
ze:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sa=
ns-serif; font-weight:400;"><font style=3D"font-weight: 600">=E2=82=B9</fon=
t> 1,583.10</font>&nbsp;&nbsp;<font style=3D"color: #222222; font-size: 11p=
x;"><s style=3D"font-size:11px;"><font style=3D"font-weight: 600">=E2=82=B9=
</font> 1,759.00</s></font></font><br><br style=3D"line-height:10px"><table=
 cellpadding=3D"0" cellspacing=3D"0" border=3D"0"><tbody><tr><td width=3D"1=
00" style=3D"width: 100px;"><font style=3D"color:#707070;text-decoration:no=
ne;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Re=
gular', sans-serif; font-weight:400;">Art. No.</font></td><td><font style=
=3D"color:#222222;text-decoration:none;font-size:13px; font-family: 'HM San=
s', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">1=
212615001013</font></td></tr><tr><td><font style=3D"color:#707070;text-deco=
ration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', '=
Corbel Regular', sans-serif; font-weight:400;">Color</font></td><td class=
=3D"cut-text"><font style=3D"color:#222222;text-decoration:none;font-size:1=
3px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-s=
erif; font-weight:400;">Cream/Dragon Deli</font></td></tr><tr><td><font sty=
le=3D"color:#707070;text-decoration:none;font-size:13px; font-family: 'HM S=
ans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;"=
>Size</font></td><td><font style=3D"color:#222222;text-decoration:none;font=
-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular',=
 sans-serif; font-weight:400;">L</font></td></tr><tr><td><font style=3D"col=
or:#707070;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Av=
enir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">Quantity=
</font></td><td><font style=3D"color:#222222;text-decoration:none;font-size=
:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans=
-serif; font-weight:400;">1</font></td></tr></tbody></table><p style=3D"col=
or:#222222;text-decoration:none;text-align:right;padding:0; margin:0;font-s=
ize:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', s=
ans-serif; font-weight:400;" class=3D"lom">Total &nbsp;&nbsp;&nbsp;<font st=
yle=3D"font-weight: 600">=E2=82=B9</font> 1,583.10</p></a><p style=3D"text-=
align:left;padding:0; margin:0;font-size:13px;"><a href=3D"https://parcel-a=
pi.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElk=
IjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9=
lbl9pbi9wcm9kdWN0cGFnZS4xMjEyNjE1MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlv=
bmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3B=
hdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0=
NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3=
D&amp;sig=3Daaaab4d3a7662223b7af1bea9d53ba527cc94148ecd0605cdba2e3637285c5d=
1" target=3D"_blank" style=3D"font-family: 'HM Sans', 'Avenir Next Medium',=
 'Corbel Regular', sans-serif; font-weight:400; color: #222; font-size: 13p=
x;"></a><a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071=
081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwi=
dXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjEyNjE1MDAxLmh=
0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBh=
aWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnR=
lbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&amp;sig=3D4=
b87cefc7da449263b8b9c1548e68e62c49c107ee957d69fb78b48390554b467"><font styl=
e=3D"color:#222222;font-size:13px; font-family: 'HM Sans', 'Avenir Next Med=
ium', 'Corbel Regular', sans-serif; font-weight:400;"><b><u>Complete the lo=
ok</u></b></font></a></p></span></td></tr></tbody></table></th></tr></tbody=
></table></td></tr><!-- spacer --><tr><td><table cellpadding=3D"0" cellspac=
ing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td height=3D"15"><div></d=
iv></td></tr></tbody></table></td></tr><tr style=3D"background-color:#FFFFF=
F;" class=3D"pl-articles-table-row"><td><table role=3D"presentation" cellpa=
dding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><th cl=
ass=3D"fl" style=3D"vertical-align:top;"><table role=3D"presentation" cellp=
adding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td w=
idth=3D"140" style=3D"padding: 0; width: 140px; text-align: left; border-bo=
ttom: 0; padding-right:10px;"><a href=3D"https://parcel-api.delivery.hm.com=
/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2Nm=
Y1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0c=
GFnZS4wOTY3OTU1MDgxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW=
09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0a=
W9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgw=
MDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D2c61b4=
8dd0554d895dd36d5cabe571aa209e72d67708a1865a2958389fa317ca" target=3D"_blan=
k" style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular',=
 sans-serif; font-weight:400; color: #222; font-size: 13px;"> <table border=
=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"b=
order-collapse:collapse;border-spacing:0px;"><tbody><tr><td width=3D"140" s=
tyle=3D"width:140px;text-align:left;" align=3D"left"><img height=3D"auto" s=
rc=3D"https://assets.hm.com/articles/0967955081?assetType=3DDESCRIPTIVESTIL=
LLIFE&amp;rendition=3Dmedium&amp;auth=3D00AA6AF6ED" style=3D"border:0;displ=
ay:block;outline:none;text-decoration:none;height:auto;width:100%; text-ali=
gn:left; padding:0; margin:0;" width=3D"140"></td></tr></tbody></table></a>=
</td><td align=3D"left" style=3D"padding: 10px 20px 10px 10px; border-botto=
m: 0; vertical-align:middle; font-family: 'HM Sans', 'Avenir Next Medium', =
'Corbel Regular', sans-serif; font-weight:400;" class=3D"fl pr10"><!-- adde=
d fl and align:left--><span style=3D"font-family: 'HM Sans', 'Avenir Next M=
edium', 'Corbel Regular', sans-serif; font-weight:400; color: #222; font-si=
ze: 13px;"> <a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f=
5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYx=
IiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4wOTY3OTU1MDg=
xLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lk=
PTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWl=
nbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2Nvbn=
RlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D2c61b48dd0554d895dd36d5c=
abe571aa209e72d67708a1865a2958389fa317ca" target=3D"_blank" style=3D"font-f=
amily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-=
weight:400; color: #222; font-size: 13px;"><font style=3D"color:#222222;tex=
t-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medi=
um', 'Corbel Regular', sans-serif; font-weight:400; text-decoration: none;"=
>Loose Fit Printed T-shirt</font><br><font style=3D"color:#222222;text-deco=
ration:none;font-size:13px;"><font style=3D"color: #CE2129; font-size:13px;=
 font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif=
; font-weight:400;"><font style=3D"font-weight: 600">=E2=82=B9</font> 467.1=
0</font>&nbsp;&nbsp;<font style=3D"color: #222222; font-size: 11px;"><s sty=
le=3D"font-size:11px;"><font style=3D"font-weight: 600">=E2=82=B9</font> 51=
9.00</s></font></font><br><br style=3D"line-height:10px"><table cellpadding=
=3D"0" cellspacing=3D"0" border=3D"0"><tbody><tr><td width=3D"100" style=3D=
"width: 100px;"><font style=3D"color:#707070;text-decoration:none;font-size=
:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans=
-serif; font-weight:400;">Art. No.</font></td><td><font style=3D"color:#222=
222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Ne=
xt Medium', 'Corbel Regular', sans-serif; font-weight:400;">0967955081013</=
font></td></tr><tr><td><font style=3D"color:#707070;text-decoration:none;fo=
nt-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular=
', sans-serif; font-weight:400;">Color</font></td><td class=3D"cut-text"><f=
ont style=3D"color:#222222;text-decoration:none;font-size:13px; font-family=
: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weigh=
t:400;">White/Valencia</font></td></tr><tr><td><font style=3D"color:#707070=
;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next =
Medium', 'Corbel Regular', sans-serif; font-weight:400;">Size</font></td><t=
d><font style=3D"color:#222222;text-decoration:none;font-size:13px; font-fa=
mily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-w=
eight:400;">L</font></td></tr><tr><td><font style=3D"color:#707070;text-dec=
oration:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', =
'Corbel Regular', sans-serif; font-weight:400;">Quantity</font></td><td><fo=
nt style=3D"color:#222222;text-decoration:none;font-size:13px; font-family:=
 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight=
:400;">1</font></td></tr></tbody></table><p style=3D"color:#222222;text-dec=
oration:none;text-align:right;padding:0; margin:0;font-size:13px; font-fami=
ly: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-wei=
ght:400;" class=3D"lom">Total &nbsp;&nbsp;&nbsp;<font style=3D"font-weight:=
 600">=E2=82=B9</font> 467.10</p></a><p style=3D"text-align:left;padding:0;=
 margin:0;font-size:13px;"><a href=3D"https://parcel-api.delivery.hm.com/cl=
ick/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1M=
DcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFn=
ZS4wOTY3OTU1MDgxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09Z=
W1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9u=
JnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDc=
yMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D2c61b48dd=
0554d895dd36d5cabe571aa209e72d67708a1865a2958389fa317ca" target=3D"_blank" =
style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sa=
ns-serif; font-weight:400; color: #222; font-size: 13px;"></a><a href=3D"ht=
tps://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=
=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93=
d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4wOTY3OTU1MDgxLmh0bWw%2FdXRtX3NvdXJjZ=
T10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPWRpc3BhdGNoX2Nv=
bmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV=
0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&amp;sig=3De422667ec5e5bb94ad279=
d6bf19e895b7b5ba5278eae2b423fc02aed52219dbb"><font style=3D"color:#222222;f=
ont-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regula=
r', sans-serif; font-weight:400;"><b><u>Complete the look</u></b></font></a=
></p></span></td></tr></tbody></table></th></tr></tbody></table></td></tr><=
!-- spacer --><tr><td><table cellpadding=3D"0" cellspacing=3D"0" border=3D"=
0" width=3D"100%"><tbody><tr><td height=3D"15"><div></div></td></tr></tbody=
></table></td></tr><tr style=3D"background-color:#FFFFFF;" class=3D"pl-arti=
cles-table-row"><td><table role=3D"presentation" cellpadding=3D"0" cellspac=
ing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><th class=3D"fl" style=3D"=
vertical-align:top;"><table role=3D"presentation" cellpadding=3D"0" cellspa=
cing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><td width=3D"140" style=
=3D"padding: 0; width: 140px; text-align: left; border-bottom: 0; padding-r=
ight:10px;"><a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f=
5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYx=
IiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjA3OTMyMDA=
xLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lk=
PTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWl=
nbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2Nvbn=
RlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D0b3feeb66d4e2d03e5288d52=
77eeba74b128562ac4be51cb09438422d1dd5d70" target=3D"_blank" style=3D"font-f=
amily: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-=
weight:400; color: #222; font-size: 13px;"> <table border=3D"0" cellpadding=
=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"border-collapse:col=
lapse;border-spacing:0px;"><tbody><tr><td width=3D"140" style=3D"width:140p=
x;text-align:left;" align=3D"left"><img height=3D"auto" src=3D"https://asse=
ts.hm.com/articles/1207932001?assetType=3DDESCRIPTIVESTILLLIFE&amp;renditio=
n=3Dmedium&amp;auth=3D787443B2A2" style=3D"border:0;display:block;outline:n=
one;text-decoration:none;height:auto;width:100%; text-align:left; padding:0=
; margin:0;" width=3D"140"></td></tr></tbody></table></a></td><td align=3D"=
left" style=3D"padding: 10px 20px 10px 10px; border-bottom: 0; vertical-ali=
gn:middle; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', =
sans-serif; font-weight:400;" class=3D"fl pr10"><!-- added fl and align:lef=
t--><span style=3D"font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Re=
gular', sans-serif; font-weight:400; color: #222; font-size: 13px;"> <a hre=
f=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forw=
ard?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cH=
M6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjA3OTMyMDAxLmh0bWw%2FdXRtX3N=
vdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MD=
QyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb=
25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2Um=
dXRtX3Rlcm09YW55In0%3D&amp;sig=3D0b3feeb66d4e2d03e5288d5277eeba74b128562ac4=
be51cb09438422d1dd5d70" target=3D"_blank" style=3D"font-family: 'HM Sans', =
'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:400; color:=
 #222; font-size: 13px;"><font style=3D"color:#222222;text-decoration:none;=
font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regul=
ar', sans-serif; font-weight:400; text-decoration: none;">Regular Fit Knitt=
ed T-shirt</font><br><font style=3D"color:#222222;text-decoration:none;font=
-size:13px;"><font style=3D"color: #CE2129; font-size:13px; font-family: 'H=
M Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:40=
0;"><font style=3D"font-weight: 600">=E2=82=B9</font> 809.10</font>&nbsp;&n=
bsp;<font style=3D"color: #222222; font-size: 11px;"><s style=3D"font-size:=
11px;"><font style=3D"font-weight: 600">=E2=82=B9</font> 899.00</s></font><=
/font><br><br style=3D"line-height:10px"><table cellpadding=3D"0" cellspaci=
ng=3D"0" border=3D"0"><tbody><tr><td width=3D"100" style=3D"width: 100px;">=
<font style=3D"color:#707070;text-decoration:none;font-size:13px; font-fami=
ly: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-wei=
ght:400;">Art. No.</font></td><td><font style=3D"color:#222222;text-decorat=
ion:none;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Cor=
bel Regular', sans-serif; font-weight:400;">1207932001013</font></td></tr><=
tr><td><font style=3D"color:#707070;text-decoration:none;font-size:13px; fo=
nt-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; f=
ont-weight:400;">Color</font></td><td class=3D"cut-text"><font style=3D"col=
or:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Av=
enir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">Light be=
ige</font></td></tr><tr><td><font style=3D"color:#707070;text-decoration:no=
ne;font-size:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Re=
gular', sans-serif; font-weight:400;">Size</font></td><td><font style=3D"co=
lor:#222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'A=
venir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">L</font=
></td></tr><tr><td><font style=3D"color:#707070;text-decoration:none;font-s=
ize:13px; font-family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', s=
ans-serif; font-weight:400;">Quantity</font></td><td><font style=3D"color:#=
222222;text-decoration:none;font-size:13px; font-family: 'HM Sans', 'Avenir=
 Next Medium', 'Corbel Regular', sans-serif; font-weight:400;">1</font></td=
></tr></tbody></table><p style=3D"color:#222222;text-decoration:none;text-a=
lign:right;padding:0; margin:0;font-size:13px; font-family: 'HM Sans', 'Ave=
nir Next Medium', 'Corbel Regular', sans-serif; font-weight:400;" class=3D"=
lom">Total &nbsp;&nbsp;&nbsp;<font style=3D"font-weight: 600">=E2=82=B9</fo=
nt> 809.10</p></a><p style=3D"text-align:left;padding:0; margin:0;font-size=
:13px;"><a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071=
081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwi=
dXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjA3OTMyMDAxLmh=
0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3=
N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1=
kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbn=
Q9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D0b3feeb66d4e2d03e5288d5277ee=
ba74b128562ac4be51cb09438422d1dd5d70" target=3D"_blank" style=3D"font-famil=
y: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weig=
ht:400; color: #222; font-size: 13px;"></a><a href=3D"https://parcel-api.de=
livery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiN=
jc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9p=
bi9wcm9kdWN0cGFnZS4xMjA3OTMyMDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJ=
nV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBP=
Q19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9=
kdWN0LXJlY28tc3dnIn0%3D&amp;sig=3D31cf33157efd597183688b2449ca87fb43cda9d63=
432564447ca7d1ec3b3f05f"><font style=3D"color:#222222;font-size:13px; font-=
family: 'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font=
-weight:400;"><b><u>Complete the look</u></b></font></a></p></span></td></t=
r></tbody></table></th></tr></tbody></table></td></tr><!-- spacer --><tr><t=
d><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><t=
body><tr><td height=3D"15"><div></div></td></tr></tbody></table></td></tr><=
/tbody></table></td></tr></tbody></table></td></tr></tbody></table>        =
                                                    </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]>
                          </td>

                      </tr>

                                </table>
                              <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
                        </td>
                      </tr>
                    </table>
                <![endif]-->


        <!-- Last White Block begins -->



        <br><br>




        <!--[if mso | IE]>
      <table
         align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" =
class=3D"" style=3D"width:652px;" width=3D"652"
      >
        <tr>
          <td style=3D"line-height:0px;font-size:0px;mso-line-height-rule:e=
xactly;">
      <![endif]-->
        <div style=3D"background:#ffffff;background-color:#ffffff;margin:0p=
x auto;max-width:652px;">
            <table role=3D"presentation" style=3D"background:#ffffff;backgr=
ound-color:#ffffff;width:100%;" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"border-bottom:12px solid #fff;directio=
n:ltr;font-size:0px;padding:20px 0;padding-left:30px;padding-right:30px;tex=
t-align:center;">
                            <!--[if mso | IE]>
                                <table role=3D"presentation" border=3D"0" c=
ellpadding=3D"0" cellspacing=3D"0">

                      <tr>

                          <td
                            class=3D"" style=3D"vertical-align:top;width:20=
7.2px;"
                          >
                        <![endif]-->
                            <div class=3D"mj-column-per-35 mj-outlook-group=
-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-b=
lock;vertical-align:top;width:100%;">
                                <table role=3D"presentation" style=3D"verti=
cal-align:top;" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word;" ali=
gn=3D"left">
                                                <div style=3D"font-family:'=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight: =
600;font-size:13px;line-height:20px;text-align:left;color:#222222; font-wei=
ght: 600;">
                                                    Order number
                                                </div>
                                        </td></tr>
                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:4px;padding-bottom:4px;word-break:break-word;" al=
ign=3D"left">
                                                <div style=3D"font-family:'=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight: =
600;font-size:16px; line-height:20px;text-align:left;color:#222222; font-we=
ight: 600;">
                                                    <a style=3D"text-decora=
tion: underline !important; color: #222222;" target=3D"_blank" href=3D"http=
s://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3D=
eyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly9obS5=
kZWxpdmVyeS1zdGF0dXMuY29tL2luL2VuLz9vcmRlck5vPTM5NzcyNzQ1ODAyJiZ1dG1fc291cm=
NlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjN=
jk3ZTIzYjBkRGlzcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZp=
cm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD10cmFja250cmFjZSZ=
zaG93X2FydGljbGVMaXN0PXllcyZzZWxlY3RlZFRyYWNraW5nTm89NzU4OTkxOTY2MjMmcz1SYn=
dGNEdRdmc3Jm94bV9lbT1wYXJjZWxMYWIifQ%3D%3D&amp;sig=3D9f95e8709954bb5b893bbb=
822404d2c58260135eef85d476cb84ab034cf3cc3f"><u>39772745802</u></a>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word;" ali=
gn=3D"left">
                                                <div style=3D"font-family:'=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight: =
600;font-size:13px;line-height:20px;text-align:left;color:#222222;font-weig=
ht: 600;">
                                                    Order date</div>
                                            </td>
                                        </tr>
                                        <tr>

                                            <td class=3D"breakall" style=3D=
"font-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-br=
eak:break-word;" align=3D"left">
                                                <div style=3D"font-family: =
'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:=
 600; font-size: 16px; line-height: 20px; text-align: left; color: #222222;=
 word-break: break-word; font-weight: 600;">
                                                    01/05/2025</div>
                                            </td>
                                        </tr>



                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word;" ali=
gn=3D"left">
                                                <div style=3D"font-family:'=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight: =
600;font-size:13px;line-height:20px;text-align:left;color:#222222;font-weig=
ht: 600;">
                                                    Mode of Payment </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class=3D"breakall" style=3D=
"font-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-br=
eak:break-word;" align=3D"left">
                                                <div style=3D"font-family: =
'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:=
 400; font-size: 13px;  line-height: 20px; text-align: left; color: #222222=
; word-break: break-word;">
Card                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
                          </td>

                          <td
                            class=3D"" style=3D"vertical-align:top;width:38=
4.8px;"
                          >
                        <![endif]-->

                            <div class=3D"mj-column-per-65 mj-outlook-group=
-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-b=
lock;vertical-align:top;width:100%;">
                                <table role=3D"presentation" style=3D"verti=
cal-align:top;" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0">
                                    <tbody>
                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:16px;padding-bottom:0;word-break:b=
reak-word;">
                                                <div style=3D"font-family:'=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight: =
600;font-size:13px;line-height:20px;text-align:left;color:#222222;font-weig=
ht: 600;">
                                                    Tracking number
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-break:=
break-word;">
                                                <div style=3D"font-family: =
'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-size: 1=
3px; line-height: 20px; text-align: left; color: #222222; word-break: break=
-word;">
75899196623                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:16px;padding-bottom:0;word-break:b=
reak-word;">
                                                <div style=3D"font-family:'=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight: =
600;font-size:13px;line-height:20px;text-align:left;color:#222222;font-weig=
ht: 600;">
                                                    Delivered with
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-break:=
break-word;">
                                                <div style=3D"font-family: =
'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-size: 1=
3px; line-height: 20px; text-align: left; color: #222222; word-break: break=
-word;">
Blue Dart                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:16px;padding-bottom:0;word-break:b=
reak-word;">
                                                <div style=3D"font-family:'=
HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight: =
600;font-size:13px;line-height:20px;text-align:left;color:#222222;font-weig=
ht: 600;">
                                                    Delivery Address
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-break:=
break-word;">
                                                <div style=3D"font-family: =
'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-size: 1=
3px; line-height: 20px; text-align: left; color: #222222; word-break: break=
-word;">
Devansh Chaudhary<br>9th Cross Road<br>10th A Main Road<br>Indiranagar<br>7=
20<br>560038<br>Bengaluru Karnataka<br>India                               =
                 </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
              </td>

          </tr>

                    </table>
                  <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        <![endif]-->

        <br>

        <!-- Block 2 begins -->
        <!--[if mso | IE]>
      <table align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D=
"0" class=3D"" style=3D"width:652px;" width=3D"652">
          <tr>
            <td style=3D"line-height:0px;font-size:0px;mso-line-height-rule=
:exactly;">
        <![endif]-->
        <div style=3D"background:#ffffff;background-color:#ffffff;margin:0p=
x auto;max-width:652px;">
            <table role=3D"presentation" style=3D"background:#ffffff;backgr=
ound-color:#ffffff;width:100%;" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"border-bottom:12px solid #fff;directio=
n:ltr;font-size:0px;padding:20px 0;padding-left:30px;padding-right:30px;tex=
t-align:center;">
                            <!--[if mso | IE]>
                                <table role=3D"presentation" border=3D"0" c=
ellpadding=3D"0" cellspacing=3D"0">

                      <tr>

                          <td
                            class=3D"" style=3D"vertical-align:top;width:20=
7.2px;"
                          >
                        <![endif]-->
                            <div class=3D"mj-column-per-35 mj-outlook-group=
-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-b=
lock;vertical-align:top;width:100%;">
                                <table role=3D"presentation" style=3D"verti=
cal-align:top;" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word;" ali=
gn=3D"left">
                                                <div style=3D"font-family:'=
HM Sans', 'Avenir Next Medium', 'Corbel Bold', sans-serif; font-weight:600;=
font-size:13px;line-height:20px;text-align:left;color:#222222; font-weight:=
600;">
                                                    YOUR DETAILS</div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class=3D"breakall" style=3D=
"font-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-br=
eak:break-word;" align=3D"left">
                                                <div style=3D"font-family: =
'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-serif; font-weight:=
 400; font-size: 13px;  line-height: 20px; text-align: left; color: #222222=
; word-break: keep-all;">
                                                    Devansh Chaudhary<br>
                                                    de=E2=80=8Cv.d=E2=80=8C=
eva=E2=80=8Cnsh=E2=80=8Ccha=E2=80=8Cudh=E2=80=8Cary=E2=80=8C@gm=E2=80=8Cail=
=E2=80=8C.co=E2=80=8Cm<br>
+91=E2=80=8C992=E2=80=8C901=E2=80=8C168=E2=80=8C9                          =
                      </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
                          </td>

                          <td
                            class=3D"" style=3D"vertical-align:top;width:38=
4.8px;"
                          >
                        <![endif]-->
                            <div class=3D"mj-column-per-65 mj-outlook-group=
-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-b=
lock;vertical-align:top;width:100%;">
                                &nbsp;
                                <!-- <table role=3D"presentation" style=3D"=
vertical-align:top;" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0"
                    border=3D"0">
                    <tbody>

                      <tr>
                        <td align=3D"left"
                          style=3D"font-size:0px;padding:10px 25px;padding-=
top:16px;padding-bottom:0;word-break:break-word;">
                          <div
                            style=3D"font-family:'HM Sans', 'Avenir Next Me=
dium', 'Corbel Regular', sans-serif; font-weight: 600;font-size:13px;line-h=
eight:20px;text-align:left;color:#222222; font-weight:600;">
                            Home Address
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align=3D"left"
                          style=3D"font-size:0px;padding:10px 25px;padding-=
top:4px;padding-bottom:4px;word-break:break-word;">
                          <div
                            style=3D"font-family: 'HM Sans', 'Avenir Next M=
edium', 'Corbel Regular', sans-serif; font-size: 13px; line-height: 20px; t=
ext-align: left; color: #222222; word-break: break-word;">
                            Devansh Chaudhary<br>
                            9th Cross Road, 10th A Main Road, Indiranagar<b=
r>
Bengaluru                          </div>
                        </td>
                      </tr>
                    </tbody>


                  </table> -->
                            </div>
                            <!--[if mso | IE]>
              </td>

          </tr>

                    </table>
                  <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        <![endif]-->







    <!-- Start of Banners Member -->
    <!--[if mso | IE]>
                <table
                   align=3D"center" border=3D"0" cellpadding=3D"0" cellspac=
ing=3D"0" class=3D"" style=3D"width:652px;" width=3D"652"
                >
                  <tr>
                    <td style=3D"line-height:0px;font-size:0px;mso-line-hei=
ght-rule:exactly;">

                  <v:rect  style=3D"width:652px;" xmlns:v=3D"urn:schemas-mi=
crosoft-com:vml" fill=3D"true" stroke=3D"false">
                  <v:fill  origin=3D"0.5, 0" position=3D"0.5, 0" color=3D"#=
F1EBDF" type=3D"tile" />
                  <v:textbox style=3D"mso-fit-shape-to-text:true" inset=3D"=
0,0,0,0">
                <![endif]-->
    <div style=3D"background:#F1EBDF;margin:0px auto;max-width:652px; paddi=
ng-top:20px;">
        <div style=3D"line-height:0;font-size:0;">
            <table align=3D"center" border=3D"0" cellpadding=3D"0" cellspac=
ing=3D"0" role=3D"presentation" style=3D"background:#F1EBDF;width:100%;">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:20=
px 0;padding-bottom:40px;padding-top:40px;text-align:center;">


                            <div class=3D"mj-column-per-100 mj-outlook-grou=
p-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-=
block;vertical-align:top;width:100%;">
                                <table border=3D"0" cellpadding=3D"0" cells=
pacing=3D"0" role=3D"presentation" style=3D"background-color:#F1EBDF;vertic=
al-align:top;" width=3D"100%">
                                    <tbody>
                                        <tr>
                                            <td align=3D"center" style=3D"f=
ont-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:10px;word-br=
eak:break-word;">
                                                <div style=3D"font-family:'=
HM Sans Semi Bold', Helvetica,
                      sans-serif;font-size:30px;line-height:36px;text-align=
:center;color:#E60A18;">
                                                    Hello Member! Have you =
checked our new arrivals yet?</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:10px;padding-right:40px;padding-bo=
ttom:14px;padding-left:40px;word-break:break-word;">
                                                <div style=3D"font-family:'=
HM Serif Regular', 'Georgia Regular', serif;font-size:17px;line-height:22px=
;text-align:center;color: #000000;">
                                                    Don't keep waiting the =
latest trends just dropped in!</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"center" vertical-a=
lign=3D"middle" style=3D"font-size:0px;padding:10px 25px;padding-bottom:40p=
x;word-break:break-word;">
                                                <table border=3D"0" cellpad=
ding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"border-collapse=
:separate;width:240px;line-height:100%;">
                                                    <tbody>
                                                        <tr>
                                                            <td align=3D"ce=
nter" bgcolor=3D"#fff" role=3D"presentation" style=3D"border:1px solid #000=
000;border-radius:0;cursor:auto;mso-padding-alt:10px 10px;background:#F1EBD=
F;" valign=3D"middle"> <a href=3D"https://parcel-api.delivery.hm.com/click/=
677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxM=
DgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9pbmRleC5odG1sP3V0=
bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1dG1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzdhZWIzMjg=
4NDA0MmM2OTdlMjNiMGREaXNwYXRjaENvbmZpcm1hdGlvbiZ1dG1fY2FtcGFpZ249ZGlzcGF0Y2=
hfY29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDBYMDA3MjEyJnV0bV9jb250ZW50PW1lbWJlc=
iZ1dG1fdGVybT1hbnkifQ%3D%3D&amp;sig=3D3ba2cb9dc709a6397c4fbf007310e7a4def35=
880862d488414eb23f1352bc9fe" style=3D"display:inline-block;width:88px;backg=
round:#F1EBDF;color:#000000;font-family:'HM Sans', 'Avenir Next Medium', 'C=
orbel Regular', sans-serif; font-weight: 400;font-size:13px;font-weight:600=
;line-height:20px;margin:0;text-decoration:none;text-transform:none;padding=
:10px 10px;mso-padding-alt:0px;border-radius:0;" target=3D"_blank">
                                                                    Shop No=
w
                                                                </a>
                                                            </td>
                                                            <td style=3D"pa=
dding-right: 10px;padding-left: 10px;">
                                                            </td>
                                                            <td align=3D"ce=
nter" bgcolor=3D"#fff" role=3D"presentation" style=3D"border:1px solid #000=
000;border-radius:0;cursor:auto;mso-padding-alt:10px 10px;background:#F1EBD=
F;" valign=3D"middle"> <a href=3D"https://parcel-api.delivery.hm.com/click/=
677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxM=
DgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2=
aWNlL3Nob3BwaW5nLWF0LWhtL3N0b3JlLWxvY2F0b3IuaHRtbD91dG1fc291cmNlPXRyYW5zYWN=
0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRG=
lzcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QT=
FBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1tZW1iZXImdXRtX3Rlcm09YW55In0%=
3D&amp;sig=3D7dbf9e5065bce3b4c51178f1055fe79d061c88ce6bd3b2973683f91cd2a8cc=
33" style=3D"display:inline-block;width:100px;background:#F1EBDF;color:#000=
000;font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-ser=
if; font-weight: 400;font-size:13px;font-weight:600;line-height:20px;margin=
:0;text-decoration:none;text-transform:none;padding:10px 10px;mso-padding-a=
lt:0px;border-radius:0;" target=3D"_blank">
                                                                    Find a =
Store
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
                      </td>

                  </tr>

                            </table>
                          <![endif]-->
                            <!-- </td>
                  </tr> -->
                            <!-- </tbody> -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!--[if mso | IE]>
                  </v:textbox>
                </v:rect>

                    </td>
                  </tr>
                </table>
                <![endif]-->

    <!-- Start of Banners No-Member -->


    <!-- Start of New Arrivals Member -->
    <!-- End of New Arrivals Member -->


    <!-- CAMPAIGN MANAGER BANNERS start -->


<!----- CAMPAIGN MANAGER BANNERS end ----------->

        <!--[if mso | IE]>
      <table
         align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" =
class=3D"" style=3D"width:652px;" width=3D"652"
      >
        <tr>
          <td style=3D"line-height:0px;font-size:0px;mso-line-height-rule:e=
xactly;">
      <![endif]-->
        <div style=3D"margin:0px auto;max-width:652px;">
            <table role=3D"presentation" style=3D"width:100%;" cellspacing=
=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:30=
px 0;text-align:center;">
                            <!--[if mso | IE]>
                  <table role=3D"presentation" border=3D"0" cellpadding=3D"=
0" cellspacing=3D"0">

        <tr>

            <td
               class=3D"" style=3D"width:326px;"
            >
          <![endif]-->
                            <div class=3D"mj-column-per-50 mj-outlook-group=
-fix" style=3D"font-size:0;line-height:0;text-align:left;display:inline-blo=
ck;width:100%;direction:ltr;">
                                <!--[if mso | IE]>
        <table  role=3D"presentation" border=3D"0" cellpadding=3D"0" cellsp=
acing=3D"0">
          <tr>

              <td
                 style=3D"vertical-align:top;width:163px;"
              >
              <![endif]-->
                                <div class=3D"mj-column-per-50 mj-outlook-g=
roup-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inli=
ne-block;vertical-align:top;width:50%;">
                                    <table role=3D"presentation" width=3D"1=
00%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                        <tbody>
                                            <tr>
                                                <td style=3D"vertical-align=
:top;padding-top:20px;padding-right:10px;padding-left:10px;">
                                                    <table role=3D"presenta=
tion" style=3D"" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:27px;wor=
d-break:break-word;" align=3D"center">
                                                                    <table =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px;=
" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                        <tb=
ody>
                                                                           =
 <tr>
                                                                           =
     <td style=3D"width:24px;">
                                                                           =
         <a target=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/cl=
ick/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1M=
DcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1z=
ZXJ2aWNlL3NoaXBwaW5nYW5kZGVsaXZlcnkuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWw=
mdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGlzcGF0Y2=
hDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19wa=
V9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1zaGlwcGluZ2FuZGRlbGl2ZXJ5JnV0bV90ZXJt=
PWFueSJ9&amp;sig=3Ddbd4e1e81a0724d831f852e09e04c3d0a74d7646de92937c24b634c2=
64de4ee5">
                                                                           =
             <img src=3D"https://parcel-cdn.delivery.hm.com/img/mail/hm/del=
ivery_3x.png" style=3D"border:0;display:block;outline:none;text-decoration:=
none;height:auto;width:100%;font-size:13px;" width=3D"24" height=3D"auto">
                                                                           =
         </a>
                                                                           =
     </td>
                                                                           =
 </tr>
                                                                        </t=
body>
                                                                    </table=
>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:14px;pad=
ding-bottom:30px;word-break:break-word;" align=3D"center">
                                                                    <div st=
yle=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-=
serif; font-weight: 400;font-size:13px;line-height:20px;text-align:center;c=
olor:#222222;">
                                                                        <a =
target=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/click/677bb978=
66f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZ=
TYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3No=
aXBwaW5nYW5kZGVsaXZlcnkuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl=
1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGlzcGF0Y2hDb25maXJtYX=
Rpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwW=
DAwNzIxMiZ1dG1fY29udGVudD1zaGlwcGluZ2FuZGRlbGl2ZXJ5JnV0bV90ZXJtPWFueSJ9&amp=
;sig=3Ddbd4e1e81a0724d831f852e09e04c3d0a74d7646de92937c24b634c264de4ee5" st=
yle=3D"text-decoration: none; color: #222; text-transform: capitalize;">
                                                                           =
 Delivery </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
              </td>

              <td
                 style=3D"vertical-align:top;width:163px;"
              >
              <![endif]-->
                                <div class=3D"mj-column-per-50 mj-outlook-g=
roup-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inli=
ne-block;vertical-align:top;width:50%;">
                                    <table role=3D"presentation" width=3D"1=
00%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                        <tbody>
                                            <tr>
                                                <td style=3D"vertical-align=
:top;padding-top:20px;padding-right:10px;padding-left:10px;">
                                                    <table role=3D"presenta=
tion" style=3D"" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:30px;wor=
d-break:break-word;" align=3D"center">
                                                                    <table =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px;=
" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                        <tb=
ody>
                                                                           =
 <tr>
                                                                           =
     <td style=3D"width:24px;"> <a target=3D"_blank" href=3D"https://parcel=
-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbE=
lkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvb=
S9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3BheW1lbnRzLWluZm8uaHRtbD91dG1fc291cmNlPXRy=
YW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTI=
zYjBkRGlzcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdG=
lvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1wYXltZW50cyZ1dG1fdGVyb=
T1hbnkifQ%3D%3D&amp;sig=3D2a42d0e460e5ecbbc262ee50d79c1d2cf14966bb50a602796=
23b647fbb72b753">

                                                                           =
             <img src=3D"https://parcel-cdn.delivery.hm.com/img/mail/hm/pay=
ment_3x.png" style=3D"border:0;display:block;outline:none;text-decoration:n=
one;height:auto;width:100%;font-size:13px;" width=3D"24" height=3D"auto">

                                                                           =
         </a> </td>
                                                                           =
 </tr>
                                                                        </t=
body>
                                                                    </table=
>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:14px;pad=
ding-bottom:30px;word-break:break-word;" align=3D"center">
                                                                    <div st=
yle=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-=
serif; font-weight: 400;font-size:13px;line-height:20px;text-align:center;c=
olor:#222222;">
                                                                        <a =
target=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/click/677bb978=
66f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZ=
TYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3Bh=
eW1lbnRzLWluZm8uaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWF=
pbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGlzcGF0Y2hDb25maXJtYXRpb24mdX=
RtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxM=
iZ1dG1fY29udGVudD1wYXltZW50cyZ1dG1fdGVybT1hbnkifQ%3D%3D&amp;sig=3D2a42d0e46=
0e5ecbbc262ee50d79c1d2cf14966bb50a60279623b647fbb72b753" style=3D"text-deco=
ration: none; color: #222; text-transform: capitalize;">
                                                                           =
 Payment </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
              </td>

          </tr>
          </table>
        <![endif]-->
                            </div>
                            <!--[if mso | IE]>
            </td>

            <td
               class=3D"" style=3D"width:326px;"
            >
          <![endif]-->
                            <div class=3D"mj-column-per-50 mj-outlook-group=
-fix" style=3D"font-size:0;line-height:0;text-align:left;display:inline-blo=
ck;width:100%;direction:ltr;">
                                <!--[if mso | IE]>
        <table  role=3D"presentation" border=3D"0" cellpadding=3D"0" cellsp=
acing=3D"0">
          <tr>

              <td
                 style=3D"vertical-align:top;width:163px;"
              >
              <![endif]-->
                                <div class=3D"mj-column-per-50 mj-outlook-g=
roup-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inli=
ne-block;vertical-align:top;width:50%;">
                                    <table role=3D"presentation" width=3D"1=
00%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                        <tbody>
                                            <tr>
                                                <td style=3D"vertical-align=
:top;padding-top:20px;padding-right:10px;padding-left:10px;">
                                                    <table role=3D"presenta=
tion" style=3D"" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:33px;wor=
d-break:break-word;" align=3D"center">
                                                                    <table =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px;=
" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                        <tb=
ody>
                                                                           =
 <tr>
                                                                           =
     <td style=3D"width:24px;"> <a target=3D"_blank" href=3D"https://parcel=
-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbE=
lkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvb=
S9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3JldHVybnMuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0=
aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGl=
zcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTF=
BPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1yZXR1cm5zJnV0bV90ZXJtPWFueSJ9&=
amp;sig=3Dba70589cca9802b0083bcbe30d94ebe23d791f1d152536518ab081b8142689be"=
>

                                                                           =
             <img src=3D"https://parcel-cdn.delivery.hm.com/img/mail/hm/ret=
urns_3x.png" style=3D"border:0;display:block;outline:none;text-decoration:n=
one;height:auto;width:100%;font-size:13px;" width=3D"24" height=3D"auto">

                                                                           =
         </a> </td>
                                                                           =
 </tr>
                                                                        </t=
body>
                                                                    </table=
>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 20px;padding-top:14px;pad=
ding-bottom:30px;word-break:break-word;" align=3D"center">
                                                                    <div st=
yle=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-=
serif; font-weight: 400;font-size:13px;line-height:20px;text-align:center;c=
olor:#222222;">
                                                                        <a =
target=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/click/677bb978=
66f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZ=
TYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3Jl=
dHVybnMuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1=
faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGlzcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbX=
BhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY=
29udGVudD1yZXR1cm5zJnV0bV90ZXJtPWFueSJ9&amp;sig=3Dba70589cca9802b0083bcbe30=
d94ebe23d791f1d152536518ab081b8142689be" style=3D"text-decoration: none; co=
lor: #222; text-transform: capitalize;">
                                                                           =
 Returns</a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
              </td>

              <td
                 style=3D"vertical-align:top;width:163px;"
              >
              <![endif]-->
                                <div class=3D"mj-column-per-50 mj-outlook-g=
roup-fix" style=3D"font-size:0px;text-align:left;direction:ltr;display:inli=
ne-block;vertical-align:top;width:50%;">
                                    <table role=3D"presentation" width=3D"1=
00%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                        <tbody>
                                            <tr>
                                                <td style=3D"vertical-align=
:top;padding-top:20px;padding-right:10px;padding-left:10px;">
                                                    <table role=3D"presenta=
tion" style=3D"" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:24px;wor=
d-break:break-word;" align=3D"center">
                                                                    <table =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px;=
" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                        <tb=
ody>
                                                                           =
 <tr>
                                                                           =
     <td style=3D"width:24px;"> <a target=3D"_blank" href=3D"https://parcel=
-api.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbE=
lkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvb=
S9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL2NvbnRhY3QuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0=
aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGl=
zcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTF=
BPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1jdXN0b21lcnNlcnZpY2UmdXRtX3Rlc=
m09YW55In0%3D&amp;sig=3Dbdbcf9c9ed8dba404f3ab4ac637db5228d49b1da0c82e0267b3=
0efc0d454bcd4">

                                                                           =
             <img src=3D"https://parcel-cdn.delivery.hm.com/img/mail/hm/cus=
tomerservice_3x.png" style=3D"border:0;display:block;outline:none;text-deco=
ration:none;height:auto;width:100%;font-size:13px;" width=3D"24" height=3D"=
auto">

                                                                           =
         </a> </td>
                                                                           =
 </tr>
                                                                        </t=
body>
                                                                    </table=
>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:0;paddin=
g-bottom:25px;word-break:break-word;" align=3D"center">
                                                                    <div st=
yle=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-=
serif; font-weight: 400;font-size:13px;line-height:20px;text-align:center;c=
olor:#222222;">
                                                                        <a =
target=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/click/677bb978=
66f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZ=
TYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL2Nv=
bnRhY3QuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1=
faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGlzcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbX=
BhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY=
29udGVudD1jdXN0b21lcnNlcnZpY2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Dbdbcf9c9ed8=
dba404f3ab4ac637db5228d49b1da0c82e0267b30efc0d454bcd4" style=3D"text-decora=
tion: none; color: #222; text-transform: capitalize;">
                                                                           =
 <br>Contact<br></a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
              </td>

          </tr>
          </table>
        <![endif]-->
                            </div>
                            <!--[if mso | IE]>
            </td>

        </tr>

                  </table>
                <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>









        <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->


        <!-- Footer images START-->


        <table align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=
=3D"0" role=3D"presentation" style=3D"background:#E4E4E4;background-color:#=
E4E4E4;width:100%;">
            <tbody>
                <tr>
                    <td>
                        <!--[if mso | IE]>
                          <table
                             align=3D"center" border=3D"0" cellpadding=3D"0=
" cellspacing=3D"0" class=3D"" style=3D"width:652px;" width=3D"652"
                          >
                            <tr>
                              <td style=3D"line-height:0px;font-size:0px;ms=
o-line-height-rule:exactly;">
                          <![endif]-->
                        <div style=3D"margin:0px auto;max-width:652px;">
                            <table align=3D"center" border=3D"0" cellpaddin=
g=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"width:100%;">
                                <tbody>
                                    <tr>
                                        <td style=3D"direction:ltr;font-siz=
e:0px;padding:40px 0px 0px 0px;text-align:center;">
                                            <!--[if mso | IE]>
                                      <table role=3D"presentation" border=
=3D"0" cellpadding=3D"0" cellspacing=3D"0">

                            <tr>

                                <td
                                   class=3D"" style=3D"width:652px;"
                                >
                              <![endif]-->
                                            <div class=3D"mj-column-per-100=
 mj-outlook-group-fix" style=3D"font-size:0;line-height:0;text-align:center=
;display:inline-block;width:100%;direction:ltr;">
                                                <!--[if mso | IE]>
                            <table
                               border=3D"0" cellpadding=3D"0" cellspacing=
=3D"0" role=3D"presentation"
                            >
                              <tr>

                                  <td
                                     style=3D"vertical-align:top;width:130p=
x;"
                                  >
                                  <![endif]-->
                                                <div class=3D"mj-column-per=
-20 mj-outlook-group-fix" style=3D"font-size:0px;text-align:left;direction:=
ltr;display:inline-block;vertical-align:top;width:19%;">
                                                    <table border=3D"0" cel=
lpadding=3D"0" cellspacing=3D"0" role=3D"presentation" width=3D"100%">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"vertical-align:top;padding:0px;">
                                                                    <table =
border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" styl=
e=3D"" width=3D"100%">
                                                                        <tb=
ody><tr>
                                                                           =
 <td align=3D"center" style=3D"font-size:0px;padding:0px;word-break:break-w=
ord;">
                                                                           =
     <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presen=
tation" style=3D"border-collapse:collapse;border-spacing:0px;">
                                                                           =
         <tbody>
                                                                           =
             <tr>
                                                                           =
                 <td style=3D"width:130px;">
                                                                           =
                     <a href=3D"https://parcel-api.delivery.hm.com/click/67=
7bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDg=
xYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi93b21lbi5odG1sP3V0bV=
9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1dG1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzdhZWIzMjg4N=
DA0MmM2OTdlMjNiMGREaXNwYXRjaENvbmZpcm1hdGlvbiZ1dG1fY2FtcGFpZ249ZGlzcGF0Y2hf=
Y29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDBYMDA3MjEyJnV0bV9jb250ZW50PWZvb3RlciZ=
1dG1fdGVybT1hbnkifQ%3D%3D&amp;sig=3Dcac3ec4a2d09966c0cda2b223c02bd353b37858=
b2f6411a02f05e8e17a4d9d88" target=3D"_blank">
                                                                           =
                         <img height=3D"auto" src=3D"https://parcel-cdn.del=
ivery.hm.com/img/mail/hm/01.Fashion-News-Choose-Women-1400x1400.jpg" style=
=3D"border:0;display:block;outline:none;text-decoration:none;height:auto;wi=
dth:100%;font-size:13px;" width=3D"130">
                                                                           =
                     </a>
                                                                           =
                 </td>
                                                                           =
             </tr>
                                                                           =
         </tbody>
                                                                           =
     </table>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                        <tr=
>
                                                                           =
 <td align=3D"center" style=3D"font-size:0px;padding:10px 25px;padding-top:=
8px;padding-right:0px;padding-bottom:4px;padding-left:0px;word-break:break-=
word;">
                                                                           =
     <div style=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Reg=
ular', sans-serif; font-weight: 400;font-size:12px;line-height:20px;text-al=
ign:center;color:#222222;">
                                                                           =
         <a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f507=
1081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiw=
idXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi93b21lbi5odG1sP3V0bV9zb3VyY2U9dH=
JhbnNhY3Rpb25hbCZ1dG1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzdhZWIzMjg4NDA0MmM2OTdlM=
jNiMGREaXNwYXRjaENvbmZpcm1hdGlvbiZ1dG1fY2FtcGFpZ249ZGlzcGF0Y2hfY29uZmlybWF0=
aW9uX1BMUE9DX3BpX0lORTI3MDBYMDA3MjEyJnV0bV9jb250ZW50PWZvb3RlciZ1dG1fdGVybT1=
hbnkifQ%3D%3D&amp;sig=3Dcac3ec4a2d09966c0cda2b223c02bd353b37858b2f6411a02f0=
5e8e17a4d9d88" style=3D"text-decoration:none; color:#222222;">Women</a>
                                                                           =
     </div>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                    </tbody=
></table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <!--[if mso | IE]>
                                  </td>

                                  <td
                                     style=3D"vertical-align:top;width:130p=
x;"
                                  >
                                  <![endif]-->
                                                <div class=3D"mj-column-per=
-20 mj-outlook-group-fix" style=3D"font-size:0px;text-align:left;direction:=
ltr;display:inline-block;vertical-align:top;width:19%;">
                                                    <table border=3D"0" cel=
lpadding=3D"0" cellspacing=3D"0" role=3D"presentation" width=3D"100%">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"vertical-align:top;padding:0px;">
                                                                    <table =
border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" styl=
e=3D"" width=3D"100%">
                                                                        <tb=
ody><tr>
                                                                           =
 <td align=3D"center" style=3D"font-size:0px;padding:0px;word-break:break-w=
ord;">
                                                                           =
     <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presen=
tation" style=3D"border-collapse:collapse;border-spacing:0px;">
                                                                           =
         <tbody>
                                                                           =
             <tr>
                                                                           =
                 <td style=3D"width:130px;">
                                                                           =
                     <a href=3D"https://parcel-api.delivery.hm.com/click/67=
7bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDg=
xYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9tZW4uaHRtbD91dG1fc2=
91cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwN=
DJjNjk3ZTIzYjBkRGlzcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2Nv=
bmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1mb290ZXImdXR=
tX3Rlcm09YW55In0%3D&amp;sig=3D65e7d2a01ad0bb948935c91a1ae2cd27e7d1e45ec4ba4=
41789de804d8efbbe24" target=3D"_blank">
                                                                           =
                         <img height=3D"auto" src=3D"https://parcel-cdn.del=
ivery.hm.com/img/mail/hm/01.Fashion-News-Men-1400x1400.jpg" style=3D"border=
:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;f=
ont-size:13px;" width=3D"130">
                                                                           =
                     </a>
                                                                           =
                 </td>
                                                                           =
             </tr>
                                                                           =
         </tbody>
                                                                           =
     </table>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                        <tr=
>
                                                                           =
 <td align=3D"center" style=3D"font-size:0px;padding:10px 25px;padding-top:=
8px;padding-right:0px;padding-bottom:4px;padding-left:0px;word-break:break-=
word;">
                                                                           =
     <div style=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Reg=
ular', sans-serif; font-weight: 400;font-size:12px;line-height:20px;text-al=
ign:center;color:#222222;">
                                                                           =
         <a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f507=
1081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiw=
idXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9tZW4uaHRtbD91dG1fc291cmNlPXRyYW=
5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc3YWViMzI4ODQwNDJjNjk3ZTIzY=
jBkRGlzcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPWRpc3BhdGNoX2NvbmZpcm1hdGlv=
bl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1mb290ZXImdXRtX3Rlcm09YW5=
5In0%3D&amp;sig=3D65e7d2a01ad0bb948935c91a1ae2cd27e7d1e45ec4ba441789de804d8=
efbbe24" style=3D"text-decoration:none; color:#222222;">Men</a>
                                                                           =
     </div>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                    </tbody=
></table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <!--[if mso | IE]>
                                  </td>

                                  <td
                                     style=3D"vertical-align:top;width:130p=
x;"
                                  >
                                  <![endif]-->
                                                <div class=3D"mj-column-per=
-20 mj-outlook-group-fix" style=3D"font-size:0px;text-align:left;direction:=
ltr;display:inline-block;vertical-align:top;width:19%;">
                                                    <table border=3D"0" cel=
lpadding=3D"0" cellspacing=3D"0" role=3D"presentation" width=3D"100%">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"vertical-align:top;padding:0px;">
                                                                    <table =
border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" styl=
e=3D"" width=3D"100%">
                                                                        <tb=
ody><tr>
                                                                           =
 <td align=3D"center" style=3D"font-size:0px;padding:0px;word-break:break-w=
ord;">
                                                                           =
     <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presen=
tation" style=3D"border-collapse:collapse;border-spacing:0px;">
                                                                           =
         <tbody>
                                                                           =
             <tr>
                                                                           =
                 <td style=3D"width:130px;">
                                                                           =
                     <a href=3D"https://parcel-api.delivery.hm.com/click/67=
7bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDg=
xYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9raWRzLmh0bWw%2FdXRt=
X3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg=
0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF=
9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9Zm9vdGVyJ=
nV0bV90ZXJtPWFueSJ9&amp;sig=3D38232aff0241d9766dabf946655c59f129b44194c9bba=
fc33e4d2e15a3ca48ed" target=3D"_blank">
                                                                           =
                         <img height=3D"auto" src=3D"https://parcel-cdn.del=
ivery.hm.com/img/mail/hm/01.Fashion-News-Kids-1400x1400.jpg" style=3D"borde=
r:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;=
font-size:13px;" width=3D"130">
                                                                           =
                     </a>
                                                                           =
                 </td>
                                                                           =
             </tr>
                                                                           =
         </tbody>
                                                                           =
     </table>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                        <tr=
>
                                                                           =
 <td align=3D"center" style=3D"font-size:0px;padding:10px 25px;padding-top:=
8px;padding-right:0px;padding-bottom:4px;padding-left:0px;word-break:break-=
word;">
                                                                           =
     <div style=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Reg=
ular', sans-serif; font-weight: 400;font-size:12px;line-height:20px;text-al=
ign:center;color:#222222;">
                                                                           =
         <a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f507=
1081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiw=
idXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9raWRzLmh0bWw%2FdXRtX3NvdXJjZT10=
cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2U=
yM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYX=
Rpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9Zm9vdGVyJnV0bV90ZXJtP=
WFueSJ9&amp;sig=3D38232aff0241d9766dabf946655c59f129b44194c9bbafc33e4d2e15a=
3ca48ed" style=3D"text-decoration:none; color:#222222;">Kids</a>
                                                                           =
     </div>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                    </tbody=
></table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <!--[if mso | IE]>
                                  </td>

                                  <td
                                     style=3D"vertical-align:top;width:130p=
x;"
                                  >
                                  <![endif]-->
                                                <div class=3D"mj-column-per=
-20 mj-outlook-group-fix" style=3D"font-size:0px;text-align:left;direction:=
ltr;display:inline-block;vertical-align:top;width:19%;">
                                                    <table border=3D"0" cel=
lpadding=3D"0" cellspacing=3D"0" role=3D"presentation" width=3D"100%">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"vertical-align:top;padding:0px;">
                                                                    <table =
border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" styl=
e=3D"" width=3D"100%">
                                                                        <tb=
ody><tr>
                                                                           =
 <td align=3D"center" style=3D"font-size:0px;padding:0px;word-break:break-w=
ord;">
                                                                           =
     <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presen=
tation" style=3D"border-collapse:collapse;border-spacing:0px;">
                                                                           =
         <tbody>
                                                                           =
             <tr>
                                                                           =
                 <td style=3D"width:130px;">
                                                                           =
                     <a href=3D"https://parcel-api.delivery.hm.com/click/67=
7bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDg=
xYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9ob21lLmh0bWw%2FdXRt=
X3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg=
0MDQyYzY5N2UyM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF=
9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9Zm9vdGVyJ=
nV0bV90ZXJtPWFueSJ9&amp;sig=3Dd43d82ed856f68df4c105cbd65e221d0561bd30e9a9c5=
57eab17a89dc4a306c5" target=3D"_blank">
                                                                           =
                         <img height=3D"auto" src=3D"https://parcel-cdn.del=
ivery.hm.com/img/mail/hm/01.Home_Fashion-News-Choose-Deptartment-1400x1400_=
4.jpg" style=3D"border:0;display:block;outline:none;text-decoration:none;he=
ight:auto;width:100%;font-size:13px;" width=3D"130">
                                                                           =
                     </a>
                                                                           =
                 </td>
                                                                           =
             </tr>
                                                                           =
         </tbody>
                                                                           =
     </table>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                        <tr=
>
                                                                           =
 <td align=3D"center" style=3D"font-size:0px;padding:10px 25px;padding-top:=
8px;padding-right:0px;padding-bottom:4px;padding-left:0px;word-break:break-=
word;">
                                                                           =
     <div style=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Reg=
ular', sans-serif; font-weight: 400;font-size:12px;line-height:16px;text-al=
ign:center;color:#222222;">
                                                                           =
         <a href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f507=
1081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiw=
idXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9ob21lLmh0bWw%2FdXRtX3NvdXJjZT10=
cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2U=
yM2IwZERpc3BhdGNoQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYX=
Rpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9Zm9vdGVyJnV0bV90ZXJtP=
WFueSJ9&amp;sig=3Dd43d82ed856f68df4c105cbd65e221d0561bd30e9a9c557eab17a89dc=
4a306c5" style=3D"text-decoration:none; color:#222222;">H&amp;M Home</a>
                                                                           =
     </div>
                                                                           =
 </td>
                                                                        </t=
r>
                                                                    </tbody=
></table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <!--[if mso | IE]>
                                  </td>

                              </tr>
                              </table>
                            <![endif]-->
                                            </div>
                                            <!--[if mso | IE]>
                                </td>

                            </tr>

                                      </table>
                                    <![endif]-->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]>
                              </td>
                            </tr>
                          </table>
                          <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>


        <!-- Footer images END -->

        <table role=3D"presentation" style=3D"background:#E4E4E4;background=
-color:#E4E4E4;width:100%;" cellspacing=3D"0" cellpadding=3D"0" border=3D"0=
" align=3D"center">
            <tbody>
                <tr>
                    <td>
                        <!--[if mso | IE]>
      <table
         align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" =
class=3D"" style=3D"width:652px;" width=3D"652"
      >
        <tr>
          <td style=3D"line-height:0px;font-size:0px;mso-line-height-rule:e=
xactly;">
      <![endif]-->
                        <div style=3D"margin:0px auto;max-width:652px;">
                            <table role=3D"presentation" style=3D"width:100=
%;" cellspacing=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                                <tbody>
                                    <tr>
                                        <td style=3D"direction:ltr;font-siz=
e:0px;padding:20px 0;text-align:center;">
                                            <!--[if mso | IE]>
                  <table role=3D"presentation" border=3D"0" cellpadding=3D"=
0" cellspacing=3D"0">

        <tr>

            <td
               class=3D"" style=3D"vertical-align:top;width:652px;"
            >
          <![endif]-->
                                            <div class=3D"mj-column-per-100=
 mj-outlook-group-fix" style=3D"font-size:0px;text-align:left;direction:ltr=
;display:inline-block;vertical-align:top;width:100%;">
                                                <table role=3D"presentation=
" style=3D"vertical-align:top;" width=3D"100%" cellspacing=3D"0" cellpaddin=
g=3D"0" border=3D"0">
                                                    <tbody>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;" alig=
n=3D"center">
                                                                <table role=
=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px;" ce=
llspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                    <tbody>
                                                                        <tr=
>
                                                                           =
 <td style=3D"width:230px;"> <a target=3D"_blank" href=3D"https://parcel-ap=
i.delivery.hm.com/click/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkI=
joiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9l=
bl9pbi9pbmRleC5odG1sP3V0bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1dG1fbWVkaXVtPWVtYWl=
sJnV0bV9pZD02NzdhZWIzMjg4NDA0MmM2OTdlMjNiMGREaXNwYXRjaENvbmZpcm1hdGlvbiZ1dG=
1fY2FtcGFpZ249ZGlzcGF0Y2hfY29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDBYMDA3MjEyJ=
nV0bV9jb250ZW50PWhtX2xvZ28mdXRtX3Rlcm09YW55In0%3D&amp;sig=3D73334c00f03e767=
662cbcb09442d9d06c80763b083e04c9a23fc1a1eddf983fd">

                                                                           =
         <img alt=3D"H&amp;M" src=3D"https://parcel-cdn.delivery.hm.com/img=
/mail/hm/Logo_Long_2x.png" style=3D"border:0;display:block;outline:none;tex=
t-decoration:none;height:auto;width:100%;font-size:13px;" width=3D"230" hei=
ght=3D"auto">

                                                                           =
     </a> </td>
                                                                        </t=
r>
                                                                    </tbody=
>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:30px;word-bre=
ak:break-word;" align=3D"center">
                                                                <div style=
=3D"font-family:'HM Sans', 'Avenir Next Medium', 'Corbel Regular', sans-ser=
if; font-weight: 400;font-size:11px;line-height:16px;text-align:center;colo=
r:#707070;">


                                                                    <!-- Fo=
oter for delivery or cancelled emails -->
                                                                    <a targ=
et=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5=
071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxI=
iwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3JldHVy=
bnMuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ=
9Njc3YWViMzI4ODQwNDJjNjk3ZTIzYjBkRGlzcGF0Y2hDb25maXJtYXRpb24mdXRtX2NhbXBhaW=
duPWRpc3BhdGNoX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29ud=
GVudD1mb290ZXImdXRtX3Rlcm09YW55In0%3D&amp;sig=3D8dae142e515ef6551d36fa947df=
13a6fbcb5e18a224f543f26f129f03c4cd233" style=3D"color: #222;">Return Policy=
</a> | <a target=3D"_blank" href=3D"https://parcel-api.delivery.hm.com/clic=
k/677bb97866f5071081aebe61/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDc=
xMDgxYWViZTYxIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZX=
J2aWNlL2xlZ2FsLWFuZC1wcml2YWN5L3ByaXZhY3ktbGluay5odG1sP3V0bV9zb3VyY2U9dHJhb=
nNhY3Rpb25hbCZ1dG1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzdhZWIzMjg4NDA0MmM2OTdlMjNi=
MGREaXNwYXRjaENvbmZpcm1hdGlvbiZ1dG1fY2FtcGFpZ249ZGlzcGF0Y2hfY29uZmlybWF0aW9=
uX1BMUE9DX3BpX0lORTI3MDBYMDA3MjEyJnV0bV9jb250ZW50PWZvb3RlciZ1dG1fdGVybT1hbn=
kifQ%3D%3D&amp;sig=3Dbcbe679a964583c5d1c05ec3aaf0527ef92749580f938df8b2e969=
3044c76e32" style=3D"color: #222;"> Privacy Notice</a> | <a target=3D"_blan=
k" href=3D"https://parcel-api.delivery.hm.com/click/677bb97866f5071081aebe6=
1/forward?to=3DeyJlbWFpbElkIjoiNjc3YmI5Nzg2NmY1MDcxMDgxYWViZTYxIiwidXJsIjoi=
aHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL2xlZ2FsLWFuZC1wcml=
2YWN5L3Rlcm1zLWFuZC1jb25kaXRpb25zLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFs=
JnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3N2FlYjMyODg0MDQyYzY5N2UyM2IwZERpc3BhdGN=
oQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1kaXNwYXRjaF9jb25maXJtYXRpb25fUExQT0NfcG=
lfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9Zm9vdGVyJnV0bV90ZXJtPWFueSJ9&amp;sig=
=3D1562542f7322122423c3d24e0f0f857d06028219686dd5b0b1b8dd089bbd0b75" style=
=3D"color: #222;">Terms &amp; Conditions</a>


                                                                    <br><br=
>

                                                                    H&amp;M=
 Hennes &amp; Mauritz Retail Pvt. Ltd. Ind,<br> District Centre Saket D-3<b=
r>A-Wing, 2nd Floor<br>Delhi, 110017<br>
                                                                    Registe=
red Number:CIN- U74140DL2013FTC262231<br>

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <!--[if mso | IE]>
            </td>

        </tr>

                  </table>
                <![endif]-->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>



</body></html>


<img src=3D"https://parcel-api.delivery.hm.com/open/677bb97866f5071081aebe6=
1/sent-by-parcellab.png" alt=3D"" width=3D"3" height=3D"2" border=3D"0" sty=
le=3D"height:3px !important;width:2px !important;border-width:0 !important;=
margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !importan=
t;margin-left:0 !important;padding-top:0 !important;padding-bottom:0 !impor=
tant;padding-right:=3D0 !important;padding-left:0 !important;"/>
----_NmP-def274620c30b2cb-Part_1--
Delivered-To: dev.devanshchaudhary@gmail.com
Received: by 2002:a17:504:5e62:b0:1ca7:870c:a21f with SMTP id fv2csp1406582njc;
        Fri, 8 Aug 2025 03:24:09 -0700 (PDT)
X-Received: by 2002:a05:6000:1a8e:b0:3b7:9233:ebb with SMTP id ffacd0b85a97d-3b90092fd21mr2071413f8f.6.1754648649606;
        Fri, 08 Aug 2025 03:24:09 -0700 (PDT)
ARC-Seal: i=1; a=rsa-sha256; t=1754648649; cv=none;
        d=google.com; s=arc-20240605;
        b=d2VJ6H3f3YEmRYFjvyWR4ySEX2AihKN2XaFdFWpjXICWU7qpfno/eDq6CSdmC1dUBq
         J5E308x0VK2An6sxQ4yhk/ZZ6C9ysnc1rq66+UftIwC6n6sZEygNuJwk7sJxGB14ewcC
         VQXa9O8dmlxoNF0J6PkdFzaP+4NRQ5M4WCyNpgpwYpxqxc3eWFM18sKmv8K7bpOeBhMg
         DpT2tSNhUJMy2wgfE39TMEdjtrB6ETX76kcky4J5QeRiESIcO3Psk18PzF5QGD8Gaz4i
         /U6GN0pmJ5Vag4ELNU6k1aZ2wzUDitkMkzznhuaYEcUSzjSw6t95QHKORylPiH8wpq7D
         X7dw==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605;
        h=to:subject:message-id:date:from:in-reply-to:references:mime-version
         :dkim-signature;
        bh=hBrMu/6stkyfrTnR/ZwLFytVzjxFXB7zm+yqLheYyA0=;
        fh=C6tFI7DrzN7B1FlvIoDVmUuuAMD29xmKKZ0hrAJaD+A=;
        b=LUz0++OSuROj1PGNfNUdsGukJWVtmE/MNLk8jKnfQblRjqUZ7+Q7aYEDb6DWjIgNyj
         rEVmcl7V3Rl0nQkV5CfxhjX0a7uJWKWIR2ueDS76AK1xXDaZZJw9o+yWBOxHzJkAi85C
         V28idxDHDcYbFPIRxvUDZGQPGr9mkRI/6/SzwTLEX/1HyJUuNIJYpfvzyZsnPfpwRw+Y
         qbD8y/A3gDGBhA/2Op/TPoY8k2wMpA6HE+w2YihH1hf5YH8VbidW4pYpREs6uxn+f4J3
         NJWaZP88MOYhK4f9RchEcfmF/8Abc6vD8BdwXUK9q8K+25vr3F1l4leYroNfb6+gtopE
         Dcfw==;
        dara=google.com
ARC-Authentication-Results: i=1; mx.google.com;
       dkim=pass header.i=@gmail.com header.s=20230601 header.b=g8yH+97T;
       spf=pass (google.com: domain of anmolrai.ar03@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=anmolrai.ar03@gmail.com;
       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com;
       dara=pass header.i=@gmail.com
Return-Path: <anmolrai.ar03@gmail.com>
Received: from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])
        by mx.google.com with SMTPS id ffacd0b85a97d-3b8fab56f1bsor945777f8f.9.2025.08.08.03.24.09
        for <Dev.devanshchaudhary@gmail.com>
        (Google Transport Security);
        Fri, 08 Aug 2025 03:24:09 -0700 (PDT)
Received-SPF: pass (google.com: domain of anmolrai.ar03@gmail.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@gmail.com header.s=20230601 header.b=g8yH+97T;
       spf=pass (google.com: domain of anmolrai.ar03@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=anmolrai.ar03@gmail.com;
       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com;
       dara=pass header.i=@gmail.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=gmail.com; s=20230601; t=1754648649; x=1755253449; dara=google.com;
        h=to:subject:message-id:date:from:in-reply-to:references:mime-version
         :from:to:cc:subject:date:message-id:reply-to;
        bh=hBrMu/6stkyfrTnR/ZwLFytVzjxFXB7zm+yqLheYyA0=;
        b=g8yH+97TVDy+79fGFsp20XgrR3znY9Jqep9BImYWnbQsuLPKLHi8LITG6iPJsCq1Qc
         zjwfnshmi8RCKXep5D667lyLJcwFHJFnXVHVLTp0/lcCr/K18nAziWZZhXHfBSN5r6NN
         ij4lQFaFbmVWdpguW5OMFJu8cG/zOtB8RhhpZSpjJoAalb02daQsqeGNEPE1HPqW3125
         n8yERsz9+3qv2g8KsWR+y11oVtGzNhUMFR2o9yeClkJhJhDXdnRaYfGnnYfSiQSSnxSp
         pcKbHXTn7OipP4sEKybuagXbaNSVrsxc67I8Ua05EfRYBt5I8gpQReQWv9BtmmNuxTsF
         PAJA==
X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=1e100.net; s=20230601; t=1754648649; x=1755253449;
        h=to:subject:message-id:date:from:in-reply-to:references:mime-version
         :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to;
        bh=hBrMu/6stkyfrTnR/ZwLFytVzjxFXB7zm+yqLheYyA0=;
        b=kN+kOFlAp+eLzgPuhsmUY3I28B2wOAJk9/r7EJm1BdOIEFZxdUZnCCIwdnTGPyVqJY
         IQHVIDcbx03sseAoNOgNDkNN2zqtkjXKf8sDR71UfFyjBFtI+fPA0P3VkxVYhlgnygDX
         IPZxcy7pqXa5DOe4JV18qdnKBuofLrm5VQGBVAMR9P6yVvBKu9dGJYrI8dFOf6J6B/0c
         o+SMahO44sa8UvfOIe2kHackFWXD+7Y6Bzh8FHe8B+G8XSh8mZxw/L+Td324clWBVW//
         DOaxYHc/NNYVVHHSvOkttmGfxeJPY3YSYzC9nCWWMUQAB5ANpEuyMcw7asxRQXKsJaC8
         F/vg==
X-Gm-Message-State: AOJu0Yw9H5DzirKlhRnd6+pg6hAVJP23RrFQJTf1XeWFyCZjSXz0DkZf GKiochuZZgQOD9y4bxxAtJvdxozfzGaneo04aKhtjitUGzQ1yGemcNy5ZchNaz5hQnbe2/d49hd yUK6gmWN3SFCZdlJqF2CEp2fx1VkyEswUqw==
X-Gm-Gg: ASbGncvf/FkQsoNC1lxueAJ9hhvrRq1D2/UZT13dzgmbvwE4+CTBdGlnR5AvYvnF6Q/ XBY5B1VvnQwAzhklIAHQt8/ad3hiRLm8RpNiuRNNZfvC9Pijsx+BvvkhVdiqCSJsL1530g53g4r S/fSig+KE+HPDXE9mitq3OEqBe+xChfM39BjA88K96KqK/4GKrIkOpkLkzBg9Ny0bcluB5eTvTH NaN+YKqpTbO04i0zFaJfglWU4/fZoLzV3eYxvY5
X-Google-Smtp-Source: AGHT+IE15eCsQbBO7AbhRT4uy0usBIWGOY6Qd7qFLlIxlNbyQkAOz4HgkRjnQeNG2x58H/USSHmy8KTYs8TnjfSURQ8=
X-Received: by 2002:a5d:64c3:0:b0:3b7:761a:95d9 with SMTP id ffacd0b85a97d-3b900b57770mr2186449f8f.59.1754648648324; Fri, 08 Aug 2025 03:24:08 -0700 (PDT)
MIME-Version: 1.0
References: <01020193edd3cd1b-51393f81-ea47-4706-9b2d-a6a16c6520b1-000000@eu-west-1.amazonses.com>
In-Reply-To: <01020193edd3cd1b-51393f81-ea47-4706-9b2d-a6a16c6520b1-000000@eu-west-1.amazonses.com>
From: Anmol Rai <anmolrai.ar03@gmail.com>
Date: Fri, 8 Aug 2025 15:53:56 +0530
X-Gm-Features: Ac12FXwaJ_z1dJRxjmxKyCoMVO2OcKfXztqq3zqu5Uuxz37ioF8Er7Juusr09e4
Message-ID: <CA+139tptpeabbSuRVAPKAewa5OE8_BNnYWn4dAE7yJyxyskcFw@mail.gmail.com>
Subject: Fwd: Order Confirmation
To: Devansh Chaudhary <Dev.devanshchaudhary@gmail.com>
Content-Type: multipart/alternative; boundary="000000000000639a25063bd7f90e"

--000000000000639a25063bd7f90e
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

Regards,
Anmol


---------- Forwarded message ---------
From: H&M <In@delivery.hm.com>
Date: Sun, 22 Dec 2024 at 15:35
Subject: Order Confirmation
To: <anmolrai.ar03@gmail.com>


Thank you for shopping at H&M
[image: H&M]
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9pbmRleC5odG1sP3V0bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1d=
G1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzY3ZTQxMzcxZGNkOTNiOTU2MjhlNzBPcmRlckNvbmZp=
cm1hdGlvbiZ1dG1fY2FtcGFpZ249b3JkZXJfY29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDB=
YMDA3MjEyJnV0bV9jb250ZW50PWhtX2xvZ28mdXRtX3Rlcm09YW55In0%3D&sig=3D6c4c60f90=
189cf9dfbffb0cdc7b1b8391c46c9711e0fd54621cd706ef6de73e8>

Thank you for shopping at H&M

We have received your order and will contact you when your parcel is
shipped. Below is the purchase information.
Order details
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI5OTExMDAzLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D2abbb34af0403d1527c26dc7995b4ecba55b403da7d7f49faa80227649=
e52d2f>
Fine-knit
turtleneck jumper
=E2=82=B9 599.00

Art. No. 1229911003010
Color Cream
Size S
Quantity 1

Total    =E2=82=B9 599.00
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI5OTExMDAzLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D2abbb34af0403d1527c26dc7995b4ecba55b403da7d7f49faa80227649=
e52d2f>

<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI5OTExMDAzLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D2abbb34af0403d1527c26dc7995b4ecba55b403da7d7f49faa80227649=
e52d2f>*Complete
the look*
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI5OTExMDAzLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPW9yZGVyX2Nvbm=
Zpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0b=
V90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&sig=3D7a6d0eb80da5872e96eccd9d396=
a4515a24f43ba817c391364450c98ea637267>
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMTUzMTUzMDAyLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D18663ae83ffd46071cc468fe7c6b387898b4b47879149db47e53b83210=
f486dc>
Collared
cropped top
=E2=82=B9 279.00

Art. No. 1153153002010
Color Black
Size S
Quantity 1

Total    =E2=82=B9 279.00
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMTUzMTUzMDAyLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D18663ae83ffd46071cc468fe7c6b387898b4b47879149db47e53b83210=
f486dc>

<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMTUzMTUzMDAyLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D18663ae83ffd46071cc468fe7c6b387898b4b47879149db47e53b83210=
f486dc>*Complete
the look*
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMTUzMTUzMDAyLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPW9yZGVyX2Nvbm=
Zpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0b=
V90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&sig=3D42ac89ac7ab4195f7c72adfb0f7=
3c8d0045e6efbfb83f2d031c882931d7daa7d>
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjMzMjU2MDAxLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D12a29f9b73aca258dd3a43edf79d90b49b3af10ddbb99223ace21cc5c9=
eb2e96>
Ribbed
polo shirt
=E2=82=B9 319.00

Art. No. 1233256001010
Color White
Size S
Quantity 1

Total    =E2=82=B9 319.00
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjMzMjU2MDAxLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D12a29f9b73aca258dd3a43edf79d90b49b3af10ddbb99223ace21cc5c9=
eb2e96>

<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjMzMjU2MDAxLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2=
I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb=
25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09=
YW55In0%3D&sig=3D12a29f9b73aca258dd3a43edf79d90b49b3af10ddbb99223ace21cc5c9=
eb2e96>*Complete
the look*
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjMzMjU2MDAxLmh0bWw%2FdXRtX3NvdXJ=
jZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPW9yZGVyX2Nvbm=
Zpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0b=
V90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&sig=3D2ce46d57d6e9e87cee3e2a1125e=
e590f33b0a6b086a7905664a10793683a6362>
Order summary
Order value
=E2=82=B9 1,197.00
Shipping & handling
Free
Total
=E2=82=B9 1,197.00
Your membership points have been updated


Order number
*39453050012*
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
9obS5kZWxpdmVyeS1zdGF0dXMuY29tL2luL2VuLz9vcmRlck5vPTM5NDUzMDUwMDEyJiZ1dG1fc=
291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRj=
ZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1=
hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD10cmFja250cmFjZSZzaG=
93X2FydGljbGVMaXN0PXllcyZzZWxlY3RlZFRyYWNraW5nTm89JnM9eG95cUFUTWxKRyZveG1fZ=
W09cGFyY2VsTGFiIn0%3D&sig=3Dfcfd58b7c097e99212099e40405f2b55dae3da93c269c94=
ce5c30209d5338871>
Order date
12/22/2024
Delivery Method
Standard delivery
2-7 days
Mode of Payment
Card
Delivery Address
Anmol Rai
720
9th Cross
10th Main
Indiranagar
Near Velo Studio
560038
Bangalore Karnataka
India

YOUR DETAILS
Anmol Rai
a=E2=80=8Cnmo=E2=80=8Clra=E2=80=8Ci.a=E2=80=8Cr03=E2=80=8C@gm=E2=80=8Cail=
=E2=80=8C.co=E2=80=8Cm
+91=E2=80=8C983=E2=80=8C868=E2=80=8C287=E2=80=8C1

Hello Member! Have you checked our new arrivals yet?
Don't keep waiting the latest trends just dropped in!
Shop Now
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9pbmRleC5odG1sP3V0bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1d=
G1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzY3ZTQxMzcxZGNkOTNiOTU2MjhlNzBPcmRlckNvbmZp=
cm1hdGlvbiZ1dG1fY2FtcGFpZ249b3JkZXJfY29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDB=
YMDA3MjEyJnV0bV9jb250ZW50PW1lbWJlciZ1dG1fdGVybT1hbnkifQ%3D%3D&sig=3D6b4bb8b=
0a6c67a1e5c564ebcaa141ede5787def66a4d90a5fedb49193b640b5e>
Find
a Store
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3Nob3BwaW5nLWF0LWhtL3N0b3JlL=
WxvY2F0b3IuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1=
dG1faWQ9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXB=
haWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udG=
VudD1tZW1iZXImdXRtX3Rlcm09YW55In0%3D&sig=3Dcd8350983de96875b548ff7ce332e993=
e0a6eb0355fdfe8c8b005971714565e3>
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3NoaXBwaW5nYW5kZGVsaXZlcnkua=
HRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2=
N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGV=
yX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1zaGlwcG=
luZ2FuZGRlbGl2ZXJ5JnV0bV90ZXJtPWFueSJ9&sig=3D5691dc6e2b6165c8004b7b7178608c=
f172d3d2689ff22a5771265bf1388b708d>

Delivery
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3NoaXBwaW5nYW5kZGVsaXZlcnkua=
HRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2=
N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGV=
yX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1zaGlwcG=
luZ2FuZGRlbGl2ZXJ5JnV0bV90ZXJtPWFueSJ9&sig=3D5691dc6e2b6165c8004b7b7178608c=
f172d3d2689ff22a5771265bf1388b708d>
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3BheW1lbnRzLWluZm8uaHRtbD91d=
G1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3=
MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZ=
pcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1wYXltZW50cyZ1dG=
1fdGVybT1hbnkifQ%3D%3D&sig=3Dde00e38a856b628bef034b7bd3d297300560e5cd1728fc=
4a9ba3a6983cce7439>

Payment
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3BheW1lbnRzLWluZm8uaHRtbD91d=
G1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3=
MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZ=
pcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1wYXltZW50cyZ1dG=
1fdGVybT1hbnkifQ%3D%3D&sig=3Dde00e38a856b628bef034b7bd3d297300560e5cd1728fc=
4a9ba3a6983cce7439>
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3JldHVybnMuaHRtbD91dG1fc291c=
mNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkz=
Yjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGl=
vbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1yZXR1cm5zJnV0bV90ZXJtPW=
FueSJ9&sig=3D83de907ad07e7a4b81b0d6fb894fb57aa6adb0413e87ee8c2c28a989b631a4=
be>

Returns
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3JldHVybnMuaHRtbD91dG1fc291c=
mNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkz=
Yjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGl=
vbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1yZXR1cm5zJnV0bV90ZXJtPW=
FueSJ9&sig=3D83de907ad07e7a4b81b0d6fb894fb57aa6adb0413e87ee8c2c28a989b631a4=
be>
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL2NvbnRhY3QuaHRtbD91dG1fc291c=
mNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkz=
Yjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGl=
vbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1jdXN0b21lcnNlcnZpY2UmdX=
RtX3Rlcm09YW55In0%3D&sig=3Dcdc143e3111ec7d76b544f9fe2845ee53b53edbb7ea4606c=
be865ebb4a80805a>


Contact
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL2NvbnRhY3QuaHRtbD91dG1fc291c=
mNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkz=
Yjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGl=
vbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1jdXN0b21lcnNlcnZpY2UmdX=
RtX3Rlcm09YW55In0%3D&sig=3Dcdc143e3111ec7d76b544f9fe2845ee53b53edbb7ea4606c=
be865ebb4a80805a>
[image: H&M]
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9pbmRleC5odG1sP3V0bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1d=
G1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzY3ZTQxMzcxZGNkOTNiOTU2MjhlNzBPcmRlckNvbmZp=
cm1hdGlvbiZ1dG1fY2FtcGFpZ249b3JkZXJfY29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDB=
YMDA3MjEyJnV0bV9jb250ZW50PWhtX2xvZ28mdXRtX3Rlcm09YW55In0%3D&sig=3D6c4c60f90=
189cf9dfbffb0cdc7b1b8391c46c9711e0fd54621cd706ef6de73e8>

This e-mail is an automated confirmation that your order has been placed. A
placed order is an offer and does not constitute a binding contract until
the order has been approved by us. If we approve your order, we will send
you a shipping confirmation e-mail with all relevant information about your
order.

Please note that you cannot reply to this email. If you have further
questions, you are always welcome to contact us. For more information about
your orders, log in to
<https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?=
to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly=
93d3cyLmhtLmNvbS9lbl9pbi9sb2dpbj91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZ=
Gl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRp=
b24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzI=
xMiZ1dG1fY29udGVudD1sb2dpbiZ1dG1fdGVybT1hbnkifQ%3D%3D&sig=3D64bd0270f6c28d3=
7076f9d4915424b938d60629ca2840da6984ec26727eb8249>

--000000000000639a25063bd7f90e
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

<div><br clear=3D"all"><br clear=3D"all"><div><div dir=3D"ltr" class=3D"gma=
il_signature" data-smartmail=3D"gmail_signature"><div dir=3D"ltr">Regards,<=
div>Anmol</div></div></div></div></div><div><br></div><div><br><div class=
=3D"gmail_quote gmail_quote_container"><div dir=3D"ltr" class=3D"gmail_attr=
">---------- Forwarded message ---------<br>From: <strong class=3D"gmail_se=
ndername" dir=3D"auto">H&amp;M</strong> <span dir=3D"auto">&lt;<a href=3D"m=
ailto:In@delivery.hm.com">In@delivery.hm.com</a>&gt;</span><br>Date: Sun, 2=
2 Dec 2024 at 15:35<br>Subject: Order Confirmation<br>To:  &lt;<a href=3D"m=
ailto:anmolrai.ar03@gmail.com">anmolrai.ar03@gmail.com</a>&gt;<br></div><br=
><br>
   =20
   =20
   =20
   =20
   =20
   =20
   =20
   =20
   =20
   =20
   =20

   =20
   =20
   =20

   =20
   =20




<div style=3D"background-color:#faf9f8">

   =20
    <div style=3D"display:none;font-size:1px;color:#ffffff;line-height:1px;=
max-height:0px;max-width:0px;opacity:0;overflow:hidden">
Thank you for shopping at H&amp;M    </div>

    <div style=3D"background-color:#faf9f8">
       =20
        <div style=3D"margin:0px auto;max-width:652px">
            <table role=3D"presentation" style=3D"width:100%" cellspacing=
=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:0;=
text-align:center">
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-100" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline=
-block;vertical-align:top;width:100%">
                                <table role=3D"presentation" width=3D"100%"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"vertical-align:top=
;padding-top:40px">
                                                <table role=3D"presentation=
" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                    <tbody>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-bottom:32px;word-break:break-word" al=
ign=3D"center">
                                                                <table role=
=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px" cel=
lspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                    <tbody>
                                                                        <tr=
>
                                                                           =
 <td style=3D"width:64px">
                                                                           =
     <a href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8=
d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJ=
sIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9pbmRleC5odG1sP3V0bV9zb3VyY2U9dHJhbn=
NhY3Rpb25hbCZ1dG1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzY3ZTQxMzcxZGNkOTNiOTU2MjhlN=
zBPcmRlckNvbmZpcm1hdGlvbiZ1dG1fY2FtcGFpZ249b3JkZXJfY29uZmlybWF0aW9uX1BMUE9D=
X3BpX0lORTI3MDBYMDA3MjEyJnV0bV9jb250ZW50PWhtX2xvZ28mdXRtX3Rlcm09YW55In0%3D&=
amp;sig=3D6c4c60f90189cf9dfbffb0cdc7b1b8391c46c9711e0fd54621cd706ef6de73e8"=
 target=3D"_blank">

                                                                           =
         <img alt=3D"H&amp;M" src=3D"https://parcel-cdn.delivery.hm.com/img=
/mail/hm/hmlogo.png" style=3D"border:0;display:block;outline:none;text-deco=
ration:none;height:auto;width:100%;font-size:13px" width=3D"64" height=3D"a=
uto">

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
k:break-word" align=3D"center">
                                                                <div style=
=3D"font-family:&#39;HM Serif Regular&#39;,&#39;Georgia Regular&#39;,serif;=
font-size:28px;line-height:36px;text-align:center;color:#222222">
                                                                    Thank y=
ou for shopping at H&amp;M</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-break=
:break-word" align=3D"left">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;tex=
t-align:center;color:#222222">


<p style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39=
;Corbel Regular&#39;,sans-serif;font-weight:400;color:#222;font-size:13px">=
 We have received your order and will contact you when your parcel is shipp=
ed. Below is the purchase information.</p>


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
                           =20
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
       =20







       =20

       =20
        <div style=3D"margin:0px auto;max-width:652px">
            <table role=3D"presentation" style=3D"width:100%" cellspacing=
=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:20=
px 0;padding-top:0;text-align:center">
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-100" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline=
-block;vertical-align:top;width:100%">
                                <table role=3D"presentation" width=3D"100%"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"vertical-align:top=
;padding-top:0">
                                                <table role=3D"presentation=
" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                    <tbody>

                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:4px;word-brea=
k:break-word" align=3D"left">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Bold&#39;,sans-serif;font-weight:600;font-size:16px;line-height:150%;text-a=
lign:center;color:#222222;font-weight:600">
                                                                    Order d=
etails
                                                                   =20
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
                           =20
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
       =20

       =20
        <div style=3D"margin:0px auto;max-width:652px">
            <table role=3D"presentation" style=3D"width:100%" cellspacing=
=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:0;=
text-align:center">
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-100" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline=
-block;vertical-align:top;width:100%">
                                <table role=3D"presentation" width=3D"100%"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"vertical-align:top=
;padding-top:0">
                                                <table role=3D"presentation=
" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                    <tbody>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:0;padding-top:4px;padding-bottom:4px;word-break:break-w=
ord" align=3D"left">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;tex=
t-align:center;color:#222222">
<table width=3D"100%" border=3D"0" cellspacing=3D"0" cellpadding=3D"0"><tbo=
dy><tr><td align=3D"center"><table width=3D"100%" border=3D"0" cellspacing=
=3D"0" cellpadding=3D"0"><tbody><tr><td align=3D"center" style=3D"border-ra=
dius:3px"><table width=3D"100%" border=3D"0" cellspacing=3D"0" cellpadding=
=3D"0"><tbody><tr style=3D"background-color:#ffffff"><td><table role=3D"pre=
sentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%">=
<tbody><tr><th class=3D"m_-5916511542229301137fl" style=3D"vertical-align:t=
op"><table role=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" border=
=3D"0" width=3D"100%"><tbody><tr><td width=3D"140" style=3D"padding:0;width=
:140px;text-align:left;border-bottom:0;padding-right:10px"><a href=3D"https=
://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=3De=
yJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cy=
LmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI5OTExMDAzLmh0bWw%2FdXRtX3NvdXJjZT10c=
mFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2I5NTYy=
OGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb25fUEx=
QT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In=
0%3D&amp;sig=3D2abbb34af0403d1527c26dc7995b4ecba55b403da7d7f49faa80227649e5=
2d2f" style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&=
#39;Corbel Regular&#39;,sans-serif;font-weight:400;color:#222;font-size:13p=
x" target=3D"_blank"> <table border=3D"0" cellpadding=3D"0" cellspacing=3D"=
0" role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0=
px"><tbody><tr><td width=3D"140" style=3D"width:140px;text-align:left" alig=
n=3D"left"><img height=3D"auto" src=3D"https://assets.hm.com/articles/12299=
11003?assetType=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;auth=3D01=
FCB54B07" style=3D"border:0;display:block;outline:none;text-decoration:none=
;height:auto;width:100%;text-align:left;padding:0;margin:0" width=3D"140"><=
/td></tr></tbody></table></a></td><td align=3D"left" style=3D"padding:10px =
20px 10px 10px;border-bottom:0;vertical-align:middle;font-family:&#39;HM Sa=
ns&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;fo=
nt-weight:400" class=3D"m_-5916511542229301137fl m_-5916511542229301137pr10=
"><span style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;=
,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;color:#222;font-size:1=
3px"> <a href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e=
8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidX=
JsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI5OTExMDAzLmh0b=
Ww%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3Nj=
dlNDEzNzFkY2Q5M2I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlc=
l9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1h=
Z2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D2abbb34af0403d1527c26dc7995b4ecba55b40=
3da7d7f49faa80227649e52d2f" style=3D"font-family:&#39;HM Sans&#39;,&#39;Ave=
nir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;co=
lor:#222;font-size:13px" target=3D"_blank"><font style=3D"color:#222222;tex=
t-decoration:none;font-size:13px;font-family:&#39;HM Sans&#39;,&#39;Avenir =
Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;text-d=
ecoration:none">Fine-knit turtleneck jumper</font><br><font style=3D"color:=
#222222;text-decoration:none;font-size:13px"><font style=3D"font-weight:600=
">=E2=82=B9</font> 599.00</font><br><br style=3D"line-height:10px"><table c=
ellpadding=3D"0" cellspacing=3D"0" border=3D"0"><tbody><tr><td width=3D"100=
" style=3D"width:100px"><font style=3D"color:#707070;text-decoration:none;f=
ont-size:13px;font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#=
39;Corbel Regular&#39;,sans-serif;font-weight:400">Art. No.</font></td><td>=
<font style=3D"color:#222222;text-decoration:none;font-size:13px;font-famil=
y:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,s=
ans-serif;font-weight:400">1229911003010</font></td></tr><tr><td><font styl=
e=3D"color:#707070;text-decoration:none;font-size:13px;font-family:&#39;HM =
Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;=
font-weight:400">Color</font></td><td class=3D"m_-5916511542229301137cut-te=
xt"><font style=3D"color:#222222;text-decoration:none;font-size:13px;font-f=
amily:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#3=
9;,sans-serif;font-weight:400">Cream</font></td></tr><tr><td><font style=3D=
"color:#707070;text-decoration:none;font-size:13px;font-family:&#39;HM Sans=
&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font=
-weight:400">Size</font></td><td><font style=3D"color:#222222;text-decorati=
on:none;font-size:13px;font-family:&#39;HM Sans&#39;,&#39;Avenir Next Mediu=
m&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400">S</font></td></=
tr><tr><td><font style=3D"color:#707070;text-decoration:none;font-size:13px=
;font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Reg=
ular&#39;,sans-serif;font-weight:400">Quantity</font></td><td><font style=
=3D"color:#222222;text-decoration:none;font-size:13px;font-family:&#39;HM S=
ans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;f=
ont-weight:400">1</font></td></tr></tbody></table><p style=3D"color:#222222=
;text-decoration:none;text-align:right;padding:0;margin:0;font-size:13px;fo=
nt-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regula=
r&#39;,sans-serif;font-weight:400" class=3D"m_-5916511542229301137lom">Tota=
l =C2=A0=C2=A0=C2=A0<font style=3D"font-weight:600">=E2=82=B9</font> 599.00=
</p></a><p style=3D"text-align:left;padding:0;margin:0;font-size:13px"><a h=
ref=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/fo=
rward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0=
cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjI5OTExMDAzLmh0bWw%2FdXRtX=
3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFk=
Y2Q5M2I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJ=
tYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3=
Rlcm09YW55In0%3D&amp;sig=3D2abbb34af0403d1527c26dc7995b4ecba55b403da7d7f49f=
aa80227649e52d2f" style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next M=
edium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;color:#222;f=
ont-size:13px" target=3D"_blank"></a><a href=3D"https://parcel-api.delivery=
.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U=
0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm=
9kdWN0cGFnZS4xMjI5OTExMDAzLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9=
tZWRpdW09ZW1haWwmdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMj=
cwMFgwMDcyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY=
28tc3dnIn0%3D&amp;sig=3D7a6d0eb80da5872e96eccd9d396a4515a24f43ba817c3913644=
50c98ea637267" target=3D"_blank"><font style=3D"color:#222222;font-size:13p=
x;font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Re=
gular&#39;,sans-serif;font-weight:400"><b><u>Complete the look</u></b></fon=
t></a></p></span></td></tr></tbody></table></th></tr></tbody></table></td><=
/tr><tr><td><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=
=3D"100%"><tbody><tr><td height=3D"15"><div></div></td></tr></tbody></table=
></td></tr><tr style=3D"background-color:#ffffff"><td><table role=3D"presen=
tation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tb=
ody><tr><th class=3D"m_-5916511542229301137fl" style=3D"vertical-align:top"=
><table role=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" border=3D=
"0" width=3D"100%"><tbody><tr><td width=3D"140" style=3D"padding:0;width:14=
0px;text-align:left;border-bottom:0;padding-right:10px"><a href=3D"https://=
parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=3DeyJl=
bWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmh=
tLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMTUzMTUzMDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFu=
c2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2I5NTYyOGU=
3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb25fUExQT0=
NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3=
D&amp;sig=3D18663ae83ffd46071cc468fe7c6b387898b4b47879149db47e53b83210f486d=
c" style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39=
;Corbel Regular&#39;,sans-serif;font-weight:400;color:#222;font-size:13px" =
target=3D"_blank"> <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px"=
><tbody><tr><td width=3D"140" style=3D"width:140px;text-align:left" align=
=3D"left"><img height=3D"auto" src=3D"https://assets.hm.com/articles/115315=
3002?assetType=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;auth=3D70C=
11C9C22" style=3D"border:0;display:block;outline:none;text-decoration:none;=
height:auto;width:100%;text-align:left;padding:0;margin:0" width=3D"140"></=
td></tr></tbody></table></a></td><td align=3D"left" style=3D"padding:10px 2=
0px 10px 10px;border-bottom:0;vertical-align:middle;font-family:&#39;HM San=
s&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;fon=
t-weight:400" class=3D"m_-5916511542229301137fl m_-5916511542229301137pr10"=
><span style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,=
&#39;Corbel Regular&#39;,sans-serif;font-weight:400;color:#222;font-size:13=
px"> <a href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8=
d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJ=
sIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMTUzMTUzMDAyLmh0bW=
w%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3Njd=
lNDEzNzFkY2Q5M2I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl=
9jb25maXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ=
2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3D18663ae83ffd46071cc468fe7c6b387898b4b47=
879149db47e53b83210f486dc" style=3D"font-family:&#39;HM Sans&#39;,&#39;Aven=
ir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;col=
or:#222;font-size:13px" target=3D"_blank"><font style=3D"color:#222222;text=
-decoration:none;font-size:13px;font-family:&#39;HM Sans&#39;,&#39;Avenir N=
ext Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;text-de=
coration:none">Collared cropped top</font><br><font style=3D"color:#222222;=
text-decoration:none;font-size:13px"><font style=3D"font-weight:600">=E2=82=
=B9</font> 279.00</font><br><br style=3D"line-height:10px"><table cellpaddi=
ng=3D"0" cellspacing=3D"0" border=3D"0"><tbody><tr><td width=3D"100" style=
=3D"width:100px"><font style=3D"color:#707070;text-decoration:none;font-siz=
e:13px;font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corb=
el Regular&#39;,sans-serif;font-weight:400">Art. No.</font></td><td><font s=
tyle=3D"color:#222222;text-decoration:none;font-size:13px;font-family:&#39;=
HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-ser=
if;font-weight:400">1153153002010</font></td></tr><tr><td><font style=3D"co=
lor:#707070;text-decoration:none;font-size:13px;font-family:&#39;HM Sans&#3=
9;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-we=
ight:400">Color</font></td><td class=3D"m_-5916511542229301137cut-text"><fo=
nt style=3D"color:#222222;text-decoration:none;font-size:13px;font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:400">Black</font></td></tr><tr><td><font style=3D"color:=
#707070;text-decoration:none;font-size:13px;font-family:&#39;HM Sans&#39;,&=
#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight=
:400">Size</font></td><td><font style=3D"color:#222222;text-decoration:none=
;font-size:13px;font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,=
&#39;Corbel Regular&#39;,sans-serif;font-weight:400">S</font></td></tr><tr>=
<td><font style=3D"color:#707070;text-decoration:none;font-size:13px;font-f=
amily:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#3=
9;,sans-serif;font-weight:400">Quantity</font></td><td><font style=3D"color=
:#222222;text-decoration:none;font-size:13px;font-family:&#39;HM Sans&#39;,=
&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weigh=
t:400">1</font></td></tr></tbody></table><p style=3D"color:#222222;text-dec=
oration:none;text-align:right;padding:0;margin:0;font-size:13px;font-family=
:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sa=
ns-serif;font-weight:400" class=3D"m_-5916511542229301137lom">Total =C2=A0=
=C2=A0=C2=A0<font style=3D"font-weight:600">=E2=82=B9</font> 279.00</p></a>=
<p style=3D"text-align:left;padding:0;margin:0;font-size:13px"><a href=3D"h=
ttps://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=
=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93=
d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMTUzMTUzMDAyLmh0bWw%2FdXRtX3NvdXJjZ=
T10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2I5=
NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb25=
fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW=
55In0%3D&amp;sig=3D18663ae83ffd46071cc468fe7c6b387898b4b47879149db47e53b832=
10f486dc" style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#3=
9;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;color:#222;font-size=
:13px" target=3D"_blank"></a><a href=3D"https://parcel-api.delivery.hm.com/=
click/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzc=
xY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cG=
FnZS4xMTUzMTUzMDAyLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW0=
9ZW1haWwmdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMD=
cyMTImdXRtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnI=
n0%3D&amp;sig=3D42ac89ac7ab4195f7c72adfb0f73c8d0045e6efbfb83f2d031c882931d7=
daa7d" target=3D"_blank"><font style=3D"color:#222222;font-size:13px;font-f=
amily:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#3=
9;,sans-serif;font-weight:400"><b><u>Complete the look</u></b></font></a></=
p></span></td></tr></tbody></table></th></tr></tbody></table></td></tr><tr>=
<td><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%">=
<tbody><tr><td height=3D"15"><div></div></td></tr></tbody></table></td></tr=
><tr style=3D"background-color:#ffffff"><td><table role=3D"presentation" ce=
llpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><tr><t=
h class=3D"m_-5916511542229301137fl" style=3D"vertical-align:top"><table ro=
le=3D"presentation" cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=
=3D"100%"><tbody><tr><td width=3D"140" style=3D"padding:0;width:140px;text-=
align:left;border-bottom:0;padding-right:10px"><a href=3D"https://parcel-ap=
i.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkI=
joiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9l=
bl9pbi9wcm9kdWN0cGFnZS4xMjMzMjU2MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvb=
mFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2I5NTYyOGU3ME9yZGVy=
Q29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb25fUExQT0NfcGlfSU5=
FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=
=3D12a29f9b73aca258dd3a43edf79d90b49b3af10ddbb99223ace21cc5c9eb2e96" style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;color:#222;font-size:13px" target=
=3D"_blank"> <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=
=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px"><tb=
ody><tr><td width=3D"140" style=3D"width:140px;text-align:left" align=3D"le=
ft"><img height=3D"auto" src=3D"https://assets.hm.com/articles/1233256001?a=
ssetType=3DDESCRIPTIVESTILLLIFE&amp;rendition=3Dmedium&amp;auth=3D09E59DC88=
D" style=3D"border:0;display:block;outline:none;text-decoration:none;height=
:auto;width:100%;text-align:left;padding:0;margin:0" width=3D"140"></td></t=
r></tbody></table></a></td><td align=3D"left" style=3D"padding:10px 20px 10=
px 10px;border-bottom:0;vertical-align:middle;font-family:&#39;HM Sans&#39;=
,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weig=
ht:400" class=3D"m_-5916511542229301137fl m_-5916511542229301137pr10"><span=
 style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;C=
orbel Regular&#39;,sans-serif;font-weight:400;color:#222;font-size:13px"> <=
a href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610=
/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoia=
HR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjMzMjU2MDAxLmh0bWw%2FdX=
RtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzN=
zFkY2Q5M2I5NTYyOGU3ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25m=
aXJtYXRpb25fUExQT0NfcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXR=
tX3Rlcm09YW55In0%3D&amp;sig=3D12a29f9b73aca258dd3a43edf79d90b49b3af10ddbb99=
223ace21cc5c9eb2e96" style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Nex=
t Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;color:#22=
2;font-size:13px" target=3D"_blank"><font style=3D"color:#222222;text-decor=
ation:none;font-size:13px;font-family:&#39;HM Sans&#39;,&#39;Avenir Next Me=
dium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;text-decorati=
on:none">Ribbed polo shirt</font><br><font style=3D"color:#222222;text-deco=
ration:none;font-size:13px"><font style=3D"font-weight:600">=E2=82=B9</font=
> 319.00</font><br><br style=3D"line-height:10px"><table cellpadding=3D"0" =
cellspacing=3D"0" border=3D"0"><tbody><tr><td width=3D"100" style=3D"width:=
100px"><font style=3D"color:#707070;text-decoration:none;font-size:13px;fon=
t-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular=
&#39;,sans-serif;font-weight:400">Art. No.</font></td><td><font style=3D"co=
lor:#222222;text-decoration:none;font-size:13px;font-family:&#39;HM Sans&#3=
9;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-we=
ight:400">1233256001010</font></td></tr><tr><td><font style=3D"color:#70707=
0;text-decoration:none;font-size:13px;font-family:&#39;HM Sans&#39;,&#39;Av=
enir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400">=
Color</font></td><td class=3D"m_-5916511542229301137cut-text"><font style=
=3D"color:#222222;text-decoration:none;font-size:13px;font-family:&#39;HM S=
ans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;f=
ont-weight:400">White</font></td></tr><tr><td><font style=3D"color:#707070;=
text-decoration:none;font-size:13px;font-family:&#39;HM Sans&#39;,&#39;Aven=
ir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400">Si=
ze</font></td><td><font style=3D"color:#222222;text-decoration:none;font-si=
ze:13px;font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Cor=
bel Regular&#39;,sans-serif;font-weight:400">S</font></td></tr><tr><td><fon=
t style=3D"color:#707070;text-decoration:none;font-size:13px;font-family:&#=
39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-=
serif;font-weight:400">Quantity</font></td><td><font style=3D"color:#222222=
;text-decoration:none;font-size:13px;font-family:&#39;HM Sans&#39;,&#39;Ave=
nir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400">1=
</font></td></tr></tbody></table><p style=3D"color:#222222;text-decoration:=
none;text-align:right;padding:0;margin:0;font-size:13px;font-family:&#39;HM=
 Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif=
;font-weight:400" class=3D"m_-5916511542229301137lom">Total =C2=A0=C2=A0=C2=
=A0<font style=3D"font-weight:600">=E2=82=B9</font> 319.00</p></a><p style=
=3D"text-align:left;padding:0;margin:0;font-size:13px"><a href=3D"https://p=
arcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=3DeyJlb=
WFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmht=
LmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMjMzMjU2MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc=
2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWwmdXRtX2lkPTY3NjdlNDEzNzFkY2Q5M2I5NTYyOGU3=
ME9yZGVyQ29uZmlybWF0aW9uJnV0bV9jYW1wYWlnbj1vcmRlcl9jb25maXJtYXRpb25fUExQT0N=
fcGlfSU5FMjcwMFgwMDcyMTImdXRtX2NvbnRlbnQ9cGRfaW1hZ2UmdXRtX3Rlcm09YW55In0%3D=
&amp;sig=3D12a29f9b73aca258dd3a43edf79d90b49b3af10ddbb99223ace21cc5c9eb2e96=
" style=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;=
Corbel Regular&#39;,sans-serif;font-weight:400;color:#222;font-size:13px" t=
arget=3D"_blank"></a><a href=3D"https://parcel-api.delivery.hm.com/click/67=
67e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U=
4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9wcm9kdWN0cGFnZS4xMj=
MzMjU2MDAxLmh0bWw%2FdXRtX3NvdXJjZT10cmFuc2FjdGlvbmFsJnV0bV9tZWRpdW09ZW1haWw=
mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9FMjcwMFgwMDcyMTImdX=
RtX2NvbnRlbnQ9c3R5bGV3aXRoJnV0bV90ZXJtPWFueSNwcm9kdWN0LXJlY28tc3dnIn0%3D&am=
p;sig=3D2ce46d57d6e9e87cee3e2a1125ee590f33b0a6b086a7905664a10793683a6362" t=
arget=3D"_blank"><font style=3D"color:#222222;font-size:13px;font-family:&#=
39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-=
serif;font-weight:400"><b><u>Complete the look</u></b></font></a></p></span=
></td></tr></tbody></table></th></tr></tbody></table></td></tr><tr><td><tab=
le cellpadding=3D"0" cellspacing=3D"0" border=3D"0" width=3D"100%"><tbody><=
tr><td height=3D"15"><div></div></td></tr></tbody></table></td></tr></tbody=
></table></td></tr></tbody></table></td></tr></tbody></table>              =
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
                           =20
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
       =20





       =20

       =20
        <div style=3D"margin:0px auto;max-width:652px">
            <table role=3D"presentation" style=3D"width:100%" cellspacing=
=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:20=
px 0;padding-top:0;text-align:center">
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-100" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline=
-block;vertical-align:top;width:100%">
                                <table role=3D"presentation" width=3D"100%"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"vertical-align:top=
;padding-top:25px">
                                                <table role=3D"presentation=
" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                    <tbody>

                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-break=
:break-word" align=3D"left">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Bold&#39;,sans-serif;font-weight:600;font-size:16px;line-height:150%;text-a=
lign:center;color:#222222;font-weight:600">
                                                                    Order s=
ummary
                                                                   =20
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
                           =20
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
       =20






       =20
        <div style=3D"background:#ffffff;background-color:#ffffff;margin:0p=
x auto;max-width:652px">
            <table role=3D"presentation" style=3D"background:#ffffff;backgr=
ound-color:#ffffff;width:100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:20=
px 0;padding-top:0;text-align:center">
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-100" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline=
-block;vertical-align:top;width:100%">
                                <table role=3D"presentation" width=3D"100%"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"vertical-align:top=
;padding-top:20px;padding-bottom:20px">
                                                <table role=3D"presentation=
" width=3D"450" cellspacing=3D"0" cellpadding=3D"0" border=3D"0" align=3D"c=
enter" class=3D"m_-5916511542229301137mj-full-width-mobile">
                                                    <tbody>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:16px;padding-bottom:0;word-break:=
break-word;width:200px" align=3D"left">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;tex=
t-align:left;color:#707070">
                                                                    Order v=
alue</div>
                                                            </td>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:16px;padding-bottom:0;word-break:=
break-word;width:200px" align=3D"right">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;tex=
t-align:right;color:#222222">
<font style=3D"font-weight:600">=E2=82=B9</font> 1,197.00                  =
                                              </div>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:0;word-break:=
break-word;width:200px" align=3D"left">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;tex=
t-align:left;color:#707070">
                                                                    Shippin=
g &amp; handling</div>
                                                            </td>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:0;word-break:=
break-word;width:200px" align=3D"right">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;tex=
t-align:right;color:#222222">
                                                                    Free
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:26px;padding-bottom:0;word-break:=
break-word;width:200px" align=3D"left">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Bold&#39;,sans-serif;font-weight:600;font-size:16px;line-height:20px;text-a=
lign:left;color:#222222;font-weight:600">
                                                                    Total</=
div>
                                                            </td>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:26px;padding-bottom:0;word-break:=
break-word;width:200px" align=3D"right">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Bold&#39;,sans-serif;font-weight:600;font-size:16px;line-height:20px;text-a=
lign:right;color:#222222;font-weight:600">
<font style=3D"font-weight:600">=E2=82=B9</font> 1,197.00                  =
                                              </div>
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style=3D"vertical-align:top=
">
                                                <table role=3D"presentation=
" width=3D"450" cellspacing=3D"0" cellpadding=3D"0" border=3D"0" align=3D"c=
enter" class=3D"m_-5916511542229301137mj-full-width-mobile">
                                                    <tbody>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:0 25px;padding-bottom:0;word-break:break-word;width:200=
px" align=3D"left">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;font-size:11px;line-height:20px;tex=
t-align:left;color:#707070">
                                                                    Your me=
mbership points have been updated
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
                           =20
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
       =20



        <br><br>




       =20
        <div style=3D"background:#ffffff;background-color:#ffffff;margin:0p=
x auto;max-width:652px">
            <table role=3D"presentation" style=3D"background:#ffffff;backgr=
ound-color:#ffffff;width:100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"border-bottom:12px solid #fff;directio=
n:ltr;font-size:0px;padding:20px 0;padding-left:30px;padding-right:30px;tex=
t-align:center">
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-35" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-=
block;vertical-align:top;width:100%">
                                <table role=3D"presentation" style=3D"verti=
cal-align:top" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D=
"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word" alig=
n=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:600;font-size:13px;line-height:20px;text-align:left;colo=
r:#222222;font-weight:600">
                                                    Order number
                                                </div>
                                        </td></tr>
                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:4px;padding-bottom:4px;word-break:break-word" ali=
gn=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:600;font-size:16px;line-height:20px;text-align:left;colo=
r:#222222;font-weight:600">
                                                    <a style=3D"text-decora=
tion:underline!important;color:#222222" href=3D"https://parcel-api.delivery=
.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U=
0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly9obS5kZWxpdmVyeS1zdGF0dXMuY2=
9tL2luL2VuLz9vcmRlck5vPTM5NDUzMDUwMDEyJiZ1dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmd=
XRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25m=
aXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzA=
wWDAwNzIxMiZ1dG1fY29udGVudD10cmFja250cmFjZSZzaG93X2FydGljbGVMaXN0PXllcyZzZW=
xlY3RlZFRyYWNraW5nTm89JnM9eG95cUFUTWxKRyZveG1fZW09cGFyY2VsTGFiIn0%3D&amp;si=
g=3Dfcfd58b7c097e99212099e40405f2b55dae3da93c269c94ce5c30209d5338871" targe=
t=3D"_blank"><u>39453050012</u></a>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word" alig=
n=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:600;font-size:13px;line-height:20px;text-align:left;colo=
r:#222222;font-weight:600">
                                                    Order date</div>
                                            </td>
                                        </tr>
                                        <tr>

                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:4px;padding-bottom:4px;word-break:break-word" ali=
gn=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:600;font-size:16px;line-height:20px;text-align:left;colo=
r:#222222;word-break:break-word;font-weight:600">
                                                    12/22/2024</div>
                                            </td>
                                        </tr>


                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word" alig=
n=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:600;font-size:13px;line-height:20px;text-align:left;colo=
r:#222222;font-weight:600">
                                                    Delivery Method
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:4px;padding-bottom:4px;word-break:break-word" ali=
gn=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:400;font-size:13px;line-height:20px;text-align:left;colo=
r:#222222;word-break:break-word">
Standard delivery                                                    <br>2-=
7 days
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word" alig=
n=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:600;font-size:13px;line-height:20px;text-align:left;colo=
r:#222222;font-weight:600">
                                                    Mode of Payment </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:4px;padding-bottom:4px;word-break:break-word" ali=
gn=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:400;font-size:13px;line-height:20px;text-align:left;colo=
r:#222222;word-break:break-word">
Card                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>
                           =20

                            <div class=3D"m_-5916511542229301137mj-column-p=
er-65" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-=
block;vertical-align:top;width:100%">
                                <table role=3D"presentation" style=3D"verti=
cal-align:top" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D=
"0">
                                    <tbody>

                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:16px;padding-bottom:0;word-break:b=
reak-word">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:600;font-size:13px;line-height:20px;text-align:left;colo=
r:#222222;font-weight:600">
                                                    Delivery Address
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:4px;word-break:=
break-word">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-size:13px;line-height:20px;text-align:left;color:#222222;word-b=
reak:break-word">
Anmol Rai<br>720<br>9th Cross<br>10th Main<br>Indiranagar<br>Near Velo Stud=
io<br>560038<br>Bangalore Karnataka<br>India                               =
                 </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                           =20
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
       =20

        <br>

       =20
       =20
        <div style=3D"background:#ffffff;background-color:#ffffff;margin:0p=
x auto;max-width:652px">
            <table role=3D"presentation" style=3D"background:#ffffff;backgr=
ound-color:#ffffff;width:100%" cellspacing=3D"0" cellpadding=3D"0" border=
=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"border-bottom:12px solid #fff;directio=
n:ltr;font-size:0px;padding:20px 0;padding-left:30px;padding-right:30px;tex=
t-align:center">
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-35" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-=
block;vertical-align:top;width:100%">
                                <table role=3D"presentation" style=3D"verti=
cal-align:top" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D=
"0">
                                    <tbody>
                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:16px;padding-bottom:0;word-break:break-word" alig=
n=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Bold&#39;,sans-se=
rif;font-weight:600;font-size:13px;line-height:20px;text-align:left;color:#=
222222;font-weight:600">
                                                    YOUR DETAILS</div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style=3D"font-size:0px;padd=
ing:10px 25px;padding-top:4px;padding-bottom:4px;word-break:break-word" ali=
gn=3D"left">
                                                <div style=3D"font-family:&=
#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans=
-serif;font-weight:400;font-size:13px;line-height:20px;text-align:left;colo=
r:#222222;word-break:keep-all">
                                                    Anmol Rai<br>
                                                    a=E2=80=8Cnmo=E2=80=8Cl=
ra=E2=80=8Ci.a=E2=80=8Cr03=E2=80=8C@gm=E2=80=8Cail=E2=80=8C.co=E2=80=8Cm<br=
>
+91=E2=80=8C983=E2=80=8C868=E2=80=8C287=E2=80=8C1                          =
                      </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-65" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline-=
block;vertical-align:top;width:100%">
                                =C2=A0
                               =20
                            </div>
                           =20
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
       =20







   =20
   =20
    <div style=3D"background:#f1ebdf;margin:0px auto;max-width:652px;paddin=
g-top:20px">
        <div style=3D"line-height:0;font-size:0">
            <table align=3D"center" border=3D"0" cellpadding=3D"0" cellspac=
ing=3D"0" role=3D"presentation" style=3D"background:#f1ebdf;width:100%">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:20=
px 0;padding-bottom:40px;padding-top:40px;text-align:center">


                            <div class=3D"m_-5916511542229301137mj-column-p=
er-100" style=3D"font-size:0px;text-align:left;direction:ltr;display:inline=
-block;vertical-align:top;width:100%">
                                <table border=3D"0" cellpadding=3D"0" cells=
pacing=3D"0" role=3D"presentation" style=3D"background-color:#f1ebdf;vertic=
al-align:top" width=3D"100%">
                                    <tbody>
                                        <tr>
                                            <td align=3D"center" style=3D"f=
ont-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:10px;word-br=
eak:break-word">
                                                <div style=3D"font-family:&=
#39;HM Sans Semi Bold&#39;,Helvetica,sans-serif;font-size:30px;line-height:=
36px;text-align:center;color:#e60a18">
                                                    Hello Member! Have you =
checked our new arrivals yet?</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"left" style=3D"fon=
t-size:0px;padding:10px 25px;padding-top:10px;padding-right:40px;padding-bo=
ttom:14px;padding-left:40px;word-break:break-word">
                                                <div style=3D"font-family:&=
#39;HM Serif Regular&#39;,&#39;Georgia Regular&#39;,serif;font-size:17px;li=
ne-height:22px;text-align:center;color:#000000">
                                                    Don&#39;t keep waiting =
the latest trends just dropped in!</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align=3D"center" style=3D"f=
ont-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word">
                                                <table border=3D"0" cellpad=
ding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"border-collapse=
:separate;width:240px;line-height:100%">
                                                    <tbody>
                                                        <tr>
                                                            <td align=3D"ce=
nter" bgcolor=3D"#fff" role=3D"presentation" style=3D"border:1px solid #000=
000;border-radius:0;background:#f1ebdf" valign=3D"middle"> <a href=3D"https=
://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=3De=
yJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cy=
LmhtLmNvbS9lbl9pbi9pbmRleC5odG1sP3V0bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1dG1fbWV=
kaXVtPWVtYWlsJnV0bV9pZD02NzY3ZTQxMzcxZGNkOTNiOTU2MjhlNzBPcmRlckNvbmZpcm1hdG=
lvbiZ1dG1fY2FtcGFpZ249b3JkZXJfY29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDBYMDA3M=
jEyJnV0bV9jb250ZW50PW1lbWJlciZ1dG1fdGVybT1hbnkifQ%3D%3D&amp;sig=3D6b4bb8b0a=
6c67a1e5c564ebcaa141ede5787def66a4d90a5fedb49193b640b5e" style=3D"display:i=
nline-block;width:88px;background:#f1ebdf;color:#000000;font-family:&#39;HM=
 Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sans-serif=
;font-weight:400;font-size:13px;font-weight:600;line-height:20px;margin:0;t=
ext-decoration:none;text-transform:none;padding:10px 10px;border-radius:0" =
target=3D"_blank">
                                                                    Shop No=
w
                                                                </a>
                                                            </td>
                                                            <td style=3D"pa=
dding-right:10px;padding-left:10px">
                                                            </td>
                                                            <td align=3D"ce=
nter" bgcolor=3D"#fff" role=3D"presentation" style=3D"border:1px solid #000=
000;border-radius:0;background:#f1ebdf" valign=3D"middle"> <a href=3D"https=
://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/forward?to=3De=
yJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cy=
LmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3Nob3BwaW5nLWF0LWhtL3N0b3JlLWxvY2F=
0b3IuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faW=
Q9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduP=
W9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1t=
ZW1iZXImdXRtX3Rlcm09YW55In0%3D&amp;sig=3Dcd8350983de96875b548ff7ce332e993e0=
a6eb0355fdfe8c8b005971714565e3" style=3D"display:inline-block;width:100px;b=
ackground:#f1ebdf;color:#000000;font-family:&#39;HM Sans&#39;,&#39;Avenir N=
ext Medium&#39;,&#39;Corbel Regular&#39;,sans-serif;font-weight:400;font-si=
ze:13px;font-weight:600;line-height:20px;margin:0;text-decoration:none;text=
-transform:none;padding:10px 10px;border-radius:0" target=3D"_blank">
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
                           =20
                           =20
                           =20
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
   =20

   =20


   =20
   =20


   =20




       =20
        <div style=3D"margin:0px auto;max-width:652px">
            <table role=3D"presentation" style=3D"width:100%" cellspacing=
=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                <tbody>
                    <tr>
                        <td style=3D"direction:ltr;font-size:0px;padding:30=
px 0;text-align:center">
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-50" style=3D"font-size:0;line-height:0;text-align:left;display:inline-bl=
ock;width:100%;direction:ltr">
                               =20
                                <div class=3D"m_-5916511542229301137mj-colu=
mn-per-50" style=3D"font-size:0px;text-align:left;direction:ltr;display:inl=
ine-block;vertical-align:top;width:50%">
                                    <table role=3D"presentation" width=3D"1=
00%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                        <tbody>
                                            <tr>
                                                <td style=3D"vertical-align=
:top;padding-top:20px;padding-right:10px;padding-left:10px">
                                                    <table role=3D"presenta=
tion" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:27px;wor=
d-break:break-word" align=3D"center">
                                                                    <table =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                        <tb=
ody>
                                                                           =
 <tr>
                                                                           =
     <td style=3D"width:24px">
                                                                           =
         <a href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cb=
e3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiw=
idXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3NoaXBwaW=
5nYW5kZGVsaXZlcnkuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lb=
WFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRt=
X2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1=
fY29udGVudD1zaGlwcGluZ2FuZGRlbGl2ZXJ5JnV0bV90ZXJtPWFueSJ9&amp;sig=3D5691dc6=
e2b6165c8004b7b7178608cf172d3d2689ff22a5771265bf1388b708d" target=3D"_blank=
">
                                                                           =
             <img src=3D"https://parcel-cdn.delivery.hm.com/img/mail/hm/del=
ivery_3x.png" style=3D"border:0;display:block;outline:none;text-decoration:=
none;height:auto;width:100%;font-size:13px" width=3D"24" height=3D"auto">
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
ding-bottom:30px;word-break:break-word" align=3D"center">
                                                                    <div st=
yle=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corb=
el Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;=
text-align:center;color:#222222">
                                                                        <a =
href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/f=
orward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR=
0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3NoaXBwaW5nYW5kZGVsaX=
ZlcnkuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1fa=
WQ9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWdu=
PW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1=
zaGlwcGluZ2FuZGRlbGl2ZXJ5JnV0bV90ZXJtPWFueSJ9&amp;sig=3D5691dc6e2b6165c8004=
b7b7178608cf172d3d2689ff22a5771265bf1388b708d" style=3D"text-decoration:non=
e;color:#222;text-transform:capitalize" target=3D"_blank">
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
                               =20
                                <div class=3D"m_-5916511542229301137mj-colu=
mn-per-50" style=3D"font-size:0px;text-align:left;direction:ltr;display:inl=
ine-block;vertical-align:top;width:50%">
                                    <table role=3D"presentation" width=3D"1=
00%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                        <tbody>
                                            <tr>
                                                <td style=3D"vertical-align=
:top;padding-top:20px;padding-right:10px;padding-left:10px">
                                                    <table role=3D"presenta=
tion" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:30px;wor=
d-break:break-word" align=3D"center">
                                                                    <table =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                        <tb=
ody>
                                                                           =
 <tr>
                                                                           =
     <td style=3D"width:24px"> <a href=3D"https://parcel-api.delivery.hm.co=
m/click/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkN=
zcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21l=
ci1zZXJ2aWNlL3BheW1lbnRzLWluZm8uaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXR=
tX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maX=
JtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwW=
DAwNzIxMiZ1dG1fY29udGVudD1wYXltZW50cyZ1dG1fdGVybT1hbnkifQ%3D%3D&amp;sig=3Dd=
e00e38a856b628bef034b7bd3d297300560e5cd1728fc4a9ba3a6983cce7439" target=3D"=
_blank">

                                                                           =
             <img src=3D"https://parcel-cdn.delivery.hm.com/img/mail/hm/pay=
ment_3x.png" style=3D"border:0;display:block;outline:none;text-decoration:n=
one;height:auto;width:100%;font-size:13px" width=3D"24" height=3D"auto">

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
ding-bottom:30px;word-break:break-word" align=3D"center">
                                                                    <div st=
yle=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corb=
el Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;=
text-align:center;color:#222222">
                                                                        <a =
href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/f=
orward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR=
0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3BheW1lbnRzLWluZm8uaH=
RtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N=
2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVy=
X2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1wYXltZW5=
0cyZ1dG1fdGVybT1hbnkifQ%3D%3D&amp;sig=3Dde00e38a856b628bef034b7bd3d29730056=
0e5cd1728fc4a9ba3a6983cce7439" style=3D"text-decoration:none;color:#222;tex=
t-transform:capitalize" target=3D"_blank">
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
                               =20
                            </div>
                           =20
                            <div class=3D"m_-5916511542229301137mj-column-p=
er-50" style=3D"font-size:0;line-height:0;text-align:left;display:inline-bl=
ock;width:100%;direction:ltr">
                               =20
                                <div class=3D"m_-5916511542229301137mj-colu=
mn-per-50" style=3D"font-size:0px;text-align:left;direction:ltr;display:inl=
ine-block;vertical-align:top;width:50%">
                                    <table role=3D"presentation" width=3D"1=
00%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                        <tbody>
                                            <tr>
                                                <td style=3D"vertical-align=
:top;padding-top:20px;padding-right:10px;padding-left:10px">
                                                    <table role=3D"presenta=
tion" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:33px;wor=
d-break:break-word" align=3D"center">
                                                                    <table =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                        <tb=
ody>
                                                                           =
 <tr>
                                                                           =
     <td style=3D"width:24px"> <a href=3D"https://parcel-api.delivery.hm.co=
m/click/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkN=
zcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21l=
ci1zZXJ2aWNlL3JldHVybnMuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl=
1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb2=
4mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxM=
iZ1dG1fY29udGVudD1yZXR1cm5zJnV0bV90ZXJtPWFueSJ9&amp;sig=3D83de907ad07e7a4b8=
1b0d6fb894fb57aa6adb0413e87ee8c2c28a989b631a4be" target=3D"_blank">

                                                                           =
             <img src=3D"https://parcel-cdn.delivery.hm.com/img/mail/hm/ret=
urns_3x.png" style=3D"border:0;display:block;outline:none;text-decoration:n=
one;height:auto;width:100%;font-size:13px" width=3D"24" height=3D"auto">

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
ding-bottom:30px;word-break:break-word" align=3D"center">
                                                                    <div st=
yle=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corb=
el Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;=
text-align:center;color:#222222">
                                                                        <a =
href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/f=
orward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR=
0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL3JldHVybnMuaHRtbD91dG=
1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3M=
WRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZp=
cm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1yZXR1cm5zJnV0bV9=
0ZXJtPWFueSJ9&amp;sig=3D83de907ad07e7a4b81b0d6fb894fb57aa6adb0413e87ee8c2c2=
8a989b631a4be" style=3D"text-decoration:none;color:#222;text-transform:capi=
talize" target=3D"_blank">
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
                               =20
                                <div class=3D"m_-5916511542229301137mj-colu=
mn-per-50" style=3D"font-size:0px;text-align:left;direction:ltr;display:inl=
ine-block;vertical-align:top;width:50%">
                                    <table role=3D"presentation" width=3D"1=
00%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                        <tbody>
                                            <tr>
                                                <td style=3D"vertical-align=
:top;padding-top:20px;padding-right:10px;padding-left:10px">
                                                    <table role=3D"presenta=
tion" width=3D"100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                        <tbody>
                                                            <tr>
                                                                <td style=
=3D"background:#ffffff;font-size:0px;padding:10px 25px;padding-top:24px;wor=
d-break:break-word" align=3D"center">
                                                                    <table =
role=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px"=
 cellspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                        <tb=
ody>
                                                                           =
 <tr>
                                                                           =
     <td style=3D"width:24px"> <a href=3D"https://parcel-api.delivery.hm.co=
m/click/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkN=
zcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21l=
ci1zZXJ2aWNlL2NvbnRhY3QuaHRtbD91dG1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl=
1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb2=
4mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxM=
iZ1dG1fY29udGVudD1jdXN0b21lcnNlcnZpY2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Dcdc=
143e3111ec7d76b544f9fe2845ee53b53edbb7ea4606cbe865ebb4a80805a" target=3D"_b=
lank">

                                                                           =
             <img src=3D"https://parcel-cdn.delivery.hm.com/img/mail/hm/cus=
tomerservice_3x.png" style=3D"border:0;display:block;outline:none;text-deco=
ration:none;height:auto;width:100%;font-size:13px" width=3D"24" height=3D"a=
uto">

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
g-bottom:25px;word-break:break-word" align=3D"center">
                                                                    <div st=
yle=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corb=
el Regular&#39;,sans-serif;font-weight:400;font-size:13px;line-height:20px;=
text-align:center;color:#222222">
                                                                        <a =
href=3D"https://parcel-api.delivery.hm.com/click/6767e44cd771cbe3e8d46610/f=
orward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR=
0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9jdXN0b21lci1zZXJ2aWNlL2NvbnRhY3QuaHRtbD91dG=
1fc291cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3M=
WRjZDkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZp=
cm1hdGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1jdXN0b21lcnNlcnZ=
pY2UmdXRtX3Rlcm09YW55In0%3D&amp;sig=3Dcdc143e3111ec7d76b544f9fe2845ee53b53e=
dbb7ea4606cbe865ebb4a80805a" style=3D"text-decoration:none;color:#222;text-=
transform:capitalize" target=3D"_blank">
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
                               =20
                            </div>
                           =20
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>









       =20


       =20


       =20

        <table role=3D"presentation" style=3D"background:#e4e4e4;background=
-color:#e4e4e4;width:100%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0"=
 align=3D"center">
            <tbody>
                <tr>
                    <td>
                       =20
                        <div style=3D"margin:0px auto;max-width:652px">
                            <table role=3D"presentation" style=3D"width:100=
%" cellspacing=3D"0" cellpadding=3D"0" border=3D"0" align=3D"center">
                                <tbody>
                                    <tr>
                                        <td style=3D"direction:ltr;font-siz=
e:0px;padding:20px 0;text-align:center">
                                           =20
                                            <div class=3D"m_-59165115422293=
01137mj-column-per-100" style=3D"font-size:0px;text-align:left;direction:lt=
r;display:inline-block;vertical-align:top;width:100%">
                                                <table role=3D"presentation=
" style=3D"vertical-align:top" width=3D"100%" cellspacing=3D"0" cellpadding=
=3D"0" border=3D"0">
                                                    <tbody>
                                                        <tr>
                                                            <td style=3D"fo=
nt-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word" align=
=3D"center">
                                                                <table role=
=3D"presentation" style=3D"border-collapse:collapse;border-spacing:0px" cel=
lspacing=3D"0" cellpadding=3D"0" border=3D"0">
                                                                    <tbody>
                                                                        <tr=
>
                                                                           =
 <td style=3D"width:230px"> <a href=3D"https://parcel-api.delivery.hm.com/c=
lick/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcx=
Y2JlM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9pbmRleC5odG1=
sP3V0bV9zb3VyY2U9dHJhbnNhY3Rpb25hbCZ1dG1fbWVkaXVtPWVtYWlsJnV0bV9pZD02NzY3ZT=
QxMzcxZGNkOTNiOTU2MjhlNzBPcmRlckNvbmZpcm1hdGlvbiZ1dG1fY2FtcGFpZ249b3JkZXJfY=
29uZmlybWF0aW9uX1BMUE9DX3BpX0lORTI3MDBYMDA3MjEyJnV0bV9jb250ZW50PWhtX2xvZ28m=
dXRtX3Rlcm09YW55In0%3D&amp;sig=3D6c4c60f90189cf9dfbffb0cdc7b1b8391c46c9711e=
0fd54621cd706ef6de73e8" target=3D"_blank">

                                                                           =
         <img alt=3D"H&amp;M" src=3D"https://parcel-cdn.delivery.hm.com/img=
/mail/hm/Logo_Long_2x.png" style=3D"border:0;display:block;outline:none;tex=
t-decoration:none;height:auto;width:100%;font-size:13px" width=3D"230" heig=
ht=3D"auto">

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
ak:break-word" align=3D"center">
                                                                <div style=
=3D"font-family:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel =
Regular&#39;,sans-serif;font-weight:400;font-size:11px;line-height:16px;tex=
t-align:center;color:#707070">

                                                                   =20

                                                                    This e-=
mail is an automated confirmation that your order has been placed. A placed=
 order is an offer and does not constitute a binding contract until the ord=
er has been approved by us. If we approve your order, we will send you a sh=
ipping confirmation e-mail with all relevant information about your order.<=
br><br>Please note that you cannot reply to this email. If you have further=
 questions, you are always welcome to contact us. For more information abou=
t your orders, log in to <a href=3D"https://parcel-api.delivery.hm.com/clic=
k/6767e44cd771cbe3e8d46610/forward?to=3DeyJlbWFpbElkIjoiNjc2N2U0NGNkNzcxY2J=
lM2U4ZDQ2NjEwIiwidXJsIjoiaHR0cHM6Ly93d3cyLmhtLmNvbS9lbl9pbi9sb2dpbj91dG1fc2=
91cmNlPXRyYW5zYWN0aW9uYWwmdXRtX21lZGl1bT1lbWFpbCZ1dG1faWQ9Njc2N2U0MTM3MWRjZ=
DkzYjk1NjI4ZTcwT3JkZXJDb25maXJtYXRpb24mdXRtX2NhbXBhaWduPW9yZGVyX2NvbmZpcm1h=
dGlvbl9QTFBPQ19waV9JTkUyNzAwWDAwNzIxMiZ1dG1fY29udGVudD1sb2dpbiZ1dG1fdGVybT1=
hbnkifQ%3D%3D&amp;sig=3D64bd0270f6c28d37076f9d4915424b938d60629ca2840da6984=
ec26727eb8249" style=3D"color:#000000;text-decoration:underline;font-family=
:&#39;HM Sans&#39;,&#39;Avenir Next Medium&#39;,&#39;Corbel Regular&#39;,sa=
ns-serif;font-weight:400;font-size:11px" class=3D"m_-5916511542229301137und=
erl" target=3D"_blank"></a></div></td></tr></tbody></table></div></td></tr>=
</tbody></table></div></td></tr></tbody></table></div></div></div></div>

--000000000000639a25063bd7f90e--
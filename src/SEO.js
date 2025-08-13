import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = '무료 QR코드 바코드 생성기',
  description = '무료 온라인 QR코드 및 바코드 생성기. URL, 텍스트, WiFi, 명함을 위한 맞춤형 QR코드를 만들어보세요.',
  keywords = 'QR코드 생성기, 바코드 생성기, QR코드 만들기, 무료 QR코드',
  image = '/og-image.png',
  url = 'https://your-domain.com',
  type = 'website',
  lang = 'ko'
}) => {
  const siteTitle = 'QRBarcode Generator';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={lang === 'ko' ? 'ko_KR' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="google" content="notranslate" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};

// SEO data for different pages
export const seoData = {
  home: {
    title: '무료 QR코드 바코드 생성기 - 온라인 QR 코드 메이커',
    description: '무료로 QR코드와 바코드를 생성하세요. 로고 삽입, 색상 변경, 대량 생성 등 다양한 기능 제공. PNG, JPG, SVG, PDF 다운로드 지원.',
    keywords: 'QR코드 생성기, 바코드 생성기, 무료 QR코드, 온라인 QR코드, QR code generator, 큐알코드 만들기'
  },
  qrGenerator: {
    title: 'QR코드 생성기 - 맞춤형 QR코드 만들기',
    description: 'URL, 텍스트, WiFi, 명함, 위치 정보를 QR코드로 변환. 로고 삽입과 색상 커스터마이징 가능.',
    keywords: 'QR코드 생성, QR코드 만들기, 맞춤형 QR코드, QR코드 디자인, WiFi QR코드'
  },
  barcodeGenerator: {
    title: '바코드 생성기 - 다양한 바코드 형식 지원',
    description: 'Code128, Code39, EAN13, UPC 등 다양한 바코드 형식 생성. 무료 온라인 바코드 메이커.',
    keywords: '바코드 생성기, Code128, EAN13, UPC, 바코드 만들기, 상품 바코드'
  },
  wifiQR: {
    title: 'WiFi QR코드 생성기 - WiFi 비밀번호 공유',
    description: 'WiFi 네트워크 정보를 QR코드로 만들어 쉽게 공유하세요. 스캔 한 번으로 WiFi 자동 연결.',
    keywords: 'WiFi QR코드, WiFi 비밀번호 QR, 와이파이 QR코드, WiFi 공유'
  },
  vcardQR: {
    title: '명함 QR코드 생성기 - vCard QR코드',
    description: '연락처 정보를 담은 디지털 명함 QR코드 생성. 스캔으로 연락처 자동 저장.',
    keywords: '명함 QR코드, vCard QR, 디지털 명함, 연락처 QR코드, 비즈니스 카드'
  },
  batch: {
    title: '대량 QR코드 생성 - 일괄 처리',
    description: 'CSV 파일로 여러 개의 QR코드를 한 번에 생성. 대량 QR코드 일괄 다운로드.',
    keywords: '대량 QR코드, 일괄 생성, CSV QR코드, 배치 프로세싱, 다중 QR코드'
  }
};

// Structured Data Component
export const StructuredData = ({ type = 'WebApplication' }) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QRBarcode Generator",
    "url": "https://your-domain.com",
    "description": "무료 온라인 QR코드 및 바코드 생성기",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    }
  };

  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "QR코드 생성 방법",
    "description": "온라인에서 무료로 QR코드를 생성하는 방법",
    "step": [
      {
        "@type": "HowToStep",
        "name": "데이터 타입 선택",
        "text": "URL, 텍스트, WiFi, 명함 등 원하는 데이터 타입을 선택합니다."
      },
      {
        "@type": "HowToStep",
        "name": "정보 입력",
        "text": "선택한 타입에 맞는 정보를 입력합니다."
      },
      {
        "@type": "HowToStep",
        "name": "커스터마이징",
        "text": "색상, 크기, 로고 등을 설정합니다."
      },
      {
        "@type": "HowToStep",
        "name": "다운로드",
        "text": "생성된 QR코드를 원하는 형식으로 다운로드합니다."
      }
    ]
  };

  const data = type === 'HowTo' ? howToData : baseData;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

export default SEO;
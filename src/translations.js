// translations.js - 다국어 번역 데이터
export const translations = {
  ko: {
    // Header
    appTitle: 'QR & Barcode Studio',
    generator: '생성기',
    batchProcess: '일괄 처리',
    history: '히스토리',
    
    // Hero
    heroTitle: 'QR 코드 & 바코드 즉시 생성',
    heroSubtitle: '고급 사용자 정의 옵션을 갖춘 전문 QR 코드 및 바코드',
    
    // Tabs
    qrCode: 'QR 코드',
    barcode: '바코드',
    
    // Settings Panel
    qrSettings: 'QR 코드 설정',
    barcodeSettings: '바코드 설정',
    
    // Data Types
    dataType: '데이터 유형',
    text: '텍스트',
    url: 'URL',
    email: '이메일',
    phone: '전화',
    sms: 'SMS',
    wifi: 'WiFi',
    vcard: '연락처',
    location: '위치',
    
    // Input Labels
    enterYourData: '데이터 입력',
    enterTextHere: '여기에 텍스트를 입력하세요...',
    networkName: '네트워크 이름 (SSID)',
    password: '비밀번호',
    noPassword: '비밀번호 없음',
    fullName: '이름',
    phoneNumber: '전화번호',
    organization: '조직',
    coordinates: '위도,경도 (예: 37.7749,-122.4194)',
    phoneForSMS: 'SMS용 전화번호',
    
    // Settings
    size: '크기',
    errorCorrectionLevel: '오류 수정 레벨',
    margin: '여백',
    colors: '색상',
    foreground: '전경색',
    background: '배경색',
    advancedOptions: '고급 옵션',
    addLogo: '로고 추가',
    clickToUpload: '클릭하여 업로드',
    removeLogo: '로고 제거',
    
    // Barcode Settings
    barcodeFormat: '바코드 형식',
    enterData: '데이터 입력',
    enterBarcodeData: '바코드 데이터를 입력하세요...',
    enter12Digits: '12자리 숫자를 입력하세요',
    barWidth: '바 너비',
    height: '높이',
    showText: '텍스트 표시',
    
    // Preview
    livePreview: '실시간 미리보기',
    generating: '생성 중...',
    enterDataToGenerate: '생성하려면 데이터를 입력하세요',
    
    // Download
    copyImage: '이미지 복사',
    
    // Batch Processing
    batchProcessing: '일괄 처리',
    uploadCSVorTXT: 'CSV 또는 TXT 파일 업로드',
    eachLineConverted: '각 줄이 별도의 코드로 변환됩니다',
    batchItems: '일괄 항목',
    generateAll: '모두 생성',
    downloadAll: '모두 다운로드',
    clear: '지우기',
    
    // History
    generationHistory: '생성 히스토리',
    clearAll: '모두 지우기',
    noHistoryYet: '아직 히스토리가 없습니다',
    
    // Toast Messages
    logoUploaded: '로고가 업로드되었습니다',
    logoRemoved: '로고가 제거되었습니다',
    downloadedAs: '다운로드 완료',
    copiedToClipboard: '클립보드에 복사되었습니다',
    failedToCopy: '복사 실패',
    failedToGenerateQR: 'QR 코드 생성 실패',
    invalidBarcodeFormat: '잘못된 바코드 데이터 형식',
    loadedItems: '개 항목이 일괄 처리를 위해 로드되었습니다',
    processingBatch: '일괄 처리 중...',
    generatedCodes: '개 코드가 성공적으로 생성되었습니다',
    downloadingAll: '모든 생성된 코드를 다운로드 중...',
    loadedFromHistory: '히스토리에서 로드되었습니다',
    historyCleared: '히스토리가 지워졌습니다',
    svgOnlyForQR: 'SVG 형식은 QR 코드에만 사용 가능합니다',
    
    // Footer
    allRightsReserved: '모든 권리 보유',
    phase2Implemented: '2단계 - 고급 기능 구현 완료',
    
    // Error Correction Levels
    errorLevelLow: '낮음 (7%)',
    errorLevelMedium: '중간 (15%)',
    errorLevelQuartile: '사분위수 (25%)',
    errorLevelHigh: '높음 (30%)',
  },
  en: {
    // Header
    appTitle: 'QR & Barcode Studio',
    generator: 'Generator',
    batchProcess: 'Batch Process',
    history: 'History',
    
    // Hero
    heroTitle: 'Generate QR Codes & Barcodes Instantly',
    heroSubtitle: 'Professional QR codes and barcodes with advanced customization options',
    
    // Tabs
    qrCode: 'QR Code',
    barcode: 'Barcode',
    
    // Settings Panel
    qrSettings: 'QR Code Settings',
    barcodeSettings: 'Barcode Settings',
    
    // Data Types
    dataType: 'Data Type',
    text: 'Text',
    url: 'URL',
    email: 'Email',
    phone: 'Phone',
    sms: 'SMS',
    wifi: 'WiFi',
    vcard: 'vCard',
    location: 'Location',
    
    // Input Labels
    enterYourData: 'Enter Your Data',
    enterTextHere: 'Enter your text here...',
    networkName: 'Network Name (SSID)',
    password: 'Password',
    noPassword: 'No Password',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    organization: 'Organization',
    coordinates: 'Latitude,Longitude (e.g., 37.7749,-122.4194)',
    phoneForSMS: 'Phone number for SMS',
    
    // Settings
    size: 'Size',
    errorCorrectionLevel: 'Error Correction Level',
    margin: 'Margin',
    colors: 'Colors',
    foreground: 'Foreground',
    background: 'Background',
    advancedOptions: 'Advanced Options',
    addLogo: 'Add Logo',
    clickToUpload: 'Click to upload',
    removeLogo: 'Remove Logo',
    
    // Barcode Settings
    barcodeFormat: 'Barcode Format',
    enterData: 'Enter Data',
    enterBarcodeData: 'Enter barcode data...',
    enter12Digits: 'Enter 12 digits',
    barWidth: 'Bar Width',
    height: 'Height',
    showText: 'Show Text',
    
    // Preview
    livePreview: 'Live Preview',
    generating: 'Generating...',
    enterDataToGenerate: 'Enter data to generate',
    
    // Download
    copyImage: 'Copy Image',
    
    // Batch Processing
    batchProcessing: 'Batch Processing',
    uploadCSVorTXT: 'Upload CSV or TXT File',
    eachLineConverted: 'Each line will be converted to a separate code',
    batchItems: 'Batch Items',
    generateAll: 'Generate All',
    downloadAll: 'Download All',
    clear: 'Clear',
    
    // History
    generationHistory: 'Generation History',
    clearAll: 'Clear All',
    noHistoryYet: 'No history yet',
    
    // Toast Messages
    logoUploaded: 'Logo uploaded successfully',
    logoRemoved: 'Logo removed',
    downloadedAs: 'Downloaded as',
    copiedToClipboard: 'Copied to clipboard',
    failedToCopy: 'Failed to copy',
    failedToGenerateQR: 'Failed to generate QR code',
    invalidBarcodeFormat: 'Invalid barcode data format',
    loadedItems: 'items loaded for batch processing',
    processingBatch: 'Processing batch...',
    generatedCodes: 'codes generated successfully',
    downloadingAll: 'Downloading all generated codes...',
    loadedFromHistory: 'Loaded from history',
    historyCleared: 'History cleared',
    svgOnlyForQR: 'SVG format only available for QR codes',
    
    // Footer
    allRightsReserved: 'All rights reserved',
    phase2Implemented: 'Phase 2 - Advanced Features Implemented',
    
    // Error Correction Levels
    errorLevelLow: 'Low (7%)',
    errorLevelMedium: 'Medium (15%)',
    errorLevelQuartile: 'Quartile (25%)',
    errorLevelHigh: 'High (30%)',
  }
};

export default translations;
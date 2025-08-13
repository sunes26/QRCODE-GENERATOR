import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { 
  Download, QrCode, Barcode, Settings, Eye, 
  Link, Mail, Phone, Wifi, MessageSquare, FileText, 
  Upload, History, Trash2, Copy, Check, AlertCircle,
  Grid, X, Plus, Image, Globe
} from 'lucide-react';

// Import translations and styles
import translations from './translations';
import './AppStyles.css';

export default function QRBarcodeGenerator() {
  // Language detection and setup
  const detectLanguage = () => {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('ko') ? 'ko' : 'en';
  };

  const [language, setLanguage] = useState(detectLanguage());
  const t = translations[language]; // Current language translations
  
  // State management
  const [activeTab, setActiveTab] = useState('qr');
  const [activeView, setActiveView] = useState('generator');
  const [qrDataType, setQrDataType] = useState('text');
  const [inputData, setInputData] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [qrDarkColor, setQrDarkColor] = useState('#000000');
  const [qrLightColor, setQrLightColor] = useState('#FFFFFF');
  const [qrErrorLevel, setQrErrorLevel] = useState('M');
  const [qrMargin, setQrMargin] = useState(4);
  const [qrLogo, setQrLogo] = useState(null);
  const [barcodeFormat, setBarcodeFormat] = useState('CODE128');
  const [barcodeWidth, setBarcodeWidth] = useState(2);
  const [barcodeHeight, setBarcodeHeight] = useState(100);
  const [barcodeShowText, setBarcodeShowText] = useState(true);
  const [generatedImage, setGeneratedImage] = useState('');
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', security: 'WPA' });
  const [vcardData, setVcardData] = useState({ name: '', phone: '', email: '', org: '' });
  const [history, setHistory] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [toast, setToast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Refs
  const qrCanvasRef = useRef(null);
  const barcodeRef = useRef(null);
  const logoInputRef = useRef(null);
  const csvInputRef = useRef(null);

  // Load history and language preference from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-barcode-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
    
    const savedLang = localStorage.getItem('qr-barcode-language');
    if (savedLang && (savedLang === 'ko' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  // Toggle language
  const toggleLanguage = () => {
    const newLang = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
    localStorage.setItem('qr-barcode-language', newLang);
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Generate QR Code
  const generateQRCode = async () => {
    if (!qrCanvasRef.current) return;
    
    setIsGenerating(true);
    let dataToEncode = inputData;
    
    switch (qrDataType) {
      case 'url':
        dataToEncode = inputData.startsWith('http') ? inputData : `https://${inputData}`;
        break;
      case 'email':
        dataToEncode = `mailto:${inputData}`;
        break;
      case 'phone':
        dataToEncode = `tel:${inputData}`;
        break;
      case 'sms':
        dataToEncode = `sms:${inputData}`;
        break;
      case 'wifi':
        dataToEncode = `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};;`;
        break;
      case 'vcard':
        dataToEncode = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nORG:${vcardData.org}\nEND:VCARD`;
        break;
      case 'geo':
        dataToEncode = `geo:${inputData}`;
        break;
      default:
        dataToEncode = inputData;
    }
    
    if (!dataToEncode) {
      setIsGenerating(false);
      return;
    }
    
    try {
      const canvas = qrCanvasRef.current;
      await QRCode.toCanvas(canvas, dataToEncode, {
        width: qrSize,
        margin: qrMargin,
        color: {
          dark: qrDarkColor,
          light: qrLightColor
        },
        errorCorrectionLevel: qrErrorLevel
      });
      
      // Add logo if provided
      if (qrLogo) {
        const ctx = canvas.getContext('2d');
        const logoSize = qrSize * 0.2;
        const logoPos = (qrSize - logoSize) / 2;
        
        // Create new promise for image loading
        await new Promise((resolve, reject) => {
          const img = document.createElement('img');
          img.crossOrigin = "anonymous"; // CORS 문제 방지
          
          img.onload = () => {
            try {
              // Draw white background for logo
              ctx.fillStyle = qrLightColor;
              ctx.fillRect(logoPos - 5, logoPos - 5, logoSize + 10, logoSize + 10);
              
              // Draw logo (roundRect may not be supported in all browsers)
              ctx.save();
              if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(logoPos, logoPos, logoSize, logoSize, 5);
                ctx.clip();
              }
              ctx.drawImage(img, logoPos, logoPos, logoSize, logoSize);
              ctx.restore();
              
              const dataUrl = canvas.toDataURL();
              setGeneratedImage(dataUrl);
              
              // Save to history with logo
              const historyItem = {
                id: Date.now(),
                type: 'qr',
                data: dataToEncode,
                image: dataUrl,
                timestamp: new Date().toISOString()
              };
              
              const newHistory = [historyItem, ...history].slice(0, 20);
              setHistory(newHistory);
              localStorage.setItem('qr-barcode-history', JSON.stringify(newHistory));
              
              resolve();
            } catch (err) {
              console.error('Error drawing logo:', err);
              // If logo fails, still show QR code without logo
              setGeneratedImage(canvas.toDataURL());
              resolve();
            }
          };
          
          img.onerror = () => {
            console.error('Failed to load logo image');
            // If logo fails to load, show QR code without logo
            setGeneratedImage(canvas.toDataURL());
            resolve();
          };
          
          img.src = qrLogo;
        });
      } else {
        const dataUrl = canvas.toDataURL();
        setGeneratedImage(dataUrl);
        
        // Save to history without logo
        const historyItem = {
          id: Date.now(),
          type: 'qr',
          data: dataToEncode,
          image: dataUrl,
          timestamp: new Date().toISOString()
        };
        
        const newHistory = [historyItem, ...history].slice(0, 20);
        setHistory(newHistory);
        localStorage.setItem('qr-barcode-history', JSON.stringify(newHistory));
      }
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      showToast(t.failedToGenerateQR, 'error');
      // Even if error occurs, try to show QR without logo
      if (qrCanvasRef.current) {
        const canvas = qrCanvasRef.current;
        const dataUrl = canvas.toDataURL();
        if (dataUrl && dataUrl !== 'data:,') {
          setGeneratedImage(dataUrl);
        }
      }
    }
    
    setIsGenerating(false);
  };

  // Generate Barcode
  const generateBarcode = () => {
    if (!barcodeRef.current || !inputData) return;
    
    setIsGenerating(true);
    
    try {
      JsBarcode(barcodeRef.current, inputData, {
        format: barcodeFormat,
        width: barcodeWidth,
        height: barcodeHeight,
        displayValue: barcodeShowText,
        fontSize: 14,
        margin: 10
      });
      
      setGeneratedImage(barcodeRef.current.toDataURL());
      
      // Save to history
      const historyItem = {
        id: Date.now(),
        type: 'barcode',
        data: inputData,
        image: barcodeRef.current.toDataURL(),
        timestamp: new Date().toISOString()
      };
      
      const newHistory = [historyItem, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('qr-barcode-history', JSON.stringify(newHistory));
      
    } catch (error) {
      console.error('Error generating barcode:', error);
      showToast(t.invalidBarcodeFormat, 'error');
    }
    
    setIsGenerating(false);
  };

  // Generate code when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'qr') {
        if (inputData || (qrDataType === 'wifi' && wifiData.ssid) || (qrDataType === 'vcard' && vcardData.name)) {
          generateQRCode();
        } else {
          setGeneratedImage('');
        }
      } else {
        if (inputData) {
          generateBarcode();
        } else {
          setGeneratedImage('');
        }
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputData, qrDataType, qrSize, qrDarkColor, qrLightColor, qrErrorLevel, qrMargin, qrLogo,
      barcodeFormat, barcodeWidth, barcodeHeight, barcodeShowText, wifiData, vcardData, activeTab]);

  // Handle file downloads
  const handleDownload = (format = 'png') => {
    if (!generatedImage) return;
    
    const fileName = `${activeTab === 'qr' ? 'qrcode' : 'barcode'}_${Date.now()}`;
    
    if (format === 'png' || format === 'jpg') {
      fetch(generatedImage)
        .then(res => res.blob())
        .then(blob => {
          saveAs(blob, `${fileName}.${format}`);
          showToast(`${t.downloadedAs} ${format.toUpperCase()}`, 'success');
        });
    } else if (format === 'svg') {
      if (activeTab === 'qr') {
        QRCode.toString(inputData, { type: 'svg', width: qrSize }, (err, svg) => {
          if (!err) {
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            saveAs(blob, `${fileName}.svg`);
            showToast(`${t.downloadedAs} SVG`, 'success');
          }
        });
      } else {
        showToast(t.svgOnlyForQR, 'info');
      }
    } else if (format === 'pdf') {
      const pdf = new jsPDF();
      const imgWidth = 100;
      const imgHeight = activeTab === 'qr' ? 100 : 50;
      pdf.addImage(generatedImage, 'PNG', 55, 40, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
      showToast(`${t.downloadedAs} PDF`, 'success');
    }
  };

  // Handle batch upload
  const handleBatchUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const data = lines.map((line, index) => ({
        id: Date.now() + index,
        data: line.trim(),
        generated: false
      }));
      setBatchData(data);
      showToast(`${data.length} ${t.loadedItems}`, 'info');
    };
    reader.readAsText(file);
  };

  // Process batch
  const processBatch = async () => {
    if (batchData.length === 0) return;
    
    showToast(t.processingBatch, 'info');
    const results = [];
    
    for (const item of batchData) {
      if (activeTab === 'qr') {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, item.data, {
          width: qrSize,
          margin: qrMargin,
          color: { dark: qrDarkColor, light: qrLightColor },
          errorCorrectionLevel: qrErrorLevel
        });
        results.push({
          ...item,
          image: canvas.toDataURL(),
          generated: true
        });
      }
    }
    
    setBatchData(results);
    showToast(`${results.length} ${t.generatedCodes}`, 'success');
  };

  // Download all batch results
  const downloadBatch = () => {
    batchData.forEach((item, index) => {
      if (item.generated && item.image) {
        fetch(item.image)
          .then(res => res.blob())
          .then(blob => {
            saveAs(blob, `batch_${activeTab}_${index + 1}.png`);
          });
      }
    });
    showToast(t.downloadingAll, 'success');
  };

  // Load from history
  const loadFromHistory = (item) => {
    if (item.type === 'qr') {
      setActiveTab('qr');
      setInputData(item.data);
    } else {
      setActiveTab('barcode');
      setInputData(item.data);
    }
    setGeneratedImage(item.image);
    showToast(t.loadedFromHistory, 'success');
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-barcode-history');
    showToast(t.historyCleared, 'success');
  };

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast(language === 'ko' ? '이미지 크기는 2MB 이하여야 합니다' : 'Image size must be less than 2MB', 'error');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      showToast(language === 'ko' ? '이미지 파일만 업로드 가능합니다' : 'Only image files are allowed', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      // Create image to validate
      const testImg = document.createElement('img');
      testImg.onload = () => {
        setQrLogo(e.target.result);
        showToast(t.logoUploaded, 'success');
      };
      testImg.onerror = () => {
        showToast(language === 'ko' ? '이미지를 읽을 수 없습니다' : 'Cannot read image file', 'error');
      };
      testImg.src = e.target.result;
    };
    reader.onerror = () => {
      showToast(language === 'ko' ? '파일 읽기 실패' : 'Failed to read file', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (!generatedImage) return;
    
    navigator.clipboard.writeText(generatedImage)
      .then(() => showToast(t.copiedToClipboard, 'success'))
      .catch(() => showToast(t.failedToCopy, 'error'));
  };

  // Render QR input fields based on data type
  const renderQRInputs = () => {
    switch (qrDataType) {
      case 'wifi':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder={t.networkName}
              value={wifiData.ssid}
              onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
              className="form-input"
            />
            <input
              type="password"
              placeholder={t.password}
              value={wifiData.password}
              onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
              className="form-input"
            />
            <select
              value={wifiData.security}
              onChange={(e) => setWifiData({...wifiData, security: e.target.value})}
              className="form-select"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">{t.noPassword}</option>
            </select>
          </div>
        );
      case 'vcard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder={t.fullName}
              value={vcardData.name}
              onChange={(e) => setVcardData({...vcardData, name: e.target.value})}
              className="form-input"
            />
            <input
              type="tel"
              placeholder={t.phoneNumber}
              value={vcardData.phone}
              onChange={(e) => setVcardData({...vcardData, phone: e.target.value})}
              className="form-input"
            />
            <input
              type="email"
              placeholder={t.email}
              value={vcardData.email}
              onChange={(e) => setVcardData({...vcardData, email: e.target.value})}
              className="form-input"
            />
            <input
              type="text"
              placeholder={t.organization}
              value={vcardData.org}
              onChange={(e) => setVcardData({...vcardData, org: e.target.value})}
              className="form-input"
            />
          </div>
        );
      case 'geo':
        return (
          <input
            type="text"
            placeholder={t.coordinates}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="form-input"
          />
        );
      case 'email':
        return (
          <input
            type="email"
            placeholder="email@example.com"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="form-input"
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            placeholder="+1234567890"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="form-input"
          />
        );
      case 'sms':
        return (
          <input
            type="tel"
            placeholder={t.phoneForSMS}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="form-input"
          />
        );
      case 'url':
        return (
          <input
            type="url"
            placeholder="https://example.com"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="form-input"
          />
        );
      default:
        return (
          <textarea
            placeholder={t.enterTextHere}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="form-textarea"
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Hidden canvases for generation */}
      <canvas ref={qrCanvasRef} style={{ display: 'none' }} />
      <canvas ref={barcodeRef} style={{ display: 'none' }} />
      
      {/* Hidden file inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        style={{ display: 'none' }}
      />
      <input
        ref={csvInputRef}
        type="file"
        accept=".txt,.csv"
        onChange={handleBatchUpload}
        style={{ display: 'none' }}
      />
      
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <QrCode size={32} />
              <span>{t.appTitle}</span>
            </div>
            <nav className="nav">
              <button
                onClick={() => setActiveView('generator')}
                className={`nav-link ${activeView === 'generator' ? 'active' : ''}`}
              >
                {t.generator}
              </button>
              <button
                onClick={() => setActiveView('batch')}
                className={`nav-link ${activeView === 'batch' ? 'active' : ''}`}
              >
                {t.batchProcess}
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`nav-link ${activeView === 'history' ? 'active' : ''}`}
              >
                {t.history}
              </button>
              <button
                onClick={toggleLanguage}
                className="language-switcher"
                title="Change Language"
              >
                <Globe size={20} />
                <span>{language === 'ko' ? 'EN' : '한국어'}</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-subtitle">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container">
        {activeView === 'generator' && (
          <>
            {/* Tab Switcher */}
            <div className="tab-container">
              <div className="tab-switcher">
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
                >
                  <QrCode size={20} />
                  {t.qrCode}
                </button>
                <button
                  onClick={() => setActiveTab('barcode')}
                  className={`tab-btn ${activeTab === 'barcode' ? 'active' : ''}`}
                >
                  <Barcode size={20} />
                  {t.barcode}
                </button>
              </div>
            </div>

            <div className="main-content">
              {/* Settings Panel */}
              <div className="panel">
                <h2 className="panel-title">
                  <Settings size={24} />
                  {activeTab === 'qr' ? t.qrSettings : t.barcodeSettings}
                </h2>

                {activeTab === 'qr' ? (
                  <>
                    {/* QR Data Type Selection */}
                    <div className="form-group">
                      <label className="form-label">{t.dataType}</label>
                      <div className="data-type-grid">
                        {[
                          { type: 'text', icon: '📝', label: t.text },
                          { type: 'url', icon: '🔗', label: t.url },
                          { type: 'email', icon: '✉️', label: t.email },
                          { type: 'phone', icon: '📱', label: t.phone },
                          { type: 'sms', icon: '💬', label: t.sms },
                          { type: 'wifi', icon: '📶', label: t.wifi },
                          { type: 'vcard', icon: '👤', label: t.vcard },
                          { type: 'geo', icon: '📍', label: t.location },
                        ].map(({ type, icon, label }) => (
                          <button
                            key={type}
                            onClick={() => setQrDataType(type)}
                            className={`data-type-btn ${qrDataType === type ? 'active' : ''}`}
                          >
                            <div className="data-type-icon">{icon}</div>
                            <div className="data-type-label">{label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="form-group">
                      <label className="form-label">{t.enterYourData}</label>
                      {renderQRInputs()}
                    </div>

                    {/* QR Customization */}
                    <div className="form-group">
                      <label className="form-label">
                        {t.size}: <span className="range-value">{qrSize}px</span>
                      </label>
                      <input
                        type="range"
                        min="128"
                        max="512"
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="range-slider"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.errorCorrectionLevel}</label>
                      <select
                        value={qrErrorLevel}
                        onChange={(e) => setQrErrorLevel(e.target.value)}
                        className="form-select"
                      >
                        <option value="L">{t.errorLevelLow}</option>
                        <option value="M">{t.errorLevelMedium}</option>
                        <option value="Q">{t.errorLevelQuartile}</option>
                        <option value="H">{t.errorLevelHigh}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {t.margin}: <span className="range-value">{qrMargin}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={qrMargin}
                        onChange={(e) => setQrMargin(Number(e.target.value))}
                        className="range-slider"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.colors}</label>
                      <div className="color-picker-group">
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>{t.foreground}</label>
                          <div className="color-picker-wrapper">
                            <input
                              type="color"
                              value={qrDarkColor}
                              onChange={(e) => setQrDarkColor(e.target.value)}
                              className="color-picker"
                            />
                            <input
                              type="text"
                              value={qrDarkColor}
                              onChange={(e) => setQrDarkColor(e.target.value)}
                              className="color-input"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>{t.background}</label>
                          <div className="color-picker-wrapper">
                            <input
                              type="color"
                              value={qrLightColor}
                              onChange={(e) => setQrLightColor(e.target.value)}
                              className="color-picker"
                            />
                            <input
                              type="text"
                              value={qrLightColor}
                              onChange={(e) => setQrLightColor(e.target.value)}
                              className="color-input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="advanced-options">
                      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                        {t.advancedOptions}
                      </h3>
                      <div className="option-grid">
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>{t.addLogo}</label>
                          <div
                            className="logo-upload"
                            onClick={() => logoInputRef.current?.click()}
                          >
                            {qrLogo ? (
                              <img src={qrLogo} alt="Logo" className="logo-preview" />
                            ) : (
                              <>
                                <Image size={24} style={{ margin: '0 auto', opacity: 0.5 }} />
                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                                  {t.clickToUpload}
                                </p>
                              </>
                            )}
                          </div>
                          {qrLogo && (
                            <button
                              onClick={() => {
                                setQrLogo(null);
                                showToast(t.logoRemoved, 'info');
                              }}
                              className="btn btn-outline"
                              style={{ marginTop: '0.5rem', padding: '6px 12px', fontSize: '0.875rem' }}
                            >
                              <X size={16} />
                              {t.removeLogo}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Barcode Settings */}
                    <div className="form-group">
                      <label className="form-label">{t.barcodeFormat}</label>
                      <select
                        value={barcodeFormat}
                        onChange={(e) => setBarcodeFormat(e.target.value)}
                        className="form-select"
                      >
                        <option value="CODE128">Code 128</option>
                        <option value="CODE39">Code 39</option>
                        <option value="EAN13">EAN-13</option>
                        <option value="EAN8">EAN-8</option>
                        <option value="UPC">UPC-A</option>
                        <option value="ITF14">ITF-14</option>
                        <option value="MSI">MSI</option>
                        <option value="pharmacode">Pharmacode</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.enterData}</label>
                      <input
                        type="text"
                        placeholder={barcodeFormat === 'EAN13' ? t.enter12Digits : t.enterBarcodeData}
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {t.barWidth}: <span className="range-value">{barcodeWidth}</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        value={barcodeWidth}
                        onChange={(e) => setBarcodeWidth(Number(e.target.value))}
                        className="range-slider"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {t.height}: <span className="range-value">{barcodeHeight}px</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={barcodeHeight}
                        onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                        className="range-slider"
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={barcodeShowText}
                          onChange={(e) => setBarcodeShowText(e.target.checked)}
                          style={{ width: 'auto' }}
                        />
                        <span className="form-label" style={{ margin: 0 }}>{t.showText}</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Preview Panel */}
              <div className="panel">
                <h2 className="panel-title">
                  <Eye size={24} />
                  {t.livePreview}
                </h2>
                
                <div className="preview-container">
                  {generatedImage ? (
                    <div className="preview-content">
                      <img
                        src={generatedImage}
                        alt={activeTab === 'qr' ? 'QR Code' : 'Barcode'}
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div className="preview-placeholder">
                      <QrCode size={80} style={{ opacity: 0.2 }} />
                      <p style={{ marginTop: '1rem' }}>
                        {isGenerating ? t.generating : `${t.enterDataToGenerate} ${activeTab === 'qr' ? t.qrCode.toLowerCase() : t.barcode.toLowerCase()}`}
                      </p>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <>
                    <div className="download-section">
                      <button
                        onClick={() => handleDownload('png')}
                        className="btn btn-primary"
                      >
                        <Download size={20} />
                        PNG
                      </button>
                      <button
                        onClick={() => handleDownload('jpg')}
                        className="btn btn-secondary"
                      >
                        <Download size={20} />
                        JPG
                      </button>
                      <button
                        onClick={() => handleDownload('svg')}
                        className="btn btn-outline"
                      >
                        <Download size={20} />
                        SVG
                      </button>
                      <button
                        onClick={() => handleDownload('pdf')}
                        className="btn btn-outline"
                      >
                        <FileText size={20} />
                        PDF
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        onClick={copyToClipboard}
                        className="btn btn-outline"
                        style={{ flex: 1 }}
                      >
                        <Copy size={20} />
                        {t.copyImage}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {activeView === 'batch' && (
          <div className="panel">
            <h2 className="panel-title">
              <Grid size={24} />
              {t.batchProcessing}
            </h2>
            
            <div className="batch-section">
              <div
                className="batch-upload"
                onClick={() => csvInputRef.current?.click()}
              >
                <Upload size={48} style={{ margin: '0 auto', opacity: 0.5 }} />
                <h3 style={{ marginTop: '1rem' }}>{t.uploadCSVorTXT}</h3>
                <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                  {t.eachLineConverted}
                </p>
              </div>
              
              {batchData.length > 0 && (
                <>
                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>{t.batchItems} ({batchData.length})</h3>
                    <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '1rem' }}>
                      {batchData.map((item, index) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderBottom: '1px solid var(--gray-100)' }}>
                          <span>{index + 1}.</span>
                          <span style={{ flex: 1 }}>{item.data}</span>
                          {item.generated && <Check size={20} style={{ color: 'var(--success-color)' }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="btn-group" style={{ marginTop: '1rem' }}>
                    <button onClick={processBatch} className="btn btn-primary">
                      <Grid size={20} />
                      {t.generateAll}
                    </button>
                    <button 
                      onClick={downloadBatch} 
                      className="btn btn-success"
                      disabled={!batchData.some(item => item.generated)}
                    >
                      <Download size={20} />
                      {t.downloadAll}
                    </button>
                    <button onClick={() => setBatchData([])} className="btn btn-danger">
                      <Trash2 size={20} />
                      {t.clear}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeView === 'history' && (
          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="panel-title" style={{ margin: 0 }}>
                <History size={24} />
                {t.generationHistory}
              </h2>
              {history.length > 0 && (
                <button onClick={clearHistory} className="btn btn-danger">
                  <Trash2 size={20} />
                  {t.clearAll}
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
                <History size={64} style={{ margin: '0 auto', opacity: 0.3 }} />
                <p style={{ marginTop: '1rem' }}>{t.noHistoryYet}</p>
              </div>
            ) : (
              <div className="history-grid">
                {history.map(item => (
                  <div
                    key={item.id}
                    className="history-item"
                    onClick={() => loadFromHistory(item)}
                  >
                    <img src={item.image} alt={item.type} />
                    <div className="history-item-info">
                      <div>{item.type === 'qr' ? t.qrCode : t.barcode}</div>
                      <div>{new Date(item.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>© 2025 {t.appTitle}. {t.allRightsReserved}.</p>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <Check size={20} />}
          {toast.type === 'error' && <AlertCircle size={20} />}
          {toast.type === 'info' && <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
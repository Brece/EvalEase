// import QRCode from 'react-qr-code';
import QRCode from 'qrcode';
import classNames from 'classnames';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

import Button from './Button';
import { Modal } from './Modal';
import { urls } from '../utils/urls';
import { useLocation } from 'react-router';

interface IQRCodeModalProps {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
  id: string;
}

/**
 * QR-Code modal component.
 */
export default function QRCodeModal({
  showModal,
  setShowModal,
  id,
}: IQRCodeModalProps) {
  const location = useLocation();
  const isSurveyBuilder = location.pathname.startsWith(urls.surveyBuilder);

  const [showNotification, setShowNotification] = useState(false);
  const qrCodeInputRef = useRef<HTMLInputElement>(null); // Ref for QR-Code copy to clipboard
  const qrCodeCanvasRef = useRef<HTMLCanvasElement>(null); // Ref for QR Code canvas
  const qrCodeUrl =
    import.meta.env.VITE_APP_URL +
    (isSurveyBuilder
      ? `${urls.survey}/${id}`
      : `${urls.evaluationResult}/${id}`);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(qrCodeInputRef.current?.value || '');
    setShowNotification(true);

    // Automatically hide notification after 2 seconds
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Download QR Code as a PNG
  const handleDownloadQRCode = () => {
    const canvas = qrCodeCanvasRef.current;

    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png'); // Convert canvas to PNG URL
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-code_${id}.png`; // Set download filename
      downloadLink.click();
    }
    setShowModal(false);
  };

  // Generate QR Code
  useEffect(() => {
    if (qrCodeCanvasRef.current) {
      QRCode.toCanvas(qrCodeCanvasRef.current, qrCodeUrl, { width: 256 });
    }
  }, [qrCodeUrl]);

  return (
    <Modal title="QR-Code" isOpen={showModal} setIsOpen={setShowModal}>
      <div className="w-[600px] flex flex-col gap-y-8">
        <div className="w-full flex gap-x-8 items-center">
          <label htmlFor="url">URL</label>
          <input
            name="url"
            type="text"
            ref={qrCodeInputRef}
            value={qrCodeUrl}
            className="flex-grow rounded-md text-brand-5"
            readOnly
          />
          <div className="py-2 pr-2 cursor-pointer hover:text-brand-8 text-brand-5 ease-in-out duration-200">
            <ClipboardDocumentCheckIcon
              className="w-[28px] h-[28px]"
              onClick={handleCopyToClipboard}
            />
          </div>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="flex justify-center">
        <canvas ref={qrCodeCanvasRef} />
      </div>

      <Button
        label="Download QR-Code"
        color="primary"
        width="full"
        size="medium"
        onClick={handleDownloadQRCode}
      />

      <div
        className={classNames(
          'absolute top-11 right-4 bg-brand-7 text-white py-2 px-4 rounded-md shadow-lg transition-opacity duration-500 ease-in-out',
          {
            'opacity-100': showNotification,
            'opacity-0': !showNotification,
          },
        )}
      >
        Copied to clipboard!
      </div>
    </Modal>
  );
}

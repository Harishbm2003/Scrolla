import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Modal from 'react-modal';
import frank from '../Images/frank.jpg';
import alice from '../Images/alice.jpg';
import pencil from '../Images/pencil.jpg';
import fables from '../Images/fables.jpg';
import bgscrolla from '../Images/bgscrolla.png';
import './Home.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const books = [
  { id: 1, title: 'Frankenstein', image: frank },
  { id: 2, title: 'Snap shots', image: alice },
  { id: 3, title: 'Kates book', image: pencil },
  { id: 4, title: 'Fables', image: fables },
];

const pdfLinks: Record<number, string> = {
  1: 'https://www.coreknowledge.org/wp-content/uploads/2023/08/CC_Frankenstein_Reader_W1.pdf',
  2: 'https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G1_U1_RDR_web.pdf',
  3: 'https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G1_U5_Rdr_web.pdf',
  4: 'https://www.coreknowledge.org/wp-content/uploads/2017/01/CKLA_G1_U3_RDR_web.pdf',
};

interface HomeProps {
  searchTerm: string;
}

const Home: React.FC<HomeProps> = ({ searchTerm }) => {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const openModal = (id: number) => {
    setSelectedBookId(id);
    setPageNumber(1);
    setIsOpen(true);
    setIsPageLoading(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedBookId(null);
    setNumPages(null);
    setPageNumber(1);
    setIsPageLoading(false);
  };

  const selectedPdf = selectedBookId ? pdfLinks[selectedBookId] : null;

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') {
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
        setIsPageLoading(true);
      } else if (e.key === 'ArrowLeft') {
        setPageNumber((prev) => Math.max(prev - 1, 1));
        setIsPageLoading(true);
      } else if (e.key === 'Escape') {
        closeModal();
      }
    },
    [isOpen, numPages]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="home-container" style={{ backgroundImage: `url(${bgscrolla})` }}>
      <div className="book-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-item" onClick={() => openModal(book.id)}>
            <img src={book.image} alt={book.title} className="book-image" />
            <p className="book-title">{book.title}</p>
          </div>
        ))}
        {filteredBooks.length === 0 && <h1>No books found.</h1>}
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="PDF Viewer"
        className="pdf-modal"
        overlayClassName="pdf-overlay"
        ariaHideApp={false}
      >
        <button onClick={closeModal} className="close-button">&times;</button>

        {selectedPdf && (
          <div className="pdf-viewer">
            {isPageLoading && <div className="pdf-spinner"></div>}

            <div className="pdf-scroll">
              <Document
                file={{ url: selectedPdf }}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading=""
                error={<div className="pdf-loading">Failed to load PDF.</div>}
              >
                <Page
                  key={`page_${pageNumber}`}
                  pageNumber={pageNumber}
                  width={600}
                  onLoadStart={() => setIsPageLoading(true)}
                  onLoadSuccess={() => setIsPageLoading(false)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          </div>
        )}

        {selectedPdf && (
          <div className="pdf-controls-fixed">
            <button
              onClick={() => {
                if (pageNumber > 1) {
                  setPageNumber((p) => p - 1);
                  setIsPageLoading(true);
                }
              }}
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => {
                if (pageNumber < (numPages || 1)) {
                  setPageNumber((p) => p + 1);
                  setIsPageLoading(true);
                }
              }}
              disabled={pageNumber >= (numPages || 1)}
            >
              Next
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
